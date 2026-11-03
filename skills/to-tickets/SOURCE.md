# 来源与适配

- source: https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/to-tickets/SKILL.md
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-blob: `9b77a01db9460c99c22d03c910c349f890f12c0e`，5812 bytes
- source-path: `skills/engineering/to-tickets/SKILL.md`
- source-agent: `skills/engineering/to-tickets/agents/openai.yaml`，blob `24605a5db64e4fc750b999aa94aea126bee814ee`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

## 已恢复的上游方法

- 上游 `Gather context`、可选 codebase exploration、prefactoring、context-sized tracer-bullet vertical slices、阻塞边、广域 refactor 的 `expand–migrate–contract`、integration branch 例外、用户 quiz、发布、frontier 和 parent 保护，均在[本地入口](./SKILL.md)的 `Process`/“保鲜与依赖规则”章节恢复为中文适配，而非摘要替代方法。
- 固定提交原文保留在上述 source URL（不是移动的 main）；本包未保存逐字原文副本。需复核原文时读取该固定源，不将本地适配冒充原文。
- 上游本地 ticket 与 issue template 位于原文 `Process / 5. Publish the tickets to the configured tracker` 后的 `<local-ticket-template>` 和 `<issue-template>`；两种形式的字段在[本地任务模板](./assets/ticket-template.md)保留并增加来源、状态和未决项。该模板为本地文件，不声称是上游同名文件。

## 本地实质偏离与保留内容

- 保留本地 Copilot frontmatter 的 `user-invocable: true` 和 `disable-model-invocation: false`，不擅自改变当前已批准的发现策略；上游 agent descriptor 中的 `allow_implicit_invocation: false` 仅记录为来源事实，不在本地强行启用/禁用入口。
- 保留默认聊天输出和用户授权边界：只有明确授权时才写本地文件或 tracker；不依赖未安装的 `/setup-matt-pocock-skills`，优先使用项目已有 tracker，否则使用本地 Markdown。
- 保留本地模板、来源引用、未决状态和可验证验收增强；这些是本地正确性与可维护性补充，不替代上游方法。
- 上游默认 ready-for-agent 改为项目已有且获准的标签，不擅自新建；远程发布与本地保存都受当前授权限制。保护 parent；原生 sub-issue 操作若需要更新 parent，先要求该操作的授权，否则只写子项 Parent 引用。若指定 tracker 不可用，报告阻塞而不私自更换发布位置。
- 保留上游避免固化实现路径/代码的保鲜规则和 prototype 决定片段例外；额外增加输入变化后重核验收、依赖与 ready 状态。保持一个新鲜上下文窗口的切片尺寸，但不等同于强制一个会话。
- `assets/ticket-template.md` 与 `LICENSE` 是本地包文件；未将上游不存在的 `references/` 伪装为源文件。

## 版本与更新

版本 1 为初次安装；版本 2 添加模板与逐包来源；版本 3 在同一固定提交上恢复完整方法并保留上述适配。更新时三方比较旧固定上游、目标上游与本地适配，保留用户改动；运行不依赖外部源码缓存。