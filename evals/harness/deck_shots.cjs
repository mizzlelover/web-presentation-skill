#!/usr/bin/env node
/**
 * deck_shots.cjs — 对任意 Deck 逐幕截图（展开揭示 + 图表渲染 + 溢出检测）
 * 用法：NODE_PATH=... node deck_shots.cjs <deck-index.html-url> <outDir> [sceneId,sceneId,...]
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const URL = process.argv[2];
const OUT = process.argv[3] || "/tmp/deck_shots";
const ONLY = (process.argv[4] || "").split(",").filter(Boolean);
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => errors.push("reqfail: " + r.url()));
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(600);

  // 展开揭示：静帧模式（等价现场按 M），逐幕保持全展开
  await page.evaluate(() => window.wp.engine.setStepwise(false));
  const ids = await page.evaluate(() => window.wp.engine.scenes.map((s) => s.dataset.sceneId));
  const targets = ONLY.length ? ids.filter((i) => ONLY.includes(i)) : ids;

  const report = [];
  for (const id of targets) {
    await page.evaluate((sid) => {
      const e = window.wp.engine;
      e.goTo(sid);
      e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
      e._applyReveal();
      if (window.WPCharts) window.WPCharts.renderScene(e.currentScene);
    }, id);
    await page.waitForTimeout(700);
    const ov = await page.evaluate(() => {
      const de = document.documentElement;
      const el = document.querySelector(".wp-scene:not([hidden])");
      return { dW: de.scrollWidth - de.clientWidth, dH: de.scrollHeight - de.clientHeight,
               sW: el ? el.scrollWidth - el.clientWidth : 0, sH: el ? el.scrollHeight - el.clientHeight : 0,
               charts: el ? el.querySelectorAll("[data-chart]").length : 0,
               canvases: el ? el.querySelectorAll("canvas").length : 0 };
    });
    const p = path.join(OUT, `${id}.png`);
    await page.screenshot({ path: p });
    report.push({ id, ...ov });
  }
  console.log(JSON.stringify({ url: URL, scenes: report, errors }, null, 2));
  await browser.close();
})();
