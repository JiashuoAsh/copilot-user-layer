# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/code-review`
- adaptation-version: `2`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留 Standards/Spec 双轴及规范优先的异味启发式。纳入 staged/unstaged/相关 untracked，缺规格仍审可确认内容，不依赖 tracker、特定 Skill API 或强制并行代理。`references/review-criteria.md` 为本地整理补充，增加逻辑、回归、异常和数据完整性检查；它不是上游同名文件。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 补审查准则、分轴报告规则和逐包来源记录。运行不依赖源码缓存。