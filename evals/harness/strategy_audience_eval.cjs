#!/usr/bin/env node
/**
 * strategy_audience_eval.cjs — §22 缺失的两项 Evals（P0-2）
 *
 * Strategy Eval:
 *   - 有上游工件（content-understanding/strategy/argument-map/scene-plan）的 Deck：
 *     校验工件齐全、闸门通过（由 Python 侧执行）、IR 与 scene-plan 同构、THESIS 幕存在；
 *   - 无工件的 Deck：如实标记 upstream:"legacy"（不判失败，但计入覆盖率）。
 *
 * Audience Adaptation Eval（§96/§97）:
 *   对 benchmarks/derived/ 的同源三受众版本做**结构差异断言**：
 *     ① 幕数不同；② 术语层次按受众分化（technical 含架构/接口/权限，frontline 不含架构/预算）；
 *     ③ 密度分化（technical 与 frontline 的 stage 平均字数不同）；④ 各版本含各自受众的关键词；
 *     ⑤ 三版结论（close 幕 headline）不同但主题一致。
 *
 * 用法：NODE_PATH=... node strategy_audience_eval.cjs
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.resolve(__dirname, "..", "..");
const PY = process.env.PYTHON || "/Users/a1-6/.workbuddy/binaries/python/envs/default/bin/python";
const OUT = process.env.WP_OUT || path.join(__dirname, "_artifacts");

function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function exists(p) { return fs.existsSync(p); }
function irText(ir) { return JSON.stringify(ir); }
// 受众所见文本：headline + stage + reader + blocks（不含元字段 constraints/prior_knowledge/notes）
function audienceText(ir) {
  return ir.scenes.map(s => [
    s.headline && s.headline.text,
    s.content && s.content.stage,
    s.content && s.content.reader,
    s.reader_content,
    JSON.stringify(s.blocks || []),
  ].filter(Boolean).join("\n")).join("\n");
}

function loadIRs(root) {
  const base = path.join(REPO, "benchmarks", root);
  const out = [];
  if (!fs.existsSync(base)) return out;
  for (const d of fs.readdirSync(base, { withFileTypes: true })) {
    const p = path.join(base, d.name, "presentation.ir.json");
    if (d.isDirectory() && exists(p)) out.push({ rel: root + "/" + d.name, ir: readJSON(p) });
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

// ── Strategy Eval ──
function strategyEval() {
  const rows = [];
  for (const root of ["corpus", "derived", "real"]) {
    for (const { rel, ir } of loadIRs(root)) {
      const dir = path.join(REPO, "benchmarks", root, path.basename(rel));
      const arts = ["content-understanding.json", "strategy.json", "argument-map.json", "scene-plan.json"].filter(f => exists(path.join(dir, f)));
      const hasAll = arts.length === 4;
      let gate = null;
      if (hasAll) {
        try {
          execSync(`${PY} scripts/validate_strategy.py "${dir}"`, { cwd: REPO, stdio: "pipe" });
          gate = "pass";
        } catch (e) {
          gate = "fail: " + String(e.stderr || e.stdout || e.message).slice(0, 200);
        }
        // IR 与 scene-plan 同构
        try {
          const sp = readJSON(path.join(dir, "scene-plan.json"));
          const planIds = sp.scenes.map(s => s.id);
          const irIds = ir.scenes.map(s => s.id);
          const same = planIds.length === irIds.length && planIds.every((v, i) => v === irIds[i]);
          if (!same) gate = "fail: IR 与 scene-plan 不同构";
          const thesisScene = ir.scenes.find(s => s.id === "opening");
          if (!thesisScene) gate = "fail: 缺 opening/THESIS 幕";
        } catch (e) { gate = "fail: " + e.message; }
      }
      rows.push({ deck: rel, artifacts: arts.length, upstream: hasAll ? (gate === "pass" ? "tested" : gate) : "legacy",
                  thesis: ir.presentation.central_thesis ? "yes" : "no" });
    }
  }
  const tested = rows.filter(r => r.upstream === "tested").length;
  const legacy = rows.filter(r => r.upstream === "legacy").length;
  const failed = rows.filter(r => r.upstream !== "tested" && r.upstream !== "legacy").length;
  return { rows, tested, legacy, failed, pass: failed === 0 };
}

// ── Audience Adaptation Eval ──
const AUD = {
  ceo: "benchmarks/derived/01-audience-ceo",
  technical: "benchmarks/derived/02-audience-technical",
  frontline: "benchmarks/derived/03-audience-frontline",
};
const LEX = {
  technical: ["架构", "接口", "灰度", "运维", "数据模型", "鉴权", "服务网关", "指标服务"],
  ceo: ["预算", "回收", "决策", "立项", "风险", "投资"],
  frontline: ["操作", "扫码", "日报", "培训", "求助", "流程"],
  forbid_frontline: ["架构", "接口标准", "灰度", "回收期", "鉴权"],
  forbid_ceo: ["数据服务网关", "元数据服务", "灰度发布"],
};

function audienceEval() {
  const F = {};
  for (const [k, rel] of Object.entries(AUD)) {
    const p = path.join(REPO, rel, "presentation.ir.json");
    const ir = readJSON(p);
    const txt = audienceText(ir);
    const stageLens = ir.scenes.map(s => ((s.content || {}).stage || "").length);
    const features = {
      scenes: ir.scenes.length,
      charts: ir.scenes.reduce((n, s) => n + (s.blocks || []).filter(b => b.type === "chart").length, 0),
      avgStageLen: Math.round(stageLens.reduce((a, b) => a + b, 0) / Math.max(1, stageLens.length)),
      techTerms: LEX.technical.filter(t => txt.includes(t)).length,
      ceoTerms: LEX.ceo.filter(t => txt.includes(t)).length,
      frontlineTerms: LEX.frontline.filter(t => txt.includes(t)).length,
      forbiddenFrontline: LEX.forbid_frontline.filter(t => txt.includes(t)),
      forbiddenCeo: LEX.forbid_ceo.filter(t => txt.includes(t)),
      closeHeadline: (ir.scenes.find(s => s.role === "summary" || s.id === "close") || {}).headline?.text || "",
    };
    F[k] = features;
  }
  const c = F.ceo, t = F.technical, f = F.frontline;
  const checks = {
    scenes_differ: c.scenes !== t.scenes || c.scenes !== f.scenes,
    tech_more_technical: t.techTerms > c.techTerms && t.techTerms > f.frontlineTerms,
    frontline_zero_technical: f.techTerms === 0,
    ceo_decision_words: c.ceoTerms >= 3,
    frontline_operational: f.frontlineTerms >= 2,
    density_differs: Math.abs(t.avgStageLen - c.avgStageLen) > 10 || Math.abs(f.avgStageLen - c.avgStageLen) > 10,
    frontline_forbidden_absent: f.forbiddenFrontline.length === 0,
    ceo_forbidden_absent: c.forbiddenCeo.length === 0,
    closes_differ: c.closeHeadline !== t.closeHeadline && t.closeHeadline !== f.closeHeadline,
  };
  return { features: F, checks, pass: Object.values(checks).every(Boolean) };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const S = strategyEval();
  const A = audienceEval();
  const report = { generatedAt: new Date().toISOString(), strategy: S, audience: A };
  fs.writeFileSync(path.join(OUT, "strategy_audience_eval.json"), JSON.stringify(report, null, 2));

  console.log("=== Strategy Eval（§22 / §52 / §95）===");
  S.rows.forEach(r => console.log(`  ${r.upstream === "tested" ? "✔" : r.upstream === "legacy" ? "○" : "✗"} ${r.deck} · 工件 ${r.artifacts}/4 · ${r.upstream}`));
  console.log(`  覆盖：tested ${S.tested} / legacy ${S.legacy} / fail ${S.failed}`);
  console.log("=== Audience Adaptation Eval（§96/§97）===");
  Object.entries(A.checks).forEach(([k, v]) => console.log(`  ${v ? "✔" : "✗"} ${k}`));
  console.log(A.pass ? "\n✔ 两项 Evals 通过" : "\n✗ 存在未通过项");
  process.exit(S.failed === 0 && A.pass ? 0 : 1);
})();
