#!/usr/bin/env node
/**
 * verify_corpus.cjs — 全语料批量验证（补丁 §8/§22/§23）
 *
 * 对 benchmarks/corpus 下每个 Deck 执行：
 *   - 逐幕展开揭示后截图 + 幕内溢出（子元素包围盒 vs 幕框）
 *   - 自适应导航断言（graph / core path / 分支 / 深潜 / Esc / 搜索 / 返回提示）
 *   - 控制台错误与资源失败计数
 * 产出：_artifacts/corpus_report.json 与逐幕截图。
 *
 * 用法：BASE=http://127.0.0.1:8765 NODE_PATH=... node verify_corpus.cjs
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");           // wenzhi/
const CORPUS = path.join(REPO, "benchmarks", "corpus");
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");

const decks = fs.readdirSync(CORPUS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(CORPUS, d.name, "presentation.ir.json")))
  .map((d) => d.name).sort();

async function checkDeck(browser, name) {
  const url = `${BASE}/benchmarks/corpus/${name}/index.html`;
  const dir = path.join(OUT, "corpus", name);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => errors.push("reqfail: " + r.url()));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(500);

  const result = { deck: name, scenes: 0, overflowScenes: [], charts: 0, consoleErrors: errors };

  // 自适应导航
  result.nav = await page.evaluate(() => {
    const e = window.wp.engine;
    const g = e.graph();
    const out = {
      scenes: g.nodes.length,
      branchEdges: g.edges.filter((x) => x.type === "branch").length,
      diveEdges: g.edges.filter((x) => x.type === "deep_dive").length,
    };
    // core path 遍历
    e.goTo(0);
    let guard = 0;
    while (e.current < e.scenes.length - 1 && guard++ < 400) e.next();
    out.coreTraversalOk = e.currentId === e.scenes[e.scenes.length - 1].dataset.sceneId;
    // 分支（如有）
    const be = g.edges.find((x) => x.type === "branch");
    if (be) {
      e.goTo(be.from);
      e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
      e._applyReveal();
      const before = e.revealStep;
      e.branchTo(be.to);
      const mid = e.currentId;
      e.returnFromDive();
      out.branchOk = mid === be.to && e.currentId === be.from && e.revealStep === before;
    } else out.branchOk = null;
    // 深潜（如有）
    const de = g.edges.find((x) => x.type === "deep_dive");
    if (de) {
      e.goTo(de.from);
      e.deepDive(de.to);
      const mid = e.currentId;
      e.returnFromDive();
      out.deepDiveOk = mid === de.to && e.currentId === de.from;
    } else out.deepDiveOk = null;
    // 搜索
    out.searchHits = e.search("口径").length + e.search("数据").length;
    return out;
  });

  // 逐幕：展开揭示 + 截图 + 溢出
  await page.evaluate(() => window.wp.engine.setStepwise(false));
  const ids = await page.evaluate(() => window.wp.engine.scenes.map((s) => s.dataset.sceneId));
  result.scenes = ids.length;
  for (const id of ids) {
    const m = await page.evaluate((sid) => {
      const e = window.wp.engine;
      e.goTo(sid);
      e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
      e._applyReveal();
      if (window.WPCharts) window.WPCharts.renderScene(e.currentScene);
      const s = e.currentScene;
      const box = s.getBoundingClientRect();
      let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
      Array.from(s.children).forEach((c) => {
        if (getComputedStyle(c).display === "none") return;
        const r = c.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
        left = Math.min(left, r.left); right = Math.max(right, r.right);
      });
      return {
        overTop: Math.round(Math.max(0, box.top - top)),
        overBottom: Math.round(Math.max(0, bottom - box.bottom)),
        overLeft: Math.round(Math.max(0, box.left - left)),
        overRight: Math.round(Math.max(0, right - box.right)),
        charts: s.querySelectorAll("[data-chart]").length,
        canvases: s.querySelectorAll("canvas").length,
      };
    }, id);
    await page.waitForTimeout(260);
    await page.screenshot({ path: path.join(dir, `${id}.png`) });
    result.charts += m.charts;
    const over = m.overTop + m.overBottom + m.overLeft + m.overRight;
    if (over > 2) result.overflowScenes.push({ id, ...m });
  }

  await ctx.close();
  return result;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const all = [];
  for (const name of decks) {
    process.stdout.write(`▶ ${name} … `);
    try {
      const r = await checkDeck(browser, name);
      all.push(r);
      const nav = r.nav;
      console.log(
        `${r.scenes} 幕 | 溢出 ${r.overflowScenes.length} | 图表 ${r.charts} | ` +
        `分支 ${nav.branchEdges} 深潜 ${nav.diveEdges} | 控制台错误 ${r.consoleErrors.length}`
      );
      if (r.overflowScenes.length) console.log("   溢出幕:", r.overflowScenes.map((s) => s.id).join(", "));
      if (r.consoleErrors.length) console.log("   错误:", r.consoleErrors.slice(0, 3).join(" | "));
    } catch (e) {
      console.log("FAILED:", e.message);
      all.push({ deck: name, fatal: e.message });
    }
  }
  await browser.close();
  const report = { generatedAt: new Date().toISOString(), base: BASE, decks: all };
  fs.writeFileSync(path.join(OUT, "corpus_report.json"), JSON.stringify(report, null, 2));
  const totalScenes = all.reduce((n, d) => n + (d.scenes || 0), 0);
  const totalOver = all.reduce((n, d) => n + ((d.overflowScenes || []).length), 0);
  const totalErr = all.reduce((n, d) => n + ((d.consoleErrors || []).length), 0);
  console.log(`\n汇总：${all.length} 套 Deck / ${totalScenes} 幕 / 溢出幕 ${totalOver} / 控制台错误 ${totalErr}`);
  console.log("报告:", path.join(OUT, "corpus_report.json"));
})();
