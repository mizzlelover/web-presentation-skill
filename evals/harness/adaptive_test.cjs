#!/usr/bin/env node
/**
 * adaptive_test.cjs — 自适应演示端到端验证（补丁 §9 / §25 / §33 / §35）
 *
 * 在真实 Deck 上验证 Presentation Graph 的实际运行：
 *   core path 线性遍历 / 分支进入与返回（reveal 恢复）/ 深潜进入与返回 /
 *   返回提示可见性 / 搜索跳转 / 图结构一致性。
 *
 * 用法：NODE_PATH=... node adaptive_test.cjs <deck-url>
 */
const { chromium } = require("playwright");

const URL = process.argv[2] || "http://127.0.0.1:8765/benchmarks/corpus/01-executive-portal-decision/index.html";

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(500);

  const R = {};
  const q = (fn, arg) => page.evaluate(fn, arg);

  // 图结构
  R.graph = await q(() => {
    const g = window.wp.engine.graph();
    return { nodes: g.nodes.length, edges: g.edges.length,
             types: [...new Set(g.edges.map((e) => e.type))],
             branchEdges: g.edges.filter((e) => e.type === "branch").length,
             diveEdges: g.edges.filter((e) => e.type === "deep_dive").length };
  });

  // 核心路径线性遍历：连续 next() 应走完核心路径（含揭示步）
  R.coreTraversal = await q(() => {
    const e = window.wp.engine;
    e.goTo(0);
    let guard = 0;
    while (e.current < e.scenes.length - 1 && guard++ < 500) e.next();
    return { reached: e.currentId, lastId: e.scenes[e.scenes.length - 1].dataset.sceneId, total: e.scenes.length, guard };
  });

  // 分支：从图中任取一条 branch 边，进入 → Esc/返回 → 校验恢复（deck 无关）
  R.branch = await q(() => {
    const e = window.wp.engine;
    const g = e.graph();
    const be = g.edges.find((x) => x.type === "branch");
    if (!be) return { skipped: "no branch edge" };
    e.goTo(be.from);
    e.revealStep = e.currentScene.querySelectorAll("[data-reveal]").length;
    e._applyReveal();
    const before = { scene: e.currentId, reveal: e.revealStep };
    e.branchTo(be.to);
    const during = { scene: e.currentId, via: e.currentScene.dataset.enteredVia,
                     returnHintVisible: (() => {
                       const el = e.currentScene.querySelector("[data-branch-return]");
                       return el ? getComputedStyle(el).display !== "none" : null;
                     })() };
    e.returnFromDive();
    const after = { scene: e.currentId, reveal: e.revealStep };
    return { edge: be, before, during, after,
             restored: after.scene === before.scene && after.reveal === before.reveal };
  });

  // 深潜：从图中任取一条 deep_dive 边
  R.deepDive = await q(() => {
    const e = window.wp.engine;
    const g = e.graph();
    const de = g.edges.find((x) => x.type === "deep_dive");
    if (!de) return { skipped: "no deep_dive edge" };
    e.goTo(de.from);
    const before = e.currentId;
    e.deepDive(de.to);
    const during = { scene: e.currentId, via: e.currentScene.dataset.enteredVia };
    e.returnFromDive();
    return { edge: de, before, during, after: e.currentId, restored: e.currentId === before };
  });

  // Esc 键返回主线（真实键盘路径，使用图中第一条 branch 边）
  R.escReturn = await (async () => {
    const be = await q(() => {
      const e = window.wp.engine;
      return e.graph().edges.find((x) => x.type === "branch") || null;
    });
    if (!be) return { skipped: "no branch edge" };
    await q((from) => { window.wp.engine.goTo(from); }, be.from);
    await page.click(`a[data-branch="${be.to}"]`).catch(() => {});
    await page.waitForTimeout(300);
    const during = await q(() => window.wp.engine.currentId);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const after = await q(() => window.wp.engine.currentId);
    return { edge: be, during, after, restored: after === be.from };
  })();

  // 搜索跳转
  R.search = await page.evaluate(() => {
    const hits = window.wp.engine.search("口径");
    return { hits: hits.length, sample: hits.slice(0, 3) };
  });

  // 返回提示仅在线性到达时隐藏（取任一 deep_dive/appendix/branch 幕，线性 goTo 进入）
  R.returnHintLinear = await q(() => {
    const e = window.wp.engine;
    const target = e.scenes.find((s) =>
      ["deep_dive", "appendix", "branch"].includes(s.dataset.role));
    if (!target) return "n/a";
    e.goTo(target.dataset.sceneId);   // via = linear
    const el = e.currentScene.querySelector("[data-branch-return]");
    return el ? getComputedStyle(el).display : "absent";
  });

  R.consoleErrors = errors;
  const checks = {
    graphHasBranchAndDive: R.graph.branchEdges > 0 && R.graph.diveEdges > 0,
    coreTraversalEndsAtLast: R.coreTraversal.reached === R.coreTraversal.lastId,
    branchRestores: R.branch.skipped ? true : R.branch.restored,
    branchHintShown: R.branch.skipped ? true : R.branch.during.returnHintVisible === true,
    deepDiveRestores: R.deepDive.skipped ? true : R.deepDive.restored,
    escReturns: R.escReturn.skipped ? true : R.escReturn.restored,
    searchHits: R.search.hits > 0,
    returnHintHiddenWhenLinear: R.returnHintLinear === "none",
    noConsoleErrors: errors.length === 0,
  };
  const notes = [];
  if (R.branch.skipped) notes.push("本 Deck 无 branch 边（跳过分支断言）");
  if (R.deepDive.skipped) notes.push("本 Deck 无 deep_dive 边（跳过深潜断言）");
  console.log(JSON.stringify({ url: URL, checks, notes, detail: R }, null, 2));
  const failed = Object.entries(checks).filter(([, v]) => !v);
  console.log(failed.length ? `\n✗ ${failed.length} FAIL: ${failed.map(([k]) => k).join(", ")}`
                           : "\n✔ 自适应导航全部通过");
  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();
