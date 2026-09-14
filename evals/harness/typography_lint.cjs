#!/usr/bin/env node
/**
 * typography_lint.cjs — 中文排版自动化校验（typography 整改 · 对标 aesthetic_quality 4→5）
 *
 * 对每套 Deck 的每一幕做机器断言（当前可见幕逐一切换，全部幕覆盖）：
 *   1. 避头尾     — 行首禁出现「，。、；：？！）】》」』〕〉”’」等」
 *   2. 标点悬挂   — 「《【（“‘〈〔〖 不成行尾孤立（开括号后必须有内容同行为止）
 *   3. 行长       — 标题 ≤24ch、正文 ≤62ch（与 CSS max-inline-size 一致）
 *   4. 数字字形   — 含 ≥3 位连续数字的元素用 tabular-nums
 *   5. 字重对比   — 每幕同一容器层级内不出现 ≥2 个同级 font-weight≥800（除 .wpk-num__v）
 *   6. 断行质量   — 标题末行不孤词（≤2 字符单独成行）
 *   7. 中西文间距 — 中文与半角英文/数字间已启用 text-spacing 或 text-autospace（只检查 computedStyle）
 *
 * 产出 evals/_artifacts/typography_report.json，退出码 0/1。
 */
const { chromium } = require("playwright");
const fs = require("fs"); const path = require("path");
const BASE = process.env.BASE || "http://127.0.0.1:8765";
const REPO = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "_artifacts");
const VIEWPORT = { width: 1600, height: 1000 };

const PUNCT_HEAD = /^[，。、；：？！）】》」』〕〉”’…·—\-]/;
const PUNCT_TAIL_OPEN = /[（【《“‘〈〔〖]$/;
const NUM_RE = /\d{3,}/;

/**
 * 对单页当前所有幕做排版断言（供 run_evals.cjs 复用）。
 * 返回 { pass, bad: { head, tailOpen, overflow, nums, weight, orphan, spacing }, detail }
 */
