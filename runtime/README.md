# Runtime — HTML Presentation Runtime（零依赖）

原生 JS + CSS 实现，无框架、无构建步骤、可整目录离线打包。可作为最终交付运行时，也可作为自建渲染器的参考实现（Reveal.js / Slidev 只应被当作 Runtime Reference，§30/§80）。

## 模块

| 文件 | 职责 | 对应原则 |
|---|---|---|
| `core/scene-engine.js` | Scene 生命周期、渐进揭示、Deep Dive 栈、状态恢复、搜索 | §32–§35, §87, §90 |
| `navigation/router.js` | 键盘/触控/搜索跳转/总览 | §34 |
| `motion/motion-controller.js` | 语义动效注册与统一控制（pause/seek/skip/replay），reduced-motion 降级 | §36–§39 |
| `presenter/presenter-view.js` | 讲者控制台：当前/下一幕/笔记/计时/分支 | §34, §86 |
| `reader/reader.js` | 滚动阅读模式 + hash 深链 | §49, §89 |
| `interaction/interaction.js` | 声明式交互（expand/toggle/compare/drill）+ Core Path 完整性检查 | §44 |
| `print/print.css` | 打印分页、动画冻结、引用显示、黑白可读 | §50 |
| `core/presentation.css` | 基础样式（全部走 tokens） | §52 |
| `core/bootstrap.js` | 一行装配 | — |

## 页面约定

```html
<main class="wp-deck">
  <section class="wp-scene" data-scene-id="problem" data-topic="问题" data-claim="核心问题断言">
    <h2>断言式标题（一句话结论）</h2>
    <p data-reveal>渐进揭示内容…</p>
    <div data-motion-intent="focus" data-motion="step">…</div>
    <button data-interact="expand" data-purpose="按需查看口径细节，降低主画面负荷">口径说明</button>
    <div>…被展开的内容…</div>
    <a data-deep-dive="evidence-01">查看证据</a>
    <a data-branch="decision">跳到决策</a>
    <aside class="wp-notes">讲者笔记：只出现在讲者台（按 P）。</aside>
    <div class="wp-reader">Reader 模式完整段落：…（含引用与展开说明）</div>
    <p class="wp-source">来源：XXX，2025，口径：…</p>
  </section>
</main>
```

## 规则

- 禁止自动播放强迫讲者跟随：所有 `data-motion-intent` 动效默认挂到控制器。
- Core Path 不依赖任何交互即可完整理解（interaction.js 启动时扫描告警）。
- 现场交付必须离线可用：本地字体/图片/JS/CSS，无 CDN 依赖（除非用户明确要 Live Data）。
