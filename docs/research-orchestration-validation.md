# 科研协作 v2.1 交付与验收

当前名称映射：`Research Orchestrator` → `Research Run`（`agents/research/entry/research-orchestrator.agent.md`），`Autonomous Research Orchestrator` → `Research Auto`（`agents/research/entry/autonomous-research-orchestrator.agent.md`），`Research Investigation Coordinator` → `Research Investigate`（`agents/research/entry/research.agent.md`），`Research Ideation Partner` → `Research Explore`（`agents/research/entry/research-explore.agent.md`）。下方已完成的交付/验收内容为历史证据快照，旧称、旧 hash 和既有 PASS 数量保持不变；本次迁移段记录当前目录与注册事实，历史导航链接按需指向新路径。

## 2026-11-03 Agent 名称与目录迁移记录

当前 Agent 文件树如下，basename 保持不变：

```text
agents/
├── core/
│   └── critic.agent.md
└── research/
	├── entry/
	│   ├── research-orchestrator.agent.md          # Research Run
	│   ├── autonomous-research-orchestrator.agent.md # Research Auto
	│   ├── research-explore.agent.md               # Research Explore
	│   └── research.agent.md                       # Research Investigate
	├── coordination/
	│   ├── implementation-lead.agent.md
	│   ├── experiment-lead.agent.md
	│   └── debate-moderator.agent.md
	├── specialists/
	│   ├── evidence-auditor.agent.md
	│   ├── experiment-designer.agent.md
	│   ├── experiment-runner.agent.md
	│   ├── literature-scout.agent.md
	│   ├── reproducibility-engineer.agent.md
	│   └── research-implementer.agent.md
	└── inactive/
		└── method-lead.agent.md
```

共 15 个 Agent 文件：14 个活动角色（含 Critic）和 1 个停用角色；4 个研究用户入口位于 `entry/`。VS Code 对 `agents/research/entry/`、`agents/research/coordination/`、`agents/research/specialists/` 三个活动目录逐个注册；`agents/research/inactive/` 不注册。既有 `core/` 和 `optional/` 注册项保留。allowlist 按新 Agent 名称精确匹配，不把显示 label 当作角色标识；该注册方案只描述当前 VS Code，不外推到 CLI。迁移只涉及名称、路径、注册说明和文档导航，不改变权限、行为、工具、模型或调用图；未修改 agents、scripts、settings 或 skills 文件。

静态迁移检查结果：待父级补证。此记录不构成新的 PASS，不覆盖或重算后文历史数量与 hash。

日期：2026-10-30。状态：**配置已写入，静态检查及部分工作线运行已验证；整体部分验收，存在已观察的行为失败。** 用户要求完整构建后集中由 Agent 验收，本轮未要求逐角色手工测试。

## 当前交付（历史快照：2026-10-30）

- 两个用户启动入口：Research Orchestrator、Autonomous Research Orchestrator。
- Research Investigation Coordinator 保留科学调查综合，可被调用；Research Ideation Partner 保留用户构想入口及向外科学委派。
- Implementation Lead / Research Implementer 和 Experiment Lead / Experiment Runner 两条工作线；简单任务可以直接派给叶子。
- Debate Moderator 有四项启动条件及停止/返回契约；普通路径两条委派边，Moderator 最长路径三条。
- Method Lead 候选保留但关闭用户入口和模型调用，不在活动白名单。
- [协作协议](../research-guides/orchestration.md)、任务和运行模板、检查器、总规范及工程/项目记录指针同步。

未改全局设置、MCP 或模型提供商，没有固定角色 `model:`，未启动 GPU/训练、安装依赖或提交推送。旧候选未整仓回滚或删除。

## 静态证据

前置条件：现有 Node；在 `/home/lijiashuo2021/.copilot` 运行 `node scripts/validate-research-framework.cjs > output.txt 2>&1`，随后读取日志；另执行 `git diff --check`。结构检查入口：[validate-research-framework.cjs](../scripts/validate-research-framework.cjs)。

实际检查结果：15 个 Agent 的受限 frontmatter 语法与必需字段；精确批准白名单、无未知角色/通配/回环；最长三条委派边；叶子工具及入口可见性；停用 Method Lead；26 份文档和 47 个本地文件引用；协议入口和行尾空白。11 个反例覆盖重复键、不支持语法、未闭合头部、回环、未知角色、通配、不可调用子角色、错误构想入口、Tab、过深路径。最终数量和快照在下方收口记录中核对。

