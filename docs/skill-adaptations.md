# 新增技能适配记录

- 上游仓库：<https://github.com/mattpocock/skills>
- 固定来源版本：`59db609eb1e18aaf59b63284d0e52255aff0c63c`
- Matt Pocock 七包的版本与来源主记录位于各自 `SOURCE.md`：`handoff` 当前为 v4，其余六包为 v3，保留各包 MIT 许可与原始版权声明。`grill-me` 为独立的 hiDaDeng 派生包，许可和来源单独记录。
- 原始源码缓存：`C:\Users\Ash\.cache\skill-sources\mattpocock-skills\`
- 适配 staging：`C:\Users\Ash\.cache\skill-adaptations\mattpocock-skills\59db609eb1e18aaf59b63284d0e52255aff0c63c\`

| 用户技能 | 上游路径 | 主要适配 |
|---|---|---|
| `to-tickets` | `skills/engineering/to-tickets` | 纵向可验证切片、真实阻塞边、广域机械变更 expand–migrate–contract；tracker 仅在已配置且获授权时操作 |
| `code-review` | `skills/engineering/code-review` | Standards/Spec 双轴；包含相关工作区改动；基线不明先询问；无规格仍审查可确认范围；不依赖特定 tracker、Skill API 或必定可用的并行审查 |
| `writing-for-agents` | `skills/productivity/writing-for-agents` | 保留完整方法：上下文指针、双重负载、信息层级、共置、完成标准、顺序拆分、引导词、正向措辞与 no-op 剪枝；按本机 Copilot 文档解释调用字段 |
| `handoff` | `skills/productivity/handoff` | 仅用户显式调用，保留 slash 入口并禁用模型调用；默认聊天输出；避免因上下文长度中断当前工作；写文件遵循项目布局及授权 |
| `retro` | `skills/engineering/retro` | 证据驱动且默认只建议；检查已有检查；缺少 guardrail 也是发现，机械性问题优先自动化；不从偶发失误泛化全局规则 |
| `prototype` | `skills/engineering/prototype` | 恢复 UI 多方案与可分享 variant 切换、logic 纯模块/单 HTML/free-play/guided walkthrough、结论与 primary source 留存；保留 feasibility、安全和生产隔离边界 |
| `wayfinder` | `skills/engineering/wayfinder` | 恢复建图/推进模式、四类票据、HITL/AFK、认领/frontier、决策节奏、结案和 Notes；本地 Markdown tracker，不依赖 setup 或未知 Skill API |

## 逐包主记录

- [to-tickets](../skills/to-tickets/SOURCE.md)
- [code-review](../skills/code-review/SOURCE.md)
- [writing-for-agents](../skills/writing-for-agents/SOURCE.md)
- [handoff](../skills/handoff/SOURCE.md)
- [retro](../skills/retro/SOURCE.md)
- [prototype](../skills/prototype/SOURCE.md)
- [wayfinder](../skills/wayfinder/SOURCE.md)

## Grill-me

- [grill-me](../skills/grill-me/SKILL.md)：基于 hiDaDeng 多路由技能，保留工程/科研/决策/思辨方法并增加中性提问、可核实事实优先和自动发现；其上游仓库标注 Apache-2.0，但 SKILL frontmatter 曾标 MIT，本地按仓库 LICENSE 记录 Apache-2.0。详见技能 frontmatter 与上游仓库。

七个技能已分别在逐包来源记录中恢复或补齐上游方法；共享索引只概述主要差异。技能版本、验证情况和许可依据以各自 `SOURCE.md` 与许可证文件为准，不将旧快照描述当作当前行为。

## 维护与回滚

默认人工更新。更新时比较旧上游、新上游和本地适配，迁移后重跑结构及受影响行为检查，不直接覆盖安装。回滚前逐项检查自安装以来的用户修改，只移出本次安装内容并恢复本次文档差异；不得覆盖后续改动，也不恢复已弃用的 `/review-code`。缓存目录不是运行依赖。

本次补齐前的本机快照：`C:\Users\Ash\.cache\skill-adaptations\mattpocock-skills\59db609eb1e18aaf59b63284d0e52255aff0c63c\completion-20261027\before\`。它包含原七包、`.gitignore`、规范、工程指引及两份文档。回滚本次补齐时逐项比较快照与当前内容，撤回本次新增资源/来源文件及对应差异，不整目录覆盖，不移除已在前次安装的七个入口，也不覆盖后续用户修改。

运行时行为测试本轮按用户决定跳过，后续有真实问题再针对性检查，不将这一选择写成运行验收通过。