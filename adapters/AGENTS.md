# AGENTS.md 片段 — Codex / OpenCode 通用适配

> 合并到使用方项目根的 AGENTS.md。

## Web Presentation Skill

本项目安装有 `web-presentation-skill`（HTML 原生智能演示系统）。

- 触发：HTML 演示 / web slides / presentation app / 演示网页 / 网页版汇报 相关任务。
- 入口：先读 `.agents/skills/web-presentation-skill/SKILL.md`，按其工作流执行。
- 强制管线：`Input → Presentation Strategy → Presentation IR (JSON) → Renderer → QA`。禁止直接从输入生成 HTML。
- IR 校验：`python3 .agents/skills/web-presentation-skill/scripts/validate_ir.py <ir.json>` 必须 0 error。
- 参考实现：`runtime/`（零依赖 JS，可直接打包离线运行）；示例：`examples/demo/`。
- 评测：交付前按 `evals/rubric.yaml` 18 维自查，runtime_stability 必须为 5。
- 红线：不假数据、不误导图表、不伪造引用、不滥用 3D/动画（见 `knowledge/anti_patterns/`）。
