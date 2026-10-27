---
name: writing-for-agents
description: "Use when creating or editing agent-consumed documents: skills, instructions, prompts, agents, AGENTS.md, CLAUDE.md, or referenced guidance. Focus on discoverability, progressive disclosure, clear completion criteria, and avoiding stale duplication."
user-invocable: true
disable-model-invocation: false
---

# 编写 Agent 可执行文档

文档的目标不是“读起来完整”，而是让 Agent 在实际任务中更稳定地找到并执行正确方法。先核对当前产品和仓库的真实发现规则，不把一个 Agent 环境的约定套到另一个环境。

## 写作流程

1. **确定文档职责和发现入口。** 判断这是 always-on policy、按文件适用的 instruction、单次 prompt、可复用 skill，还是角色定义。检查当前平台文档和已有文件，避免重复入口。
2. **先写触发指针。** description 或路由说明应使用明确的“Use when...”场景，区分真正不同的触发分支，并说明不适用范围。自动可发现的 Skill 要让描述承担可检索的上下文指针；手动入口是否同时可见由平台字段决定。
3. **按信息层级组织。** 主文件放必经步骤和完成条件；只对特定分支有用的细节放到按需引用文件。引用写清何时读取，保证路径存在、依赖可达，不把关键必需规则藏在弱指针后。
4. **让步骤可判定完成。** 每一步说明可观察的完成标准；区分已查证、推断和未知。给分析和建议类文档设定合适的输出与停止条件。
5. **精简并维护单一事实来源。** 删除重复规则、环境中一查即得且易过时的副本、与行为无关的叙述。保留确实改变行为的边界；项目事实留在项目层，跨项目方法留在用户层。
6. **检查加载与授权。** Frontmatter 与文件夹名一致；描述符合平台限制；调用模式符合需求；文档不声称平台没有的工具、权限或运行保证。方法可自动发现不代表获得额外写入或外部操作授权。

## Skill 专项

编辑 Skill 时，读取[调用机制参考](./references/skill-mechanics.md)核对平台字段。模型自动发现、用户 slash 入口是两个独立问题；按实际 VS Code/Copilot 文档决定字段，不能照搬其他生态对上下文成本或调用的假设。
