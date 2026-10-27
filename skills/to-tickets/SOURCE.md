# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/to-tickets`
- adaptation-version: `2`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留纵向可验证切片、真实阻塞边与 expand–migrate–contract。改为默认聊天输出，远程 tracker 依当前配置和授权，不强制一任务一会话。`assets/ticket-template.md` 是本地适配补充，不是上游同名文件的复制。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 补模板、入口指针和逐包来源记录。运行不依赖源码缓存。