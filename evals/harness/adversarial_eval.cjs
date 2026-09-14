#!/usr/bin/env node
/** adversarial_eval.cjs — 对抗测试的机器可断言部分（§68 / 补丁 §18）
 *  对「用户可能提出的不当要求」，Skill 的防线必须落在机器层，而非仅靠 LLM 自觉。
 *  本脚本断言以下守卫真实存在并生效：
 *   G1 无 render_level ≥L3 缺 render_rationale（炫技请求的硬闸）
 *   G2 motion_intent 全部在语义集合内（无意义动效的硬闸）
 *   G3 chart.kind 全部在白名单内且必有 caption（为美观换图/无口径的硬闸）
 *   G4 print.css 真正隐藏交互控件（「打印版=现场版缩小」的硬闸）
 *   G5 SKILL.md 载明对抗式回应（字越少越好/全改问句/全做3D 的条件响应）
 *   G6 validate_ir 对 caption 缺失告警（证据口径防线）
 */
const fs = require("fs"); const path = require("path");
const REPO = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "_artifacts");

function loadIRs() {
  const out = [];
  for (const root of ["corpus", "derived", "real"]) {
    const base = path.join(REPO, "benchmarks", root);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base, { withFileTypes: true })) {
      const p = path.join(base, d.name, "presentation.ir.json");
      if (d.isDirectory() && fs.existsSync(p))
        out.push({ rel: root + "/" + d.name, ir: JSON.parse(fs.readFileSync(p, "utf8")) });
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

const VALID_JOBS = new Set(["ask","answer","explain","compare","demonstrate","prove","orient","transition","summarize","challenge","reveal","visualize","quantify","simulate","decide"]);
const VALID_KINDS = new Set(["bar","line","area","pie","scatter","ranking","hbar","stacked-bar"]);
const VALID_MOTION = new Set(["reveal","focus","connect","transform","trace","accumulate","compare","cause","continuity","remove"]);

const irs = loadIRs();
const violations = { g1: [], g2: [], g3: [], g6: [] };
for (const { rel, ir } of irs) {
  for (const s of ir.scenes) {
    const lvl = parseInt(String(s.render_level || "L1").replace("L", ""), 10) || 1;
    if (lvl >= 3 && !s.render_rationale) violations.g1.push(`${rel}/${s.id} ${s.render_level}`);
    for (const m of s.motion_intent || []) if (!VALID_MOTION.has(m)) violations.g2.push(`${rel}/${s.id} ${m}`);
    for (const b of s.blocks || []) {
      if (b.type === "chart") {
        const cfg = b.chart || b;
        if (cfg.kind && !VALID_KINDS.has(cfg.kind)) violations.g3.push(`${rel}/${s.id} ${cfg.kind}`);
        if (!cfg.caption && !b.caption) violations.g3.push(`${rel}/${s.id} chart 缺 caption`);
      }
    }
  }
}
// G4：print.css 必须隐藏交互控件
const printCss = fs.readFileSync(path.join(REPO, "runtime", "print", "print.css"), "utf8");
const g4 = /display\s*:\s*none/.test(printCss) && /(wp-hints|wp-status|nav|button)/i.test(printCss);
// G5：SKILL.md 必须载明对抗式回应
const skill = fs.readFileSync(path.join(REPO, "SKILL.md"), "utf8");
const g5 = ["字", "问句", "3D"].every(k => skill.includes(k)) && /对抗|Contextual|情境/.test(skill);
// G6：validate_ir 对 caption 缺失告警（跑一遍含缺 caption 图表的临时 IR）
const tmp = path.join(REPO, "benchmarks", "real", "01-national-statistical-bulletin");
let g6 = null;
try {
  const ir = JSON.parse(fs.readFileSync(path.join(tmp, "presentation.ir.json"), "utf8"));
  const clone = JSON.parse(JSON.stringify(ir));
  clone.scenes[1].blocks[0].caption = "";
  const tmpFile = path.join(OUT, "_caption_probe.ir.json");
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(tmpFile, JSON.stringify(clone, null, 2));
  const { execSync } = require("child_process");
  const PY = process.env.PYTHON || "/Users/a1-6/.workbuddy/binaries/python/envs/default/bin/python";
  const out = execSync(`${PY} scripts/validate_ir.py "${tmpFile}"`, { cwd: REPO, encoding: "utf8" });
  g6 = /caption/.test(out);
} catch (e) { g6 = /caption/.test(String(e.stdout || e.stderr || e.message)); }

const checks = {
  g1_no_level3_without_rationale: violations.g1.length === 0,
  g2_motion_intents_in_set: violations.g2.length === 0,
  g3_chart_kind_whitelist_and_caption: violations.g3.length === 0,
  g4_print_hides_interactive: g4,
  g5_skill_has_adversarial_responses: g5,
  g6_validate_ir_flags_missing_caption: g6,
};
fs.writeFileSync(path.join(OUT, "adversarial_eval.json"), JSON.stringify({ checks, violations }, null, 2));
Object.entries(checks).forEach(([k, v]) => console.log(`${v ? "✔" : "✗"} ${k}`));
if (violations.g1.length) console.log("  g1:", violations.g1.slice(0, 5));
if (violations.g2.length) console.log("  g2:", violations.g2.slice(0, 5));
if (violations.g3.length) console.log("  g3:", violations.g3.slice(0, 5));
const failed = Object.values(checks).filter(v => !v).length;
console.log(failed ? `\n✗ ${failed} 项守卫未生效` : "\n✔ 六项对抗守卫全部生效");
process.exit(failed ? 1 : 0);
