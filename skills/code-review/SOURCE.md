# 来源与适配

- source: https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/code-review/SKILL.md
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-blob: `373a4f26e6cfa3617778397945bb069d9cb184bc`，6670 bytes
- source-path: `skills/engineering/code-review/SKILL.md`
- source-agent: `skills/engineering/code-review/agents/openai.yaml`，blob `9076774ba327f49068db9273feceda03bfe940fa`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

## 已恢复的上游方法

- 双轴定义、`Process` 五步及 `Why two axes` 的方法在[本地入口](./SKILL.md)对应章节恢复，正文为中文适配，并非原文逐字副本；frontmatter 保持修改前本地值，不声称恢复上游 description。
- 固定提交原文保留在上述 source URL（不是移动的 main）；本包未保存逐字原文副本。需复核原文时读取该固定源，不将本地适配冒充原文。
- 异味基线原文位置：上游 `SKILL.md` 的 `Process / 3. Identify the standards sources`；本地十二项定义和修正方向位于[审查准则](./references/review-criteria.md)。委派时完整粘贴而非仅传名称。
- 独立委派与两份输入要求位置：上游 `Process / 4. Spawn both sub-agents in parallel`。
- 双轴报告与不跨轴重排位置：上游 `Process / 5. Aggregate` 及 `Why two axes`。

## 本地实质偏离与保留内容

- 保留本地 Copilot frontmatter 的 `user-invocable: true` 和 `disable-model-invocation: false`，不改变当前已批准的发现/触发策略；上游 agent descriptor 仅作为来源记录，不在本地新增未授权的代理入口。
- 保留本地默认只读、用户明确要求修复才可修改、staged/unstaged/相关 untracked 覆盖和无 spec 覆盖限制；这些是本地授权与正确性边界增强。
- 将上游 tracker/setup 依赖改为“按项目已有 tracker 工作流执行；不可用时记录能力降级”，避免声称存在未安装的 Skill API；将仓库实际检查、逻辑/回归/边界/状态完整性检查接入 Standards 轴。
- 恢复默认双轴隔离委派与完整输入，移除版本 2 的复杂度门槛。仅当前宿主/角色无可用获准能力时单上下文降级，不能并行时保留两个独立上下文并标注限制。当前叶子角色禁止委派，本次没有执行动态委派测试。
- 无完整 spec 但有明确要求时做有限 Spec 检查；完全无要求则跳过并说明。跨轴重复问题保留各自结论及计数，仅额外去重总数计一次，不合并或跨轴重排。
- `references/review-criteria.md` 是本地补充，不是上游同名文件；`LICENSE` 是本包许可证副本。

## 版本与更新

版本 1 为初次安装；版本 2 添加本地准则与逐包来源；版本 3 在同一固定提交上恢复完整方法并保留上述适配。更新时三方比较旧固定上游、目标上游与本地适配，保留用户改动；运行不依赖外部源码缓存。