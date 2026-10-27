# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/prototype`
- adaptation-version: `2`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留原型回答具体问题、UI 结构变体和逻辑边界场景。`references/ui.md`、`logic.md` 分别适配上游 `UI.md`、`LOGIC.md`；`feasibility.md` 是本地新增分支。按主张决定测试/测量，不限定 HTML，不自动提交、推送或推广到生产；UI 参考增加生产构建隔离要求。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 仅增加逐包来源记录，执行方法未变。运行不依赖源码缓存。