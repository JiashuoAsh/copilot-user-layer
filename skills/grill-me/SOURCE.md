# 来源与适配

- source: https://github.com/hiDaDeng/grill-me/tree/3420efb391cc6d9f0ce04ab2399025dd9d23e53f
- source-commit: `3420efb391cc6d9f0ce04ab2399025dd9d23e53f`
- source-path: `skills/SKILL.md` and the repository's four route references
- repository-license: Apache-2.0 (`LICENSE` at the fixed source commit)
- adaptation-version: `2`

## 保留内容

- 保留按最终产物选择工程、科研、决策、思辨主路由。
- 保留材料优先、分批追问、问题依赖、收敛条件、活文档与限次复审模式。
- 保留本地四路由参考文件、模板和只读/写入授权边界。

## 本地适配

- 为 VS Code Copilot 补充 `user-invocable: true`、`disable-model-invocation: false`，并将 `agents/openai.yaml` 的 `allow_implicit_invocation` 设为 `true`，使技能在适用的模糊方案、研究想法、重要决策和论点压力测试场景可被发现；description 同时排除明确执行、简单事实查询和只需即时建议的任务。
- 增加事实优先核查、开放中性单问题、只在真实取舍时给推荐、回答复述与“不确定/跳过/纠正前提”出口，减少暗示性提问和把推断记成决定。
- 将研究输出中的 `Stage 1 最小任务` 改为 `下一步最小证据行动`，并统一复审门槛说明。
- 主文件与共享规范使用仓库 LICENSE 的 Apache-2.0 标记，不沿用源文件 frontmatter 中不一致的 MIT 字段。

## 许可证说明

固定源仓库的根 `LICENSE` 是 Apache-2.0；其 `SKILL.md` frontmatter 曾写 `license: MIT`，两者不一致。本地不声称该冲突已由上游作者解决，按仓库许可证记录，并保留来源、提交和适配差异以便后续复核。若重新分发本技能，应同时保留 Apache-2.0 条款及必要归属声明。

## 更新规则

更新时比较固定上游、新上游和本地适配，保留本地路由与平台边界；不直接覆盖，不把自动发现当作写入或执行授权。静态引用、frontmatter 和行为触发检查应在更新后重新运行。运行时是否被模型选中仍取决于宿主的发现实现，不能仅凭元数据宣称已完成端到端验证。
