# 新增技能适配记录

- 上游仓库：<https://github.com/mattpocock/skills>
- 固定来源版本：`59db609eb1e18aaf59b63284d0e52255aff0c63c`
- 各包版本与来源的主记录位于各自 `SOURCE.md`；当前均为本地适配版本 2，保留 MIT 许可与每项技能的原始版权声明。
- 原始源码缓存：`C:\Users\Ash\.cache\skill-sources\mattpocock-skills\`
- 适配 staging：`C:\Users\Ash\.cache\skill-adaptations\mattpocock-skills\59db609eb1e18aaf59b63284d0e52255aff0c63c\`

| 用户技能 | 上游路径 | 主要适配 |
|---|---|---|
| `to-tickets` | `skills/engineering/to-tickets` | 纵向可验证切片、真实阻塞边、广域机械变更 expand–migrate–contract；tracker 仅在已配置且获授权时操作 |
| `code-review` | `skills/engineering/code-review` | Standards/Spec 双轴；包含相关工作区改动；基线不明先询问；无规格仍审查可确认范围；不依赖特定 tracker、Skill API 或必定可用的并行审查 |
| `writing-for-agents` | `skills/productivity/writing-for-agents` | 保留上下文指针、渐进披露、完成标准和单一事实来源；按本机 Copilot 文档解释调用字段 |
| `handoff` | `skills/productivity/handoff` | 明确需要交接时使用；默认聊天输出；避免因上下文长度中断当前工作；写文件遵循项目布局及授权 |
| `retro` | `skills/engineering/retro` | 证据驱动且默认只建议；检查已有检查；不从偶发失误泛化全局规则 |
| `prototype` | `skills/engineering/prototype` | UI/逻辑/可行性三分支；是否测试由验证主张决定；不自动提交或推广到生产 |
| `wayfinder` | `skills/engineering/wayfinder` | 多个互相依赖的未决决策用本地 Markdown 地图；不要求 tracker、标签、认领、推送或未知 Skill API |

## 逐包主记录

- [to-tickets](../skills/to-tickets/SOURCE.md)
- [code-review](../skills/code-review/SOURCE.md)
- [writing-for-agents](../skills/writing-for-agents/SOURCE.md)
- [handoff](../skills/handoff/SOURCE.md)
- [retro](../skills/retro/SOURCE.md)
- [prototype](../skills/prototype/SOURCE.md)
- [wayfinder](../skills/wayfinder/SOURCE.md)

版本 2 补齐任务模板、审查准则、交接模板、地图模板与决策模板，并接入对应入口；这些独立资源是本地适配补充。`writing-for-agents`、`retro`、`prototype` 的执行方法未改，仅增加逐包来源。许可证原文不变。§7 补齐职责，工程全局指引移除额外重复路由，两份维护文档增加精确 Git 忽略例外。

## 维护与回滚

默认人工更新。更新时比较旧上游、新上游和本地适配，迁移后重跑结构及受影响行为检查，不直接覆盖安装。回滚前逐项检查自安装以来的用户修改，只移出本次安装内容并恢复本次文档差异；不得覆盖后续改动，也不恢复已弃用的 `/review-code`。缓存目录不是运行依赖。

本次补齐前的本机快照：`C:\Users\Ash\.cache\skill-adaptations\mattpocock-skills\59db609eb1e18aaf59b63284d0e52255aff0c63c\completion-20261027\before\`。它包含原七包、`.gitignore`、规范、工程指引及两份文档。回滚本次补齐时逐项比较快照与当前内容，撤回本次新增资源/来源文件及对应差异，不整目录覆盖，不移除已在前次安装的七个入口，也不覆盖后续用户修改。

运行时行为测试本轮按用户决定跳过，后续有真实问题再针对性检查，不将这一选择写成运行验收通过。