#!/usr/bin/env node
/**
 * live_scenarios.cjs — 现场适应剧本验证（补丁 §24/§34/§56）
 *
 * 以「真实现场会发生什么」为单位驱动同一套 Deck（默认 corpus/01），而非逐 API 断言：
 *   S1 时间不够   → 跳段直达决策页，回退后场景状态保持
 *   S2 被问证据   → 深潜证据附录 → Esc 返回 → 揭示进度恢复
 *   S3 被问技术   → 深潜技术架构 → 返回
 *   S4 被质疑合规 → 分支异议应对 → Esc 返回
 *   S5 现场用静帧 → M 直出全部内容，再关闭恢复步进
 *
 * 注意：所有读取都在页面内完成（引擎的 getter 无法跨 evaluate 序列化）。
 * 用法：BASE=http://127.0.0.1:8765 NODE_PATH=... node live_scenarios.cjs [deck-rel]
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REL = process.argv[2] || "benchmarks/corpus/01-executive-portal-decision";
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");
fs.mkdirSync(path.join(OUT, "live_scenarios"), { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${BASE}/${REL}/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(500);

  // 页面内快照（避免序列化丢失 getter 与 DOM）
  const snap = () => page.evaluate(() => {
    const e = window.wp.engine;
    const el = e.currentScene;
    const hint = el ? el.querySelector("[data-branch-return]") : null;
    return {
      id: e.currentId, index: e.scenes.indexOf(el), step: e.revealStep,
      via: el ? el.dataset.enteredVia : null,
      hint: hint ? getComputedStyle(hint).display !== "none" : false,
    };
  });
  const run = (fn, arg) => page.evaluate(fn, arg);

  const S = {};

  // S1 时间不够：讲到投入产出 → 跳段直达决策页 → 回退（状态保持）→ 再跳回
  S.skipShortPath = await (async () => {
    await run(() => {
      const e = window.wp.engine;
      e.goTo("financial");
      e.revealStep = 1; e._applyReveal();   // 只揭示到第一条
    });
    const atFin = await snap();
    await run(() => window.wp.engine.skipTo("ask"));      // 时间不够：跳到决策页
    await page.waitForTimeout(250);
    const atAsk = await snap();
    for (let i = 0; i < 4; i++) { await page.keyboard.press("ArrowLeft"); await page.waitForTimeout(140); }
    const back = await snap();
    await run(() => window.wp.engine.skipTo("ask"));      // 现场答完，回到决策页
    await page.waitForTimeout(250);
    const again = await snap();
    return { atFin, atAsk, back, again,
             ok: atAsk.id === "ask" && (back.index < atAsk.index || back.step < atAsk.step) && again.id === "ask" };
  })();

  // S2 被问证据：financial 深潜 appendix → Esc 返回且揭示进度恢复
  S.evidenceDive = await (async () => {
    await run(() => {
      const e = window.wp.engine;
      e.goTo("financial");
      e.revealStep = Math.min(2, e.currentScene.querySelectorAll("[data-reveal]").length);
      e._applyReveal();
    });
    const before = await snap();
    await run(() => window.wp.engine.deepDive("appendix"));
    await page.waitForTimeout(250);
    const during = await snap();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const after = await snap();
    await page.screenshot({ path: path.join(OUT, "live_scenarios", "S2-evidence.png") });
    return { before, during, after,
             ok: during.id === "appendix" && during.hint && after.id === before.id && after.step === before.step };
  })();

  // S3 被问技术：recommendation 深潜 tech-arch → 返回
  S.techDive = await (async () => {
    await run(() => window.wp.engine.goTo("recommendation"));
    const before = await snap();
    await run(() => window.wp.engine.deepDive("tech-arch"));
    await page.waitForTimeout(250);
    const during = await snap();
    await run(() => window.wp.engine.returnFromDive());
    await page.waitForTimeout(250);
    const after = await snap();
    return { before, during, after, ok: during.id === "tech-arch" && after.id === before.id };
  })();

  // S4 被质疑合规：thesis 分支 objection → Esc 返回
  S.objectionBranch = await (async () => {
    await run(() => {
      const e = window.wp.engine;
      e.goTo("thesis");
      e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
      e._applyReveal();
    });
    const before = await snap();
    await page.click('a[data-branch="objection"]').catch(() => {});
    await page.waitForTimeout(300);
    const during = await snap();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const after = await snap();
    await page.screenshot({ path: path.join(OUT, "live_scenarios", "S4-objection.png") });
    return { before, during, after,
             ok: during.id === "objection" && during.hint && after.id === before.id && after.step === before.step };
  })();

  // S5 现场用静帧：M 直出，再关闭恢复步进
  S.staticMode = await (async () => {
    await run(() => window.wp.engine.goTo("metrics"));
    await page.keyboard.press("m");
    await page.waitForTimeout(250);
    const on = await page.evaluate(() => ({
      cls: document.body.classList.contains("wp-no-motion"),
      visible: [...document.querySelectorAll(".wp-scene:not([hidden]) [data-reveal]")]
        .every((el) => getComputedStyle(el).opacity === "1"),
    }));
    await page.keyboard.press("m");
    await page.waitForTimeout(250);
    const off = await page.evaluate(() => !document.body.classList.contains("wp-no-motion"));
    return { on, off, ok: on.cls && on.visible && off };
  })();

  await b.close();
  const report = { deck: REL, scenarios: S, consoleErrors: errors };
  fs.writeFileSync(path.join(OUT, "live_scenarios", "report.json"), JSON.stringify(report, null, 2));
  const list = Object.entries(S).map(([k, v]) => [k, v.ok]);
  const failed = list.filter(([, v]) => !v);
  console.log("现场适应剧本（§56） · " + REL);
  list.forEach(([k, v]) => console.log(`  ${v ? "✔" : "✗"} ${k}`));
  console.log(failed.length ? `\n✗ ${failed.length} 个剧本未通过：${failed.map(([k]) => k).join(", ")}` : "\n✔ 五个现场剧本全部通过");
  process.exit(failed.length ? 1 : 0);
})();
