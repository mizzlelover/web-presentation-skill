/**
 * WP Charts — 可视化运行时（补丁 §11 / §40）
 * 零依赖自研运行时之上的**可选**模块：若页面存在 [data-chart] 且已加载 vendor/echarts.min.js，
 * 则把 data-chart 的语义配置渲染为 ECharts 实例；否则静默降级为文字表格（离线安全）。
 *
 * 语义配置（block.type=chart 的 chart 字段）：
 *   { kind: bar|hbar|line|area|pie|scatter|ranking,
 *     title, unit, categories:[], series:[{ name, data:[] }], horizontal, stacked }
 *
 * 目标：图表也必须过 Stage / Reader / Print / reduced-motion 四态，并随幕宽重排。
 */
(function (global) {
  "use strict";

  const theme = () => {
    const cs = getComputedStyle(document.documentElement);
    const g = (n, d) => (cs.getPropertyValue(n) || d).trim();
    return {
      accent: g("--wp-accent", "#3b5bff"),
      fg: g("--wp-fg", "#17150f"),
      muted: g("--wp-muted", "#57534a"),
      bg: g("--wp-surface", "#fff"),
      line: g("--wp-line", "rgba(0,0,0,.12)"),
      font: g("--wp-font-body", "system-ui"),
      fontDisplay: g("--wp-font-display", g("--wp-font-body", "system-ui")),
    };
  };

  // 系列色板：accent 为首色，其余取自 CSS 变量（themes 可定制 --wp-chart-c2…c6），缺省用协调光谱
  const PALETTE = (t) => {
    const cs = getComputedStyle(document.documentElement);
    const g = (n, d) => (cs.getPropertyValue(n) || d).trim();
    return [
      t.accent,
      g("--wp-chart-c2", "#8b5cf6"),
      g("--wp-chart-c3", "#ff6a4d"),
      g("--wp-chart-c4", "#0ea5a3"),
      g("--wp-chart-c5", "#d4a017"),
      g("--wp-chart-c6", "#64748b"),
    ];
  };

  function toOption(cfg) {
    const t = theme();
    const cats = cfg.categories || [];
    const series = cfg.series || [];
    const base = {
      color: PALETTE(t),
      textStyle: { fontFamily: t.font, color: t.fg },
      title: cfg.title
        ? { text: cfg.title, left: "center", textStyle: { fontSize: 15, color: t.muted, fontWeight: 600, fontFamily: t.fontDisplay } }
        : undefined,
      // 多系列必须有图例，否则颜色无法对应（§41 图表必须可读）
      legend: series.length > 1
        ? { top: cfg.title ? 26 : 4, left: "center", textStyle: { color: t.muted, fontSize: 12 }, itemWidth: 14, itemHeight: 8 }
        : undefined,
      tooltip: { trigger: series.length > 1 ? "axis" : "item" },
      grid: { left: 24, right: 16, top: (cfg.title ? 48 : 24) + (series.length > 1 ? 24 : 0), bottom: 8, containLabel: true },
      animation: document.documentElement.dataset.wpChartsAnim === "off" ? false : { duration: 600 },
    };
    const axisLabel = { color: t.muted, fontSize: 12 };
    const axisLine = { lineStyle: { color: t.line } };

    // 多单位双轴（§41）：任一系列声明 secondary:true 时启用右轴，左/右轴各自带单位
    const hasSecondary = series.some((s) => s.secondary);
    const valAxis = (unit, secondary) => ({
      type: "value",
      name: unit || undefined,
      nameTextStyle: { color: t.muted, fontSize: 11, align: secondary ? "left" : "right" },
      nameGap: 6,
      axisLabel, axisLine,
      splitLine: secondary ? { show: false } : { lineStyle: { color: t.line } },
      scale: true,   // 数据范围远离 0 时不强制从 0 起（配合 caption 说明口径）
    });

    switch (cfg.kind) {
      case "pie": {
        return { ...base, series: [{
          type: "pie", radius: ["42%", "70%"], center: ["50%", "54%"],
          data: cats.map((c, i) => ({ name: c, value: series[0].data[i] })),
          label: { color: t.fg, fontSize: 12 },
        }] };
      }
      case "ranking": {
        const pairs = cats.map((c, i) => ({ name: c, value: series[0].data[i] })).sort((a, b) => a.value - b.value);
        return { ...base, grid: { left: 24, right: 40, top: cfg.title ? 46 : 22, bottom: 8, containLabel: true },
          xAxis: { type: "value", name: cfg.unit || undefined, nameTextStyle: { color: t.muted, fontSize: 11 },
                   axisLabel, splitLine: { lineStyle: { color: t.line } } },
          yAxis: { type: "category", data: pairs.map((p) => p.name), axisLabel, axisLine,
                   axisLabel: { ...axisLabel, width: 132, overflow: "truncate" } },
          series: [{ type: "bar", data: pairs.map((p) => p.value),
                     label: { show: true, position: "right", color: t.muted, fontSize: 11 } }] };
      }
      case "line": case "area": {
        return { ...base, grid: { ...base.grid, right: hasSecondary ? 56 : 16 },
          xAxis: { type: "category", data: cats, axisLabel, axisLine, boundaryGap: false },
          yAxis: hasSecondary ? [valAxis(cfg.unit, false), valAxis((series.find((s) => s.secondary) || {}).unit, true)]
                              : valAxis(cfg.unit, false),
          series: series.map((s, i) => ({ name: s.name, type: "line", smooth: true, symbolSize: 7,
            yAxisIndex: s.secondary ? 1 : 0,
            connectNulls: false,   // 缺失值断线，不补零（§41 S2）
            data: s.data, areaStyle: cfg.kind === "area" ? { opacity: .14 } : undefined })) };
      }
      case "scatter": {
        return { ...base,
          xAxis: { type: "value", axisLabel, axisLine, splitLine: { lineStyle: { color: t.line } } },
          yAxis: { type: "value", axisLabel, axisLine, splitLine: { lineStyle: { color: t.line } } },
          series: series.map((s) => ({ name: s.name, type: "scatter", symbolSize: 12, data: s.data })) };
      }
      default: {
        const horizontal = cfg.kind === "hbar" || cfg.horizontal;
        return { ...base, grid: { ...base.grid, right: hasSecondary ? 56 : 16 },
          xAxis: horizontal
            ? { type: "value", name: cfg.unit || undefined, nameTextStyle: { color: t.muted, fontSize: 11 },
                axisLabel, splitLine: { lineStyle: { color: t.line } } }
            : { type: "category", data: cats, axisLabel, axisLine },
          yAxis: horizontal
            ? { type: "category", data: cats, axisLabel: { ...axisLabel, width: 132, overflow: "truncate" }, axisLine }
            : (hasSecondary ? [valAxis(cfg.unit, false), valAxis((series.find((s) => s.secondary) || {}).unit, true)]
                            : valAxis(cfg.unit, false)),
          series: series.map((s) => ({
            // 次轴（不同量纲）惯例用折线叠加在柱上，避免「柱比柱」造成量纲误读（§41 S4）
            name: s.name,
            type: (!horizontal && s.secondary) ? "line" : "bar",
            stack: cfg.stacked ? "total" : undefined,
            yAxisIndex: !horizontal && s.secondary ? 1 : 0,
            smooth: true, symbolSize: (!horizontal && s.secondary) ? 7 : undefined,
            data: s.data, barMaxWidth: 42,
            itemStyle: (horizontal || s.secondary) ? undefined
              : { borderRadius: [4, 4, 0, 0] } })) };
      }
    }
  }

  const WPCharts = {
    instances: new Map(),
    _echarts: null,

    /** 供压力测试 / 契约测试直接调用（不做 DOM 初始化） */
    toOption(cfg) { return toOption(cfg); },

    available() { return typeof global.echarts !== "undefined"; },

    /** 只渲染某幕内的图表（幕不可见时容器为 0 宽，避免浪费） */
    renderScene(sceneEl) {
      if (!sceneEl) return;
      // 数据兜底（补丁 §3/§16）：echarts 缺失时渲染为语义表格，数据仍可读
      if (!this.available()) { this.renderTableFallback(sceneEl); return; }
      sceneEl.querySelectorAll("[data-chart]").forEach((box) => {
        if (this.instances.has(box)) { this.instances.get(box).resize(); return; }
        if (!box.clientWidth) return;
        let cfg;
        try { cfg = JSON.parse(box.getAttribute("data-chart")); } catch (_) { return; }
        const inst = global.echarts.init(box, null, { renderer: "canvas" });
        inst.setOption(toOption(cfg), true);
        this.instances.set(box, inst);
      });
    },

    /** 数据兜底：把 chart 配置渲染为语义表格（数据语义 fallback，数据仍完整可读） */
    renderTableFallback(scopeEl) {
      (scopeEl || document).querySelectorAll("[data-chart]").forEach((box) => {
        if (box.dataset.chartFallback === "table") return;
        let cfg;
        try { cfg = JSON.parse(box.getAttribute("data-chart")); } catch (_) { return; }
        const cats = cfg.categories || [];
        const series = cfg.series || [];
        const t = document.createElement("table");
        t.className = "wpk-chart__table";
        const thead = t.createTHead();
        const hr = thead.insertRow();
        ["类别", ...series.map(s => s.name + (cfg.unit ? "（" + cfg.unit + "）" : ""))].forEach(h => {
          const th = document.createElement("th"); th.textContent = h; hr.appendChild(th);
        });
        const tb = t.createTBody();
        cats.forEach((c, i) => {
          const row = tb.insertRow();
          const th = document.createElement("th"); th.textContent = c; row.appendChild(th);
          series.forEach(s => { const td = row.insertCell(); td.textContent = (s.data || [])[i] ?? "—"; });
        });
        box.textContent = "";
        box.appendChild(t);
        box.dataset.chartFallback = "table";
      });
    },

    renderAll() { document.querySelectorAll(".wp-scene").forEach((s) => this.renderScene(s)); },

    resizeAll() {
      this.instances.forEach((inst, box) => { if (box.clientWidth) inst.resize(); });
    },

    /** 打印/导出 PDF：关闭动画并重渲染终态（补丁 §15） */
    printAll() {
      document.documentElement.dataset.wpChartsAnim = "off";
      this.instances.clear();
      this.renderAll();
      this.resizeAll();
    },

    bind() {
      if (!global.wp || !global.wp.engine) return false;
      if (this._bound) return true;
      this._bound = true;
      const eng = global.wp.engine;
      const prev = eng.options.onSceneChange;
      eng.options.onSceneChange = (el, i, p) => { if (prev) prev(el, i, p); WPCharts.renderScene(el); };
      this.renderScene(eng.currentScene);
      global.addEventListener("resize", () => WPCharts.resizeAll());
      global.addEventListener("beforeprint", () => WPCharts.printAll());
      // Reader 模式：全幕展开后统一重排图表
      new MutationObserver(() => {
        if (document.body.classList.contains("wp-reader-mode")) {
          requestAnimationFrame(() => { WPCharts.renderAll(); WPCharts.resizeAll(); });
        }
      }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
      return true;
    },
  };

  global.WPCharts = WPCharts;

  function boot() {
    if (!WPCharts.bind()) setTimeout(boot, 40);
  }
  if (global.document) {
    if (document.readyState === "complete") boot();
    else global.addEventListener("load", boot);
  }
})(window);
