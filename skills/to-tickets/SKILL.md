---
name: to-tickets
description: "Use when a settled plan, specification, or conversation needs to become a dependency-aware set of implementable work items. Prefer this over planning from scratch when enough decisions already exist."
user-invocable: true
disable-model-invocation: false
---

# 将计划拆成可验证任务

将已有规格、计划或对话整理成 tracer-bullet vertical tickets，每项声明真正阻塞它的工作。默认在聊天中提出并审阅拆分；只有当前用户授权覆盖保存或发布时，才写入项目已有 tracker 或本地 Markdown。不要把未决设计伪装成 ready 工作。

## Process

### 1. Gather context

复用已有对话、规格和决定。若用户传入规格路径、issue 编号或 URL，读取完整正文和评论。缺少关键事实时标为待决定，不重开已回答的问题。

### 2. Explore the codebase（可选）

尚未了解现状且任务需要时，再查代码、项目 glossary 和 ADR；任务标题、描述和验收使用项目领域词汇。寻找能让实现更容易的 prefactoring 机会，遵循“先让改动容易，再做容易的改动”。不因该步骤而凭空扩大范围。

### 3. Draft vertical slices

按用户可观察的端到端行为切成 tracer-bullet tickets，而不是按 schema/API/UI/test 横向拆层。每个 slice 必须覆盖所需完整路径、可单独 demo 或验证，并能放入一个新鲜上下文窗口；任何 prefactoring 先于依赖它的实现。

每项写明 title、delivery、acceptance criteria、blocked-by 和来源引用。阻塞边只表示“必须先完成”，不是“方便同时做”；无阻塞项可立即开始。

**广域机械变更例外。** 若 rename column、共享符号 retype 等 blast radius 使单次编辑会同时破坏大量调用点，且纵向切片无法独立保持绿色，不强行做 tracer bullet，使用 `expand–migrate–contract`：先并存新增形式使现有行为不破坏；再按风险和 blast radius（例如 package 或 directory）分批迁移，每批各为一个 ticket、依赖 expand，并因旧形式仍可用而批批保持 CI 绿色；确认无调用者后，contract 依赖所有 migrate 批次并删除旧形式。若连批次也不能单独保持绿色，仍保留该顺序，但让这些任务共享 integration branch；所有批次和收缩工作共同阻塞最终 `integrate-and-verify` ticket，绿色承诺只适用于该最终项。分支不是依赖图中的 ticket，不把“使用共同分支”误写成阻塞边；实际创建/合并分支需要相应授权。

### 4. Quiz the user

以编号列表呈现 proposed breakdown。每项显示 Title、Blocked by 和 What it delivers，并询问粒度是否合适、阻塞边是否都是真实 gate、哪些项应合并或继续拆分。迭代直到用户批准 breakdown；不得把未批准的拆分当作已发布任务。

### 5. Review and publish with authorization

批准拆分后按依赖顺序 review 每项的交付、验收、来源、未决状态和无环依赖。拆分批准不自动等于写文件或远程发布授权；当前请求已明确包括发布时不重复索取授权，否则先交付草案。获授权后才按以下已有配置发布，不安装 setup、工具或依赖：

- 已配置且当前能力可用的真实 tracker 时，按 blocker first 一项一 issue 发布，使后续阻塞边能引用真实 ID。有原生 blocking relationship 就使用；没有则在 Blocked by 写明阻塞 issue。来源是已有 parent issue 时，使用已获授权的 sub-issue 操作关联；该操作若必须更新 parent，则先核对相应授权，无授权时只在子项记录 Parent 引用。遵循项目已有 triage vocabulary；存在且获准时默认用 `ready-for-agent` 标签，或按用户指定标签，不擅自新建标签。
- 没有配置远程 tracker 时，使用项目已有的本地 Markdown 约定；若无约定且本地保存已获授权，写入 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 起按依赖顺序一任务一文件，绝不合成单一任务文件。每项 Blocked by 写前置编号/标题及真实理由；使用[本地与远程任务模板](./assets/ticket-template.md)。已指定 tracker 但其工具不可用时报告阻塞并交付草案，不擅自切换发布位置。

发布后在授权执行范围内只从 frontier 选取工作：所有 blockers 已完成的 ticket；纯线性链就是从上到下。无 blocker 的项从起点即可实施，但“可实施”不等于已授权执行。本 Skill 产出任务，不自行开始实现。不得关闭或修改任何 parent issue；若用户另有明确授权，则仅执行该授权覆盖的动作。

## 保鲜与依赖规则

- 依赖必须有方向、无环，并区分真实阻塞与并行便利；尚待决定的事项及其阻塞范围必须明确标注。
- 每项描述一个有价值、可独立验证的交付；不要求普通小改动强制拆任务，也不要求一项任务对应一个会话。
- 规格、计划、项目现状或授权发生变化时，重新检查受影响 ticket 的来源、验收和依赖；旧 ticket 不得在依据失效后继续标记 ready。保留历史决定并只使真实受影响的工作项失效。
- 两种发布形式都避免把具体实现文件路径或代码片段固化在 ticket 中，它们容易过时；规格/决定的来源引用、任务文件位置和硬性授权路径不受此限制。例外：prototype 产生的状态机、reducer、schema、type shape 等片段若比文字更精确表达决定，可内联仅包含决定的部分并标注 prototype 来源，不粘贴完整 demo。开始实施前重新定位代码，不将过时路径当作事实。

## 完成判据

所有工作项都有完整交付、可检查验收、来源和准确的真实阻塞边；依赖无环；未定设计未标 ready；用户已审阅拆分；只有获得发布授权且使用项目已有 tracker 或本地 Markdown 时才称为 published。未运行验证不得声称通过。
