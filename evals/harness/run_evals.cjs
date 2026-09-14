#!/usr/bin/env node
/**
 * run_evals.cjs — Evals 实际执行（补丁 §22）
 *
 * 对 benchmarks/corpus 下每套 Deck 执行并给出 PASS/FAIL：
 *   1. IR Eval        — IR 结构计数（scene 数、认知任务覆盖、标题类型多样性）
 *   2. Visual Eval    — 逐幕幕内溢出（子元素包围盒 vs 幕框）+ 图表 canvas 实际绘制
 *   3. Runtime Eval   — core path 遍历 / 分支 / 深潜 / Esc 返回 / 搜索
 *   4. Browser Eval   — Chromium 与 WebKit 双引擎（功能一致性）
 *   5. Offline Eval   — file:// + offline 上下文，外部请求必须为 0
 *   6. Performance Eval — FCP / 资源数 / 转场 FPS（阈值门禁）
 *
 * 用法：BASE=http://127.0.0.1:8765 NODE_PATH=... node run_evals.cjs [--browser-only]
 */
const { chromium, webkit } = require("playwright");
const fs = require("fs");
const path = require("path");
const { checkPage } = require("./typography_lint.cjs");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const CORPUS = path.join(REPO, "benchmarks", "corpus");
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");

const BUDGET = { fcpMs: 900, fps: 45, resources: 40 };

function listDecks() {
  const out = [];
  for (const root of ["corpus", "derived", "real"]) {
    const base = path.join(REPO, "benchmarks", root);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base, { withFileTypes: true })) {
      if (d.isDirectory() && fs.existsSync(path.join(base, d.name, "presentation.ir.json")))
        out.push({ name: d.name, rel: `benchmarks/${root}/${d.name}` });
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}
const DECKS = listDecks();

