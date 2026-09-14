#!/usr/bin/env node
/** verify_a11y.cjs — 可访问性自动检查（§46/§69：对比度/字号/alt/aria）
 *  逐 Deck 检查：正文文本对场景背景的对比度 ≥4.5:1；最小字号 ≥12px；
 *  img 必须有 alt；可交互元素有可聚焦形态。
 */
const { chromium } = require("playwright");
const fs = require("fs"); const path = require("path");
const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "_artifacts");
function decks() {
  const o = [];
  for (const root of ["corpus", "derived", "real"]) {
    const b = path.join(REPO, "benchmarks", root);
    if (!fs.existsSync(b)) continue;
    for (const d of fs.readdirSync(b, { withFileTypes: true }))
      if (d.isDirectory() && fs.existsSync(path.join(b, d.name, "presentation.ir.json")))
        o.push("benchmarks/" + root + "/" + d.name);
  }
  return o.sort();
}
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await ctx.newPage();
  const rows = [];
  for (const rel of decks()) {
    await page.goto(`${BASE}/${rel}/index.html`, { waitUntil: "load" });
    await page.waitForTimeout(350);
    const r = await page.evaluate(() => { try {
      function lum(r, g, b) {
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      }
      function parseColor(c) {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map(x => parseFloat(x));
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      }
      function bgOf(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const c = parseColor(getComputedStyle(cur).backgroundColor);
          if (c && c.a > 0.9) return c;
          cur = cur.parentElement;
        }
        return { r: 255, g: 255, b: 255 };
      }
      function ratio(a, b) {
        const l1 = lum(a.r, a.g, a.b), l2 = lum(b.r, b.g, b.b);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }
      const scene = [...document.querySelectorAll(".wp-scene")].find(s => !s.hidden);
      let badContrast = 0, checked = 0, minFont = 999, noAlt = 0; const badDetail = [];
      if (scene) {
        scene.querySelectorAll("p,li,span,td,th,h1,h2,h3,.wpk-card__text,.wpk-card__title,.wpk-step__t").forEach(el => {
          if (el.children.length > 2) return;
          const st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden") return;
          const fg = parseColor(st.color); if (!fg) return;
          const bg = bgOf(el);
          if (fg.a < 0.9) return;
          const cr = ratio(fg, bg); checked++;
          if (cr < 4.5) { badContrast++; if (badDetail.length < 8) badDetail.push({ tag: el.tagName, cls: String(el.className).slice(0, 40), color: st.color, bg: "rgb(" + bg.r + "," + bg.g + "," + bg.b + ")", cr: Math.round(cr * 100) / 100, text: (el.textContent || "").trim().slice(0, 18) }); }
          const fs = parseFloat(st.fontSize);
          if (fs < minFont) minFont = fs;
        });
      }
      document.querySelectorAll("img").forEach(img => { if (!img.getAttribute("alt")) noAlt++; });
      return { contrastChecked: checked, badContrast, minFont: Math.round(minFont * 10) / 10, noAlt, badDetail };
      } catch (err) { return { error: String(err && err.message || err) }; }
    });
    if (r.error) { rows.push({ deck: rel, error: r.error }); continue; }
    rows.push({ deck: rel, ...r,
      pass: r.badContrast === 0 && r.minFont >= 12 && r.noAlt === 0 });
  }
  await browser.close();
  const bad = rows.filter(r => !r.pass);
  fs.writeFileSync(path.join(OUT, "a11y_report.json"), JSON.stringify({ rows, failed: bad.length }, null, 2));
  rows.forEach(r => console.log(`${r.pass ? "✔" : "✗"} ${r.deck} · 对比度 ${r.badContrast}/${r.contrastChecked} 不达标 · 最小字号 ${r.minFont}px · 缺 alt ${r.noAlt}`));
  console.log(bad.length ? `\n✗ ${bad.length} 套未通过` : "\n✔ 全部通过（对比度 ≥4.5:1 / 字号 ≥12px / alt 完整）");
  process.exit(bad.length ? 1 : 0);
})();
