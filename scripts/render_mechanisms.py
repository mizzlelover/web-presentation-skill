#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""render_mechanisms.py — 机制正反例画廊渲染器（补丁 §20）

读取 evals/mechanisms/mechanisms.json，产出 evals/mechanisms/index.html：
每条机制渲染「正例 / 反例」两栏对照 + 原则 + 由此导出的渲染规则 + 证据。
正/反例片段使用**生产组件类名**，因此画廊同时是组件契约的回归夹具。
"""
import html
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "evals", "mechanisms", "mechanisms.json")
OUT = os.path.join(ROOT, "evals", "mechanisms", "index.html")


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    mechs = data["mechanisms"]

    cards = []
    for m in mechs:
        cards.append(f"""
  <section class="mech" id="{m['id']}">
    <header>
      <span class="mid">{m['id']}</span>
      <h2>{html.escape(m['name'])}</h2>
      <span class="node">{html.escape(m['node'])}</span>
    </header>
    <p class="principle">{html.escape(m['principle'])}</p>
    <div class="pair">
      <div class="side pos"><div class="side-h">✓ 正例</div><div class="stage">{m['pos']}</div></div>
      <div class="side neg"><div class="side-h">✕ 反例</div><div class="stage">{m['neg']}</div></div>
    </div>
    <p class="rule"><b>导出的渲染规则</b>：{html.escape(m['rule'])}</p>
    <p class="evidence"><b>证据/依据</b>：{html.escape(m['evidence'])}</p>
  </section>""")

    rows = "\n".join(
        f"<tr><td>{m['id']}</td><td>{html.escape(m['name'])}</td><td>{html.escape(m['rule'])}</td></tr>"
        for m in mechs
    )

    doc = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>机制正反例画廊（补丁 §20）</title>
<link rel="stylesheet" href="../../runtime/components/components.css">
<style>
  :root {{
    --wp-accent:#3b5bff; --wp-bg:#faf8f4; --wp-fg:#17150f; --wp-muted:#57534a;
    --wp-radius:14px; --wp-surface:#fff;
    --wp-line-fallback: rgba(23,21,15,.12);
  }}
  *{{box-sizing:border-box}}
  body{{margin:0;padding:32px clamp(16px,4vw,56px) 64px;background:var(--wp-bg);color:var(--wp-fg);
       font:15px/1.75 "PingFang SC","Helvetica Neue",system-ui,sans-serif}}
  h1{{font-size:26px;margin:0 0 6px}}
  .lead{{color:var(--wp-muted);max-width:80ch;margin:0 0 26px}}
  .mech{{background:var(--wp-surface);border:1px solid var(--wp-line-fallback);border-radius:var(--wp-radius);
        padding:20px 22px;margin:0 0 20px}}
  header{{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:6px}}
  header h2{{font-size:17px;margin:0}}
  .mid{{font-family:ui-monospace,monospace;font-size:12px;background:#eef1ff;color:var(--wp-accent);
       border-radius:6px;padding:2px 8px;font-weight:700}}
  .node{{font-size:12px;color:var(--wp-muted);margin-left:auto}}
  .principle{{margin:6px 0 14px;color:var(--wp-muted)}}
  .pair{{display:grid;grid-template-columns:1fr 1fr;gap:16px}}
  .side{{border:1px solid var(--wp-line-fallback);border-radius:10px;overflow:hidden}}
  .side-h{{font-size:12px;font-weight:700;padding:6px 12px;letter-spacing:.06em}}
  .side.pos .side-h{{background:#e8f6ee;color:#14713c}}
  .side.neg .side-h{{background:#fdecec;color:#a3231f}}
  .stage{{padding:16px;font-size:14px}}
  .stage .wpk-num__v{{font-size:44px}}
  .rule,.evidence{{font-size:13px;color:var(--wp-muted);margin:12px 0 0}}
  .rule b,.evidence b{{color:var(--wp-fg)}}
  table{{border-collapse:collapse;width:100%;margin-top:28px;font-size:13px;background:var(--wp-surface)}}
  th,td{{border-bottom:1px solid var(--wp-line-fallback);padding:9px 10px;text-align:left;vertical-align:top}}
  th{{color:var(--wp-muted);font-weight:600}}
  @media(max-width:820px){{.pair{{grid-template-columns:1fr}}}}
</style>
</head>
<body>
<h1>机制正反例画廊</h1>
<p class="lead">{len(mechs)} 条机制，每条给出<b>正例</b>与<b>反例</b>对照，并导出可执行的渲染规则。所有片段使用生产组件类名（<code>runtime/components/components.css</code>），因此本页同时是组件契约的回归夹具。</p>
{''.join(cards)}

<h2 style="margin-top:34px">导出的渲染规则汇总（Renderer Planning Rules）</h2>
<table><thead><tr><th>#</th><th>机制</th><th>规则</th></tr></thead><tbody>
{rows}
</tbody></table>
</body>
</html>
"""
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(doc)
    print(f"rendered {len(mechs)} mechanisms → {OUT}")


if __name__ == "__main__":
    main()
