# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/prototype`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留上游按问题选择 UI/logic 分支、throwaway、免安装运行、展示完整状态和捕获 primary source 的核心方法。`references/ui.md`、`logic.md` 分别适配上游 `UI.md`、`LOGIC.md`；本地文件名使用小写。UI 参考保留本地 production build 隔离和验证要求，并明确同路由优先、可分享 URL/键盘切换；logic 恢复纯逻辑模块和单 HTML 的 free-play/guided walkthrough 结构。`feasibility.md` 是本地新增分支，继续保留；按主张决定测试/测量，不自动提交、推送或推广到生产。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 仅增加逐包来源记录；版本 3 恢复上游 UI/logic 骨架，保留本地 feasibility、production 隔离、审计留存与验证要求。运行不依赖源码缓存。