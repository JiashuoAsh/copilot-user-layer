---
name: code-review
description: "Use when asked to review a branch, pull request, work-in-progress changes, or implementation against its specification. Review code changes read-only on both repository-standards and specification axes, including relevant uncommitted work."
user-invocable: true
disable-model-invocation: false
---

# 双轴代码审查

默认只读。审查需求符合性与工程规范是两个独立问题，分别汇报，避免一轴掩盖另一轴。发现问题不自动修改；仅当当前任务明确要求修复或完成实现闭环时继续修改。

## Process

### 1. 固定比较点

用户说出的提交、分支、tag、`main`、`HEAD~5` 等就是 fixed point。对分支/已提交变更，固定点确认后只记录一次比较命令：`git diff <fixed-point>...HEAD`，使用三点以相对于 merge-base 比较，并记录 `git log <fixed-point>..HEAD --oneline`。未指定且没有工作区改动时询问 fixed point，不猜 `HEAD~1`。

分支审查继续前确认 fixed point 可由 `git rev-parse <fixed-point>` 解析且 diff 非空。坏引用应在此处报告；空 diff 应明确报告该范围无变更，不应拖到独立审查阶段才失败，也不应把工作区改动当作不存在。

若用户未指定提交范围但存在工作区改动，覆盖 tracked staged、tracked unstaged 和相关 untracked 文件，无须为这种范围另猜提交基线。记录 staged 的 `git diff --cached`、unstaged 的 `git diff` 及 untracked 清单和完整内容；分别读取相关实现、调用方和测试，不只看 diff。已提交差异与工作区差异不得混为一谈；同时审查时将各部分明确列出。记录 HEAD、引用解析结果及工作区内容快照，防止两个审查读取到不同版本；发生变化时重新固定范围。

### 2. 找到规格来源

按以下顺序寻找 originating spec：

1. 从提交消息中的 issue 引用（如 `#123`、`Closes #45`、GitLab `!67`）按项目 tracker 工作流获取。
2. 用户作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支名或 feature 匹配的规格文件。
4. 若仍找不到，询问规格位置；用户确认没有规格时，Spec 轴报告 `no spec available`，不推测作者意图。完全没有可用要求时跳过 Spec 委派；仍有明确用户要求时，只对这些要求进行有限 Spec 审查。

即使没有规格，仍审查可确认的内容，并明确 Spec 轴覆盖限制。

### 3. 找到规范来源并应用异味基线

检索仓库中描述编码方式的全部文件；若存在 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`，必须纳入。开始两轴审查前读取[审查准则](./references/review-criteria.md)。检查逻辑正确性、回归、边界和异常路径、状态与数据完整性，而不只审查风格；工具已经报告的问题不重复包装成审查发现。

Standards 轴还固定携带 Fowler（Refactoring，第 3 章）异味基线。完整的十二项“它是什么 → 如何修复”定义位于[审查准则的异味基线](./references/review-criteria.md#异味基线定义与修正方向)；即使仓库没有任何规范也必须读取并应用，不只携带名称清单。

- 仓库明确规范优先；规范认可某种基线异味时，抑制该异味报告。
- 异味始终是带标签的判断线索，例如 `possible Feature Envy`，不是硬违规。
- 只报告能从 diff 和相关代码证明会造成具体影响的异味；不机械要求抽象、移动代码或重写继承。

### 4. 独立审查两轴

使用当前宿主可用且当前角色获准的独立审查能力，在前台同时发起 Standards 与 Spec 两个独立审查，再汇总返回结果。不要增加主观的“复杂度足够才委派”门槛。两个审查使用隔离上下文，不将一轴发现输入另一轴；没有规格时按步骤 2 限定或跳过 Spec。每份委派包均包含项目绝对路径、同一固定点/HEAD/工作区快照、完整 diff 命令和提交列表、额外工作区命令与 untracked 内容、适用指令、只读授权范围、本轴输入及以下完整任务简报。工作区审查没有提交列表时明确标记不适用，不伪造提交。

- **Standards 输入与简报：** 附全部规范来源文件清单及可访问路径或内容；将审查准则中的完整十二项异味定义与两条约束直接粘贴进委派包，不能假定审查者已加载本 Skill。简报：“逐文件/逐 hunk 报告：(a) 每处违反文档规范的变更，引用规范文件和具体规则；(b) 发现的基线异味，命名并引用 hunk。区分硬违规和判断：文档规范违反可以是硬违规，基线异味始终是判断，仓库文档覆盖基线。跳过工具已强制检查的事项；不要将它们重复包装成发现。同时按附带本地审查准则检查逻辑、回归、边界、异常和状态完整性，引用可确认的影响。返回少于 400 words 的报告。”
- **Spec 输入与简报：** 附规格路径或抓取的完整正文、评论和要求定位，说明已知覆盖缺口。简报：“报告：(a) 规格要求但缺失或部分实现的内容；(b) diff 中未被要求的行为（scope creep）；(c) 看似已实现但实现错误的要求。每项引用规格原句和相应实现证据。没有来源时不推测意图。返回少于 400 words 的报告。”

只有当前宿主或角色没有可用、获准的独立委派能力时，才在当前上下文中按相同完整输入分别检查，并明确它不等价于隔离上下文审查及具体降级原因。若支持独立审查但不支持同时调度，串行使用两个隔离上下文并注明并行能力限制；不以此为由改成单上下文。不得假设某个 Skill API、tracker 或子代理一定可用，也不得无限重试不可用能力。

### 5. 汇总报告

在 `## Standards` 和 `## Spec` 标题下分别呈现两个报告，原文或轻度清理，不合并、不跨轴重排发现。每项写清严重性、文件/符号/定位、触发条件、证据、影响和克制的修正建议；同一问题在两轴均有依据时保留两轴表述并标同一 ID。各轴统计其自身发现，若额外给出去重总数则同一 ID 只计一次；不为去重删除一轴结论。

末尾用一行分别给出两轴发现总数和各轴最严重问题，不选择跨轴的单一赢家。无发现时分别说明审查范围和未验证部分；未运行检查不得称为通过，审查不是验证的替代品。

## Why two axes

一项变更可能通过一轴而失败于另一轴：遵守所有规范但实现了错误需求，是 Standards pass、Spec fail；准确实现 issue 但破坏项目约定，是 Spec pass、Standards fail。分开报告可避免一轴掩盖另一轴。