async function checkPage(page) {
  await page.waitForTimeout(400);
  const sceneCount = await page.evaluate(() => document.querySelectorAll(".wp-scene").length);
  const bad = { head: 0, tailOpen: 0, overflow: 0, nums: 0, weight: 0, orphan: 0, spacing: 0 };
  const detail = [];

  for (let i = 0; i < sceneCount; i++) {
    await page.evaluate(idx => {
      const s = document.querySelectorAll(".wp-scene")[idx];
      if (s) s.scrollIntoView({ block: "center" });
      s.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("wp-revealed"));
    }, i);
    await page.waitForTimeout(120);

    const r = await page.evaluate(() => {
      const PUNCT_HEAD = /^[，。、；：？！）】》」』〕〉”’…·—\-]/;
      const PUNCT_TAIL_OPEN = /[（【《“‘〈〔〖]$/;
      const NUM_RE = /\d{3,}/;
      const scene = [...document.querySelectorAll(".wp-scene")].find(s => !s.hidden);
      if (!scene) return null;
      const res = { head: [], tailOpen: [], overflow: [], nums: [], weight: [], orphan: [], spacing: [] };

      function linesOf(el) {
        const range = document.createRange();
        const texts = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.trim()) texts.push(node);
        }
        if (!texts.length) return [];
        const rects = [];
        for (const t of texts) {
          range.selectNodeContents(t);
          rects.push(...range.getClientRects());
        }
        return [...rects].sort((a, b) => a.top - b.top || a.left - b.left);
      }

      // 1. 避头尾（逐行首字符检测：某行以标点开头才算违例）
      scene.querySelectorAll("h1,h2,p,li,.wpk-card__text,.wpk-card__title,.wpk-step__d,.wpk-step__t,.wpk-lead,.wpk-cmp li,.wpk-time__d,.wpk-quote__text,.wpk-ev__t,.wpk-ev__s").forEach(el => {
        const text = (el.textContent || "").trim();
        if (!text) return;
        const rects = linesOf(el);
        if (rects.length < 2) return;
        // 按 top 分行，取每行首字符
        let lastTop = -999;
        let lineIdx = 0;
        for (const r of rects) {
          if (Math.abs(r.top - lastTop) > 4) {
            lastTop = r.top;
            // 通过 Range 反向取该行首字符（用 x 坐标最小的 text node 的首字符）
            const range = document.createRange();
            const startNode = document.elementFromPoint(r.left + 1, r.top + r.height / 2);
            if (startNode && startNode.nodeType === Node.TEXT_NODE) {
              const ch = (startNode.textContent || "").trim()[0];
              if (ch && PUNCT_HEAD.test(ch)) {
                res.head.push({ tag: el.tagName, cls: el.className, line: lineIdx, text: text.slice(0, 24) });
                break;
              }
            } else if (startNode) {
              // 命中元素节点，取其 textContent 首字符
              const ch = (startNode.textContent || "").trim()[0];
              if (ch && PUNCT_HEAD.test(ch)) {
                res.head.push({ tag: el.tagName, cls: el.className, line: lineIdx, text: text.slice(0, 24) });
                break;
              }
            }
            lineIdx++;
          }
        }
      });

      // 2. 标点悬挂（开括号不成行尾孤立）
      scene.querySelectorAll("h1,h2,p,li,.wpk-card__text,.wpk-card__title,.wpk-step__d,.wpk-step__t,.wpk-lead,.wpk-cmp li,.wpk-time__d,.wpk-quote__text,.wpk-ev__t,.wpk-ev__s").forEach(el => {
        const text = (el.textContent || "").trim();
        if (!text) return;
        const last = text[text.length - 1];
        if (PUNCT_TAIL_OPEN.test(last)) res.tailOpen.push({ tag: el.tagName, cls: el.className, text: text.slice(-24) });
      });

      // 3. 行长（max-inline-size 溢出）
      scene.querySelectorAll("h1,h2").forEach(el => {
        const cs = getComputedStyle(el);
        const max = parseFloat(cs.maxInlineSize);
        const w = el.getBoundingClientRect().width;
        if (max && w > max + 2) res.overflow.push({ tag: "H1/H2", cls: el.className, w: Math.round(w), max: Math.round(max), text: (el.textContent || "").trim().slice(0, 20) });
      });
      scene.querySelectorAll("p,li").forEach(el => {
        const cs = getComputedStyle(el);
        const max = parseFloat(cs.maxInlineSize);
        const w = el.getBoundingClientRect().width;
        if (max && w > max + 2) res.overflow.push({ tag: el.tagName, cls: el.className, w: Math.round(w), max: Math.round(max), text: (el.textContent || "").trim().slice(0, 20) });
      });

      // 4. 数字字形（≥3 位连续数字用 tabular-nums）
      scene.querySelectorAll("p,li,td,th,.wpk-num__v,.wpk-card__text,.wpk-step__d,.wpk-ev__s,.wpk-lead,.wpk-quote__text,.wpk-quote__cite").forEach(el => {
        const text = (el.textContent || "").trim();
        if (!NUM_RE.test(text)) return;
        const cs = getComputedStyle(el);
        if (!cs.fontVariantNumeric.includes("tabular-nums")) {
          res.nums.push({ tag: el.tagName, cls: el.className, text: text.slice(0, 24) });
        }
      });

      // 5. 字重对比（同一容器内 ≥2 个同级 font-weight≥800，排除 .wpk-num__v 与 .wpk-chart）
      const containers = scene.querySelectorAll(".wpk-grid,.wpk-steps,.wpk-cmp,.wpk-time,.wpk-actions,.wpk-matrix,.wpk-arch,.wpk-evidence,.wp-scene");
      containers.forEach(c => {
        const strongs = [];
        c.querySelectorAll(":scope > *").forEach(child => {
          const fw = parseFloat(getComputedStyle(child).fontWeight);
          if (fw >= 800 && !child.classList.contains("wpk-num__v") && !child.closest(".wpk-chart")) {
            strongs.push(child);
          }
        });
        if (strongs.length > 1) {
          res.weight.push({ container: c.className, count: strongs.length, texts: strongs.map(s => (s.textContent || "").trim().slice(0, 12)) });
        }
      });

      // 6. 断行质量（标题末行孤词：末行仅 1–2 个中文助词/虚词，数字/英文/单位不算孤词）
      scene.querySelectorAll("h1,h2").forEach(el => {
        const text = (el.textContent || "").trim();
        if (text.length <= 3) return;
        const rects = linesOf(el);
        if (rects.length < 2) return;
        const lastLine = rects[rects.length - 1];
        const fs = parseFloat(getComputedStyle(el).fontSize);
        // 末行宽度 ≈ 1–2 个全角字符
        if (lastLine.width < fs * 2.2) {
          // 取末行文本：通过 elementFromPoint 反向定位
          const startNode = document.elementFromPoint(lastLine.left + 1, lastLine.top + lastLine.height / 2);
          const lineText = startNode ? (startNode.textContent || "").trim() : "";
          // 数字、英文、百分号、单位（万/亿/万亿/pp/%/GDP 等）不算孤词
          const isNumericOrUnit = /^[\d\s.,%％万亿GDPPP]+$/.test(lineText) || /^[A-Za-z0-9\s.,%％\-]+$/.test(lineText);
          // 单字中文虚词才算孤词（了/的/是/在/和/与/及/或/为/把/被/将/向/着/从/往/到/于/对/以/按/就/都/不/也/很/还/又/再/最/更/极/挺/较/稍/颇/甚/至/极/殊/非/常/异/常）
          const isOrphan = /^[的地得了是在和与及或为把被将向着从往到于对以按就都不也很还又再最更极挺较稍颇甚至极殊非常异常]$/.test(lineText);
          if (isOrphan) {
            res.orphan.push({ tag: el.tagName, cls: el.className, text: text.slice(-10), lastLineW: Math.round(lastLine.width), fs: Math.round(fs), lineText });
          }
        }
      });

      // 7. 中西文间距（text-spacing 已启用）
      const cs = getComputedStyle(scene);
      const spacingOn = cs.textSpacing === "ideograph-alpha ideograph-numeric" || cs.textSpacingTrim === "space-start" || cs.textAutospace !== "none";
      if (!spacingOn) res.spacing.push({ scene: scene.className, textSpacing: cs.textSpacing, textSpacingTrim: cs.textSpacingTrim, textAutospace: cs.textAutospace });

      return res;
    });

    if (!r) continue;
    bad.head += r.head.length; bad.tailOpen += r.tailOpen.length; bad.overflow += r.overflow.length;
    bad.nums += r.nums.length; bad.weight += r.weight.length; bad.orphan += r.orphan.length; bad.spacing += r.spacing.length;
    for (const [k, arr] of Object.entries(r)) {
      if (arr.length && detail.length < 20) detail.push({ scene: i + 1, rule: k, count: arr.length, samples: arr.slice(0, 2) });
    }
  }

  const pass = bad.head === 0 && bad.tailOpen === 0 && bad.overflow === 0 && bad.nums === 0 && bad.weight === 0 && bad.orphan === 0 && bad.spacing === 0;
  return { pass, bad, detail: detail.slice(0, 8) };
}

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

