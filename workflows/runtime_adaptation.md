# Workflow: Runtime Adaptation — 现场动态调整

## 触发
现场反馈信号：时间不足、决策者提前表态、质疑出现、受众走神、技术故障。

## 预案（制作期必须预埋）
| 信号 | 动作 | 依赖的制作期设计 |
|---|---|---|
| 时间砍半 | 跳到 Executive Summary 路径 | core_path / optional_paths 分离 |
| 决策者问"所以呢" | 跳 Decision 幕 | Decision Headline + 显式 Decision 幕 |
| 质疑某数据 | 打开对应 evidence_scene | evidence_appendix 挂载 |
| 提出异议 | 走 objection_handling 分支 | 预埋异议分支 |
| 受众走神 | 跳 Story/Case 幕或互动幕 | 负荷曲线中的缓冲幕 |
| 网络断 | 切换离线数据快照 | offline bundle + 静态快照 |

## 讲者控制台（runtime/presenter/）
- 当前幕 / 下一幕预览 / Speaker Notes / 计时器
- 搜索跳转（keyword/topic/claim/evidence，§87）
- 分支按钮（本幕定义的 branch_targets）
- Deep Dive 进入与 Return（状态恢复，§90）

## 规则
- 所有跳转后必须能 Return 到原位置。
- 自动播放被禁止：讲者永远控制节奏（动效可 pause/skip/seek）。
