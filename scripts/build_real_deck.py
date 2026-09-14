#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build_real_deck.py — 真实语料上游管线工具（§54 上游的工程化）

输入：一个 spec JSON（源材料信息 + 受众 + 论点 + 场景表）。
输出：content-understanding.json / strategy.json / argument-map.json / scene-plan.json /
      presentation.ir.json，并依次调用 validate_strategy.py / validate_ir.py / render_ir.py。

设计原则：
  - 每个数字、每条引文必须在 source-material.md 中命中（validate_strategy 强制）；
  - 图表如为显示换算（元→亿元），在 block 上声明 source_values（原文原值）逐一核对；
  - 推导内容（集团参考等）必须在 strategy.ethical_constraints 声明；
  - spec 即「上游工件的人源输入」，一次编写、全部工件可复现。

用法：python3 build_real_deck.py <spec.json> [--skip-render]
"""
import io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load(p):
    with io.open(p, encoding="utf-8") as f:
        return json.load(f)


def dump(p, obj):
    with io.open(p, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)


def run(args):
    r = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
    out = (r.stdout or "") + (r.stderr or "")
    ok = r.returncode == 0
    return ok, out.strip().splitlines()[-2:] if out.strip() else ["(no output)"]


def main(spec_path, skip_render=False):
    spec = load(spec_path)
    dest = os.path.join(ROOT, spec["dest"])
    os.makedirs(dest, exist_ok=True)

    # 0) 源材料必须在（由抓取步骤生成）
    src_path = os.path.join(dest, "source-material.md")
    if not os.path.exists(src_path):
        print(f"ERROR: {src_path} 不存在——请先抓取真实材料"); return 1
    src = io.open(src_path, encoding="utf-8").read()
    src_norm = re.sub(r"\s+", "", src)

    # 1) content-understanding.json —— key_facts 可缺省（由 claims 证据派生）；全部引文预检
    kf = spec.get("key_facts", [])
    for c in spec["claims"]:
        for e in c["evidence"]:
            q = e["quote"] if isinstance(e, dict) else e
            kf.append({"fact": c["claim"][:40], "quote": q})
    bad = [f["quote"] for f in kf if re.sub(r"\s+", "", f["quote"]) not in src_norm]
    if bad:
        print("ERROR: 引文未命中源材料:", bad[:3]); return 1
    dump(os.path.join(dest, "content-understanding.json"), {
        "_readme": "Content Understanding — 只登记事实，全部引文已由闸门核对。",
        "source": spec["source"], "key_facts_verified": kf,
        "not_in_saved_text": spec.get("not_in_saved_text", []),
        "audience_questions": spec["audience"]["concerns"],
        "material_difficulties": spec.get("material_difficulties", []),
    })

    # 2) strategy.json
    strategy = {
        "schema": "strategy.v1", "source_material": spec["source"],
        "situation": spec["situation"], "situation_rationale": spec["situation_rationale"],
        "communication_goal": spec["communication_goal"], "audience": spec["audience"],
        "central_thesis": spec["central_thesis"], "key_messages": spec["key_messages"],
        "supporting_structure": spec["supporting_structure"],
        "duration_minutes": spec["duration_minutes"],
        "ethical_constraints": spec["ethical_constraints"], "anti_goals": spec.get("anti_goals", []),
    }
    dump(os.path.join(dest, "strategy.json"), strategy)

    # 3) argument-map.json
    claims = []
    for c in spec["claims"]:
        quotes = [e["quote"] if isinstance(e, dict) else e for e in c["evidence"]]
        badq = [q for q in quotes if re.sub(r"\s+", "", q) not in src_norm]
        if badq:
            print(f"ERROR: argument-map.{c['id']} 引文未命中:", badq[:2]); return 1
        claims.append({"id": c["id"], "claim": c["claim"], "type": c.get("type", "fact"),
                       "evidence": [{"quote": q, "loc": c.get("loc", "报告原文")} for q in quotes],
                       "counter": c.get("counter", "无"), "supports": c.get("supports", ["THESIS"])})
    am = {"schema": "argument-map.v1", "central_thesis": spec["central_thesis"],
          "claims": claims, "checks": {"unsupported_claim": "无", "evidence_mismatch": spec.get("evidence_mismatch", "无"),
          "logical_gap": "无", "argument_jump": "无", "duplicate_claim": "无", "overclaim": spec["overclaim"]}}
    dump(os.path.join(dest, "argument-map.json"), am)

    # 4) scene-plan.json + 5) presentation.ir.json
    claim_ids = {c["id"] for c in claims} | {"THESIS"}
    scenes, plan = [], []
    for n, s in enumerate(spec["scenes"], start=1):
        arg = s.get("arg_ref")
        if arg is not None and arg not in claim_ids:
            print(f"ERROR: scene {s['id']} arg_ref 指向不存在的 claim: {arg}"); return 1
        plan.append({"order": n, "id": s["id"], "arg_ref": arg, "cognitive_job": s["job"],
                     "load": s["load"], "headline_type": s["htype"], "headline": s["headline"],
                     "chart": (s["blocks"][0] if s.get("blocks") and s["blocks"][0]["type"] == "chart" else None),
                     "source_refs": s.get("source_refs", [])})
        scenes.append({
            "id": s["id"], "role": s["role"], "cognitive_job": s["job"],
            "topic": re.sub(r"::", "", s["headline"]).split("：")[0][:12],
            "claim": re.sub(r"::", "", s["headline"]).split("：")[-1][:30],
            "headline": {"type": s["htype"], "text": s["headline"], "rationale": s["rationale"]},
            "kicker": spec["kicker"] + (f"（{spec['type_label']}）" if s["id"] == "opening" else ""),
            "content": {"stage": s["stage"], "reader": s["reader"]},
            "evidence": [{"type": "official", "ref": spec["source"]["ref"], "source": spec["source"]["title"],
                          "unit": None, "time": spec["source"]["date"], "scope": spec.get("scope", "全国")}],
            "visual_semantics": ("data_insight" if any(b.get("type") == "chart" for b in s.get("blocks", []))
                                 else "hierarchy" if s.get("role") in ("evidence",) else "assertion_evidence"),
            "layout_intent": None, "information_density": s["load"], "cognitive_load": s["load"],
            "render_level": s.get("render_level", "L2" if s["load"] in ("medium", "high") else "L1"),
            "render_rationale": s.get("render_rationale"),
            "reveal_strategy": "none", "motion_intent": s.get("motion_intent", []), "interaction": [],
            "deep_dive": None, "speaker_notes": s["reader"], "screen_role": None, "speaker_role": None,
            "reader_content": s["reader"] + "（口径与限定语以原文为准；推导内容已声明。）",
            "print_state": "完整打印", "branch_targets": [],
            "accessibility": {"alt_text": ("图表见 caption" if any(b.get("type") == "chart" for b in s.get("blocks", [])) else None), "notes": None},
            "source": f"来源：{spec['source']['title']}",
            "blocks": s.get("blocks", []), "source_refs": s.get("source_refs", []),
        })
    dump(os.path.join(dest, "scene-plan.json"), {"schema": "scene-plan.v1",
         "deck_title": spec["title"], "argument_map_ref": "argument-map.json",
         "load_curve_rule": "连续 HIGH ≤2 幕", "scenes": plan})
    ir = {"ir_version": "1.0",
          "presentation": {"id": spec["id"], "title": spec["title"], "situation": spec["situation"],
          "communication_goal": spec["communication_goal"], "audience": spec["audience"],
          "central_thesis": spec["central_thesis"], "duration_minutes": spec["duration_minutes"],
          "modes": ["stage", "reader", "print"],
          "brand": {"theme": spec["theme"]["name"], "constraints": spec["constraints"]},
          "theme": {"name": spec["theme"]["name"], "css": spec["theme"]["css"], "tokens": spec["theme"]["tokens"]},
          "runtime": {"navigation": {"keyboard": True, "search": True, "jump": True},
          "presenter_view": {"notes": True, "timer": True, "next_scene": True},
          "motion": {"respect_reduced_motion": True, "controllable": True}, "offline": True,
          "performance_budget": {"first_load_kb": 1400, "max_image_kb": 200, "target_fps": 60}},
          "modes": {"stage": True, "reader": {"enabled": True, "deep_links": True},
          "print": {"enabled": True, "expand_critical": True, "show_citations": True}},
          "graph": {"core_path": [s["id"] for s in scenes if s["id"] != "appendix"],
          "optional_paths": [], "deep_dives": [], "evidence_appendix": (["appendix"] if any(s["id"] == "appendix" for s in scenes) else [])},
          "qa_preparation": spec.get("qa_preparation", {"likely_questions": [], "objection_handling": []}),
          "constraints": spec["constraints"]},
          "theme": {"name": spec["theme"]["name"], "css": spec["theme"]["css"], "tokens": spec["theme"]["tokens"]},
          "runtime": {"navigation": {"keyboard": True, "search": True, "jump": True},
          "presenter_view": {"notes": True, "timer": True, "next_scene": True},
          "motion": {"respect_reduced_motion": True, "controllable": True}, "offline": True,
          "performance_budget": {"first_load_kb": 1400, "max_image_kb": 200, "target_fps": 60}},
          "modes": {"stage": True, "reader": {"enabled": True, "deep_links": True},
          "print": {"enabled": True, "expand_critical": True, "show_citations": True}},
          "scenes": scenes}
    dump(os.path.join(dest, "presentation.ir.json"), ir)

    # 6) 三道闸门 + 渲染
    rc = 0
    ok, out = run([sys.executable, os.path.join(HERE, "validate_strategy.py"), dest])
    print("\n".join(out))
    if not ok: rc = 1
    ok, out = run([sys.executable, os.path.join(HERE, "validate_ir.py"),
                   os.path.join(dest, "presentation.ir.json")])
    print("\n".join(out))
    if not ok: rc = 1
    if not skip_render:
        ok, out = run([sys.executable, os.path.join(HERE, "render_ir.py"),
                       os.path.join(dest, "presentation.ir.json")])
        print("\n".join(out))
        if not ok: rc = 1
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], *(sys.argv[2:])))
