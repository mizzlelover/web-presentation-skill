#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build_corpus.py — 批量校验并渲染 benchmarks/corpus 下所有 Deck（补丁 §7/§8/§52）

对每个 benchmarks/corpus/*/presentation.ir.json：
  1. scripts/validate_ir.py 校验（不过则中止该 Deck 并报错）
  2. scripts/render_ir.py 渲染出 index.html
用法：python3 scripts/build_corpus.py [corpus_root]
"""
import glob
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
VALIDATE = os.path.join(HERE, "validate_ir.py")
RENDER = os.path.join(HERE, "render_ir.py")


def main():
    roots = sys.argv[1:] or [
        os.path.join(ROOT, "benchmarks", "corpus"),
        os.path.join(ROOT, "benchmarks", "derived"),
        os.path.join(ROOT, "benchmarks", "real"),
    ]
    irs = []
    for root in roots:
        irs += sorted(glob.glob(os.path.join(root, "*", "presentation.ir.json")))
    if not irs:
        print("no decks found under", roots)
        return 1
    py = sys.executable or "python3"
    ok, bad = 0, []
    for ir in irs:
        name = os.path.basename(os.path.dirname(ir))
        v = subprocess.run([py, VALIDATE, ir], capture_output=True, text=True)
        if v.returncode != 0:
            bad.append((name, "validate", v.stdout.strip().splitlines()[-1] if v.stdout else ""))
            print(f"✗ {name}: 校验失败")
            print(v.stdout.strip())
            continue
        r = subprocess.run([py, RENDER, ir], capture_output=True, text=True)
        if r.returncode != 0:
            bad.append((name, "render", r.stderr.strip()[-200:]))
            print(f"✗ {name}: 渲染失败\n{r.stderr}")
            continue
        ok += 1
        print(f"✔ {name}: {r.stdout.strip()}")
    print(f"\n{ok}/{len(irs)} deck(s) 构建成功" + (f"，失败 {len(bad)}" if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
