#!/usr/bin/env node
/** verify_data_stress.cjs — 数据压力测试（补丁 §41） */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");
fs.mkdirSync(path.join(OUT, "data_stress"), { recursive: true });

(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 })).newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await p.goto(`${BASE}/evals/data_stress/index.html`, { waitUntil: "load" });
  await p.waitForTimeout(400);
  await p.evaluate(() => window.DATASTRESS.render());
  await p.waitForTimeout(900);

  const r = await p.evaluate(() => {
    const out = {};
    Object.keys(window.DATASTRESS.cases).forEach((id) => {
      const inst = window.DATASTRESS.cases[id];
      if (!inst || inst.error) { out[id] = { ok: false, error: inst && inst.error }; return; }
      const box = document.getElementById(id);
      const cv = box.querySelector("canvas");
      let painted = 0;
      if (cv) {
        const g = cv.getContext("2d");
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 0) painted++;
      }
      const opt = inst.getOption();
      const ys = Array.isArray(opt.yAxis) ? opt.yAxis : [opt.yAxis];
      out[id] = {
        ok: painted > 800,
        painted,
        hasCanvas: !!cv,
        yAxisCount: ys.length,
        units: ys.map((y) => (y && y.name) || null),
        secondaryIndex: (opt.series || []).map((s) => s.yAxisIndex || 0),
        categories: ((opt.xAxis[0] && opt.xAxis[0].data) || (opt.yAxis[0] && opt.yAxis[0].data) || []).length,
        nullsKept: JSON.stringify((opt.series[0].data || [])).includes("null"),
      };
    });
    // 长页面纵向滚动属正常；只检查面板级横向溢出
    const bad = [];
    document.querySelectorAll(".panel, .wpk-chart__box").forEach(function (el) {
      if (el.scrollWidth - el.clientWidth > 2) bad.push(el.className || el.id);
    });
    out.panelHOverflow = bad;
    return out;
  });

  await p.screenshot({ path: path.join(OUT, "data_stress", "page.png"), fullPage: true });
  // 单图截图
  for (const id of ["c1", "c2", "c3", "c4", "c5", "c6"]) {
    try { await p.locator("#" + id).screenshot({ path: path.join(OUT, "data_stress", `${id}.png`) }); } catch (_) {}
  }
  await b.close();

  const checks = {
    s1_20cats: r.c1 && r.c1.ok && r.c1.categories === 20,
    s2_nullsKept: r.c2 && r.c2.ok && r.c2.nullsKept,
    s3_mixedSign: r.c3 && r.c3.ok,
    s4_dualAxis: r.c4 && r.c4.ok && r.c4.yAxisCount === 2 && r.c4.secondaryIndex.includes(1) && r.c4.units.filter(Boolean).length >= 1,
    s5_decimals: r.c5 && r.c5.ok,
    s6_extremes: r.c6 && r.c6.ok,
    noPanelHOverflow: (r.panelHOverflow || []).length === 0,
    noConsoleErrors: errors.length === 0,
  };
  console.log(JSON.stringify({ checks, detail: r, errors }, null, 2));
  const failed = Object.entries(checks).filter(([, v]) => !v);
  console.log(failed.length ? `\n✗ ${failed.length} FAIL: ${failed.map(function (e) { return e[0]; }).join(", ")}` : "\n✔ 数据压力 8/8 通过");
  await b.close && null;
  process.exit(failed.length ? 1 : 0);
})();
