/**
 * WP Interaction — 通用交互行为（§44/KN-INT-001）
 * data-interact="expand|toggle|compare|drill" 声明式挂载；每个交互必须带 data-purpose 说明认知目的。
 * 校验：Core Path 内容不得只在交互后可见（init 时扫描告警）。
 */
(function (global) {
  "use strict";

  class WPInteraction {
    static init(root = document) {
      root.querySelectorAll("[data-interact]").forEach((el) => {
        if (!el.dataset.purpose) {
          console.warn("[WP] 交互缺少 data-purpose（认知目的），违反 KN-INT-001：", el);
        }
        const kind = el.dataset.interact;
        const target = el.dataset.target
          ? document.querySelector(el.dataset.target)
          : el.nextElementSibling;
        if (!target) return;
        if (kind === "expand" || kind === "toggle") {
          el.setAttribute("aria-expanded", "false");
          target.hidden = true;
          el.addEventListener("click", () => {
            const open = target.hidden;
            target.hidden = !open;
            el.setAttribute("aria-expanded", String(open));
          });
        } else if (kind === "compare") {
          el.addEventListener("click", () => {
            target.classList.toggle("wp-compare-alt");
          });
        } else if (kind === "drill") {
          el.addEventListener("click", () => {
            const detail = target;
            detail.hidden = !detail.hidden;
            el.setAttribute("aria-expanded", String(!detail.hidden));
          });
        }
      });
      // Core Path 完整性检查：主内容不应全部 hidden 依赖交互
      root.querySelectorAll(".wp-scene").forEach((scene) => {
        const visibleText = Array.from(scene.childNodes)
          .filter((n) => !(n.nodeType === 1 && n.hidden))
          .map((n) => n.textContent || "").join("").trim();
        if (visibleText.length < 20) {
          console.warn("[WP] Scene 可见内容过少，核心信息可能藏在交互之后（§44 禁止）：",
            scene.dataset.sceneId);
        }
      });
    }
  }

  global.WPInteraction = WPInteraction;
})(window);