检查器是明确拒绝不支持语法的 scalar/array 子集解析，**不是通用 YAML parser**。Node 环境未发现 yaml/js-yaml，Ruby 也不可用；没有安装依赖。最初临时正则检查漏掉 Tab，独立 Critic 找到后已修复并补拒绝反例。编辑器当前无相关诊断，不以此代替运行测试。

最初“范围外指纹不变”检查失败，未找到可复核的逐文件初始清单，因此不作“所有范围外文件均未变化”的证明。未执行任何整仓恢复或清理。

## 运行证据与可复核位置

会话：`e1f84dda-e1fa-4752-97ec-170189aad305`。原始轨迹：`/home/lijiashuo2021/.vscode-server/data/User/workspaceStorage/a24930761b36091987474a57ee8f8313/GitHub.copilot-chat/transcripts/e1f84dda-e1fa-4752-97ec-170189aad305.jsonl`。这是本地运行证据，不加入 Git；以下工具调用 ID 可用于定位，不凭 worker 自述认定嵌套。

| 场景 | 实际证据 | 结论 |
|---|---|---|
| Critic 材料读取 | 调用 `call_e3421c04f6324046885af4b714061191`；报告准确返回当时 root 文件末段及 57 行总长 | 当前只读材料取证可用；不保证所有来源覆盖 |
| SMOKE-IL-01 | Lead 与 Implementer 调用均有轨迹，但将 Agent 配额误读成普通工具预算 | 失败，未完成前置读取；澄清预算定义 |
| SMOKE-IL-02 | Lead `call_e9abda5957314426a7729ec09510d892` → Implementer `call_be599407a72048e4b9e063a2c8bdda27`；转录约 2823–2860 行含双方读取、成功返回及父级核对 | 只读嵌套、版本/任务 ID、模板原文传递已验证，2/2 Agent 调用 |
| TOY-IL-01 | Implementer `call_f677b54d99fc4beaa01dcbea49586de7`；6 个常规测试通过，Lead 独立大数检查失败 | 成功拒绝有缺陷交付；写入边界失败见下 |
| TOY-FIX-01 | 直接 Implementer `call_0a861336c2b744c6b2dea7bfadefa35a`；新增回归修复前 8 通过/2 失败，修复后 10/10 | 失败反馈与限定修复；M1/P1 未变 |
| TOY-EL-01 | Lead `call_40066303431c41699a0e3cdc5933252f`；三次 Runner 请求见下；仅一次测量进程 | 固定协议输出可核对；分支预算失败 |
| BUDGET-EL-02 | 修正规则后 Lead 实际读取两份文件，child=0 时返回 blocked，新增子调用 0 | 零余额停止场景通过；不抹去前次超额 |
| DEBATE-NO-01 | Moderator 读取配置和协议，拒绝等价文件名偏好争议，子调用 0 | 条件不足不启动场景通过；符合条件的完整 Debate 未测试 |

隔离样例：`/tmp/copilot-orchestration-smoke-e1f84dda-v21/`。SPEC 定义 M1/P1：在线均值必须先预测后更新、无未来信息、无跨调用状态；Node 自带测试，无依赖或 GPU。

修复后的源码 SHA-256：`58868bfae39c376c99b408333971b4948374911844c5f2ed0c9e46d96b6233bb`；测试：`502c6bd3c0b5ff07dba52ac0ab1ee62a10038329f57cf087edf4ab72a4b46317`；SPEC：`3b06fab09bd815257eaaf4d759adb3498db0f420afee15431676d0c07d05fcb3`。

样例 `run-01/record.json`、`completion.json`、`raw-output.json` 已实际读取。固定输入 `[2,4,8]`，因果预测 `[0,2,3]`，MSE 11；泄漏 oracle MSE 0，只是负面对照。测量 PID 1579177，`spawnSync` 记录退出码 0，运行前后上述三个输入指纹一致。原始 JSON SHA-256：`5100cd0b4735b5243d3e4b304f11b268a2523375f229c3e1b5e8d8a7eb16d787`。父级接受该单次输出证据，不将运行数值正确等同于整个工作线合规。`/tmp` 可能被系统清理；本记录保留结果、指纹及原始轨迹定位。

