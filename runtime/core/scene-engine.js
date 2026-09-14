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
      this.options = Object.assign({ hashSync: true, onSceneChange: null, onReveal: null, onExpandAll: null }, options);
      this.scenes = [];
      this.index = new Map();     // sceneId -> position
      this.current = -1;
      this.revealStep = 0;
      this.diveStack = [];        // [{ sceneId, revealStep }] 用于 Deep Dive 后返回
      this.memory = new Map();    // sceneId -> revealStep（切出前的揭示进度，再入时恢复）
      this.stepwise = true;       // false = 静帧模式：整幕直接呈现，不再逐步揭示
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
        const skip = e.target.closest("[data-skip]");
        if (dive) { e.preventDefault(); this.deepDive(dive.dataset.deepDive); }
        else if (branch) { e.preventDefault(); this.branchTo(branch.dataset.branch); }
        else if (skip) { e.preventDefault(); this.goTo(skip.dataset.skip); }
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

    goTo(target, { preserveDive = false, via = "linear" } = {}) {
      const i = typeof target === "number" ? target : this.index.get(target);
      if (i == null || i < 0 || i >= this.scenes.length) return false;
      if (!preserveDive) this.diveStack = this.diveStack.filter(() => false);
      const prev = this.currentScene;
      if (prev) {
        this.memory.set(prev.dataset.sceneId, this.revealStep); // 记住切出前的揭示进度
        prev.hidden = true;
        prev.setAttribute("aria-hidden", "true");
      }
      this.current = i;
      const el = this.currentScene;
      el.dataset.enteredVia = via;  // linear | dive | jump —— 返回提示只在 dive 上下文显示
      // 再入恢复：曾经切出的幕保持切出时的进度；静帧模式整幕直接呈现
      const items = el.querySelectorAll("[data-reveal]").length;
      this.revealStep = this.stepwise
        ? Math.min(this.memory.get(el.dataset.sceneId) ?? 0, items)
        : items;
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
      return this.goTo(sceneId, { preserveDive: true, via: "dive" });
    }

    returnFromDive() {
      const top = this.diveStack.pop();
      if (!top) return false;
      const ok = this.goTo(top.sceneId, { preserveDive: true, via: "dive-return" });
      if (ok) {
        this.revealStep = top.revealStep;
        this.memory.set(top.sceneId, top.revealStep);
        this._applyReveal();
      }
      return ok;
    }

    /**
     * Branch：Presentation Graph 的发散路径（§33/§35）。
     * 与 deepDive 共用返回栈——Esc / [data-branch-return] 即可回到主线。
     * 区别仅在语义：deepDive 是"向下钻取证据"，branch 是"横向切换视角"
     * （技术分支 / 财务分支 / 异议应对 / 短路径）。
     */
    branchTo(sceneId) {
      if (!this.index.has(sceneId)) return false;
      this.diveStack.push({ sceneId: this.currentId, revealStep: this.revealStep });
      return this.goTo(sceneId, { preserveDive: true, via: "branch" });
    }

    /** 跳过若干幕直达目标（§34 Skip / 时间不足走短路径） */
    skipTo(sceneId) { return this.goTo(sceneId); }

    /**
     * Presentation Graph：从 DOM 推导的有向图（§33）。
     * 节点 = scene；边 = core_path(线性) + data-branch / data-deep-dive / data-skip。
     * 供 Renderer / 讲者台 / 审计复用，避免图结构散落在各处。
     */
    graph() {
      const nodes = this.scenes.map((el) => el.dataset.sceneId);
      const edges = [];
      this.scenes.forEach((el, i) => {
        const from = el.dataset.sceneId;
        if (i < this.scenes.length - 1) {
          edges.push({ from, to: this.scenes[i + 1].dataset.sceneId, type: "core_path" });
        }
        el.querySelectorAll("[data-branch]").forEach((a) =>
          edges.push({ from, to: a.dataset.branch, type: "branch" }));
        el.querySelectorAll("[data-deep-dive]").forEach((a) =>
          edges.push({ from, to: a.dataset.deepDive, type: "deep_dive" }));
        el.querySelectorAll("[data-skip]").forEach((a) =>
          edges.push({ from, to: a.dataset.skip, type: "skip" }));
      });
      const mainPath = this.scenes
        .filter((el) => el.dataset.role !== "deep_dive" && el.dataset.role !== "branch")
        .map((el) => el.dataset.sceneId);
      return { nodes, edges, mainPath };
    }

    /** 静帧开关（§演示现场：时间紧时整幕直出，不做逐步揭示） */
    setStepwise(on) {
      this.stepwise = !!on;
      if (!this.stepwise && this.currentScene) {
        this.revealStep = this._reveals().length;
        this._applyReveal();
      }
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
        // 通知外部（语义动效）：reveal 到达即播放该元素的注册动效
        if (typeof this.options.onReveal === "function") this.options.onReveal(el, i, on);
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
      if (typeof this.options.onExpandAll === "function") this.options.onExpandAll();
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
        this.memory.set(snap.sceneId, this.revealStep);
        this._applyReveal();
      }
    }
  }

  global.WPSceneEngine = SceneEngine;
})(window);
