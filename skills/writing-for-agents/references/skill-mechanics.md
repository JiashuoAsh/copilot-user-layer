# VS Code Copilot Skill 字段说明

适配依据：VS Code Copilot 对 Skill discovery 的调用模型。修改前若平台行为或官方文档已变化，应重新核对。

- `user-invocable: true` 控制面向用户的 slash 入口。
- `disable-model-invocation: false`（或省略且使用平台默认）允许 Agent 根据描述自动发现；设为 `true` 禁止模型调用，但可保留用户入口。
- 两项职责不同。按需要可同时开放 slash 与自动发现；自动可发现不意味着每次必触发，也不授予文件写入、执行命令或外部操作权限。
- `name` 应与技能目录名一致；`description` 是自动发现的主要触发线索，写清任务类型与关键触发场景，避免泛化成“有用时使用”。
- 具体字段语义和目录位置以当前 VS Code/Copilot 文档及本机实际发现能力为准；不要复制 Claude Code 或其他宿主的假设。
