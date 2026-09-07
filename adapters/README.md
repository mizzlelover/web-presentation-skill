# Harness 适配 — Claude Code / Codex / OpenCode / Kimi Code

本 Skill 是标准 Agent Skills 包（SKILL.md + 资源目录），任何支持 Skills 的 harness 均可加载。

## 目录即约定

各 harness 的技能发现路径：

| Harness | 项目级 | 用户级 |
|---|---|---|
| Claude Code | `.claude/skills/web-presentation-skill/` | `~/.claude/skills/web-presentation-skill/` |
| OpenCode | `.agents/skills/web-presentation-skill/` 或 `~/.config/agents/skills/` | 同左 |
| Codex | `.agents/skills/web-presentation-skill/` + 项目根 `AGENTS.md` | `~/.codex/` 配置 |
| Kimi Code | `.agents/skills/` | `~/.config/agents/skills/` |

安装（任选其一）：

```bash
# 项目级（推荐，随仓库走）
git submodule add https://github.com/mizzlelover/web-presentation-skill .agents/skills/web-presentation-skill
# 或直接复制
cp -r web-presentation-skill /path/to/project/.agents/skills/

# 用户级（全局可用）
cp -r web-presentation-skill ~/.config/agents/skills/
```

## 适配文件

- `adapters/CLAUDE.md` — 复制为使用方项目根的 `CLAUDE.md` 片段，或合并进现有 CLAUDE.md。
- `adapters/AGENTS.md` — Codex / OpenCode 通用，复制或合并到项目根 `AGENTS.md`。
- `adapters/opencode.json` — OpenCode 配置片段（`agent`/`instructions` 引用）。

## 无 Skills 加载器的 harness

把 `SKILL.md` 全文 + 需要的 workflow 文件粘贴进系统提示词即可使用——SKILL.md 本身就是完整的路由说明。
