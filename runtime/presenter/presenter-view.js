/**
 * WP Presenter View — 讲者控制台（§34/§86）
 * 快捷键 P 打开独立窗口：当前幕 / 下一幕预览 / Speaker Notes / 计时器 / 分支跳转。
 * Speaker Notes 写在 <aside class="wp-notes"> 内，绝不显示在主画面。
 */
(function (global) {
  "use strict";

  class WPPresenter {
    constructor(engine) {
      this.engine = engine;
      this.win = null;
      this.startedAt = null;
      this._tick = null;
    }

    open() {
      if (this.win && !this.win.closed) { this.win.focus(); return; }
      this.win = global.open("", "wp-presenter", "width=900,height=640");
      if (!this.win) return;
      this.startedAt = Date.now();
      this.win.document.title = "Presenter Console";
      this.win.document.body.innerHTML = `
        <style>
          body{font:14px/1.6 system-ui,sans-serif;margin:0;background:#111;color:#eee}
          header{display:flex;gap:16px;padding:12px 16px;background:#000;align-items:baseline}
          #t{font-size:28px;font-variant-numeric:tabular-nums}
          main{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px}
          section{background:#1c1c1e;border-radius:10px;padding:12px}
          h2{margin:0 0 8px;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:.08em}
          #notes{grid-column:1/-1;font-size:16px;white-space:pre-wrap}
          button{margin:2px;padding:6px 10px;border-radius:6px;border:1px solid #444;background:#222;color:#eee;cursor:pointer}
        </style>
        <header><strong id="t">00:00</strong><span id="pos"></span></header>
        <main>
          <section><h2>当前幕</h2><div id="cur"></div></section>
          <section><h2>下一幕</h2><div id="nxt"></div></section>
          <section id="notes"><h2>Speaker Notes</h2><div id="note"></div></section>
          <section><h2>分支跳转</h2><div id="branches"></div></section>
        </main>`;
      this._render();
      this._tick = setInterval(() => this._render(), 500);
      this.win.addEventListener("beforeunload", () => clearInterval(this._tick));
      // 主窗口换幕时刷新
      this._prevOnChange = this.engine.options.onSceneChange;
      this.engine.options.onSceneChange = (el, i, prev) => {
        if (this._prevOnChange) this._prevOnChange(el, i, prev);
        this._render();
      };
    }

    _fmt(ms) {
      const s = Math.floor(ms / 1000);
      return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }

    _text(sceneEl) {
      if (!sceneEl) return "—";
      const h = sceneEl.querySelector("h1,h2,h3");
      return (h ? h.textContent : sceneEl.dataset.sceneId).trim();
    }

    _render() {
      if (!this.win || this.win.closed) { clearInterval(this._tick); return; }
      const d = this.win.document;
      const eng = this.engine;
      d.getElementById("t").textContent = this._fmt(Date.now() - this.startedAt);
      d.getElementById("pos").textContent = (() => {
        const total = eng.currentScene ? eng.currentScene.querySelectorAll("[data-reveal]").length : 0;
        const topic = eng.currentScene ? (eng.currentScene.dataset.topic || eng.currentScene.dataset.sceneId) : "";
        return `${eng.current + 1} / ${eng.scenes.length} · ${topic} · 揭示 ${eng.revealStep}/${total}`;
      })();
      d.getElementById("cur").textContent = this._text(eng.currentScene);
      d.getElementById("nxt").textContent = this._text(eng.scenes[eng.current + 1]);
      const notes = eng.currentScene ? eng.currentScene.querySelector(".wp-notes") : null;
      d.getElementById("note").textContent = notes ? notes.textContent.trim() : "（本幕无笔记）";
      const box = d.getElementById("branches");
      box.innerHTML = "";
      if (eng.currentScene) {
        eng.currentScene.querySelectorAll("[data-branch],[data-deep-dive]").forEach((a) => {
          const b = d.createElement("button");
          b.textContent = (a.dataset.branch ? "⇢ " : "⤵ ") + (a.dataset.branch || a.dataset.deepDive);
          b.onclick = () => {
            if (a.dataset.branch) eng.goTo(a.dataset.branch);
            else eng.deepDive(a.dataset.deepDive);
          };
          box.appendChild(b);
        });
        if (eng.diveStack.length) {
          const r = d.createElement("button");
          r.textContent = "↩ 返回主线";
          r.onclick = () => eng.returnFromDive();
          box.appendChild(r);
        }
      }
    }
  }

  global.WPPresenter = WPPresenter;
})(window);
