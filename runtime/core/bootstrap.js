/**
 * WP Bootstrap — 一行装配完整运行时。
 * 用法：
 *   <link rel="stylesheet" href="runtime/core/presentation.css">
 *   <link rel="stylesheet" href="runtime/print/print.css" media="print">
 *   <script src="runtime/core/scene-engine.js"></script>
 *   <script src="runtime/navigation/router.js"></script>
 *   <script src="runtime/motion/motion-controller.js"></script>
 *   <script src="runtime/interaction/interaction.js"></script>
 *   <script src="runtime/presenter/presenter-view.js"></script>
 *   <script src="runtime/reader/reader.js"></script>
 *   <script src="runtime/core/bootstrap.js"></script>
 *   <script>WPBoot.start(".wp-deck")</script>
 *
 * 快捷键：→/Space 推进 · ← 回退 · O 总览 · / 搜索 · P 讲者台 · R 阅读模式
 *         M 静帧（关动效整幕直出） · ? 帮助 · Esc 退出/返回深潜 · Home/End 首尾
 *
 * 展示层常驻元素（自动注入，可用 data-wpui="off" 关闭）：
 *   .wp-status  左下页码锚点「03 / 08 · 主题」
 *   .wp-hints   右下隐晦按键提示（6s 无操作自动淡化为 25%）
 *   .wp-help    ? 键呼出的完整快捷键面板
 */
(function (global) {
  "use strict";

  const WPBoot = {
    start(deckSelector = ".wp-deck") {
      const engine = new WPSceneEngine(deckSelector).init();
      const motion = new WPMotionController();
      const search = new WPSearch(engine);
      const overview = new WPOverview(engine);
      const help = buildHelp();
      const router = new WPRouter(engine, { searchUI: search, overviewUI: overview, helpUI: help }).start();
      const presenter = new WPPresenter(engine);
      const reader = new WPReader(engine);
      WPInteraction.init();

      const uiOff = document.querySelector(deckSelector).dataset.wpui === "off";

      // 每幕激活时注册该幕动效
      const prevOnChange = engine.options.onSceneChange;
      engine.options.onSceneChange = (el, i, prev) => {
        motion.registerAll(el);
        if (prevOnChange) prevOnChange(el, i, prev);
      };
      motion.registerAll(engine.currentScene);

      // 进度条
      const bar = document.createElement("div");
      bar.className = "wp-progress";
      bar.innerHTML = "<i></i>";
      document.body.appendChild(bar);
      const fill = bar.firstElementChild;

      // 页码锚点 + 隐晦按键提示
      let status = null, hints = null;
      if (!uiOff) {
        status = document.createElement("div");
        status.className = "wp-status";
        status.setAttribute("aria-live", "polite");
        document.body.appendChild(status);
        hints = document.createElement("div");
        hints.className = "wp-hints";
        hints.textContent = "→ 推进 · O 总览 · ? 快捷键";
        document.body.appendChild(hints);
        // 6s 无操作淡化提示，任何按键/鼠标活动恢复
        let dimTimer = null;
        const wake = () => {
          hints.classList.remove("wp-dim");
          if (status) status.classList.remove("wp-dim");
          clearTimeout(dimTimer);
          dimTimer = setTimeout(() => {
            hints.classList.add("wp-dim");
            if (status) status.classList.add("wp-dim");
          }, 6000);
        };
        ["keydown", "mousemove", "touchstart"].forEach((ev) =>
          document.addEventListener(ev, wake, { passive: true }));
        wake();
      }

      const sceneLabel = (el) =>
        (el.dataset.topic || el.dataset.sceneId || "").trim();
      const updateUI = () => {
        fill.style.width = ((engine.current + 1) / engine.scenes.length * 100) + "%";
        if (status) {
          const cur = String(engine.current + 1).padStart(2, "0");
          const total = String(engine.scenes.length).padStart(2, "0");
          status.textContent = `${cur} / ${total} · ${sceneLabel(engine.currentScene)}`;
        }
      };
      const chain = engine.options.onSceneChange;
      engine.options.onSceneChange = (el, i, prev) => { chain(el, i, prev); updateUI(); };
      updateUI();

      // 静帧开关（M）：整幕直出 + 停掉一切动效；选择持久化到 sessionStorage
      const setMotionOff = (off) => {
        engine.setStepwise(!off);
        motion.disabled = off;
        document.body.classList.toggle("wp-no-motion", off);
        if (off) motion.skipAll();
        try { sessionStorage.setItem("wp-motion", off ? "off" : "on"); } catch (_) {}
        if (hints) hints.textContent = off
          ? "静帧中 · M 恢复动效 · O 总览 · ? 快捷键"
          : "→ 推进 · O 总览 · ? 快捷键";
      };
      let motionOff = false;
      try { motionOff = sessionStorage.getItem("wp-motion") === "off"; } catch (_) {}
      if (motionOff) setMotionOff(true);

      document.addEventListener("keydown", (e) => {
        if (e.target.matches("input, textarea, [contenteditable]")) return;
        const k = e.key.toLowerCase();
        if (k === "p") presenter.open();
        if (k === "r") reader.toggle();
        if (k === "m") { motionOff = !motionOff; setMotionOff(motionOff); }
        if (e.key === "?") help.toggle();
      });

      // 打印前全展开（§50：打印态必须完整）
      global.addEventListener("beforeprint", () => engine.expandAll());

      global.wp = { engine, motion, router, presenter, reader, overview, setMotionOff };
      return global.wp;
    },
  };

  /** ? 帮助面板：完整快捷键一览 */
  function buildHelp() {
    const el = document.createElement("div");
    el.className = "wp-help";
    el.hidden = true;
    el.innerHTML =
      '<div class="wp-help-card" role="dialog" aria-label="快捷键帮助">' +
      "<h2>快捷键</h2><dl>" +
      "<dt>→ / Space / PgDn</dt><dd>下一步（先走完本幕揭示）</dd>" +
      "<dt>← / PgUp</dt><dd>回退一步</dd>" +
      "<dt>O</dt><dd>总览：全部页面缩略平铺，点击跳转</dd>" +
      "<dt>/</dt><dd>搜索场景 / 论点 / 证据</dd>" +
      "<dt>P</dt><dd>讲者控制台（独立窗口：笔记 / 计时 / 分支）</dd>" +
      "<dt>R</dt><dd>阅读模式（完整内容纵向滚动）</dd>" +
      "<dt>M</dt><dd>静帧开关：关闭动效，整幕直出</dd>" +
      "<dt>Esc</dt><dd>退出总览 / 帮助 · 深潜后返回主线</dd>" +
      "<dt>Home / End</dt><dd>第一幕 / 最后一幕</dd>" +
      "</dl><p>Esc 或 ? 关闭</p></div>";
    document.body.appendChild(el);
    const api = {
      el,
      get active() { return !el.hidden; },
      toggle() { el.hidden = !el.hidden; },
    };
    el.addEventListener("click", (e) => { if (e.target === el) api.toggle(); });
    return api;
  }

  global.WPBoot = WPBoot;
})(window);
