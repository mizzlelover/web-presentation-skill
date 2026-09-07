# CLAUDE.md 片段 — 在使用方项目中启用 web-presentation-skill

> 把本文件内容合并到项目根 CLAUDE.md（或 `.claude/skills/web-presentation-skill/` 安装后自动发现 SKILL.md）。

## 演示任务规程

当任务涉及 HTML 演示 / 网页版 PPT / 演示应用时，启用 `web-presentation-skill`：

1. 读取 `.claude/skills/web-presentation-skill/SKILL.md` 并严格遵循其六步流程：Situation → Strategy → Argument Map → Scene Plan → Presentation IR → Render → QA。
2. **禁止** Input → HTML 一步生成；必须先产出 Strategy 与 IR（`presentation.ir.json`），并用 `python3 .claude/skills/web-presentation-skill/scripts/validate_ir.py` 校验。
3. 用户的经验性要求（"字越少越好""标题都用问句"等）必须登记为 Practitioner Hypothesis 处理，不得直接当规则执行。
4. 交付前必须完成 Runtime QA（断网、键盘、打印预览、零 JS 报错）。
5. 伦理红线：无来源数据不上屏、不截断坐标轴误导、不伪造引用。
