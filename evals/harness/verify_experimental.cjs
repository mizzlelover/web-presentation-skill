#!/usr/bin/env node
/**
 * verify_experimental.cjs — 实验技术验证（补丁 §4/§12/§13/§18/§19/§21）
 * 逐个打开 experimental/ 下的原型，记录：控制台错误、脚本体积、关键 bench 指标、截图。
 * 用法：BASE=http://127.0.0.1:8765 NODE_PATH=... node verify_experimental.cjs
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const EXP = path.join(REPO, "experimental");
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts", "experimental");

const PAGES = [
  ["motion-compare", "动效技术对照（§21）"],
  ["threejs-cases", "Three.js 正反用例（§13）"],
  ["mermaid-vs-svg", "Mermaid 默认 vs 定制 SVG（§12）"],
  ["d3-narrative", "D3 定制数据叙事（§18）"],
];

function sizeOf(rel) {
  try { return fs.statSync(path.join(REPO, rel)).size; } catch (_) { return null; }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = { generatedAt: new Date().toISOString(), vendorSizes: {}, pages: [] };

  report.vendorSizes = {
    "gsap.min.js": sizeOf("experimental/vendor/gsap.min.js"),
    "three.min.js": sizeOf("experimental/vendor/three.min.js"),
    "mermaid.min.js": sizeOf("experimental/vendor/mermaid.min.js"),
    "d3.min.js": sizeOf("experimental/vendor/d3.min.js"),
    "echarts.min.js(production)": sizeOf("runtime/vendor/echarts.min.js"),
  };

  for (const [dir, label] of PAGES) {
    const url = `${BASE}/experimental/${dir}/index.html`;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("requestfailed", (r) => errors.push("reqfail: " + r.url()));
    const t0 = Date.now();
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(1400);
    const loadMs = Date.now() - t0;

    // 触发全部按钮（motion-compare）
    if (dir === "motion-compare") {
      for (const b of await page.$$("button[data-tech]")) { await b.click(); await page.waitForTimeout(220); }
      await page.waitForTimeout(600);
    }

    const bench = await page.evaluate(() => {
      const out = {};
      if (window.MOTION_BENCH) { out.results = window.MOTION_BENCH.results; }
      if (window.THREE_BENCH) { out.three = window.THREE_BENCH; }
      if (window.MERMAID_BENCH) { out.mermaid = window.MERMAID_BENCH; }
      if (window.D3_BENCH) { out.d3 = window.D3_BENCH; }
      return out;
    });
    const shot = path.join(OUT, `${dir}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    report.pages.push({ dir, label, loadMs, consoleErrors: errors, bench, screenshot: shot });
    console.log(`▶ ${dir}: 加载 ${loadMs}ms | 控制台错误 ${errors.length} | ${dir === "threejs-cases" ? "fps=" + ((bench.three || {}).fps || "-") : dir === "mermaid-vs-svg" ? "mermaid " + Math.round(((bench.mermaid || {}).renderMs) || 0) + "ms" : dir === "d3-narrative" ? "d3 " + ((bench.d3 || {}).renderMs || "-") + "ms" : "场景完成 " + Object.keys((bench.results) || {}).length}`);
    if (errors.length) console.log("   错误:", errors.slice(0, 4).join(" | "));
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "experimental_report.json"), JSON.stringify(report, null, 2));
  console.log("\n报告:", path.join(OUT, "experimental_report.json"));
})();
