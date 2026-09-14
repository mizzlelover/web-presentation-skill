# dist-r9 → dist-r10 发布记录（2026-09-14）

> 本文记录 dist-r9 到 dist-r10 的完整变更，供留档追溯。

---

## 一、发布概要

| 项 | dist-r9 | dist-r10 |
|---|---|---|
| 发布触发 | DIST_R8.md 留档 | **实测验证回灌：runtime 根因修复** |
| 本地 main 基线 | `e8cf8a8` | 本次提交（见下） |
| 发布时间 | 2026-09-13 | 2026-09-14 |
| 变更性质 | docs | **runtime CSS / 渲染器 / 校验器 / 文档 + 视觉基线** |

---

## 二、背景与问题清单

用外部模型（ChatGPT 5.6 terra）实测本 skill 产出 deck（`实测验证/01`，零信任主题 11 幕）。该模型绕开 `render_ir.py` 手写 HTML，暴露以下问题；经两轮「修复→实测→再诊断」在产物侧收敛后，将全部 runtime 级根因回灌主仓。

| # | 问题 | 根因 | 修复 |
|---|---|---|---|
| 1 | 主题字体完全失效（实渲 system-ui） | `presentation.css` 在 `:root` 重声明 `--wp-font-*`，级联反杀主题（**主仓 28 套 benchmark 同病**） | 字体契约根治：runtime 只在使用处带兜底，与加载顺序无关 |
| 2 | 中文标题任意劈开（"放大/的链"） | `max-inline-size: 24ch`——ch 对汉字仅半宽（≈12 字即折行） | `24ch → 24em` + `text-wrap: balance` |
| 3 | steps 内散布灰色小横线残渣；单幕 reveal 23/29 步，按键节奏崩坏 | 手写产物把 `.wpk-link` 塞进 step 内部（契约误读） | 产物修复 + 标记契约文档化 |
| 4 | 5 卡片配 `is-4` 网格 → 4+1 孤儿行 | IR `cols:4` 与 items=5 矛盾，无校验 | 新增 `is-5` + validate_ir 闸门 |
| 5 | pillars 幕 1366×768 溢出 44px，kicker/来源行被裁 | 密集幕 + 来源行两行 + 深潜按钮，短屏余量不足 | 短屏档收紧 matrix/navrow + 来源行收敛 |
| 6 | compare 幕 0 reveal（IR 声明 progressive 却整幕直出） | 渲染器 `r_compare` 未挂 data-reveal | 渲染器补挂 |
| 7 | 深潜按钮被 reveal 扣押，现场无法即点 | `.wpk-navrow` 带 data-reveal | 渲染器摘除 |
| 8 | 来源行 11 幕全量重复（含"用户提供 Claude eBook"生产元信息） | 生成侧纪律缺失 | validate_ir warning + 文档纪律 |
| 9 | kicker 11 幕同一句，无方位信息 | 生成侧纪律缺失 | validate_ir warning + 文档纪律 |
| 10 | 组件正文 11-15px 偏小、编号压线、总览格过宽 | 字号/间距标尺 | 最小字号 +1~1.5px + pretty + step 间距 + 总览 420px |

---

## 三、文件变更清单

| 文件 | 操作 | 变更 |
|---|---|---|
| `runtime/core/presentation.css` | 修改 | 删除 `:root` 字体重声明（契约根治）；使用处带兜底；`24ch→24em` + `text-wrap: balance`；总览格 560→420px |
| `runtime/components/components.css` | 修改 | 新增 `is-5`（含窄屏塌缩）；`.wpk-lead` balance；卡片/步骤/对比/时间线/矩阵/架构正文最小字号上调 + `text-wrap: pretty`；step 顶部间距；短屏档 matrix/navrow 收紧；引用字体兜底；`.wpk-src`/is-dense 字号 |
| `themes/editorial.css` | 修改 | 字体栈补 `Noto Serif SC / Source Han Serif SC` 跨平台降级 |
| `themes/government.css` | 修改 | 标题字体栈补 `Source Han Serif SC` |
| `scripts/render_ir.py` | 修改 | `r_compare` 两列补 `data-reveal`；`.wpk-navrow` 摘除 `data-reveal`（深潜入口即时可点） |
| `scripts/validate_ir.py` | 修改 | 新增闸门：cards.cols×items 一致性（error）；source/kicker 全场同一句（warning） |
| `workflows/render_html.md` | 修改 | 新增「标记契约」节（手写/修复产物判定基准，7 条） |
| `evals/baselines/screens.json` | 修改 | 视觉基线按新渲染刷新（266 幕） |
| `CHANGELOG.md` | 修改 | 新增 [1.0.1] 条目 |
| `DIST_R10.md` | 新增 | 本记录 |

产物侧（`实测验证/01`，不入主仓）：index.html / presentation.ir.json / 三份 CSS 同步修复，实测全绿。

---

## 四、验证状态

| 验证项 | 结果 |
|---|---|
| `validate_ir.py` 对修复前 IR | 负向捕获 3/3（cols error + source/kicker warning） |
| `validate_ir.py` 对修复后 IR | 0 error 0 warning |
| 修复后 IR 经 `render_ir.py` 全管线重渲染 + deck_shots | 11 幕零溢出、零控制台错误 |
| typography-lint（本地，1600×1000） | **28/28 套，266 幕，0 违规** |
| 视觉回归基线 | 47 处预期差异（字体/字号变更）→ 刷新后 **266 幕 0 差异** |
| benchmark 抽查（editorial 衬线 / technology 暗色） | 主题字体首次真实生效，渲染正常 |

---

## 五、orphan 发布链（更新）

```
dist-r4 (64554e7) ─→ dist-r5 (c36a69f) ─→ dist-r6 (f12d31e) ─→ dist-r7 (83212d1) ─→ dist-r8 (00e5833) ─→ dist-r9 (604f451) ─→ dist-r10 (本次)
 V1.0.0-r4           V1.0.0-r5           V1.0.0-r6           V1.0.0-r7           V1.0.0-r8           V1.0.0-r9           V1.0.0-r10
 中文排版整改         keys-card.svg        RELEASE_NOTES.md    CI 工作流            CI 修复              DIST_R8.md          实测验证回灌
 + typography lint   域名替换             留档补发             + DIST_R6.md        Playwright 安装     发布留档            runtime 根因修复
```

---

*记录时间：2026-09-14*
