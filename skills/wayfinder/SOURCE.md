# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/wayfinder`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留上游的目的地、已决索引、Notes、精确问题依赖、HITL/AFK、四类票据、认领、blocking、frontier、fog、范围外、建图和推进模式、单会话决策节奏及结案/移出范围规则。上游未提供本地 tracker 文件，新增 `references/local-markdown-tracker.md`，把地图、票据、状态、认领和依赖落实为本地 Markdown；没有 tracker 时不依赖 setup。新增 `references/skill-dependencies.md`，保留 grilling、domain-modeling、research 的必要方法，不假定 Skill API。`assets/map-template.md`、`assets/decision-template.md` 为本地模板补充。

偏离项：为当前 Copilot 保留原有 `user-invocable: true`、`disable-model-invocation: false` 自动发现策略，不采用上游的 `disable-model-invocation: true`；不自动推送、外部写入、创建分支或调用未提供的后台 Skill。更新时比较固定上游、目标上游与本包差异，按本包版本迁移，不直接覆盖。

版本记录：v1 初次安装；v2 增加本地模板、入口指针和逐包来源记录；v3 恢复完整上游方法并加入本地 tracker/依赖适配。