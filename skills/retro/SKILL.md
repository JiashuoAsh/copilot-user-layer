---
name: retro
description: "Use when evidence shows repeated agent mistakes, substantial rework, or costly tool waste and the user or task would benefit from improving the working environment. Analyze the current session by default; suggest narrowly scoped improvements, not generic rules."
user-invocable: true
disable-model-invocation: false
---

# 工作流复盘

复盘是基于证据改善后续工作方式，不是每次失败后的仪式，也不是自动扩大全局 instructions 的理由。一次偶发失败若不影响后续流程，通常继续完成当前任务即可。

## 流程

1. 默认检查当前会话。只有用户指定历史会话且当前工具可读取时才检查历史；无法读取时说明限制，不推断日志内容。
2. 收集具体证据：重复错误、返工路径、耗时工具调用、关键资料难以发现或现有检查失效。区分模型决策、工具限制、项目配置和外部服务问题。
3. 对每个候选改进检查现有配置与自动化：若现有检查已存在但未接通，优先指出连接问题；机械性错误优先考虑自动检查，判断性建议才考虑文档规则。
4. 提出最多三个高收益改进；每项说明观察证据、可能原因及归属层、最小建议、验证办法和维护成本。证据不足时标为假设，不作为结论。允许得出无需修改。
5. 默认只报告建议。仅当当前任务明确授权修改对应文件或环境时实施；项目局部问题不升级为跨项目规则。实施后只报告实际验证过的结果。

## 完成判据

建议可追溯到本次会话的具体证据，修改范围与问题责任层匹配，没有把工具故障、单次失误或未经验证的解释写成普遍规律。
