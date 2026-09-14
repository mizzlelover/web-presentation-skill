#!/usr/bin/env node
/**
 * runtime_verify.cjs — 跨引擎运行时验证 harness（补丁 §23/§27/§30/§31/§33/§34/§54）
 *
 * 零运行时依赖：仅使用 Playwright（dev-only）驱动真实浏览器内核。
 * 覆盖引擎：chromium / webkit / firefox。
 *
 * 用法：
 *   cd evals/harness && npm install && node runtime_verify.cjs
 * 或复用外部安装：
 *   NODE_PATH=/path/to/node_modules node runtime_verify.cjs
 *
 * 环境变量：
 *   WP_BASE  demo 页面 URL（默认本地 http 服务）
 *   WP_OUT   产物目录（默认 ./_artifacts）
 */
const { chromium, webkit, firefox } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE =
  process.env.WP_BASE ||
  "http://127.0.0.1:8765/wenzhi/examples/demo/index.html";
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");
const RES = [
  [1920, 1080],
  [1366, 768],
  [1600, 1000],
];
const ENGINES = [
  ["chromium", chromium],
  ["webkit", webkit],
  ["firefox", firefox],
];
const SELECT = (process.env.WP_ENGINES || "").split(",").filter(Boolean);
const ENGINE_TIMEOUT = Number(process.env.WP_ENGINE_TIMEOUT || 150000);

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error(`timeout ${ms}ms @ ${label}`)), ms)
    ),
  ]);
}

fs.mkdirSync(OUT, { recursive: true });

