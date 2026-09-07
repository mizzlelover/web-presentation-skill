/**
 * WP Motion Controller — 语义动效控制器（§36–§39）
 * 每个动效必须声明 intent（data-motion-intent），统一注册、统一可控：
 * pause / resume / reverse / seek / skip / replay。
 * 尊重 prefers-reduced-motion：降级为直接呈现终态。
 *
 * HTML 约定：
 *   <div data-motion-intent="focus|reveal|connect|transform|trace|accumulate|compare|cause|continuity|remove"
 *        data-motion="auto|step">…</div>
 *   step = 与 reveal 步骤联动；auto = 幕激活即播放（讲者仍可控制）。
 */
(function (global) {
  "use strict";

  class WPMotionController {
    constructor() {
      this.animations = new Map();  // el -> Animation[]
      this.reducedMotion = global.matchMedia &&
        global.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (global.matchMedia) {
        global.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
          this.reducedMotion = e.matches;
          if (e.matches) this.skipAll();
        });
      }
    }

    /** 为元素按 intent 生成 WAAPI 动画并注册 */
    register(el) {
      const intent = el.dataset.motionIntent;
      if (!intent) return null;
      if (this.reducedMotion) { el.classList.add("wp-motion-final"); return null; }
      const keyframes = this._keyframes(intent, el);
      if (!keyframes) return null;
      const anim = el.animate(keyframes, {
        duration: Number(el.dataset.motionDuration || 600),
        easing: "cubic-bezier(.2,.7,.3,1)",
        fill: "both",
      });
      if (el.dataset.motion !== "auto") anim.pause();
      this.animations.set(el, [...(this.animations.get(el) || []), anim]);
      return anim;
    }

    registerAll(root) {
      (root || document).querySelectorAll("[data-motion-intent]")
        .forEach((el) => this.register(el));
    }

    _keyframes(intent, el) {
      switch (intent) {
        case "reveal":  return [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }];
        case "focus":   return [{ filter: "brightness(.4)", opacity: .35 }, { filter: "none", opacity: 1 }];
        case "connect": return [{ opacity: 0, transform: "scaleX(0)", transformOrigin: "left" }, { opacity: 1, transform: "scaleX(1)" }];
        case "transform": return [{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "scale(1)" }];
        case "trace": {
          // SVG path 描画
          if (el instanceof SVGElement && el.getTotalLength) {
            const len = el.getTotalLength();
            el.style.strokeDasharray = String(len);
            return [{ strokeDashoffset: len }, { strokeDashoffset: 0 }];
          }
          return [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }];
        }
        case "accumulate": return [{ opacity: 0, transform: "translateY(24px) scale(.96)" }, { opacity: 1, transform: "none" }];
        case "compare": return [{ clipPath: "inset(0 0 0 50%)" }, { clipPath: "inset(0 0 0 0)" }];
        case "cause":   return [{ opacity: 0, transform: "translateX(-18px)" }, { opacity: 1, transform: "none" }];
        case "remove":  return [{ opacity: 1 }, { opacity: .15, filter: "grayscale(.8)" }];
        case "continuity": return [{ opacity: .4 }, { opacity: 1 }];
        default: return null;
      }
    }

    _each(fn) { this.animations.forEach((list) => list.forEach(fn)); }
    pauseAll()  { this._each((a) => a.pause()); }
    resumeAll() { this._each((a) => a.play()); }
    reverseAll(){ this._each((a) => a.reverse()); }
    skipAll()   { this._each((a) => { try { a.finish(); } catch (_) {} }); }
    replayAll() { this._each((a) => { a.currentTime = 0; a.play(); }); }
    seekAll(fraction) {
      this._each((a) => {
        const t = a.effect ? a.effect.getComputedTiming() : null;
        const dur = t && t.duration !== "auto" ? t.duration : 0;
        a.currentTime = dur * Math.max(0, Math.min(1, fraction));
        a.pause();
      });
    }
    dispose() { this.animations.clear(); }
  }

  global.WPMotionController = WPMotionController;
})(window);
