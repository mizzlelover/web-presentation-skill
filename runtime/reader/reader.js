/**
 * WP Reader Mode — 独立阅读模式（§49/§57/§89）
 * 快捷键 R 切换：全部 Scene 纵向滚动、显示 reader 完整内容、展开渐进元素、hash 深链。
 * Reader 内容写在 <div class="wp-reader"> 内（Stage 模式隐藏）。
 */
(function (global) {
  "use strict";

  class WPReader {
    constructor(engine) {
      this.engine = engine;
      this.active = false;
      this._snapshot = null;
    }

    toggle() { this.active ? this.exit() : this.enter(); }

    enter() {
      this._snapshot = this.engine.snapshot();
      this.active = true;
      document.body.classList.add("wp-reader-mode");
      this.engine.expandAll();
      // 回到当前幕对应位置
      const cur = this.engine.currentScene;
      if (cur) cur.scrollIntoView({ block: "start" });
      // 滚动时同步 hash，便于分享某一 Scene（§89 深链）
      this._onScroll = () => {
        const scenes = this.engine.scenes;
        for (const s of scenes) {
          const r = s.getBoundingClientRect();
          if (r.top <= 80 && r.bottom > 80) {
            history.replaceState(null, "", "#/" + s.dataset.sceneId);
            break;
          }
        }
      };
      global.addEventListener("scroll", this._onScroll, { passive: true });
    }

    exit() {
      this.active = false;
      document.body.classList.remove("wp-reader-mode");
      global.removeEventListener("scroll", this._onScroll);
      this.engine.scenes.forEach((s, i) => {
        const isCur = i === this.engine.current;
        s.hidden = !isCur;
      });
      this.engine.restore(this._snapshot);
      this._snapshot = null;
    }
  }

  global.WPReader = WPReader;
})(window);
