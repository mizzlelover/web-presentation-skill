#!/usr/bin/env node
/**
 * safari_real.cjs — 真机 Safari 验证（补丁 §30/§72）
 * 直接走 safaridriver 的 WebDriver 协议（无第三方依赖）：
 *   建会话 → 逐 Deck 打开 → 在页面内执行 JS 读取引擎状态与溢出 → 截图 → 退出
 */
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = 52388;
const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "_artifacts", "safari");
fs.mkdirSync(OUT, { recursive: true });

function listDecks() {
  const out = [];
  for (const root of ["corpus", "derived", "real"]) {
    const base = path.join(REPO, "benchmarks", root);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base, { withFileTypes: true })) {
      if (d.isDirectory() && fs.existsSync(path.join(base, d.name, "presentation.ir.json")))
        out.push(`benchmarks/${root}/${d.name}`);
    }
  }
  return out.sort();
}

function req(method, p, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({ host: "127.0.0.1", port: PORT, path: p, method,
      headers: { "Content-Type": "application/json", ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}) } },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { const j = JSON.parse(buf); resolve(j); }
          catch (_) { resolve({ raw: buf }); }
        });
      });
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // 1) 启动 safaridriver
  const driver = spawn("safaridriver", ["-p", String(PORT)], { stdio: "ignore" });
  await sleep(1200);
  const st = await req("GET", "/status").catch(() => null);
  if (!st || !st.value || !st.value.ready) {
    console.error("✗ safaridriver 未就绪。请开启：Safari → 设置 → 高级 → 勾选『在菜单栏中显示开发菜单』→ 开发 → 允许远程自动化");
    driver.kill(); process.exit(2);
  }
  console.log("✔ safaridriver 就绪");

  // 2) 建会话（这一步若系统未授权本进程控制 Safari，会在这里失败）
  const s = await req("POST", "/session", {
    capabilities: { alwaysMatch: { browserName: "safari", "safari:deviceUDID": undefined } },
  });
  if (!s.value || !s.value.sessionId || s.value.error) {
    console.error("✗ 无法创建 Safari 会话：", JSON.stringify(s).slice(0, 400));
    console.error("   处理：系统设置 → 隐私与安全性 → 自动化 → 勾选允许当前终端 App 控制 Safari");
    driver.kill(); process.exit(3);
  }
  const sid = s.value.sessionId;
  const ver = s.value.capabilities || {};
  // 窗口模式：默认统一为设计画布（1920×1080）；SAFARI_CANVAS=native 时用原生窗口（验证短屏适配）
  const native = process.env.SAFARI_CANVAS === "native";
  if (!native) {
    await req("POST", `/session/${sid}/window/rect`, { width: 1920, height: 1080 });
    await sleep(400);
  }
  const rect = await req("GET", `/session/${sid}/window/rect`);
  const win = (rect.value || {});
  console.log(`✔ Safari 会话建立：${ver.browserVersion || "?"}（窗口 ${win.width || "?"}×${win.height || "?"}${native ? "，原生" : "，设计画布"}）`);

  const decks = listDecks();
  const rows = [];
  for (const rel of decks) {
    const url = `${BASE}/${rel}/index.html`;
    await req("POST", `/session/${sid}/url`, { url });
    await sleep(900);

    const probe = await req("POST", `/session/${sid}/execute/sync`, {
      script: `return (function(){
        try {
          const e = window.wp && window.wp.engine;
          if (!e) return { booted:false };
          const el = e.currentScene;
          const box = el.getBoundingClientRect();
          let top=Infinity, bottom=-Infinity, left=Infinity, right=-Infinity;
          el.querySelectorAll("*").forEach(function(c){
            if (getComputedStyle(c).display==="none") return;
            const r = c.getBoundingClientRect();
            if (r.width===0 && r.height===0) return;
            top=Math.min(top,r.top); bottom=Math.max(bottom,r.bottom);
            left=Math.min(left,r.left); right=Math.max(right,r.right);
          });
          return { booted:true, scenes:e.scenes.length, id:e.currentId,
                   overTop:Math.round(Math.max(0,box.top-top)),
                   overBottom:Math.round(Math.max(0,bottom-box.bottom)),
                   overLeft:Math.round(Math.max(0,box.left-left)),
                   overRight:Math.round(Math.max(0,right-box.right)) };
        } catch (err) { return { booted:false, error:String(err) }; }
      })()`,
      args: [],
    });
    const v = (probe.value || {});
    rows.push({ deck: rel, ...v });
    const over = (v.overTop||0)+(v.overBottom||0)+(v.overLeft||0)+(v.overRight||0);
    console.log(`${v.booted ? "✔" : "✗"} ${rel} · ${v.scenes||"?"} 幕 · 当前 ${v.id||"?"} · 溢出 ${over}`);
    // 截图（只截首套与末套，控制体积）
    if (rows.length === 1 || rows.length === decks.length) {
      const shot = await req("GET", `/session/${sid}/screenshot`);
      if (shot.value) fs.writeFileSync(path.join(OUT, rel.split("/").pop() + ".png"), Buffer.from(shot.value, "base64"));
    }
  }

  // 现场剧本抽查（分支 + 返回）在真机 Safari 上
  const live = await req("POST", `/session/${sid}/execute/sync`, {
    script: `return (function(){
      try {
        const e = window.wp.engine;
        e.goTo("thesis");
        e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
        e._applyReveal();
        const before = { id: e.currentId, step: e.revealStep };
        e.branchTo("objection");
        const mid = e.currentId;
        e.returnFromDive();
        return { before, mid, after: e.currentId, restored: e.currentId === before.id && e.revealStep === before.step };
      } catch (err) { return { error: String(err) }; }
    })()`,
    args: [],
  });

  await req("DELETE", `/session/${sid}`);
  driver.kill();

  const bad = rows.filter((r) => !r.booted || ((r.overTop||0)+(r.overBottom||0)+(r.overLeft||0)+(r.overRight||0)) > 2);
  const report = { generatedAt: new Date().toISOString(), safari: ver, decks: rows, branchTest: live.value, failed: bad.length };
  fs.writeFileSync(path.join(OUT, "safari_report.json"), JSON.stringify(report, null, 2));
  console.log(`\n真机 Safari：${rows.length - bad.length}/${rows.length} 套通过；分支/返回 ${live.value && live.value.restored ? "✔" : "✗"}`);
  console.log("报告:", path.join(OUT, "safari_report.json"));
  process.exit(bad.length ? 1 : 0);
})();
