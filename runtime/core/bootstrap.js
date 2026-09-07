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
 * 快捷键：→/Space 下一步 · ← 上一步 · / 搜索 · P 讲者台 · R 阅读模式 · Esc 返回深潜 · Home/End 首尾
 */
(function (global) {
  "use strict";

  const WPBoot = {
    start(deckSelector = ".wp-deck") {
      const engine = new WPSceneEngine(deckSelector).init();
      const motion = new WPMotionController();
      const search = new WPSearch(engine);
      const router = new WPRouter(engine, { searchUI: search }).start();
      const presenter = new WPPresenter(engine);
      const reader = new WPReader(engine);
      WPInteraction.init();

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
      const updateBar = () => {
        fill.style.width = ((engine.current + 1) / engine.scenes.length * 100) + "%";
      };
      const chain = engine.options.onSceneChange;
      engine.options.onSceneChange = (el, i, prev) => { chain(el, i, prev); updateBar(); };
      updateBar();

      document.addEventListener("keydown", (e) => {
        if (e.target.matches("input, textarea, [contenteditable]")) return;
        const k = e.key.toLowerCase();
        if (k === "p") presenter.open();
        if (k === "r") reader.toggle();
      });

      // 打印前全展开（§50：打印态必须完整）
      global.addEventListener("beforeprint", () => engine.expandAll());

      global.wp = { engine, motion, router, presenter, reader };
      return global.wp;
    },
  };

  global.WPBoot = WPBoot;
})(window);
