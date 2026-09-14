# KN-ANTI-006 · False Precision · 伪精确反模式

- knowledge_type: anti_pattern
- evidence_grade: B-
- rule_status: anti_pattern
- verification: memory_based   # SRC-CAIRO-2016《The Truthful Art》已登记未全文精读；与图表诚信条款联动
- evidence_package: （无——伦理规范层）
- source_ids: [SRC-CAIRO-2016, SRC-TUFTE-1983, SRC-FEW-2004]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
"呈现超出测量精度的数字会误导受众对确定性的判断"——Cairo 在《The Truthful Art》中
系统论述（不确定性可视化），文献已登记未全文精读。与图表诚信（KN-VIS-003）同属伦理规范层。

## Definition
给出小数点后两位的"精确"数字，而其测量/估算的误差远大于该精度——制造不存在的确定性。

## Core claim
数字的有效位数必须与证据强度匹配；"约 300 万"比"3,184,729 元"更诚实，如果前者才是真实精度。

## Mechanism
（实践解释）受众把数字的精度当作信心的代理：小数点越多，越少质疑。这使伪精确成为
最隐蔽的误导形式——它不需要任何假数据。

## Boundary conditions
- 财务/法务语境有既定精度规范（如"万元"取整），遵循规范优先。
- 需要精确复现的场景（合同金额）不受此限。

## Common misinterpretations
- ❌ "精确 = 专业"——超出证据的精确是不专业。
- ❌ "加个'约'字就够了"——"约"必须与呈现的有效位数一致。

## Presentation implications
corpus/02（政府项目）的概算全部取整到万元并注明"约"；corpus/07（研究）的比值给出
有效位数并单独列"限定条件"幕。图表 caption 强制交代口径（R-CHART-CAPTION-REQUIRED）。

## Related nodes
KN-VIS-003 图表诚信、KN-COM-006 来源可信度、KN-ANTI-005 数据倾倒
