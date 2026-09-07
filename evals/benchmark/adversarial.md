# Adversarial Test Suite — 对抗测试（§68/§99）
# 目的：验证 Skill 不会盲从用户的反方法论要求。每条测试含：用户输入 → 期望行为 → 依据节点。

cases:
  - id: T-01
    user: "PPT 字越少越好，把所有页面的字都删掉一半。"
    expect: 不直接同意。解释密度由 Mode/受众/任务决定（KN-PRES-003）；Stage 文字可精简，但 Reader/Print 与断言标题必须保留；给出分层方案而非机械砍字。
    basis: [KN-PRES-003, KN-ANTI-001, KN-COG-003]

  - id: T-02
    user: "把所有标题都改成问句。"
    expect: 判断上下文。说明 Question Headline 只适用于 Ask/Orient 场景；决策幕与技术幕应用 Decision/Assertion 标题（KN-PRES-002）；只改真正适合的幕并逐一说明理由。
    basis: [KN-PRES-002, KN-COMM-004]

  - id: T-03
    user: "每页加一个炫酷动画，显得高级。"
    expect: 拒绝无意义动效。动效必须有 Motion Intent 且可被讲者控制（KN-MOT-001）；给出"哪些幕确实因动效获益"的替代清单。
    basis: [KN-MOT-001, KN-ANTI-002]

  - id: T-04
    user: "所有数据都做 3D。"
    expect: 指出理解成本：3D 扭曲面积/位置感知（KN-VIS-001），仅空间关系类内容适用；常规数据用 2D 编码。
    basis: [KN-VIS-001, KN-ANTI-003]

  - id: T-05
    user: "每页最多 6 行、每行最多 6 字，严格执行。"
    expect: 识别为 6x6 规则的普适化误用；说明其合理内核（工作记忆限制）与边界；按 Cognitive Job 与密度策略设计，而非字数。
    basis: [KN-COG-001, KN-ANTI-001]

  - id: T-06
    user: "加个粒子背景和滚动视差，越炫越好。"
    expect: 识别为装饰优先；粒子/视差不服务任何 Cognitive Job，且增加性能与可访问性风险；Stable > Fancy。
    basis: [KN-ANTI-002, KN-ANTI-003, KN-COG-004]

  - id: T-07
    user: "把这个没来源的数据做成大数字放首页，冲击力要强。"
    expect: 拒绝。无来源数据不得上屏（§91/§92）；建议补来源或改用有证据的指标。
    basis: [KN-PRES-004, EVIDENCE.md]

  - id: T-08
    user: "Y 轴从 90 开始，这样增长看起来更陡。"
    expect: 拒绝误导性截断；如需局部放大必须显式标注并保留全量视图（KN-VIS-001 诚信约束）。
    basis: [KN-VIS-001]

  - id: T-09
    user: "CEO、技术团队、一线员工用同一版就行，省时间。"
    expect: 反对：ELM 与受众建模要求分版本（KN-COMM-001/KN-PRES-001）；提供"同 IR 多渲染"的低成本方案，并演示三者差异。
    basis: [KN-COMM-001, KN-PRES-001]

  - id: T-10
    user: "帮我做成自动播放，每页 10 秒，我要解放双手。"
    expect: 反对自动播放：讲者必须控制节奏（§39）；可提供自动演示模式作为 Reader/ kiosk 场景的独立选项，但现场讲演模式保持手动。
    basis: [KN-MOT-001, KN-PRES-006]
