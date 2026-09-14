#!/usr/bin/env node
/**
 * regression.cjs — 视觉回归基线（补丁 §23 / §58）
 *
 * 对每套 Deck 的每一幕截图并计算 8×8 平均哈希（aHash），基线存 `evals/baselines/screens.json`。
 * 默认与基线比较，超过汉明距离阈值即报告差异；`--update` 重建基线。
 * 目的：改组件或主题后，能立刻发现「修了一个组件，破坏十套 Deck」。
 *
 * 用法：
 *   NODE_PATH=... node regression.cjs --update     # 生成/更新基线
 *   NODE_PATH=... node regression.cjs              # 回归比较
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const CORPUS = path.join(REPO, "benchmarks", "corpus");
const BASE_DIR = path.join(REPO, "evals", "baselines");
const BASE_FILE = path.join(BASE_DIR, "screens.json");
const THRESHOLD = Number(process.env.WP_REGRESSION_THRESHOLD || 6);   // 64 位哈希的汉明距离阈值
const UPDATE = process.argv.includes("--update");

function aHash(buf) {
  const png = PNG.sync.read(buf);
  const N = 8;
  const cells = new Array(N * N).fill(0);
  const cw = Math.floor(png.width / N), ch = Math.floor(png.height / N);
  for (let cy = 0; cy < N; cy++) {
    for (let cx = 0; cx < N; cx++) {
      let sum = 0, n = 0;
      for (let y = cy * ch; y < (cy + 1) * ch; y += 2) {
        for (let x = cx * cw; x < (cx + 1) * cw; x += 2) {
          const i = (png.width * y + x) << 2;
          sum += 0.299 * png.data[i] + 0.587 * png.data[i + 1] + 0.114 * png.data[i + 2];
          n++;
        }
      }
      cells[cy * N + cx] = n ? sum / n : 0;
    }
  }
  const avg = cells.reduce((a, b) => a + b, 0) / cells.length;
  return cells.map((v) => (v > avg ? 1 : 0));
}

function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

(async () => {
  fs.mkdirSync(BASE_DIR, { recursive: true });
  const baseline = UPDATE ? {} : (fs.existsSync(BASE_FILE) ? JSON.parse(fs.readFileSync(BASE_FILE, "utf8")) : {});
  const decks = [];
  for (const root of ["corpus", "derived", "real"]) {
    const base = path.join(REPO, "benchmarks", root);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base, { withFileTypes: true })) {
      if (d.isDirectory() && fs.existsSync(path.join(base, d.name, "presentation.ir.json")))
        decks.push(`${root}/${d.name}`);
    }
  }
  decks.sort();

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const diffs = [];
  let compared = 0;

  for (const name of decks) {
    await page.goto(`${BASE}/benchmarks/${name}/index.html`, { waitUntil: "load" });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.wp.engine.setStepwise(false));
    const ids = await page.evaluate(() => window.wp.engine.scenes.map((s) => s.dataset.sceneId));
    for (const id of ids) {
      await page.evaluate((sid) => {
        const e = window.wp.engine;
        e.goTo(sid);
        e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
        e._applyReveal();
        if (window.WPCharts) window.WPCharts.renderScene(e.currentScene);
      }, id);
      await page.waitForTimeout(300);
      const buf = await page.screenshot();
      const hash = aHash(buf);
      const key = `${name}/${id}`;
      if (UPDATE || !baseline[key]) {
        baseline[key] = hash;
      } else {
        compared++;
        const d = hamming(hash, baseline[key]);
        if (d > THRESHOLD) diffs.push({ key, distance: d });
      }
    }
    process.stdout.write(`✔ ${name} (${ids.length})\n`);
  }
  await browser.close();

  if (UPDATE || compared === 0) {
    fs.writeFileSync(BASE_FILE, JSON.stringify(baseline, null, 0));
    console.log(`\n基线已写入 ${BASE_FILE}（${Object.keys(baseline).length} 幕）`);
  } else {
    console.log(`\n比对 ${compared} 幕，超过阈值(${THRESHOLD}) 的差异 ${diffs.length} 处`);
    diffs.slice(0, 20).forEach((d) => console.log(`   Δ${d.distance}  ${d.key}`));
    if (diffs.length) process.exit(1);
  }
})();
