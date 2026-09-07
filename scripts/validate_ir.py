#!/usr/bin/env python3
"""validate_ir.py — Presentation IR 校验器（§55：IR 必须通过校验才能渲染）

用法: python3 validate_ir.py presentation.ir.json
exit 0 = 通过（可有 warning）；exit 1 = 有 error。
"""
import json
import sys

COGNITIVE_JOBS = {"ask","answer","explain","compare","demonstrate","prove","orient",
                  "transition","summarize","challenge","reveal","visualize","quantify",
                  "simulate","decide"}
HEADLINE_TYPES = {"question","assertion","topic","decision","contrast","narrative"}
RENDER_LEVELS = {"L0","L1","L2","L3","L4","L5","L6"}
LOADS = {"low","medium","high","very_high"}
ROLES = {"opening","problem","argument","evidence","case","recommendation","decision",
         "transition","summary","qa","backup","deep_dive","appendix"}
MOTION_INTENTS = {"reveal","focus","connect","transform","trace","accumulate",
                  "compare","cause","continuity","remove"}
LOAD_RANK = {"low":0,"medium":1,"high":2,"very_high":3}

def main(path):
    errors, warnings = [], []
    try:
        ir = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: 无法解析 JSON: {e}")
        return 1

    pres = ir.get("presentation", {})
    if not pres.get("situation"):
        errors.append("presentation.situation 缺失（Situation First 未执行）")
    if not pres.get("communication_goal"):
        errors.append("presentation.communication_goal 缺失")
    aud = pres.get("audience") or {}
    for k in ("role","expertise","decision_power","attitude","time_budget"):
        if not aud.get(k):
            errors.append(f"audience.{k} 缺失（受众建模不完整）")
    if not pres.get("central_thesis"):
        errors.append("central_thesis 缺失（Argument before Slides）")

    scenes = ir.get("scenes", [])
    if not scenes:
        errors.append("scenes 为空")
    ids = [s.get("id") for s in scenes]
    if len(ids) != len(set(ids)):
        errors.append("scene id 重复")

    core = ((pres.get("graph") or {}).get("core_path")) or []
    for sid in core:
        if sid not in ids:
            errors.append(f"core_path 引用了不存在的 scene: {sid}")

    prev_high = 0
    for s in scenes:
        sid = s.get("id", "?")
        job = s.get("cognitive_job")
        if job not in COGNITIVE_JOBS:
            errors.append(f"{sid}: cognitive_job 非法或缺失: {job}")
        h = s.get("headline") or {}
        if h.get("type") not in HEADLINE_TYPES:
            errors.append(f"{sid}: headline.type 非法: {h.get('type')}")
        if not h.get("rationale"):
            errors.append(f"{sid}: headline.rationale 缺失（必须解释标题类型选择）")
        if h.get("type") == "assertion":
            t = (h.get("text") or "").strip()
            if t and len(t) < 10:
                warnings.append(f"{sid}: assertion 标题过短，疑似话题标签而非断言")
        rl = s.get("render_level")
        if rl not in RENDER_LEVELS:
            errors.append(f"{sid}: render_level 非法: {rl}")
        if rl in ("L3","L4","L5","L6") and not s.get("render_rationale"):
            errors.append(f"{sid}: {rl} 渲染缺少 render_rationale（防技术滥用）")
        if rl == "L6":
            warnings.append(f"{sid}: 使用 L6(3D)，确认仅用于空间关系（KN-ANTI-003）")
        for m in (s.get("motion_intent") or []):
            if m not in MOTION_INTENTS:
                errors.append(f"{sid}: motion_intent 非法: {m}")
        for it in (s.get("interaction") or []):
            if not it.get("purpose"):
                errors.append(f"{sid}: interaction 缺少 purpose（KN-INT-001）")
        c = s.get("content") or {}
        if not c.get("stage") or not c.get("reader"):
            errors.append(f"{sid}: 缺少 stage/reader 双内容（One Content Model）")
        if not s.get("speaker_notes") and s.get("role") not in ("appendix",):
            warnings.append(f"{sid}: speaker_notes 为空")
        for ev in (s.get("evidence") or []):
            if not ev.get("source"):
                errors.append(f"{sid}: evidence 缺少 source（数据诚信 §92）")
        dd = s.get("deep_dive")
        if dd and dd not in ids:
            errors.append(f"{sid}: deep_dive 指向不存在的 scene: {dd}")
        # 认知负荷曲线
        load = s.get("cognitive_load")
        if load not in LOADS:
            warnings.append(f"{sid}: cognitive_load 缺失")
        else:
            if LOAD_RANK.get(load,0) >= 2 and s.get("role") in ("opening","decision"):
                warnings.append(f"{sid}: {s.get('role')} 幕不宜 HIGH 负荷")
            if LOAD_RANK.get(load,0) >= 2:
                prev_high += 1
                if prev_high >= 3:
                    warnings.append(f"{sid}: 连续 {prev_high} 幕高负荷，违反负荷曲线原则（§23）")
            else:
                prev_high = 0

    rt = ir.get("runtime") or {}
    if rt.get("motion", {}).get("respect_reduced_motion") is not True:
        errors.append("runtime.motion.respect_reduced_motion 必须为 true（§46）")
    if rt.get("offline") is not True:
        warnings.append("runtime.offline 非 true：确认现场网络或已获用户明确许可")

    for w in warnings: print(f"WARN : {w}")
    for e in errors:   print(f"ERROR: {e}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s), {len(scenes)} scene(s)")
    return 1 if errors else 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("用法: python3 validate_ir.py <presentation.ir.json>")
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
