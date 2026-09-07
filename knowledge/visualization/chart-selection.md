# KN-VIS-001 · Chart Selection by Cognitive Job · 按认知任务选图

- knowledge_type: presentation_principle
- evidence_grade: B
- source_ids: [SRC-CLEVELAND-1984, SRC-FEW-2004, SRC-ABELA-2008, SRC-WARE-2012]
- last_reviewed: 2026-09

## Core claim
禁止"因为有数据所以画图"。先定 Cognitive Job，再选图形。

## 认知任务 → 图形映射
| Cognitive Job | 首选图形 | 避免 |
|---|---|---|
| Comparison | 条形图（bar，长度编码） | 饼图（角度/面积编码精度差） |
| Trend | 折线图 | 堆积面积图（多序列时基线漂移） |
| Distribution | 直方图/箱线图 | 均值柱状图（掩盖分布） |
| Relationship | 散点图 | 双轴折线（伪相关诱惑） |
| Composition | 堆叠条形/树图 | 多于 5 类的饼图 |
| Ranking | 排序条形图 | 无序类别轴 |
| Deviation | 偏差条/哑铃图 | 绝对值对比（掩盖基准） |
| Flow | 桑基图/漏斗 | 箭头连线图（无量纲） |
| Network | 力导向图（谨慎） | 3D 网络球 |
| Geography | 分级统计地图（choropleth） | 地图上堆饼图 |

## 感知基础（Cleveland & McGill 排序）
位置 > 共同标尺长度 > 角度/斜率 > 面积 > 体积/颜色饱和度。能用位置/长度编码就不用面积/颜色。

## 诚信约束（§92）
每张图必须保留 source / unit / time / scope；禁止截断 Y 轴制造夸张（除非显式标注且服务真实认知任务）；禁止 3D 装饰性图表（面积透视扭曲）。

## Related nodes
KN-VIS-002、KN-PRES-004
