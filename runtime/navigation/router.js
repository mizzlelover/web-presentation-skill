/**
 * WP Router — 键盘/触控/遥控导航
 * ←/→/Space/PgUp/PgDn 翻页与揭示；Home/End 首尾；/ 搜索；Esc 返回深潜；O 总览。
 */
(function (global) {
  "use strict";

  class WPRouter {
    constructor(engine, { searchUI = null, overviewUI = null } = {}) {
      this.engine = engine;
      this.searchUI = searchUI;
      this.overviewUI = overviewUI;
      this._onKey = this._onKey.bind(this);
    }

    start() {
      document.addEventListener("keydown", this._onKey);
      // 触控滑动
      let x0 = null;
      document.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
      document.addEventListener("touchend", (e) => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 60) (dx < 0 ? this.engine.next() : this.engine.prev());
        x0 = null;
      }, { passive: true });
      return this;
    }

    stop() { document.removeEventListener("keydown", this._onKey); }

    _onKey(e) {
      if (e.target.matches("input, textarea, [contenteditable]")) return;
      const eng = this.engine;
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case " ": case "PageDown":
          e.preventDefault(); eng.next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp":
          e.preventDefault(); eng.prev(); break;
        case "Home": e.preventDefault(); eng.goTo(0); break;
        case "End": e.preventDefault(); eng.goTo(eng.scenes.length - 1); break;
        case "Escape":
          if (!eng.returnFromDive() && this.overviewUI) this.overviewUI.close();
          break;
        case "/":
          e.preventDefault();
          if (this.searchUI) this.searchUI.open();
          break;
        case "o": case "O":
          if (this.overviewUI) this.overviewUI.toggle();
          break;
      }
    }
  }

  /** 简易搜索 UI（§87 现场搜索跳转） */
  class WPSearch {
    constructor(engine) {
      this.engine = engine;
      this.el = document.createElement("div");
      this.el.className = "wp-search";
      this.el.innerHTML =
        '<input type="search" placeholder="搜索场景 / 论点 / 证据… (Esc 关闭)" aria-label="搜索场景">' +
        '<ul role="listbox"></ul>';
      this.el.hidden = true;
      document.body.appendChild(this.el);
      const input = this.el.querySelector("input");
      const list = this.el.querySelector("ul");
      input.addEventListener("input", () => {
        const hits = engine.search(input.value);
        list.innerHTML = hits.map((id) =>
          `<li role="option" tabindex="0" data-id="${id}">${id}</li>`).join("");
      });
      list.addEventListener("click", (e) => {
        const li = e.target.closest("[data-id]");
        if (li) { engine.goTo(li.dataset.id); this.close(); }
      });
      this.el.addEventListener("keydown", (e) => { if (e.key === "Escape") this.close(); });
    }
    open() { this.el.hidden = false; this.el.querySelector("input").focus(); }
    close() { this.el.hidden = true; }
  }

  global.WPRouter = WPRouter;
  global.WPSearch = WPSearch;
})(window);
