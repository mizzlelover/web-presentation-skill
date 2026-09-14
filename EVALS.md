# EVALS — 评测体系

## 组成

| 文件 | 内容 |
|---|---|
| `evals/rubric.yaml` | 18 维评分标准（每维 1–5 分，q5/q1 锚点） |
| `evals/benchmark/cases.yaml` | 100+ 测试案例登记（15 Executive / 10 Government / 10 Project / 10 Sales / 10 Pitch / 10 Teaching / 10 Technical / 10 Data / 5 Research / 5 Story / 5 Reader） |
| `evals/benchmark/adversarial.md` | 对抗测试 T-01~T-10（验证不盲从反方法论要求） |
| `evals/regression/` | 回归用例（IR 校验规则回归 + 运行时功能回归） |
| `evals/visual/` | 核心 Scene 截图基线（视觉回归 §71） |

## 交付门槛

- `scripts/validate_ir.py` → 0 error。
- Runtime QA 全绿：JS 零报错 / 键盘全程 / 分支与深潜返回 / 断网加载 / 打印预览。
- 视觉 QA 无 P0：overflow / contrast / font-size / cropping / overlap。
- 18 维评分：全部 ≥3，`runtime_stability` = 5。
- 浏览器：Chromium + Safari 实测。

## 验收套件（§95–§99）

1. **ACC-AUDIENCE**：同材料三受众（CEO/技术/一线）产出明显不同的演示。
2. **ACC-RUNTIME**：静态/渐进/动画因果/交互数据/Deep Dive/3D 各一幕并附 rationale。
3. **ACC-ADVERSARIAL**：T-01~T-10 全部按期望行为响应。

## 视觉回归（§71）

核心 Scene 截图存 `evals/visual/baseline/`；修改后用同视口截图对比 layout shift / overflow / 意外视觉变化。建议工具：Playwright 或 Chrome headless `--screenshot`。
