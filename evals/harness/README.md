# evals/harness — 跨引擎运行时验证 harness

补丁 §23/§27/§30/§31/§33/§34/§39/§40/§58/§59 的可复现验证入口。
**dev-only**：Playwright 仅用于把真实浏览器内核拉起来做验证，不属于交付运行时依赖（运行时本身仍是零依赖）。

## 安装与运行

```bash
cd evals/harness
npm install                 # 安装 playwright（dev）
npx playwright install chromium webkit firefox
# 需先起一个本地静态服务（仓库根）
python3 -m http.server 8765 --bind 127.0.0.1
# 回到仓库根之后：
cd ../..
WP_BASE=http://127.0.0.1:8765/wenzhi/examples/demo/index.html \
  node wenzhi/evals/harness/runtime_verify.cjs
```

也可复用外部 Playwright 安装：`NODE_PATH=/path/to/node_modules node runtime_verify.cjs`。

## 脚本

| 脚本 | 覆盖 | 产物 |
|---|---|---|
| `runtime_verify.cjs` | §32 初始态 / §34 键盘导航·搜索·总览 / §49 Reader 开关 / §39 静帧 / §23 讲者台弹窗·计时·笔记 / §25 深潜返回状态恢复 / §50 打印全展开 / §31 性能（FCP·堆·FPS）/ §30·§33 三档分辨率·零溢出 / §34 reduced-motion | `_artifacts/runtime_verify.json` + 截图 |
| `content_stress.cjs` | §39/§40 中文标题压力（短/26字/31字/机构全称/中英混排/中文数字标点）× 两档分辨率，横向溢出检测；§27 Reader 清单（全展开·来源·展开控件·移动端） | `_artifacts/content_stress.json` + 移动端 Reader 截图 |

## 环境变量

- `WP_BASE` — demo 页面 URL
- `WP_OUT` — 产物目录（默认 `./_artifacts`，已 gitignore）
- `WP_ENGINES` — 逗号分隔，限定引擎（如 `chromium,webkit`）
- `WP_ENGINE_TIMEOUT` — 单引擎超时毫秒（默认 150000）

## 已知环境限制

- **Firefox**：Playwright Firefox 可 `launch()`，但本机沙箱内 `browser.newPage()` 挂起（内容进程创建被阻断），故 Firefox 引擎暂未验证。补丁 §30 中 Firefox 属「有条件增加」。
- **Safari.app**：`safaridriver` 需在 Safari → 设置 → 开发者 勾选「允许远程自动化」；`osascript` 控制 Safari 亦需「自动化」隐私授权。两者均为需人工授权的系统开关。当前以 Playwright **WebKit 26.6**（与 Safari 26.5.2 同代内核）作为 WebKit 引擎证据；真机 Safari 实测待授权后补。