## 已观察的失败与修正

1. **临时文件越界：** 首轮 Implementer 创建后删除 `output.txt.check`，不在三个允许文件内。转录约 3019、3036 行有 Add/Delete patch。最终目录无残留不代表没有越界。已明确临时/退出状态文件也受 allowlist 约束；限定修复任务未新增文件。未安装文件写入沙箱。
2. **实验分支超预算：** 分配 2 次含 Lead，实际 Lead 加 Runner 三次请求共 4 次。Runner 请求 `call_249bef9d0a6445e09c53a50141a5fa39`（模型错误）、`call_b070311616f04575b586c5e4c0f1061b`（blocked）、`call_18d5823583204ffbaf5a8424f20d7fc5`（执行）。失败和 blocked 都必须计费/计配额。已在 Lead 和协议中明确尝试前扣账、耗尽不得模型换名重试；零余额停止已单独复测。未证明失败后的动态扣账在所有场景正确。
3. **日志规则误解：** 首个 Sol Runner 因把唯一运行日志与允许覆盖项目 output.txt 误判成冲突而 blocked；之后澄清才执行。原始实验输出保存在唯一 run 目录，项目 output.txt 只是该命令的合并输出。
4. **数值实现失败：** 初版累计和溢出，合法大数预测出现 Infinity。Lead 拒绝验收后按 M1/P1 修复递推均值，加入同号/异号极值、次正规数回归。只支持所测浮点行为，不宣称任意精确舍入。

独立 Critic 首次发现 YAML/旧检查器/Coordinator 协议缺口；修正后复核未发现首版配置阻断问题，另修正执行者描述以允许向实际派工 parent（root 或 Lead）返回。内容审阅不证明运行规则必然得到遵守。

## 模型与平台边界

当前 debug-log 的模型目录含 `gpt-6.1-sol`、`gpt-6-astra`、`gpt-6-luna`（vendor 字段 OpenAI）。目录不是账单，也不是精确执行路由证明。

