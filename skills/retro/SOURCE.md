# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/retro`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留基于会话证据检查导航、自动检查、规范、全局指引、信息访问和工具成本的方法。聚焦重复问题或明显浪费，最多三项建议，先检查已有检查是否未接通；补充没有任何 guardrail 本身也是发现，机械问题优先自动化。默认建议、不擅自改全局规则，不把偶发错误泛化；写作技能通过实际读取文件及其适用参考执行，不假设存在 Skill API。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 仅增加逐包来源记录；版本 3 保留本地克制和默认建议，同时补足 guardrail 缺失发现、机械问题自动化优先及实际读取 writing-for-agents 文件的路径。运行不依赖源码缓存。