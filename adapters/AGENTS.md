# AGENTS.md 片段 — Codex / OpenCode 通用适配

> 合并到使用方项目根的 AGENTS.md。

## Web Presentation Skill

本项目安装有 `wenzhi`（HTML 原生智能演示系统）。

- 触发：HTML 演示 / web slides / presentation app / 演示网页 / 网页版汇报 相关任务。
- 入口：先读 `.agents/skills/wenzhi/SKILL.md`，按其工作流执行。
- **Briefing Gate（先于一切生成动作）**：用户请求未同时满足「五问答案齐备」（给谁看/什么场合/多长时间/要达成什么/材料与红线）或「明示跳过访谈」时，第一动作必须是向用户提问；禁止在访谈完成前产出 Strategy / IR / HTML。用户明示跳过时，IR 的 `presentation.briefing.source` 写 `user_opt_out` 并显式标注全部假设字段。仅缺一两问时只追问缺项。
- 强制管线：`Input → Presentation Strategy → Presentation IR (JSON) → Renderer → QA`。禁止直接从输入生成 HTML。
- IR 校验：`python3 .agents/skills/wenzhi/scripts/validate_ir.py <ir.json>` 必须 0 error。
- 参考实现：`runtime/`（零依赖 JS，可直接打包离线运行）；示例：`examples/demo/`。
- 评测：交付前按 `evals/rubric.yaml` 18 维自查，runtime_stability 必须为 5。
- 红线：不假数据、不误导图表、不伪造引用、不滥用 3D/动画（见 `knowledge/anti_patterns/`）。