async function measure(page, rel) {
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => errors.push("reqfail: " + r.url()));
  await page.goto(`${BASE}/${rel}/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(500);
  return errors;
}

// 字面 <br> 检测随 measure 一起返回（挂在 page 对象外层不可行，改由 browserPass 内联）

function literalBr_flag(c, w) { return !!(c.literalBr || w.literalBr); }

async function browserPass(browser, rel) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const errors = await measure(page, rel);
  const literalBr = await page.evaluate(() => document.body.textContent.includes("<br>"));

  const runtime = await page.evaluate(() => {
    const e = window.wp.engine;
    const g = e.graph();
    const out = { scenes: g.nodes.length, branchEdges: g.edges.filter((x) => x.type === "branch").length,
                  diveEdges: g.edges.filter((x) => x.type === "deep_dive").length };
    e.goTo(0);
    let guard = 0;
    while (e.current < e.scenes.length - 1 && guard++ < 400) e.next();
    out.coreOk = e.currentId === e.scenes[e.scenes.length - 1].dataset.sceneId;
    const be = g.edges.find((x) => x.type === "branch");
    if (be) { e.goTo(be.from); e.branchTo(be.to); const mid = e.currentId; e.returnFromDive(); out.branchOk = mid === be.to && e.currentId === be.from; }
    const de = g.edges.find((x) => x.type === "deep_dive");
    if (de) { e.goTo(de.from); e.deepDive(de.to); const mid = e.currentId; e.returnFromDive(); out.diveOk = mid === de.to && e.currentId === de.from; }
    out.searchHits = (function () {
      // 搜索词取自 Deck 自身内容，避免测试写死导致误判
      const term = (e.scenes[0].dataset.topic || "").trim() || (e.scenes[0].textContent || "").trim().slice(0, 2);
      return term ? e.search(term).length : 0;
    })();
    out.headlineTypes = [...new Set(e.scenes.map((s) => (s.querySelector("h1,h2,h3") ? "h" : "?")))].length;
    out.jobs = [...new Set(e.scenes.map((s) => s.dataset.role))].length;
    return out;
  });

  // Visual：逐幕溢出 + 图表绘制
  await page.evaluate(() => window.wp.engine.setStepwise(false));
  const ids = await page.evaluate(() => window.wp.engine.scenes.map((s) => s.dataset.sceneId));
  const visual = { overflow: 0, charts: 0, chartsPainted: 0 };
  for (const id of ids) {
    const m = await page.evaluate((sid) => {
      const e = window.wp.engine;
      e.goTo(sid);
      e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
      e._applyReveal();
      if (window.WPCharts) window.WPCharts.renderScene(e.currentScene);
      const s = e.currentScene, box = s.getBoundingClientRect();
      let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
      Array.from(s.children).forEach((c) => {
        if (getComputedStyle(c).display === "none") return;
        const r = c.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
        left = Math.min(left, r.left); right = Math.max(right, r.right);
      });
      return { over: Math.round(Math.max(0, box.top - top) + Math.max(0, bottom - box.bottom) + Math.max(0, box.left - left) + Math.max(0, right - box.right)),
               charts: s.querySelectorAll("[data-chart]").length,
               canvases: s.querySelectorAll("canvas").length };
    }, id);
    if (m.over > 2) visual.overflow++;
    visual.charts += m.charts;
    if (m.charts > 0) { await page.waitForTimeout(320); visual.chartsPainted += await page.evaluate((sid) => {
      const s = [...document.querySelectorAll(".wp-scene")].find((x) => x.dataset.sceneId === sid && !x.hidden) || document.querySelector(".wp-scene:not([hidden])");
      const cv = s && s.querySelector("canvas");
      if (!cv) return 0;
      const g = cv.getContext("2d"); const d = g.getImageData(0, 0, cv.width, cv.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
      return n > 1000 ? 1 : 0;
    }, id); }
  }

  // Performance
  const perf = await page.evaluate(() => {
    const o = {};
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    o.fcp = fcp ? Math.round(fcp.startTime) : (nav ? Math.round(nav.domContentLoadedEventEnd) : null);
    o.resources = performance.getEntriesByType("resource").length;
    o.byType = performance.getEntriesByType("resource").reduce((m, r) => { const t = r.initiatorType || "other"; m[t] = (m[t] || 0) + 1; return m; }, {});
    return o;
  });
  await page.evaluate(() => { window.__fps = { f: 0, t0: performance.now(), on: true }; (function tick(){ if(!window.__fps.on) return; window.__fps.f++; requestAnimationFrame(tick); })(); });
  for (let i = 0; i < 8; i++) { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(110); }
  const fps = await page.evaluate(() => { window.__fps.on = false; return Math.round(window.__fps.f / (performance.now() - window.__fps.t0) * 1000); });

  // Typography（在 ctx 关闭前执行）
  const typography = await checkPage(page);

  await ctx.close();
  return { errors, runtime, visual, literalBr, perf: { ...perf, fps }, typography };
}

async function offlinePass(browser, rel) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, offline: true });
  const page = await ctx.newPage();
  const external = [];
  page.on("request", (r) => { const u = r.url(); if (!u.startsWith("file://") && !u.startsWith("data:")) external.push(u); });
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto("file://" + path.join(REPO, rel, "index.html"), { waitUntil: "load" });
  await page.waitForTimeout(600);
  const ok = await page.evaluate(() => !!(window.wp && window.wp.engine && window.wp.engine.scenes.length));
  await ctx.close();
  return { externalRequests: external.length, pageErrors: errs.length, booted: ok };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const chromiumBrowser = await chromium.launch();
  const webkitBrowser = await webkit.launch();
  const rows = [];

  for (const { name, rel } of DECKS) {
    process.stdout.write(`▶ ${name} … `);
    const c = await browserPass(chromiumBrowser, rel);
    const w = await browserPass(webkitBrowser, rel);
    const off = await offlinePass(chromiumBrowser, rel);

    const evals = {
      ir: c.runtime.scenes > 0 && c.runtime.jobs >= 4,
      visual: c.visual.overflow === 0 && (c.visual.charts === 0 || c.visual.chartsPainted === c.visual.charts) && !c.literalBr && !w.literalBr,
      runtime: c.runtime.coreOk && (c.runtime.branchOk === undefined || c.runtime.branchOk) && (c.runtime.diveOk === undefined || c.runtime.diveOk) && c.runtime.searchHits > 0,
      browser: w.runtime.coreOk && w.visual.overflow === 0,
      offline: off.externalRequests === 0 && off.pageErrors === 0 && off.booted,
      performance: (c.perf.fcp == null || c.perf.fcp <= BUDGET.fcpMs) && c.perf.fps >= BUDGET.fps && c.perf.resources <= BUDGET.resources,
      consoleClean: c.errors.length === 0 && w.errors.length === 0,
      typography: c.typography && c.typography.pass,
    };
    const pass = Object.values(evals).every(Boolean);
    rows.push({ deck: rel, pass, evals, literalBr: c.literalBr || w.literalBr || false, detail: { chromium: c, webkit: w, offline: off } });
    console.log(`${pass ? "✔ PASS" : "✗ FAIL"} | FCP ${c.perf.fcp}ms · FPS ${c.perf.fps} · 资源 ${c.perf.resources} · 图表 ${c.visual.charts} · 溢出 ${c.visual.overflow}` +
      (pass ? "" : "\n   " + Object.entries(evals).filter(([, v]) => !v).map(([k]) => k).join(", ")));
  }
  await chromiumBrowser.close();
  await webkitBrowser.close();

  const report = { generatedAt: new Date().toISOString(), budget: BUDGET, decks: rows };
  fs.writeFileSync(path.join(OUT, "evals_report.json"), JSON.stringify(report, null, 2));
  const passCount = rows.filter((r) => r.pass).length;
  console.log(`\nEvals：${passCount}/${rows.length} 套 Deck 全部维度通过`);
  console.log("报告:", path.join(OUT, "evals_report.json"));
  process.exit(passCount === rows.length ? 0 : 1);
})();
