/**
 * WP Router — 键盘/触控/遥控导航
 * ←/→/Space/PgUp/PgDn 翻页与揭示；Home/End 首尾；/ 搜索；Esc 返回深潜；O 总览。
 */
(function (global) {
  "use strict";

  class WPRouter {
    constructor(engine, { searchUI = null, overviewUI = null, helpUI = null } = {}) {
      this.engine = engine;
      this.searchUI = searchUI;
      this.overviewUI = overviewUI;
      this.helpUI = helpUI;
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
          // 优先级：关总览 > 关帮助 > 深潜返回
          if (this.overviewUI && this.overviewUI.active) { this.overviewUI.close(); break; }
          if (this.helpUI && this.helpUI.active) { this.helpUI.toggle(); break; }
          eng.returnFromDive();
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

  /**
   * WP Overview — 总览模式（幻灯片预览列表）
   * 快捷键 O：所有 Scene 以实时缩略网格平铺（依赖 .wp-scene 的 container-type:inline-size，
   * cqi 单位使内容随格宽等比缩放），点击任意一幕跳转进入；Esc / O / 点空白退出。
   * 当前幕高亮；Reader 模式下不启用。
   */
  class WPOverview {
    constructor(engine) {
      this.engine = engine;
      this.active = false;
      this.bar = document.createElement("div");
      this.bar.className = "wp-ov-bar";
      this.bar.textContent = "总览 · 点击任意一幕跳转 · Esc 退出";
      this.bar.hidden = true;
      document.body.appendChild(this.bar);
      this._numbered = false;
      // 点击缩略图跳转（捕获阶段拦截，避免触发幕内分支链接）
      engine.root.addEventListener("click", (e) => {
        if (!this.active) return;
        const scene = e.target.closest(".wp-scene");
        if (!scene) return;
        e.preventDefault();
        e.stopPropagation();
        this.engine.goTo(scene.dataset.sceneId);
        this.close();
      }, true);
      this.bar.addEventListener("click", () => this.close());
      window.addEventListener("resize", () => this._fit());
      // 动态缩放规则走注入样式表（内联 transform 在部分渲染路径下不生效）
      this._style = document.createElement("style");
      this._style.className = "wp-ov-fit";
      document.head.appendChild(this._style);
    }

    _number() {
      if (this._numbered) return;
      this.engine.scenes.forEach((s, i) => {
        const tag = document.createElement("span");
        tag.className = "wp-ov-num";
        tag.textContent = String(i + 1).padStart(2, "0");
        s.appendChild(tag);
      });
      this._numbered = true;
    }

    open() {
      if (document.body.classList.contains("wp-reader-mode")) return;
      this._number();
      this.active = true;
      this.bar.hidden = false;
      document.body.classList.add("wp-overview-mode");
      this.engine.scenes.forEach((s) => {
        s.hidden = false;
        s.removeAttribute("aria-hidden");
        s.classList.toggle("wp-ov-current", s === this.engine.currentScene);
      });
      this._fit();
    }

    // 等比缩放：每幕撑回舞台真实宽高（vw × 100dvh），再用 transform 缩成缩略图，
    // 负外边距抵消布局占位，使网格轨道收缩到缩放后的视觉尺寸。
    // 列宽从网格轨道的计算值读取（此时场景已被规则撑宽，不能读 clientWidth）。
    _fit() {
      if (!this.active) return;
      const deck = this.engine.root;
      const firstTrack = (getComputedStyle(deck).gridTemplateColumns || "").split(" ")[0];
      const colW = parseFloat(firstTrack);
      const vw = Math.max(document.documentElement.clientWidth, 1);
      const vh = Math.max(window.innerHeight, 1);
      if (!colW || colW <= 0) return;
      const k = colW / vw;
      this._style.textContent =
        "body.wp-overview-mode .wp-scene{" +
        "width:" + vw + "px;" +
        "margin-right:" + -(vw - colW) + "px;" +
        "margin-bottom:" + -(vh * (1 - k)) + "px;" +
        "transform:scale(" + k + ");}";
    }

    close() {
      if (!this.active) return;
      this.active = false;
      this.bar.hidden = true;
      document.body.classList.remove("wp-overview-mode");
      this._style.textContent = "";
      this.engine.scenes.forEach((s, i) => {
        const isCur = i === this.engine.current;
        s.hidden = !isCur;
        s.classList.remove("wp-ov-current");
        s.setAttribute("aria-hidden", String(!isCur));
      });
    }

    toggle() { this.active ? this.close() : this.open(); }
  }

  global.WPOverview = WPOverview;
})(window);
