# 视觉回归基线

为核心 Scene 保存同视口截图（建议 1920×1080 与 1280×720 两档）：

```bash
chrome --headless=new --screenshot=baseline/opening.png --window-size=1920,1080 \
  "file:///path/to/dist/index.html#/opening"
```

修改后重截同 URL 对比：layout shift / overflow / 意外视觉变化。
基线图片不进 Git LFS，命名规则：`<scene-id>_<viewport>.png`。
