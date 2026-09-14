#!/usr/bin/env node
/**
 * content_stress.cjs — 中文内容压力 + Reader 清单验证（补丁 §27/§39/§40）
 *
 * 在同一份真实 Demo 上：
 *  - §39/§40：以短标题 / 20–35 字长标题 / 机构全称 / 政府项目名 / 中英混排 / 中文数字标点
 *    逐条替换当前幕标题，检测是否横向溢出、是否越出视口（渲染器须 wrap / re-layout 而非溢出）。
 *  - §27：Reader 模式清单（深链锚点 / 引用来源 / 展开交互 / 移动端）。
 *
 * 用法：NODE_PATH=/path/to/node_modules node content_stress.cjs
 */
const { chromium, webkit } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE =
  process.env.WP_BASE ||
  "http://127.0.0.1:8765/wenzhi/examples/demo/index.html";
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");
fs.mkdirSync(OUT, { recursive: true });

const TITLES = [
  { tag: "short", text: "数据闭环" },
  { tag: "long26", text: "当前核心问题不是数据缺失，而是跨系统身份映射的长期缺位" },
  { tag: "long31", text: "演示的质量瓶颈从来不在视觉生成能力而在受众认知路径的重构能力缺位" },
  { tag: "org", text: "福州市三坊七巷历史文化街区保护管理委员会办公室对台小额贸易免税商城" },
  { tag: "mixed", text: "Web-native Presentation 与 HTML 原生演示系统的融合路径" },
  { tag: "num_punct", text: "一、二、三；「四」『五』（六）——七的标点压力测试" },
];
const RES = [
  [1920, 1080],
  [1366, 768],
];

async function titleStress(page, text) {
  return await page.evaluate((t) => {
    const el = document.querySelector(".wp-scene:not([hidden])");
    const h = el.querySelector("h1,h2,h3");
    if (!h) return { error: "no title el" };
    const orig = h.textContent;
    h.textContent = t;
    void h.offsetWidth;
    const de = document.documentElement;
    const rect = h.getBoundingClientRect();
    const out = {
      len: [...t].length,
      docOverflowX: de.scrollWidth - de.clientWidth,
      sceneOverflowX: el.scrollWidth - el.clientWidth,
      titleOverflowX: h.scrollWidth - h.clientWidth,
      titleRight: Math.round(rect.right),
      viewportW: de.clientWidth,
      titleH: Math.round(rect.height),
    };
    out.ok = out.docOverflowX <= 1 && out.sceneOverflowX <= 1 && out.titleOverflowX <= 1 &&
             out.titleRight <= out.viewportW + 1 && rect.left >= -1;
    h.textContent = orig;
    return out;
  }, text);
}

async function run(name, type) {
  const res = { engine: name, titles: [], reader: {} };
  const browser = await type.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(400);

  // §39/§40 标题压力 × 两档分辨率
  for (const [w, h] of RES) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(250);
    for (const t of TITLES) {
      const r = await titleStress(page, t.text);
      r.tag = t.tag;
      r.res = `${w}x${h}`;
      res.titles.push(r);
    }
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(200);

  // §27 Reader 清单
  await page.evaluate(() => window.wp.engine.goTo("proof"));
  await page.keyboard.press("r");
  await page.waitForTimeout(400);
  res.reader = await page.evaluate(() => {
    const de = document.documentElement;
    const sc = [...document.querySelectorAll(".wp-scene")];
    return {
      active: document.body.classList.contains("wp-reader-mode"),
      allScenesVisible: sc.every((s) => !s.hidden),
      hasSource: !!document.querySelector(".wp-source"),
      sourceVisible: (() => {
        const s = document.querySelector(".wp-source");
        return s ? getComputedStyle(s).display !== "none" : false;
      })(),
      expandControls: document.querySelectorAll("[data-interact]").length,
      noHorizontalOverflow: de.scrollWidth - de.clientWidth <= 1,
      hash: location.hash,
    };
  });
  // 移动端阅读
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  res.reader.mobile = await page.evaluate(() => {
    const de = document.documentElement;
    const body = getComputedStyle(document.body);
    return {
      noHorizontalOverflow: de.scrollWidth - de.clientWidth <= 1,
      fontSizePx: parseFloat(body.fontSize) || null,
    };
  });
  await page.screenshot({ path: path.join(OUT, `${name}-reader-mobile-390x844.png`) });
  await browser.close();
  return res;
}

(async () => {
  const all = [];
  for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
    process.stdout.write(`\n▶ ${name} …\n`);
    const r = await run(name, type).catch((e) => ({ engine: name, fatal: e.message }));
    all.push(r);
    if (r.fatal) { console.log("  FATAL", r.fatal); continue; }
    const bad = r.titles.filter((t) => !t.ok);
    console.log(`  标题压力: ${r.titles.length - bad.length}/${r.titles.length} 通过`);
    if (bad.length) bad.forEach((b) => console.log(`   ✗ ${b.res} ${b.tag} (${b.len}字) →`, JSON.stringify(b)));
    console.log("  Reader:", JSON.stringify(r.reader, null, 0));
  }
  fs.writeFileSync(path.join(OUT, "content_stress.json"), JSON.stringify({ generatedAt: new Date().toISOString(), engines: all }, null, 2));
  console.log("\n✔ 报告:", path.join(OUT, "content_stress.json"));
})();