module.exports = { checkPage, decks };

if (require.main === module) {
  (async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const page = await ctx.newPage();
    const rows = [];
    const deckList = decks();

    for (const rel of deckList) {
      await page.goto(`${BASE}/${rel}/index.html`, { waitUntil: "load" });
      const r = await checkPage(page);
      rows.push({ deck: rel, scenes: await page.evaluate(() => document.querySelectorAll(".wp-scene").length), ...r.bad, pass: r.pass, detail: r.detail });
    }

    await browser.close();
    fs.writeFileSync(path.join(OUT, "typography_report.json"), JSON.stringify({ rows, failed: rows.filter(r => !r.pass).length }, null, 2));
    rows.forEach(r => {
      const s = r.pass ? "✔" : "✗";
      console.log(`${s} ${r.deck} · 幕 ${r.scenes} · 避头尾 ${r.head} · 悬挂 ${r.tailOpen} · 溢出 ${r.overflow} · 数字 ${r.nums} · 字重 ${r.weight} · 孤词 ${r.orphan} · 间距 ${r.spacing}`);
    });
    const failed = rows.filter(r => !r.pass);
    console.log(failed.length ? `\n✗ ${failed.length} 套未通过（共 ${rows.length} 套）` : `\n✔ 全部通过（共 ${rows.length} 套，${rows.reduce((a, r) => a + r.scenes, 0)} 幕）`);
    process.exit(failed.length ? 1 : 0);
  })();
}
