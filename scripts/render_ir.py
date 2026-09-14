#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_ir.py — Presentation IR → 自包含 HTML 渲染器（补丁 §5 / §6 / §14 / §31 / §52）

唯一渲染入口：Input → Strategy → IR → **Renderer** → HTML。禁止手写 HTML 绕开 IR。
Stage / Reader / Print 三模式由同一份 IR 同源产出（Reader 内容、讲者笔记、打印态一并写入）。
Renderer 依据 scene.visual_semantics / blocks[].type / motion_intent 选择组件与动效意图。

用法：
    python3 scripts/render_ir.py <ir.json> [-o <out.html>] [--theme-css themes/editorial.css]

约定：输出 HTML 相对仓库根的引用路径由输出位置自动推导（--runtime-prefix 可覆盖）。
"""
import argparse
import html
import json
import os
import re
import sys

# ── 行内标记：**粗** ::高亮:: 换行 ──
def inline(s):
    if s is None:
        return ""
    s = html.escape(str(s), quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"::(.+?)::", r'<em class="wpk-mark">\1</em>', s)
    # 换行标记：IR 中的 <br>（意图为换行）在转义后需还原；\n 与真实换行同样转为 <br>
    s = re.sub(r"&lt;br\s*/?&gt;", "<br>", s, flags=re.I)
    s = s.replace("\\n", "<br>").replace("\n", "<br>")
    return s


def esc_attr(s):
    return html.escape(str(s), quote=True)


def reveal(scene, i, extra=""):
    """内容块渐进揭示：scene.reveal 为真则加 data-reveal，并挂 motion intent。"""
    if not scene.get("reveal", True):
        return extra
    mi = (scene.get("motion_intent") or ["reveal"])[0]
    cls = f' data-reveal data-motion-intent="{esc_attr(mi)}"'
    return cls + ((" " + extra) if extra else "")


# ── 组件渲染器：blocks[].type → HTML ──
def r_cards(b):
    cols = b.get("cols", 3)
    items = "".join(
        f'<div class="wpk-card{" is-accent" if it.get("accent") else ""}"{reveal(b,0)}>'
        + (f'<div class="wpk-card__no">{inline(it["no"])}</div>' if it.get("no") else "")
        + (f'<div class="wpk-card__title">{inline(it.get("title",""))}</div>')
        + (f'<div class="wpk-card__text">{inline(it.get("text",""))}</div>')
        + (f'<span class="wpk-card__tag">{inline(it["tag"])}</span>' if it.get("tag") else "")
        + "</div>"
        for it in b.get("items", [])
    )
    return f'<div class="wpk-grid is-{cols}">{items}</div>'


def r_numbers(b):
    items = "".join(
        f'<div class="wpk-num{" is-accent" if it.get("accent") else ""}"{reveal(b,0)}>'
        f'<div class="wpk-num__v">{inline(it.get("value",""))}</div>'
        f'<div class="wpk-num__l">{inline(it.get("label",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-numbers">{items}</div>'


def r_steps(b):
    items = []
    for it in b.get("items", []):
        cls = "wpk-step is-gate" if it.get("gate") else "wpk-step"
        items.append(f'<div class="{cls}"{reveal(b,0)}>')
        if it.get("k"):
            items.append(f'<div class="wpk-step__k">{inline(it["k"])}</div>')
        items.append(f'<div class="wpk-step__t">{inline(it.get("title",""))}</div>')
        if it.get("text"):
            items.append(f'<div class="wpk-step__d">{inline(it["text"])}</div>')
        items.append("</div>")
    return '<div class="wpk-steps">' + '<div class="wpk-link" data-reveal data-motion-intent="trace"></div>'.join(items) + "</div>"


def r_compare(b):
    def col(c, primary):
        lis = "".join(f"<li>{inline(x)}</li>" for x in c.get("items", []))
        tag = f'<span class="wpk-cmp__tag">{inline(c["tag"])}</span>' if c.get("tag") else ""
        return (f'<div class="wpk-cmp__col{" is-primary" if primary else ""}"{reveal(b,0)}>'
                f'<h3 class="wpk-cmp__h">{inline(c.get("title",""))}{tag}</h3><ul>{lis}</ul></div>')
    return '<div class="wpk-cmp">' + col(b.get("left", {}), False) + col(b.get("right", {}), True) + "</div>"


def r_timeline(b):
    items = "".join(
        f'<div class="wpk-time__i"{reveal(b,0)}><div class="wpk-time__when">{inline(it.get("when",""))}</div>'
        f'<div class="wpk-time__t">{inline(it.get("title",""))}</div>'
        f'<div class="wpk-time__d">{inline(it.get("text",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-time">{items}</div>'


def r_quote(b):
    return (f'<div class="wpk-quote" data-reveal data-motion-intent="focus">'
            f'<div class="wpk-quote__text">{inline(b.get("text",""))}</div>'
            + (f'<div class="wpk-quote__cite">{inline(b["cite"])}</div>' if b.get("cite") else "")
            + "</div>")


def r_matrix(b):
    items = "".join(
        f'<div class="wpk-mx"{reveal(b,0)}><div class="wpk-mx__h">{inline(it.get("title",""))}</div>'
        f'<div class="wpk-mx__d">{inline(it.get("text",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-matrix">{items}</div>'


def r_risks(b):
    head = "".join(f"<th>{inline(h)}</th>" for h in b.get("head", []))
    rows = ""
    for row in b.get("rows", []):
        cells = ""
        for c in row:
            if isinstance(c, dict) and "level" in c:
                cells += f'<td><span class="wpk-lvl">{inline(c["level"])}</span></td>'
            else:
                cells += f"<td>{inline(c)}</td>"
        rows += f"<tr>{cells}</tr>"
    return f'<table class="wpk-risks"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'


def r_arch(b):
    items = "".join(
        f'<div class="wpk-layer"{reveal(b,0)}><div class="wpk-layer__h">{inline(it.get("title",""))}</div>'
        f'<div class="wpk-layer__d">{inline(it.get("text",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-arch">{items}</div>'


def r_actions(b):
    items = "".join(
        f'<div class="wpk-action"{reveal(b,0)}>'
        + (f'<div class="wpk-action__k">{inline(it["k"])}</div>' if it.get("k") else "")
        + f'<div class="wpk-action__t">{inline(it.get("title",""))}</div>'
        + f'<div class="wpk-action__d">{inline(it.get("text",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-actions">{items}</div>'


def r_evidence(b):
    items = "".join(
        f'<div class="wpk-ev"{reveal(b,0)}><div class="wpk-ev__t">{inline(it.get("title",""))}</div>'
        f'<div class="wpk-ev__s">{inline(it.get("source",""))}</div>'
        f'<div class="wpk-ev__g">{inline(it.get("grade",""))}</div></div>'
        for it in b.get("items", [])
    )
    return f'<div class="wpk-evidence">{items}</div>'


def r_list(b):
    lis = "".join(f"<li>{inline(x)}</li>" for x in b.get("items", []))
    return f'<ul class="wpk-cmp" style="display:block;width:min(100%,900px);padding-left:20px;list-style:disc;text-align:left">{lis}</ul>'


def r_chart(b):
    # 兼容两种写法：chart:{...} 嵌套，或 kind/categories/series 平铺于 block
    cfg = b.get("chart") or {k: v for k, v in b.items() if k not in ("type", "caption")}
    payload = json.dumps(cfg, ensure_ascii=False)
    cap = f'<div class="wpk-chart__cap">{inline(b["caption"])}</div>' if b.get("caption") else ""
    return (f'<div class="wpk-chart"><div class="wpk-chart__box" data-chart=\'{esc_attr(payload)}\'></div>{cap}</div>')


def r_text(b):
    return f'<p class="wpk-lead">{inline(b.get("text",""))}</p>'


BLOCK_RENDERERS = {
    "cards": r_cards, "numbers": r_numbers, "steps": r_steps, "compare": r_compare,
    "timeline": r_timeline, "quote": r_quote, "matrix": r_matrix, "risks": r_risks,
    "arch": r_arch, "actions": r_actions, "evidence": r_evidence, "list": r_list,
    "chart": r_chart, "text": r_text,
}


def link_row(scene):
    out = []
    nav = scene.get("nav_links", {}) or {}
    for t in nav.get("deep_dive", []) or []:
        out.append(f'<a class="wpk-dl" data-deep-dive="{esc_attr(t["id"])}">⤵ {inline(t.get("label", t["id"]))}</a>')
    for t in nav.get("branch", []) or []:
        out.append(f'<a class="wpk-dl" data-branch="{esc_attr(t["id"])}">⇢ {inline(t.get("label", t["id"]))}</a>')
    for t in nav.get("skip", []) or []:
        out.append(f'<a class="wpk-dl" data-skip="{esc_attr(t["id"])}">⏭ {inline(t.get("label", t["id"]))}</a>')
    # 兼容 canonical 单值字段
    if scene.get("deep_dive"):
        out.append(f'<a class="wpk-dl" data-deep-dive="{esc_attr(scene["deep_dive"])}">⤵ 深潜</a>')
    if not out:
        return ""
    # navrow 不挂 data-reveal：深潜/分支入口须即时可点，不被渐进揭示扣押（实测验证暴露）
    return f'<div class="wpk-navrow">{ "".join(out) }</div>'


def render_scene(scene, index, total):
    sid = scene["id"]
    role = scene.get("role", "argument")
    density = scene.get("information_density", "medium")
    content = scene.get("content", {}) or {}
    cls = "wp-scene"
    if density in ("high", "very_high"):
        cls += " is-dense"
    if density == "low":
        cls += " is-sparse"
    headline = scene.get("headline", {}) or {}
    htag = "h1" if role in ("opening", "summary") and not scene.get("blocks") else "h2"
    parts = [f'<section class="{cls}" data-scene-id="{esc_attr(sid)}" data-role="{esc_attr(role)}" '
             f'data-topic="{esc_attr(scene.get("topic", scene.get("audience_question", role)))}" '
             f'data-claim="{esc_attr(scene.get("claim", scene.get("assertion") or ""))}">']
    if scene.get("kicker"):
        parts.append(f'<span class="wpk-kicker">{inline(scene["kicker"])}</span>')
    if headline.get("text"):
        parts.append(f'<{htag}>{inline(headline["text"])}</{htag}>')
    lead = scene.get("lead") or content.get("stage")
    if lead:
        parts.append(f'<p class="wpk-lead">{inline(lead)}</p>')
    for b in scene.get("blocks", []) or []:
        fn = BLOCK_RENDERERS.get(b.get("type"))
        if fn:
            parts.append(fn(b))
        else:
            parts.append(f'<!-- 未知 block type: {esc_attr(b.get("type"))} -->')
    parts.append(link_row(scene))
    # 三层内容：讲者笔记 / Reader / 来源
    if scene.get("speaker_notes"):
        parts.append(f'<aside class="wp-notes">{inline(scene["speaker_notes"])}</aside>')
    reader = scene.get("reader_content") or content.get("reader")
    if reader and reader != "见 content.reader":
        parts.append(f'<div class="wp-reader">{inline(reader)}</div>')
    elif content.get("reader"):
        parts.append(f'<div class="wp-reader">{inline(content["reader"])}</div>')
    src = scene.get("source")
    if not src and scene.get("evidence"):
        src = "来源：" + " · ".join(e.get("source", "") for e in scene["evidence"] if e.get("source"))
    ret = '<span data-branch-return class="wpk-return">Esc 返回主线 · </span>' if role in ("deep_dive", "appendix", "branch") else ""
    if src or ret:
        parts.append(f'<p class="wpk-src">{ret}{inline(src or "")}</p>')
    parts.append("</section>")
    return "\n  ".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ir")
    ap.add_argument("-o", "--out")
    ap.add_argument("--runtime-prefix", default=None)
    ap.add_argument("--theme-css", default=None)
    args = ap.parse_args()

    with open(args.ir, encoding="utf-8") as f:
        ir = json.load(f)

    ir_dir = os.path.dirname(os.path.abspath(args.ir))
    out = args.out or os.path.join(ir_dir, "index.html")
    out_dir = os.path.dirname(os.path.abspath(out))

    # 推导输出 → 仓库根（scripts/ 的上一级）的相对前缀
    if args.runtime_prefix is not None:
        prefix = args.runtime_prefix
    else:
        repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prefix = os.path.relpath(repo_root, out_dir).replace(os.sep, "/")
        if prefix == ".":
            prefix = ""

    def rp(p):
        return (prefix + "/" + p) if prefix else p

    pres = ir.get("presentation", {}) or {}
    theme = ir.get("theme", {}) or {}
    theme_css = args.theme_css or theme.get("css") or "themes/editorial.css"
    tokens = theme.get("tokens", {}) or {}
    token_css = "".join(f"{k}:{v};" for k, v in tokens.items())

    scenes = ir.get("scenes", []) or []
    body = "\n  ".join(render_scene(s, i, len(scenes)) for i, s in enumerate(scenes))

    runtime = ir.get("runtime", {}) or {}
    charts = any(blk.get("type") == "chart" for s in scenes for blk in (s.get("blocks") or []))

    doc = f"""<!DOCTYPE html>
