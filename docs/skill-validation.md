# 技能交付验收记录

日期：2026-10-27。范围：七个已安装技能的本地适配版本 2；逐包版本与来源见[适配索引](./skill-adaptations.md)。

## 静态检查：通过（已执行范围）

使用 `C:\Program Files\nodejs\node.exe` 标准库检查实际安装文件；不使用 shell 中的 winpty 别名，不安装依赖。固定源码 HEAD 核对为 `59db609eb1e18aaf59b63284d0e52255aff0c63c`。

| Skill | description 字符数 | SKILL.md 行数 | 字段、来源、链接与许可 |
|---|---:|---:|---|
| `to-tickets` | 199 | 22 | 通过 |
| `code-review` | 239 | 31 | 通过 |
| `writing-for-agents` | 248 | 23 | 通过 |
| `handoff` | 249 | 29 | 通过 |
| `retro` | 261 | 22 | 通过 |
| `prototype` | 233 | 26 | 通过 |
| `wayfinder` | 245 | 27 | 通过 |

具体检查包括：

- 入口分隔符、唯一字段名、目录/name 一致、description 非空且不超过 1024 字符、入口少于 500 行；两个调用字段均为相应布尔值。
- 用严格标量格式检查当前入口的实际字段：固定 name、JSON 兼容双引号字符串和布尔值；本次未调用通用 YAML parser。已检查常规 Node/npm 及 VS Code/扩展的可复用模块，未找到独立解析包，不将这项检查宣称为通用 YAML 解析通过。
- 七包各有 `SOURCE.md`，source/commit/path/adaptation-version 字段完整、源路径存在，版本为 2；技能目录不是 symlink。
- 五份承诺资源均存在且有对应入口的明确读取指针；七包内 16 条相对 Markdown 链接均存在，Markdown 文件没有尾随空白。
- 七份 LICENSE 与固定上游原文逐字节 SHA-256 一致：`4981c5f6a90eb3a969dacabb9350f5a75695ff3910b39b6534952908dfdc5ff7`。
- 在 `~/.agents/skills/` 和 `~/.claude/skills/` 未发现这七个名字的重复入口。
- `git check-ignore -q` 对两份维护文档均返回 1（未忽略）；对 `docs/unrelated.md` 和 `config.json` 均返回 0（继续忽略），只放行两份记录。

## 内容审阅与差异

前次安装的独立审阅建议已落实：UI 参考要求原型生产隔离，入口保留当前任务授权边界。本轮尝试请求 Critic 独立审阅，但代理服务连接失败，故本轮新增内容未完成独立审阅；不能沿用前次审阅作为新增内容已审阅的证据。

- VS Code 对本轮修改的四份受检 Markdown 文件（本记录、适配索引、User Layer 规范、工程指引）均未报告错误；技能目录没有相关诊断输出。
- `git diff --check` 退出码为 0。Git 对 `.gitignore` 和 `instructions/engineering.instructions.md` 提示工作副本 CRLF 将规范化为 LF；未报告空白错误。
- 最终工作区状态包含预期的七个未跟踪技能目录、两份放行文档和三份被修改的规范文件；未执行提交或推送。

## 产品发现证据

本轮没有独立验证 VS Code/Copilot 是否发现或展示这些入口；当前文件的静态检查不证明产品发现行为。

## 运行时行为：按用户决定跳过

用户在 2026-10-27 明确选择不执行 slash 菜单、自动触发、正负行为和权限负例测试；不制作专用行为 fixture，不将这些测试作为本轮交付门槛。此状态为跳过/未测试，不是 PASS。后续遇到真实问题再针对性微调。

技能中的任务授权、只读审查、隔离原型等方法边界继续有效；跳过测试不等于取消边界或已证明行为正确。

## 2026-11-03 文档式讨论流程

新增个人 [discussion 技能](../skills/discussion/SKILL.md)与[讨论模板](../skills/discussion/assets/discussion-template.md)，支持起草可评论方案、处理逐项意见、多轮修订、确认范围、清理已解决线程和定稿承接。通过 [grill-me 活文档模式](../skills/grill-me/references/docs-mode.md)衔接；在 User Layer 规格登记。未新增 Agent、全局 Instructions、自动化脚本或锁机制，未迁移任何既有项目讨论。

独立 Critic 只读审阅提出评论跨轮追踪、归档重试去重、并发写入及定稿承接缺口；后续补充了 Agent 维护稳定线程、归档前查重、写前对照原文并保留冲突、承接前重读目标与按确认范围合并。补充后的行为尚未经过真实多轮会话复测；提示词约定不提供原子写入保证。

实际静态检查：使用现有 Node 标准库检查新技能入口的分隔符、字段唯一性、目录/name 一致、非空描述与参数提示、两个调用布尔值、描述长度和入口行数；检查技能、模板、衔接引用、规格与本记录的相对链接及行尾空白。另运行现有科研框架检查器和 `git diff --check`，三个检查退出码均为 0，输出已写入并读取工作区 `output.txt`。这是本次针对性检查，不是通用 YAML parser 验证。

未验证：新会话技能发现与 slash 菜单展示、真实逐轮评论覆盖、归档中断恢复、并发编辑保护、定稿合并。2026-10-27 对另一批技能的运行测试豁免不作为本技能已验证的依据。