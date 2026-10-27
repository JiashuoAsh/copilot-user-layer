---
name: code-review
description: "Use when asked to review a branch, pull request, work-in-progress changes, or implementation against its specification. Review code changes read-only on both repository-standards and specification axes, including relevant uncommitted work."
user-invocable: true
disable-model-invocation: false
---

# 双轴代码审查

默认只读。审查需求符合性与工程规范是两个独立问题，分别汇报，避免一轴掩盖另一轴。发现问题不自动修改；仅当当前任务明确要求修复或完成实现闭环时继续修改。

## 1. 固定审查范围

- 用户指定了提交、分支或范围时，以其为准并先确认引用有效。
- 未指定且存在工作区改动时，覆盖 tracked staged、tracked unstaged 和相关 untracked 文件。读取相关实现、调用方和测试，不只看 diff。
- 没有工作区改动时，只有存在可靠基线才审查分支差异。无法确定比较范围时，简洁询问一次；不得猜 `HEAD~1`，不得把已提交差异与工作区差异混为一谈。
- 检查提交信息和文档以定位规格；找不到规格时，仍审查可确认的部分，并明确 Spec 轴的覆盖限制。

## 2. Standards 轴

开始两轴审查前读取[审查准则](./references/review-criteria.md)。检索仓库实际适用的编码规范、贡献指南、测试与格式配置；检查逻辑正确性、回归、边界和异常路径、状态与数据完整性，而不只审查风格。可将维护性异味作为带标签的判断线索，不能把异味冒充硬规则；仓库明确规范优先于通用启发式，工具已报告的问题不重复包装成审查发现。

## 3. Spec 轴

将实现与 issue、规格或用户要求逐项对照，检查遗漏、误解、错误实现和未要求行为。每个结论引用可定位的实现证据和相应需求；没有来源时说明无法确认，不推测作者意图。

## 4. 独立性与报告

若当前环境提供适合的独立审查能力，且任务复杂到独立上下文有实际价值，可分别审查两轴后综合；否则在同一上下文中按两个轴独立检查。不得假设某个 Skill API 或子代理一定可用。

分别报告两轴发现，轴内按严重程度排序，注明文件/符号/定位、证据、影响和建议。同一问题标注两轴依据时只计一次。无发现时分别说明审查范围和限制。未运行检查不得称为通过；审查不是验证的替代品。