- `gpt-6.1-sol (copilot)` 实际请求失败；`gpt-6.1-sol (customendpoint)` 在 Runner 子调用中成功返回并执行。
- `gpt-6-astra (customendpoint)` 的 `MODEL-ASTRA-01` Critic 请求成功返回，指出 oracle 目标泄漏；没有可独立观察的实际模型/provider 回执，标为未知。
- 未测 Luna，也未测 Sol 主会话自动升级 Astra、关键任务降级、请求费用和 token 归属。共享策略已写，不固定角色模型，不把成功请求当作自动路由完成。
- [官方文件参考](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference)明确 Local 显式 `agents` 名单可覆盖 worker 的 `disable-model-invocation`；因此“用户启动”还依赖其他角色名单不包含该入口。Copilot harness 不采用 Local 的 `agents` 字段，不能声称跨 harness 硬隔离。[harness 说明](https://code.visualstudio.com/docs/agents/run/agent-harnesses)区分 Local 与 Copilot，选模型不会切换 harness。
- 当前会话启动时的可调用角色清单没有新双 root；未尝试绕过用户启动边界来伪造 root 验收。实际用户选择、发现刷新和两个入口端到端行为仍缺证据。

## 未覆盖及下一步

保留未覆盖：双 root 用户入口、完整自主迭代和 revision 失效传播；正向 Debate 及三边调用链；其他角色主动调用 Ideation 的禁止路径；新会话恢复/不重复启动；并行写入隔离；GPU 预留与长运行；自动模型升级/降级和收费归属。无需用户逐个做测试；支持相应会话接口后集中继续，当前不宣称完整验收。

单写者、预算、版本和资源规则是指令级约定，实际已出现预算和路径偏差；没有新增硬调度器、沙箱或常驻守护进程。此前旧候选声称的预扣费阻塞未找到本轮可复核证据，不作为当前结论。

## 最终收口检查

最终组合检查实际退出成功，工作区 `output.txt` 已读取：检查器全部 PASS；`node --check scripts/validate-research-framework.cjs` 和 `git diff --check` 无错误；父级独立复跑样例测试 10/10 通过、0 失败/跳过，核对原始 JSON SHA-256、测量退出码 0 和三个输入指纹全部一致。未再次启动测量。相关编辑器诊断无错误。

当前配置快照涵盖按路径排序的 15 个 `.agent.md`、协作协议和检查器，共 17 文件。每文件 SHA-256 组成 `path + NUL + hash` 条目，再以换行连接并取 SHA-256：`998101dbecaaa90083dd5048bcba371f73967b16487c81ce8ece693ba3dbcadd`。此快照不包括可变日志和本文档；后续变更不能自动沿用本次配置验证。

收口结论：首版配置可审阅；上述静态及限定样例结果成立。已观察的越界写入和预算超额不因后续修正变成通过；双入口和完整自动模型/自主研究行为继续保持未验证。

## 2026-11-03 用户级实验指令部署与冲突核对

用户批准将实验比较和执行偏好部署为跨项目 Instructions，并在部署后检查冲突。新增 [Experiment Comparison](../instructions/experiment-comparison.instructions.md) 与 [Experiment Execution](../instructions/experiment-execution.instructions.md)，使用任务相关 `description`，不设置会让所有文件都加载完整正文的 `applyTo`。现有 [工程指令](../instructions/engineering.instructions.md)增加显式任务读取入口；协作协议和 Experiment Lead/Runner 传递适用路径并要求读取。配置未改变 Agent 调用图、工具、模型、宿主审批或现有自主授权。

### 冲突与优化

- `output.txt` 覆盖与原始证据保留：通用命令摘要和 run 独占日志分开；并行任务不争写共享摘要。若入口要求输出目录不存在，使用独立启动日志，不提前创建其拒绝覆盖的目录。
- GPU/日志规则重复：通用执行细则迁到用户级执行指令；协作协议保留框架跨项目启动所有权和记录集成要求，Runner 引用持久运行及检查节奏，不维护第二份完整规则。
- 项目路径和指标污染：未迁入 `mm_ctta`、特定报告器/测试路径、固定 `runs/` 布局及 accuracy 字段；运行时读取项目协议、实现及测试。方法允许的 checkpoint 差异由项目合同决定。
- Hash 与比较混淆：代码来源不作为同条件输入相等门槛；输入、方法配置、收据完整性分别判断。部分或不同输入结果仅能带限制描述，不能冒充完整同条件比较；重跑按实际影响决定。
- 权限与触发范围：只读相关代码检查适用审查标准，不因此启动实验或查询无关 GPU。读取指令不授予执行权，也不要求重新申请已经有效的自主项目授权。
- 独立 Critic 已实际读取两份新指令、工程入口、协议及相关角色，指出“一卡一个训练实验”缩窄了附件的“一卡一个实验”；已改为涵盖训练、评估与推理的“一卡一个 GPU 实验”。其余指定范围未发现实质冲突，审阅不等于运行保证。

### 验证方法与边界

前置条件为现有 Node，无需新增依赖。执行 `node scripts/validate-research-framework.cjs`，校验新增指令 frontmatter、任务级激活约定、工程/协议/工作线指针、Agent 图和本地引用；执行 `node --check scripts/validate-research-framework.cjs` 和 `git diff --check`，并检查编辑器诊断。命令输出覆盖到工作区 `output.txt` 后读取。

新文件出现在宿主后续请求的指令发现列表、实际读取触发和真实运行遵从性需要各自的运行证据；本次只读审阅不能证明新会话自动加载。未启动训练、查询 GPU、改项目报告器或回写原始收据，未改未命名附件及其他项目的指令。旧验证快照不能用于证明本次配置。

本次实际结果：检查器通过 15 个 Agent、5 份用户指令、31 份文档、63 个本地文件引用及 12 个负向用例；`node --check`、`git diff --check` 退出码均为 0，相关编辑器诊断无错误。扩展检查器最初因不支持合法 `applyTo` 键而失败，已精确补支持和重复键反例后复跑通过。两份新指令均由 `git ls-files --others --exclude-standard` 列出，可被 Git 收录；未修改忽略规则或提交。以上证据只支持本次静态部署及指定范围兼容性审阅。

## 2026-11-03 用户中止式持续自主研究

本次依据用户“持续自动研究，看到后主动终止并检查”的决定，更新了 [Autonomous Research Orchestrator（历史名称）](../agents/research/entry/autonomous-research-orchestrator.agent.md)、[共享协作协议](../research-guides/orchestration.md)、[总体规划](research-agent-collaboration-plan.md)、[用户层规格](../COPILOT_USER_LAYER_SPEC.md) 和[内容审查台账](agent-content-review.md)。自主模式现默认持续围绕同一核心研究问题安排调查、实现、验证、实验和失败诊断；完成一个阶段、返回一个分支、暂时没有 ready 子任务或耗尽单轮六次扇出额度都不是自动停止条件。批次入口仍保留有限批次规则。

保留的停止边界包括：用户明确要求停止、暂停、检查或改变运行方式；达到用户明确设置的总时长/费用/调用/资源/写入上限；必须改变核心问题、已有假设、评价标准或数据规则；必须越出默认项目授权；真实安全、权限或宿主运行时阻断；以及继续只会重复已有检查且没有可保留研究路径。用户要求检查时暂停新增派工并汇总状态，但不默认终止健康的外部实验。持续模式是当前 Agent 会话内的行为约定，不是跨窗口常驻 daemon 或自动唤醒机制。

### 本次静态验证

实际执行并读取工作区 `output.txt`：检查器通过 15 个 Agent、5 份用户指令、31 份文档、63 个本地文件引用和 12 个负向用例；`node --check scripts/validate-research-framework.cjs` 通过；`git diff --check` 通过；相关编辑器诊断无错误。旧配置快照不覆盖本次修改，因此不将旧快照作为本次验收证据。

### 尚未验证

以下行为仍需要真实 Agent 会话证据，当前不宣称已经通过：一个子目标完成后自动进入下一项有区分力的工作；单轮六次派工后无需用户批准而续轮；用户要求检查时暂停新增派工并正确汇总；用户主动终止时不误杀健康实验；会话中断后能依据记录恢复；以及不同 harness 对持续入口可见性和用户启动边界的实际表现。长实验是否按执行指令独立持续，也未在本次启动验证。

## 2026-11-03 Agent 目录分层与用户入口改名

用户批准将研究 Agent 按 `entry/`、`coordination/`、`specialists/`、`inactive/` 分层，并将四个可见入口改名为 Research Run、Research Auto、Research Investigate、Research Explore。文件 basename 保持不变；调用白名单同步精确名称，关联技能和项目记录权限条件同步为 Research Explore。没有改变工具、权限、模型或调用图。VS Code User `chat.agentFilesLocations` 保留 `core` 和 `optional`，注册三个活动研究目录，不注册 `inactive`。VS Code Agent 搜索路径只读直接子文件，因此分别注册目录；选择菜单不会按这些目录分组。此结论限于已核对的 VS Code 版本及当前配置方式，不外推至 CLI 或其他 harness。

### 静态迁移验证

实际执行并读取 `output.txt`：检查器通过 15 个 Agent、调用白名单/可见性/图深度、目录分配、无旧平铺文件、`Method Lead` 停用隔离、5 份用户指令、37 份文档、116 个本地链接和空白检查；12 个负向 parser/graph fixture 通过。`node --check scripts/validate-research-framework.cjs` 通过，`git diff --check` 通过，相关编辑器诊断无错误。检查器第一次运行时新目录检查代码曾报 `file is not defined`，随后定位并修正；后一次完整检查通过。该失败不改写为初次通过。

### 尚未验证

VS Code 是否在重载后发现新注册目录、菜单实际显示四个新入口，以及各入口是否能按新 `name` 完成真实调用，仍待产品运行证据。本次静态设置读取和文件验证不证明已重载或运行时可见；用户可执行一次 `Developer: Reload Window` 刷新，之后在 Agent 菜单和自定义 Agent 诊断中核对。历史验收记录中的旧名称、旧路径、hash 和当时检查结果保持原样，不作为本次迁移验证证据。

## 2026-11-03 研究方案与课题记录部署

用户在 R2 评论处理后明确“全部批准，开始实施吧”。本次完成个人层配置部署；[讨论结果](discussions/research-proposal-and-record-layout.md)保留确认范围与有效入口，[评论历史](discussions/archive/research-proposal-and-record-layout.md)逐字保存原始问题、批准和被替代约定。没有迁移实际课题、启动实验或训练、查询 GPU、安装依赖、改全局设置、提交或推送。

### 实际变更

- 新增[研究方案与方法交付规范](../research-guides/proposal-delivery.md)，统一完整方案的论证关系；子问题与假设按需，局部查询仍局部交付。
- 更新[项目记录规范](../research-guides/project-records.md)：先定位课题，代码库/worktree、记录入口和运行产物分开；支持 `research/` 多课题容器与自定义布局，不预建空模板或强制迁移。按需拆 proposal、唯一 method/methods、协议、实现、证据和协作记录。
- [协作协议 v3](../research-guides/orchestration.md)加入 topic 上下文、方法正文引用和全部共享正文的同课题 root 集成；更新两个模板。不同课题共享源码仍按实际路径协调独占写者。
- 四入口实际接入按任务读取；两 Lead、两执行者继承课题和记录上下文。四阶段技能保留交互模式，并明确 Auto 委派不重复请求用户批准。专项专家的现有输出结构保留，由父级按任务传入要求。
- Research Auto 明确课题自主推进后默认授权研究闭环；课题内方法、候选假设和必要协议调整不再自动触发用户审批，旧记录缺少逐动作许可不是阻塞。明确锁定、停止、真实宿主权限、科研诚信、既有数据/健康进程保护仍保留，其他入口不扩权。
- 名称、frontmatter 工具、调用白名单、目录注册和 Method Lead 停用状态不变；仅为本次结果与历史文档添加精确 Git 允许项。

### 静态检查与独立审阅

前置条件为现有 Node；在用户层根目录执行 `node scripts/validate-research-framework.cjs`、`node --check scripts/validate-research-framework.cjs` 和 `git diff --check`，stdout/stderr 覆盖到 `output.txt` 后实际读取。首轮结果：15 个 Agent、5 份指令、40 份文档、153 个本地文件链接通过；原 12 个 parser/graph 负例与新增 4 个交付契约负向变异通过。新增反例覆盖丢失共享规范、入口引用丢失，以及 Auto/协议恢复旧审批条款。链接数量随结果页收口变化，最终重跑数量以收尾记录为准。

独立 Critic 实际读取共享规则、四入口、工作线和执行者、四技能、模板及相关总说明，逐项审阅 13 个场景：单课题默认、多课题明确续接、自定义入口、课题歧义、无假设/未成熟方案、短任务、拆 proposal 保留评论、复杂方法拆分、多候选、共享正文/源码并发、Auto 无动作许可、Auto 科学调整、明确限制/停止/宿主拒绝。13 项均有对应内容规则；它没有执行这些入口，不记为行为通过。

审阅发现讨论主稿仍标“部分确认、未部署”，与实际批准和实施不一致；已归档回读全部评论与新批准，将主稿收为 R3 结果页，并同步总规范和规划当前状态。未发现本次指定规则范围内其他实质冲突。编辑器检查无相关诊断；不以此代替静态命令或实际调用证据。

### 实际覆盖边界

检查器是受限 frontmatter/文本契约/本地链接检查，不是通用 YAML、目录解析器、权限沙箱或行为模拟器。13 场景是独立内容审阅，不证明四个用户入口已经按新规则运行；完整自主循环、实际多课题写入隔离、拆文档保留评论、新会话恢复和宿主刷新仍未实测。当前工具未提供用户入口启动/续接接口，也不通过将用户专用入口作为子 Agent 调用来伪造验收。

真实研究效果、GPU 预留、长进程和历史未覆盖行为保持未验证。既有十月运行轨迹与旧 hash 不覆盖本次配置；本次未增加常驻调度器、锁或写入沙箱。结论限定为配置已部署、静态检查与指定范围的内容审阅通过。

最终收尾复跑：15 个 Agent、5 份指令、40 份文档、158 个本地链接和空白检查通过；原 12 个负例及新增 4 个契约变异通过。`node --check`、`git diff --check` 均退出成功，23 个相关 Markdown/Agent/Skill/脚本文件的编辑器诊断无错误。新增交付规范、讨论结果页和评论历史均由 `git ls-files --others --exclude-standard` 列出，精确忽略例外生效，未提交。以上是当前配置的静态与内容证据，不升级为真实用户入口运行通过。