async function measureFPS(page, steps = 8) {
  await page.evaluate(() => {
    window.__fps = { frames: 0, t0: performance.now(), running: true };
    const tick = () => {
      if (!window.__fps.running) return;
      window.__fps.frames++;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(120);
  }
  const r = await page.evaluate(() => {
    window.__fps.running = false;
    const dt = performance.now() - window.__fps.t0;
    return { frames: window.__fps.frames, ms: dt, fps: (window.__fps.frames / dt) * 1000 };
  });
  return { fps: Math.round(r.fps * 10) / 10, frames: r.frames, ms: Math.round(r.ms) };
}

async function runEngine(name, browser) {
  const res = { engine: name, consoleErrors: [], checks: {}, perf: {}, shots: [] };
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") res.consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => res.consoleErrors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) =>
    res.consoleErrors.push("reqfail: " + r.url() + " " + (r.failure() || {}).errorText)
  );

  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(400);

  const T = (k, v) => (res.checks[k] = v);
  const q = (fn) => page.evaluate(fn);

  T("sceneCount", await q(() => document.querySelectorAll(".wp-scene").length));

  // §32 初始只首幕可见
  T("initialOnlyFirstVisible", await q(() => {
    const s = [...document.querySelectorAll(".wp-scene")];
    return s.length > 0 && s[0].hidden === false && s.filter((x) => !x.hidden).length === 1;
  }));

  // §34 渐进揭示：ArrowRight 先消费本幕 reveal 再翻页
  T("revealBeforeAdvance", await q(() => {
    const eng = window.wp.engine;
    const start = eng.current;
    const reveals = eng.currentScene.querySelectorAll("[data-reveal]").length;
    for (let i = 0; i < reveals; i++) eng.next();
    return eng.current === start && eng.revealStep === reveals;
  }));

  // §34 Home / End
  await page.keyboard.press("End");
  await page.waitForTimeout(150);
  const lastId = await q(() => window.wp.engine.currentId);
  T("endGoesLast", await q(() => window.wp.engine.current === window.wp.engine.scenes.length - 1));
  await page.keyboard.press("Home");
  await page.waitForTimeout(150);
  T("homeGoesFirst", await q(() => window.wp.engine.current === 0));
  T("lastSceneId", lastId);

  // §34/§87 搜索跳转
  await page.keyboard.press("/");
  await page.waitForTimeout(200);
  T("searchOpens", await q(() => !document.querySelector(".wp-search").hidden));
  await page.keyboard.type("pipelin");
  await page.waitForTimeout(250);
  const hits = await q(() => document.querySelectorAll(".wp-search li[data-id]").length);
  T("searchHits", hits);
  if (hits > 0) {
    await page.click(".wp-search li[data-id]");
    await page.waitForTimeout(250);
    T("searchJumped", await q(() => window.wp.engine.currentId));
  }

  // §34 总览 O / Esc
  await page.keyboard.press("o");
  await page.waitForTimeout(250);
  T("overviewOn", await q(() => document.body.classList.contains("wp-overview-mode")));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  T("overviewOff", await q(() => !document.body.classList.contains("wp-overview-mode")));

  // ? 帮助
  await page.keyboard.press("?");
  await page.waitForTimeout(200);
  T("helpOn", await q(() => !document.querySelector(".wp-help").hidden));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  T("helpOff", await q(() => document.querySelector(".wp-help").hidden));

  // §49/§89 Reader 模式
  await page.keyboard.press("r");
  await page.waitForTimeout(300);
  T("readerOn", await q(() => document.body.classList.contains("wp-reader-mode")));
  res.shots.push(await shot(page, `${name}-reader-1920x1080`));
  await page.keyboard.press("r");
  await page.waitForTimeout(200);
  T("readerOff", await q(() => !document.body.classList.contains("wp-reader-mode")));

  // §39 静帧 M：整幕直出
  await page.keyboard.press("m");
  await page.waitForTimeout(250);
  T("staticModeAllRevealed", await q(() => {
    const el = window.wp.engine.currentScene;
    const items = [...el.querySelectorAll("[data-reveal]")];
    return items.length === 0 || items.every((x) => x.classList.contains("wp-revealed"));
  }));
  await page.keyboard.press("m");
  await page.waitForTimeout(150);

  // §23 讲者台 P（独立窗口）
  try {
    const [popup] = await Promise.all([
      page.waitForEvent("popup", { timeout: 3000 }),
      page.keyboard.press("p"),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(400);
    res.checks.presenterPopup = true;
    res.checks.presenterHasTimer = await popup.evaluate(
      () => !!document.getElementById("t") && /\d\d:\d\d/.test(document.getElementById("t").textContent)
    );
    res.checks.presenterHasNotes = await popup.evaluate(() => !!document.getElementById("note"));
    await popup.close();
  } catch (e) {
    res.checks.presenterPopup = false;
    res.consoleErrors.push("presenter: " + e.message);
  }

  // §25 深潜/返回 状态恢复（API 级，独立于 demo 是否含链接）
  T("deepDiveReturnRestores", await q(() => {
    const eng = window.wp.engine;
    eng.goTo(1);
    eng.next();
    const before = eng.revealStep;
    const target = eng.scenes.length - 1;
    eng.diveStack.push({ sceneId: eng.currentId, revealStep: before });
    eng.goTo(target, { preserveDive: true, via: "dive" });
    eng.returnFromDive();
    return eng.currentId === eng.scenes[1].dataset.sceneId && eng.revealStep === before;
  }));

  // §50 打印态全展开
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(200);
  T("printAllExpanded", await q(() => {
    window.wp.engine.expandAll();
    const s = [...document.querySelectorAll(".wp-scene")];
    return s.every((x) => !x.hidden);
  }));
  await page.emulateMedia({ media: "screen" });

  // §31 性能采集（首次导航）
  res.perf = await q(() => {
    const o = {};
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav) {
      o.domContentLoaded = Math.round(nav.domContentLoadedEventEnd);
      o.load = Math.round(nav.loadEventEnd);
      o.transferSize = nav.transferSize;
    }
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    if (fcp) o.fcp = Math.round(fcp.startTime);
    if (performance.memory)
      o.jsHeapUsedMB = +(performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    o.resources = performance.getEntriesByType("resource").length;
    return o;
  });
  res.perf.fpsUnderTransition = await measureFPS(page, 8);

  // §30/§33 三档分辨率截图（先重载清除 print 测试 expandAll 副作用，并强制回开场幕）
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.wp.engine.goTo(0));
  await page.waitForTimeout(300);

  // §58 视觉回归基线：总览 / 静帧 两个状态各留一张
  await page.keyboard.press("o");
  await page.waitForTimeout(400);
  res.shots.push(await shot(page, `${name}-overview-1920x1080`));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  for (const [w, h] of RES) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(350);
    res.shots.push(await shot(page, `${name}-${w}x${h}`));
    // 溢出检测：分别记录文档级与可见幕自身的溢出量
    const ov = await q(() => {
      const de = document.documentElement;
      const el = document.querySelector(".wp-scene:not([hidden])");
      return {
        dW: de.scrollWidth - de.clientWidth,
        dH: de.scrollHeight - de.clientHeight,
        sceneW: el ? el.scrollWidth - el.clientWidth : 0,
        sceneH: el ? el.scrollHeight - el.clientHeight : 0,
      };
    });
    res.checks[`overflow_${w}x${h}`] =
      !!ov && ov.dW <= 2 && ov.dH <= 2 && ov.sceneW <= 2 && ov.sceneH <= 2;
    res.checks[`overflowRaw_${w}x${h}`] = ov;
  }
  await page.setViewportSize({ width: 1920, height: 1080 });

  // §34 reduced-motion：内容仍完整
  const rmCtx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmCtx.newPage();
  await rmPage.goto(BASE, { waitUntil: "load" });
  await rmPage.waitForTimeout(300);
  res.checks.reducedMotionFlag = await rmPage.evaluate(() => window.wp.engine.reducedMotion === true);
  res.checks.reducedMotionContentVisible = await rmPage.evaluate(() => {
    const h = document.querySelector(".wp-scene:not([hidden]) h1, .wp-scene:not([hidden]) h2");
    return !!h && getComputedStyle(h).visibility !== "hidden";
  });
  await ctx.close();
  await rmCtx.close();
  return res;
}

async function shot(page, name) {
  const p = path.join(OUT, name + ".png");
  await page.screenshot({ path: p });
  return p;
}

(async () => {
  const all = [];
  const writeJson = () =>
    fs.writeFileSync(
      path.join(OUT, "runtime_verify.json"),
      JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, engines: all }, null, 2)
    );
  for (const [name, type] of ENGINES) {
    if (SELECT.length && !SELECT.includes(name)) continue;
    process.stdout.write(`\n▶ ${name} …\n`);
    let browser = null;
    let r;
    try {
      browser = await withTimeout(type.launch(), 60000, name + ":launch");
      r = await withTimeout(runEngine(name, browser), ENGINE_TIMEOUT, name);
    } catch (e) {
      r = { engine: name, fatal: e.message, checks: {}, consoleErrors: [e.message], perf: {}, shots: [] };
    } finally {
      if (browser) { try { await browser.close(); } catch (_) {} }
    }
    all.push(r);
    writeJson();
    const failed = Object.entries(r.checks).filter(([, v]) => v === false);
    const pass = Object.entries(r.checks).filter(([, v]) => v === true).length;
    console.log(
      `  ${name}: ${pass} PASS / ${failed.length} FAIL` +
        (r.consoleErrors.length ? ` / ${r.consoleErrors.length} note` : "") +
        (r.fatal ? `  [FATAL: ${r.fatal}]` : "")
    );
    if (failed.length) console.log("  FAIL:", failed.map(([k]) => k).join(", "));
  }
  console.log("\n✔ 报告:", path.join(OUT, "runtime_verify.json"));
})();