<html lang="{esc_attr(pres.get('lang','zh-CN'))}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{inline(pres.get('title',''))}</title>
<link rel="stylesheet" href="{rp(theme_css)}">
<link rel="stylesheet" href="{rp('runtime/core/presentation.css')}">
<link rel="stylesheet" href="{rp('runtime/components/components.css')}">
{ f'<link rel="stylesheet" href="{rp("runtime/visualization/charts.css")}">' if charts else '' }
<link rel="stylesheet" href="{rp('runtime/print/print.css')}" media="print">
<style>{(':root{' + token_css + '}') if token_css else ''}</style>
</head>
<body data-wpui="{esc_attr(pres.get('ui','on'))}">
<main class="wp-deck">

  {body}

</main>
<script src="{rp('runtime/core/scene-engine.js')}"></script>
<script src="{rp('runtime/navigation/router.js')}"></script>
<script src="{rp('runtime/motion/motion-controller.js')}"></script>
<script src="{rp('runtime/interaction/interaction.js')}"></script>
<script src="{rp('runtime/presenter/presenter-view.js')}"></script>
<script src="{rp('runtime/reader/reader.js')}"></script>
{ f'<script src="{rp("runtime/vendor/echarts.min.js")}"></script>' if charts else '' }
{ f'<script src="{rp("runtime/visualization/charts.js")}"></script>' if charts else '' }
<script src="{rp('runtime/core/bootstrap.js')}"></script>
<script>WPBoot.start(".wp-deck");</script>
</body>
</html>
"""
    with open(out, "w", encoding="utf-8") as f:
        f.write(doc)
    print(f"rendered {len(scenes)} scenes → {out}")


if __name__ == "__main__":
    main()
