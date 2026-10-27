# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/retro`
- adaptation-version: `2`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留基于会话证据检查导航、自动检查、规范和工具成本的方法。聚焦重复问题或明显浪费，最多三项建议，先检查已有检查是否未接通；默认建议不改全局规则，不把偶发错误泛化，不依赖未知 Skill API。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 仅增加逐包来源记录，执行方法未变。运行不依赖源码缓存。