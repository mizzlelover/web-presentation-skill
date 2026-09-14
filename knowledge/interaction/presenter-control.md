# KN-INT-003 · Presenter Control Patterns · 讲者控制模式

- knowledge_type: engineering_mechanism
- evidence_grade: engineering
- rule_status: strong_principle（工程）
- verification: engineering_validated   # 全部模式在 Chromium + WebKit 实测；真机 Safari 待授权
- evidence_package: audits/CAPABILITY_VERIFICATION.md（CAP-PRESENTER / CAP-BRANCH-NAV / CAP-SEARCH）
- source_ids: [SRC-REVEALJS-DOC, SRC-GALLO-2010]
- last_reviewed: 2026-09-11

## 已验证条目（工程实测）
2026-09-11 实测（deck01，18 幕）：讲者台从独立窗口可直接控制主画面——推进（下一步）、
回退（含揭示步回退）、总览开关、静帧开关、回到首页，全部生效且主画面状态正确同步；
主窗口换幕时讲者台自动刷新。此前讲者台只能"看"不能"控"，属单向往返，已闭合。

## Definition
讲者控制 = 讲者台能做的所有事：看（当前/下一幕/笔记/计时）+ 控（导航/跳转/静帧/总览）+ 救（分支深潜返回）。

## Core claim
讲者台是驾驶舱不是副屏；能看不能控的讲者台会让讲者回到键盘，等于没有讲者台。

## Mechanism
（工程解释）现场讲者的手通常不在键盘上（持翻页笔/激光笔/手势）；控制入口必须集中在讲者台，
且按钮语义要能在 0.5 秒内被理解。

## Boundary conditions
- 双屏场景要求主画面与讲者台状态强同步（本实现经 onSceneChange 钩子）。
- 单屏场景（无第二显示器）讲者台不可用，键盘路径必须完整保留。

## Common misinterpretations
- ❌ "讲者台 = 笔记本第二屏"——它还可以是手机/平板（本系统为独立窗口，天然支持）。
- ❌ "有了翻页笔就不需要"——翻页笔只能推进，不能跳段/深潜/静帧。

## Presentation implications
讲者台五键（◀/▶/总览/静帧/首页）+ 分支跳转列表 + 计时器；配合运行时的
skip/deepDive/branchTo/returnFromDive 构成完整的现场适应性（§56 五剧本全部实测）。

## Related nodes
KN-INT-002 交互成本、KN-PRES-012 现场故障预案、KN-PRES-011 结构路标
