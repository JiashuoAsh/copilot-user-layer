# 科研协作 v2 交付与验收

日期：2026-10-29。用户要求先完成框架，再集中验证；不逐项要求用户手动测试。

## 范围

保留 Research 总入口和已有专家，新增三名工作线负责人、两个执行者、[协作协议](../research-guides/orchestration.md)及两份项目模板。同步总规范、工程所有权、Experiment Designer 路由、research-explore 无子代理边界和项目记录约定。不改模型、MCP、全局批准策略，不执行真实训练。

## 平台依据

- 当前服务端 package.json 版本为 1.143.1。
- 实际读取的用户 settings.json 已启用 `chat.subagents.allowInvocationsFromSubagents: true` 并注册 research agent 目录；本次未写该设置。
- 官方 [subagents 文档](https://code.visualstudio.com/docs/agents/run/subagents) 的 Local 部分说明开关与最大五层；[文件参考](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference) 说明 Local 的 agents 白名单与其他 harness 的差异。
- 配置采用总负责人 → 工作线负责人 → 叶子两条委派边；不声称增加了邮箱、同成员续接、常驻运行或自动合并能力。

## 集中检查记录

结构检查入口：[validate-research-framework.cjs](../scripts/validate-research-framework.cjs)。在用户层根目录用 Node 执行此文件；前置条件只有现有 Node，无依赖安装。退出码 0 表示所列静态约束通过，非零表示失败。

检查器仅解析本仓库实际使用的 scalar/array frontmatter 子集；不支持的语法直接失败，不把它称为通用 YAML 解析。反例自检覆盖重复字段、不支持的语法、未闭合头部、调用回环、未知子角色及 wildcard。

最终命令、检查结果、独立审阅及运行轨迹在集中验收后更新。尚未执行的项不计为通过。

## 解释边界

静态检查不能证明权限文字必然执行、跨进程设备预留已实现、模型始终遵守预算或真实科研任务有效。协议中的单写者、预算、版本和资源规则是 Agent 执行约定；本次未安装调度服务或文件锁守护进程。嵌套能力以实际工具轨迹为依据，不以 worker 自述代替。完整科研效果需要以后实际项目证据，本次不会为此要求用户反复手动验收。