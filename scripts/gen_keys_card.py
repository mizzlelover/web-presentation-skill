#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gen_keys_card.py — 演示产物「键位速查」视觉卡片生成器

为任意文质（Wenzhi）演示产物生成一张与运行时 `?` 帮助面板一致的键位速查 SVG 卡片，
可嵌入 README、文档或交付说明。纯标准库，零依赖。

用法:
  python3 gen_keys_card.py                                  # 默认键位 + 纸上光谱主题
  python3 gen_keys_card.py --output dist/keys.svg
  python3 gen_keys_card.py --title "路演键位" --brand "ACME · Q3 REVIEW" --site "acme.example"
  python3 gen_keys_card.py --keys my_keys.json              # 自定义键位（JSON，见 --print-keys）
  python3 gen_keys_card.py --stops "#3b5bff,#8b5cf6,#ff6a4d" --bg "#faf8f4" --ink "#17150f"

键位 JSON 结构（可用 --print-keys 导出默认版再修改）:
  [{"group": "推进 · NAVIGATE", "rows": [[["→", "Space"], "下一步 · 先走完本幕揭示"], ...]}, ...]

exit 0 = 成功；卡片为三列布局，列数自适应分组数（1–3 组最佳）。
"""
import argparse
import json
import sys

DEFAULT_KEYS = [
    {"group": "推进 · NAVIGATE", "rows": [
        [["→", "Space"], "下一步 · 先走完本幕揭示"],
        [["←"], "回退一步"],
        [["Home", "End"], "第一幕 / 最后一幕"],
    ]},
    {"group": "视图 · VIEWS", "rows": [
        [["O"], "总览 · 全页缩略平铺跳转"],
        [["R"], "自读模式 · 纵向完整滚动"],
        [["P"], "讲者控制台 · 笔记/计时"],
        [["M"], "静帧 · 关闭动效整幕直出"],
    ]},
    {"group": "辅助 · ASSIST", "rows": [
        [["/"], "搜索场景 / 论点 / 证据"],
        [["?"], "快捷键帮助面板"],
        [["Esc"], "退出总览 · 深潜返回主线"],
    ]},
]

SANS = "ui-sans-serif,system-ui,PingFang SC,sans-serif"
MONO = "ui-monospace,SF Mono,Menlo,monospace"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def keycap(label, x, y, ink, cap, cap_line):
    w = max(46, 26 + len(label) * 15)
    parts = [
        f'<rect x="{x}" y="{y}" width="{w}" height="46" rx="10" fill="{cap}" '
        f'stroke="{cap_line}" stroke-width="1.2"/>',
        f'<rect x="{x}" y="{y + 42}" width="{w}" height="4" rx="2" fill="rgba(23,21,15,.08)"/>',
        f'<text x="{x + w / 2}" y="{y + 30}" text-anchor="middle" font-family="{MONO}" '
        f'font-size="19" font-weight="600" fill="{ink}">{esc(label)}</text>',
    ]
    return "".join(parts), w


def build_svg(keys, title, brand, site, bg, ink, stops, width, height, footer,
              ink2="#4a463c", ink3="#8a857a", cap="#ffffff", cap_line="rgba(23,21,15,.14)"):
    stop_tags = "".join(
        f'<stop offset="{i / max(len(stops) - 1, 1):.2g}" stop-color="{c}"/>'
        for i, c in enumerate(stops)
    )
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">',
        f'<defs><linearGradient id="spectrum" x1="0" y1="0" x2="1" y2="0">{stop_tags}</linearGradient>'
        f'<filter id="noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/>'
        f'<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 0"/></filter></defs>',
        f'<rect width="{width}" height="{height}" fill="{bg}"/>',
        f'<rect width="{width}" height="{height}" filter="url(#noise)"/>',
        f'<rect x="0" y="0" width="{width}" height="6" fill="url(#spectrum)"/>',
        f'<text x="60" y="86" font-family="{SANS}" font-size="15" letter-spacing="4" fill="{ink3}">{esc(brand)}</text>',
        f'<text x="60" y="132" font-family="{SANS}" font-size="38" font-weight="700" fill="{ink}">{esc(title)}</text>',
        '<rect x="60" y="154" width="120" height="4" rx="2" fill="url(#spectrum)"/>',
    ]

    n = max(len(keys), 1)
    usable = width - 120
    col_w = usable / n
    for ci, entry in enumerate(keys[:4]):  # 最多 4 组
        x0 = 60 + ci * col_w
        svg.append(
            f'<text x="{x0}" y="212" font-family="{SANS}" font-size="13" letter-spacing="3" '
            f'font-weight="600" fill="{ink3}">{esc(entry["group"])}</text>'
        )
        y = 232
        for key_labels, desc in entry["rows"]:
            kx = x0
            for ki, k in enumerate(key_labels):
                cap_svg, w = keycap(k, kx, y, ink, cap, cap_line)
                svg.append(cap_svg)
                kx += w + 10
                if ki < len(key_labels) - 1:
                    svg.append(
                        f'<text x="{kx - 4}" y="{y + 30}" font-family="{SANS}" font-size="15" fill="{ink3}">/</text>'
                    )
                    kx += 12
            svg.append(
                f'<text x="{x0}" y="{y + 72}" font-family="{SANS}" font-size="16" fill="{ink2}">{esc(desc)}</text>'
            )
            y += 104

    if footer:
        svg.append(
            f'<text x="60" y="{height - 32}" font-family="{SANS}" font-size="13" fill="{ink3}">{esc(footer)}</text>'
        )
    if site:
        svg.append(
            f'<text x="{width - 60}" y="{height - 32}" text-anchor="end" font-family="{MONO}" '
            f'font-size="13" fill="{ink3}">{esc(site)}</text>'
        )
    svg.append("</svg>")
    return "\n".join(svg)


def main():
    ap = argparse.ArgumentParser(description="生成键位速查 SVG 卡片（文质演示产物配套）")
    ap.add_argument("--output", "-o", default="keys-card.svg", help="输出 SVG 路径")
    ap.add_argument("--title", default="键位速查", help="卡片标题")
    ap.add_argument("--brand", default="文质 WENZHI · WEB-NATIVE PRESENTATION", help="顶部品牌行")
    ap.add_argument("--site", default="", help="右下角站点署名（留空不显示）")
    ap.add_argument("--footer", default="提示常驻右下角 · 6 秒无操作自动淡化 · ? 随时唤起完整帮助",
                    help="左下角脚注（留空不显示）")
    ap.add_argument("--keys", help="自定义键位 JSON 文件路径")
    ap.add_argument("--print-keys", action="store_true", help="打印默认键位 JSON 后退出")
    ap.add_argument("--bg", default="#faf8f4", help="底色（默认暖纸）")
    ap.add_argument("--ink2", default="#4a463c", help="说明文字色")
    ap.add_argument("--ink3", default="#8a857a", help="弱提示文字色")
    ap.add_argument("--cap", default="#ffffff", help="键帽底色")
    ap.add_argument("--cap-line", default="rgba(23,21,15,.14)", help="键帽描边色")
    ap.add_argument("--ink", default="#17150f", help="墨色（默认暖墨）")
    ap.add_argument("--stops", default="#3b5bff,#8b5cf6,#ff6a4d", help="光谱渐变色标，逗号分隔")
    ap.add_argument("--width", type=int, default=1200)
    ap.add_argument("--height", type=int, default=630)
    args = ap.parse_args()

    if args.print_keys:
        print(json.dumps(DEFAULT_KEYS, ensure_ascii=False, indent=2))
        return 0

    keys = DEFAULT_KEYS
    if args.keys:
        with open(args.keys, encoding="utf-8") as f:
            keys = json.load(f)
        for entry in keys:
            assert "group" in entry and "rows" in entry, "每组需含 group 与 rows"
            for row in entry["rows"]:
                assert len(row) == 2 and isinstance(row[0], list), "每行格式为 [[键...], 说明]"

    stops = [s.strip() for s in args.stops.split(",") if s.strip()]
    svg = build_svg(keys, args.title, args.brand, args.site, args.bg, args.ink,
                    stops, args.width, args.height, args.footer,
                    ink2=args.ink2, ink3=args.ink3, cap=args.cap, cap_line=args.cap_line)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"written {args.output} ({len(svg)} bytes, {sum(len(e['rows']) for e in keys)} 键位)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
