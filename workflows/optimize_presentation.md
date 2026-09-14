# Workflow: Optimize Presentation — 诊断优化已有演示

## 输入
已有 HTML Presentation（或 PPT 导出的 HTML / 截图 / 结构描述）。

## 步骤
1. **逆向 IR**：把现有演示反解成 IR：每幕的 cognitive_job / headline 类型 / 密度 / 负荷 / render_level。缺失字段标"未定义"。
2. **策略对照**：向用户确认（或推断并标注）原演示的情境/受众/目标，对照 KN-PRES-005 找错配。
3. **诊断清单**：
   - 论证：六查（Unsupported Claim / Logical Gap / …）
   - 认知：负荷曲线是否连续 HIGH；Redundancy/Coherence 违反
   - 标题：是否全是 Topic Headline（弱）或滥用 Question
   - 密度：Mode 错配（拿 Reader 密度去演讲 / 拿 Stage 密度做留存）
   - 动效：无 Intent 动效清单；不可控动效清单
   - 技术：CDN 依赖 / 绝对定位 / 无 reduced-motion / 无打印态 / 无离线
   - 诚信：截断轴 / 无来源图表 / 3D 扭曲
4. **优先级排序**：按"对沟通目标的损害 × 修复成本"排序，P0 先修。
5. **重构而非贴纸**：结构性问题回到 IR 层修，禁止只在 HTML 上打补丁。

## 输出
- 诊断报告（问题 × 依据知识节点 × 严重度 × 修复建议）
- 修复后的 IR 与重新渲染的演示

## 对抗性
用户若坚持"我就要每页动画/全部 3D"，按 KN-ANTI-001/002/003 给出机制层面的反对理由与替代方案；用户知情后仍坚持，执行但记录决策。
