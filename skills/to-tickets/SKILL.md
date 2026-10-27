---
name: to-tickets
description: "Use when a settled plan, specification, or conversation needs to become a dependency-aware set of implementable work items. Prefer this over planning from scratch when enough decisions already exist."
user-invocable: true
disable-model-invocation: false
---

# 将计划拆成可验证任务

将已有规格、计划或对话整理成可独立交付的纵向工作项。不要把未决设计伪装成已准备实施的任务。

## 步骤

1. **复用已有上下文。** 先读用户提供的规格和当前对话；只有任务需要理解现状时才查代码、术语表和 ADR。缺少关键事实时标为待决定，不重开已回答的问题。
2. **切分可验证交付。** 默认按用户可观察的端到端行为切片，每项有 title、delivery、acceptance criteria、blocked-by 和来源引用。优先让切片可独立验证；只有真实前置依赖才建立阻塞边。
3. **处理广域机械变更。** 若单项机械变更会令大量调用点无法逐步保持绿色，按 expand–migrate–contract 排序；迁移可按风险/范围拆批，最终收缩依赖所有迁移项。
4. **检查依赖。** 阻塞关系必须有方向、无环；区分“需要先完成”与“方便同时做”。明确指出尚未决策的事项以及它们阻塞的工作。
5. **交付拆分。** 默认在聊天中给出有序工作项、依赖理由和验收标准。用户要求保存时，遵循项目现有任务系统和目录；没有约定时使用[任务模板](./assets/ticket-template.md)，一任务一文件放在 `.scratch/<effort>/issues/NN-<slug>.md`。只有已有配置、工具和明确授权时才创建远程 issue 或修改 tracker。

## 完成判据

每项描述一个有价值的交付并有可检查验收标准；所有依赖均为真实阻塞且无环；不把未定设计写成 ready 工作；输出说明范围与来源。无需为普通小改动强制拆任务，也不要求一项任务对应一个会话。
