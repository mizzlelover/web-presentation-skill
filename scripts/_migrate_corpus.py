#!/usr/bin/env python3
"""一次性迁移：seed_corpus.yaml 旧 access_status → 补丁 §3 acquisition 阶梯。
所有旧条目按 RESEARCH_AUDIT.md 决议诚实标为 ladder:found / verification:memory_based。
"""
import re, pathlib

p = pathlib.Path(__file__).parent.parent / "knowledge/sources/seed_corpus.yaml"
text = p.read_text(encoding="utf-8")

PRACTITIONER = {
    "SRC-DUARTE-2008", "SRC-DUARTE-2010", "SRC-REYNOLDS-2008", "SRC-ATKINSON-2005",
    "SRC-ABELA-2008", "SRC-WEISSMAN-2003", "SRC-MINTO-1987", "SRC-KNAFLIC-2015",
    "SRC-WILLIAMS-1994", "SRC-GALLO-2010", "SRC-FEW-2004", "SRC-REVEALJS", "SRC-SLIDEV",
}

ACQ_BLOCK = """    acquisition:
      ladder: found
      acquired_how: null
      read_sections: null
      access_level: null
      annotated_at: null
      validated_by: null
      verification: memory_based
"""

out_lines = []
current_id = None
for line in text.splitlines():
    m = re.match(r"\s*- source_id: (\S+)", line)
    if m:
        current_id = m.group(1)
    if re.match(r"\s*access_status:", line):
        indent = "    "
        kt = "practitioner_framework" if current_id in PRACTITIONER else "scientific"
        out_lines.append(ACQ_BLOCK.rstrip("\n"))
        out_lines.append(f"    knowledge_type: {kt}")
        continue
    # 更新文件头注释
    if line.startswith("# access_status 记录"):
        out_lines.append("# acquisition 按补丁 §3 记录获取阶梯；2026-09-08 起旧条目诚实降级为 found/memory_based，")
        out_lines.append("# 仅 acquisition.ladder >= validated 的来源可作为 Knowledge Node 核心证据。")
        continue
    out_lines.append(line)

p.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
print("migrated", p)
