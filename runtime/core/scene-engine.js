/**
 * WP Scene Engine — 演示场景引擎（零依赖原生 JS）
 * 职责：Scene 生命周期、渐进揭示（reveal steps）、Deep Dive 栈、分支跳转、状态恢复。
 * 约定：每个 Scene 是 <section class="wp-scene" data-scene-id="...">。
 * 渐进揭示元素带 data-reveal（出现顺序按 DOM 序）。
 * 分支：<a data-branch="scene-id">；深潜：<a data-deep-dive="scene-id">。
 */
(function (global) {
  "use strict";

  class SceneEngine {
    constructor(root, options = {}) {
      this.root = typeof root === "string" ? document.querySelector(root) : root;
      this.options = Object.assign({ hashSync: true, onSceneChange: null }, options);
      this.scenes = [];
      this.index = new Map();     // sceneId -> position
      this.current = -1;
      this.revealStep = 0;
      this.diveStack = [];        // [{ sceneId, revealStep }] 用于 Deep Dive 后返回
      this.reducedMotion = global.matchMedia &&
        global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    init() {
      this.scenes = Array.from(this.root.querySelectorAll(".wp-scene"));
      this.scenes.forEach((el, i) => {
        const id = el.dataset.sceneId || "scene-" + i;
        el.dataset.sceneId = id;
        this.index.set(id, i);
        el.setAttribute("aria-hidden", "true");
        el.hidden = true;
      });
      this.root.addEventListener("click", (e) => {
        const branch = e.target.closest("[data-branch]");
        const dive = e.target.closest("[data-deep-dive]");
        if (dive) { e.preventDefault(); this.deepDive(dive.dataset.deepDive); }
        else if (branch) { e.preventDefault(); this.goTo(branch.dataset.branch); }
      });
      // hash 深链（Reader 分享 / 现场跳转）
      if (this.options.hashSync) {
        const fromHash = this._fromHash();
        this.goTo(fromHash != null ? fromHash : 0);
        global.addEventListener("hashchange", () => {
          const p = this._fromHash();
          if (p != null && p !== this.current) this.goTo(p);
        });
      } else {
        this.goTo(0);
      }
      return this;
    }

    get currentScene() { return this.scenes[this.current] || null; }
    get currentId() { return this.currentScene ? this.currentScene.dataset.sceneId : null; }

    _fromHash() {
      const m = /^#\/?(.+)$/.exec(global.location.hash || "");
      if (!m) return null;
      return this.index.has(m[1]) ? this.index.get(m[1]) : null;
    }

    goTo(target, { preserveDive = false } = {}) {
      const i = typeof target === "number" ? target : this.index.get(target);
      if (i == null || i < 0 || i >= this.scenes.length) return false;
      if (!preserveDive) this.diveStack = this.diveStack.filter(() => false);
      const prev = this.currentScene;
      if (prev) { prev.hidden = true; prev.setAttribute("aria-hidden", "true"); }
      this.current = i;
      this.revealStep = 0;
      const el = this.currentScene;
      el.hidden = false;
      el.removeAttribute("aria-hidden");
      this._applyReveal();
      if (this.options.hashSync && global.location.hash !== "#/" + el.dataset.sceneId) {
        history.replaceState(null, "", "#/" + el.dataset.sceneId);
      }
      if (typeof this.options.onSceneChange === "function") {
        this.options.onSceneChange(el, i, prev);
      }
      return true;
    }

    next() {
      if (this._revealNext()) return true;          // 先走完本幕揭示
      if (this.current < this.scenes.length - 1) return this.goTo(this.current + 1);
      return false;
    }

    prev() {
      if (this._revealPrev()) return true;
      if (this.current > 0) return this.goTo(this.current - 1);
      return false;
    }

    /** Deep Dive：压栈后跳转，return 时恢复 reveal 进度（§90 状态可恢复） */
    deepDive(sceneId) {
      if (!this.index.has(sceneId)) return false;
      this.diveStack.push({ sceneId: this.currentId, revealStep: this.revealStep });
      return this.goTo(sceneId, { preserveDive: true });
    }

    returnFromDive() {
      const top = this.diveStack.pop();
      if (!top) return false;
      const ok = this.goTo(top.sceneId, { preserveDive: true });
      if (ok) {
        this.revealStep = top.revealStep;
        this._applyReveal();
      }
      return ok;
    }

    /** 搜索跳转：按 id / data-topic / data-claim / 文本匹配（§87） */
    search(query) {
      const q = String(query).toLowerCase();
      const hits = this.scenes.filter((el) =>
        el.dataset.sceneId.toLowerCase().includes(q) ||
        (el.dataset.topic || "").toLowerCase().includes(q) ||
        (el.dataset.claim || "").toLowerCase().includes(q) ||
        el.textContent.toLowerCase().includes(q));
      return hits.map((el) => el.dataset.sceneId);
    }

    // ── 渐进揭示 ──
    _reveals() {
      return this.currentScene ? Array.from(this.currentScene.querySelectorAll("[data-reveal]")) : [];
    }

    _applyReveal() {
      const items = this._reveals();
      items.forEach((el, i) => {
        const on = i < this.revealStep;
        el.classList.toggle("wp-revealed", on);
        if (on) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
      });
    }

    _revealNext() {
      const items = this._reveals();
      if (this.revealStep < items.length) {
        this.revealStep += 1;
        this._applyReveal();
        const el = items[this.revealStep - 1];
        if (el && !this.reducedMotion) {
          el.animate(
            [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
            { duration: 320, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" });
        }
        return true;
      }
      return false;
    }

    _revealPrev() {
      if (this.revealStep > 0) {
        this.revealStep -= 1;
        this._applyReveal();
        return true;
      }
      return false;
    }

    /** 全部展开（Reader/Print 模式调用） */
    expandAll() {
      this.scenes.forEach((s) => {
        s.hidden = false;
        s.removeAttribute("aria-hidden");
        s.querySelectorAll("[data-reveal]").forEach((el) => {
          el.classList.add("wp-revealed");
          el.removeAttribute("aria-hidden");
        });
      });
    }

    /** 状态快照/恢复（§90） */
    snapshot() {
      return { sceneId: this.currentId, revealStep: this.revealStep, diveStack: [...this.diveStack] };
    }
    restore(snap) {
      if (!snap) return;
      this.diveStack = snap.diveStack || [];
      if (this.goTo(snap.sceneId, { preserveDive: true })) {
        this.revealStep = snap.revealStep || 0;
        this._applyReveal();
      }
    }
  }

  global.WPSceneEngine = SceneEngine;
})(window);
