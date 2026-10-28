---
name: handoff
description: "Use only when the user explicitly invokes handoff to hand work to another session or person. Capture verified state, decisions, changed files, evidence, blockers, and next action without duplicating existing artifacts."
argument-hint: "接手者要完成什么？"
user-invocable: true
disable-model-invocation: true
---

# 工作交接

仅在用户通过 `/handoff` 或明确点名调用本技能时生成交接包。Agent 不得因委派需要、上下文变长或普通任务结束自行调用，也不得因此中断当前任务。

## 交接步骤

1. 明确接手者要完成的目标；若用户提供重点，将其作为下一步目标。
2. 查阅当前对话、工作区状态和相关记录。将已确认事实与推断分开；测试结论应对应当前代码状态，代码变化后不得沿用过期验证结果。
3. 组织交接内容时读取[交接模板](./assets/handoff-template.md)，按实际需要裁剪。优先引用已有规格、计划、ADR、issue、diff 或日志路径，避免重复复制。整理必要内容：
   - 当前目标和状态；
   - 已定决策及依据链接；
   - 变更文件和未提交状态；
   - 已运行与未运行的验证；
   - 阻塞、风险和明确的下一步；
   - 下一会话确实需要的技能或能力。
4. 删除密钥、密码、令牌和不必要个人信息；不要将秘密写入交接文件。
5. 默认在聊天给出交接。只有用户要求保存或当前任务明确授权时才写文件；遵循用户指定位置和项目既有约定。没有约定时，项目交接可存 `.scratch/<effort>/handoff.md`；无项目的短期交接使用 Windows 临时目录。

## 完成判据

接手者无需重做已记录的探索即可知道目标、可信状态、尚未完成事项和下一步；引用可定位，验证范围准确，文件位置明确。若当前环境无法确认工作区状态，写明未知而不补造。
