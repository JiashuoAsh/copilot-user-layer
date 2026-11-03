# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/productivity/writing-for-agents`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留上游的上下文指针、two loads、information hierarchy、progressive disclosure、co-location、completion clarity+demand、sequence/invocation split、leading words、positive phrasing、pruning 和 no-ops。主文件保留完整方法，`references/skill-mechanics.md` 单独适配上游 `SKILL-MECHANICS.md`，解释当前 Copilot 的 frontmatter、slash 入口、模型发现、拆分与 router；不照搬其他宿主的 Skill API 或加载假设。

偏离项：当前包保留用户已批准的 `user-invocable: true` 与 `disable-model-invocation: false` 策略；上游正文的通用方法以英文保留，Copilot 机制另行适配。更新时比较固定上游、目标上游与本包差异，按本包版本迁移，不直接覆盖。

版本记录：v1 初次安装；v2 增加逐包来源记录；v3 恢复完整方法并清理旧版重复正文。