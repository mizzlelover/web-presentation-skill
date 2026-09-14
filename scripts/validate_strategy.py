#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""validate_strategy.py — 上游管线闸门（补丁 §52/§53/§95 的机械化执行）

对一个真实材料 Deck 目录校验：
  1. source-material.md 存在且带出处（URL + 抓取时间）
  2. content-understanding.json 的每条 key_facts[].quote 必须逐字命中源材料
  3. strategy.json 必备字段（situation / audience / goal / central_thesis / source_material）
  4. argument-map.json 每条 evidence[].quote 必须逐字命中源材料；checks.overclaim 必须登记
  5. scene-plan.json：cognitive_job 合法、load 合法、连续 HIGH ≤2、chart 必带 caption+unit
  6. 场景 ↔ 论证互锁：scene.arg_ref 必须指向 THESIS 或某条 claim；claim 必须被 ≥1 幕引用
  7. IR（若存在）的 source_refs[].quote 逐字命中源材料；图表数据数值必须能在源材料中找到

exit 0 = 通过；exit 1 = 有 error。quote 校验是「禁止编造原始素材」的机械化执行。
"""
import json, os, re, sys

VALID_JOBS = {"ask","answer","explain","compare","demonstrate","prove","orient",
              "transition","summarize","challenge","reveal","visualize","quantify",
              "simulate","decide"}
VALID_LOADS = {"low","medium","high","very_high"}

def load_json(path):
    with io_open(path) as f: return json.load(f)

def io_open(p):
    import io
    return io.open(p, encoding="utf-8")

def main(d):
    errs, warns = [], []
    src_path = os.path.join(d, "source-material.md")
    if not os.path.exists(src_path):
        print("ERROR: 缺少 source-material.md（真实材料必须先落盘）"); return 1
    src = io_open(src_path).read()
    src_norm = re.sub(r"\s+", "", src)   # PDF 逐页抽取会在行内插入换行/空格，引文比对做空白归一化
    if "http" not in src[:600] or "抓取时间" not in src[:600]:
        errs.append("source-material.md 头部缺少出处（URL/抓取时间）")

    def check_quotes(quotes, where):
        for q in quotes:
            qn = re.sub(r"\s+", "", q or "")
            if not qn or qn not in src_norm:
                errs.append(f"[{where}] 引文未命中源材料（疑似编造）: {q[:60]}")

    # content-understanding
    cu = os.path.join(d, "content-understanding.json")
    if os.path.exists(cu):
        c = load_json(cu)
        check_quotes([f.get("quote","") for f in c.get("key_facts",[])], "content-understanding.key_facts")
        for n in c.get("not_in_saved_text", []):
            warns.append(f"[content-understanding] 已登记不在原文中的事实（禁用）: {n[:40]}")

    # strategy
    st = load_json(os.path.join(d, "strategy.json"))
    for k in ("situation","communication_goal","central_thesis","duration_minutes","source_material"):
        if not st.get(k): errs.append(f"strategy.json 缺少 {k}")
    aud = st.get("audience") or {}
    for k in ("role","time_budget"):
        if not aud.get(k): errs.append(f"strategy.audience 缺少 {k}")
    if not st.get("ethical_constraints"): warns.append("strategy.json 未登记伦理约束")

    # argument-map
    am = load_json(os.path.join(d, "argument-map.json"))
    claims = am.get("claims", [])
    claim_ids = {c.get("id") for c in claims} | {"THESIS"}
    for c in claims:
        if not c.get("claim"): errs.append(f"argument-map: {c.get('id')} 缺 claim")
        check_quotes([e.get("quote","") for e in c.get("evidence",[])], f"argument-map.{c.get('id')}.evidence")
    if not (am.get("checks") or {}).get("overclaim"):
        errs.append("argument-map.checks.overclaim 未登记（必须主动登记过度声称风险）")

    # scene-plan
    sp = load_json(os.path.join(d, "scene-plan.json"))
    scenes = sp.get("scenes", [])
    ids = [s.get("id") for s in scenes]
    if len(ids) != len(set(ids)): errs.append("scene-plan: scene id 重复")
    prev_high = 0
    used_refs = set()
    for s in scenes:
        sid = s.get("id")
        if s.get("cognitive_job") not in VALID_JOBS: errs.append(f"scene-plan:{sid} cognitive_job 非法")
        if s.get("load") not in VALID_LOADS: errs.append(f"scene-plan:{sid} load 非法")
        if s.get("load") == "high":
            prev_high += 1
            if prev_high >= 3: errs.append(f"scene-plan:{sid} 连续 ≥3 幕 HIGH")
        else:
            prev_high = 0
        ch = s.get("chart")
        if ch:
            if not ch.get("caption"): errs.append(f"scene-plan:{sid} chart 缺 caption（口径）")
            if not ch.get("unit"): errs.append(f"scene-plan:{sid} chart 缺 unit")
        ref = s.get("arg_ref")
        if ref is not None and ref not in claim_ids:
            errs.append(f"scene-plan:{sid} arg_ref 指向不存在的 claim: {ref}")
        if ref: used_refs.add(ref)

    orphans = claim_ids - used_refs - {"THESIS"}
    if orphans: warns.append(f"argument-map 中未被任何场景引用的 claim: {sorted(orphans)}")

    # IR（若存在）
    irp = os.path.join(d, "presentation.ir.json")
    if os.path.exists(irp):
        ir = load_json(irp)
        ir_scenes = ir.get("scenes", [])
        plan_ids = set(ids)
        missing = [s.get("id") for s in ir_scenes if s.get("id") not in plan_ids]
        if missing: errs.append(f"IR 中存在 scene-plan 之外的幕: {missing}")
        for s in ir_scenes:
            sid = s.get("id")
            check_quotes(s.get("source_refs", []), f"IR.{sid}.source_refs")
            # 图表数值溯源：每个数据值必须能在源材料中找到（空白归一化，容忍 PDF 换行伪影）
            for b in s.get("blocks", []):
                if b.get("type") != "chart": continue
                cfg = b.get("chart") or {k: v for k, v in b.items() if k not in ("type","caption")}
                # 若声明 source_values（原文原值），则逐一核对其命中——数据值视为显示换算（如元→亿元）
                declared = b.get("source_values") or cfg.get("source_values")
                if declared:
                    src_nc = src_norm.replace(",", "")
                    for dv in declared:
                        if isinstance(dv, (int, float)):
                            tok = str(int(dv)) if float(dv).is_integer() else (f"{round(float(dv), 2):.2f}".rstrip("0").rstrip("."))
                        else:
                            tok = str(dv)
                        if tok.replace(",", "") not in src_nc:
                            errs.append(f"IR.{sid} 声明的原值 {tok} 未在源材料中命中（疑似编造）")
                    continue
                for ser in cfg.get("series", []):
                    for v in ser.get("data", []):
                        if v is None: continue
                        tok = ("%g" % v) if isinstance(v, (int, float)) else str(v)
                        if tok not in src_norm:
                            errs.append(f"IR.{sid} 图表数值 {tok} 未在源材料中命中（疑似编造）")

    for w in warns: print("WARN :", w)
    for e in errs:  print("ERROR:", e)
    print(f"\n{len(errs)} error(s), {len(warns)} warning(s) — {d}")
    return 1 if errs else 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(2)
    sys.exit(main(sys.argv[1]))
