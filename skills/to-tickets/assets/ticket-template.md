# <NN>：<任务标题>

## 交付（Delivery）

<用户能观察或独立验证的完整行为；不是单层实现清单。>

## 验收（Acceptance）

- [ ] <具体场景、预期结果和验证方式>
- [ ] <必要边界或失败路径>

## 前置依赖（Blocked by）

<无，或前置任务的编号、名称/链接及真实阻塞理由。依赖无环。>

## 来源（Source references）

- <规格、计划或决定的路径/链接及定位；不复制完整规格>

## Parent（可选）

<源自已有 parent issue 时填写引用；否则删除本节。不关闭或修改 parent。>

## 未决项与状态

<无，或尚待决定的内容。状态选待决定/被阻塞/可实施；关键设计未定不得标可实施。项目采用该词汇时，可实施对应 ready-for-agent；阻塞边仍决定当前 frontier。>

## 远程 issue 形式

发布时每项一 issue，依赖顺序 blocker first；使用以下字段，不将本模板说明本身复制到 issue 中：

- **Parent：** 来源是已有 issue 时填 parent 引用，否则省略。
- **What to build：** 用户视角的端到端行为，不是逐层实现清单。
- **Acceptance criteria：** 可检查的 checklist，含必要边界和失败路径。
- **Blocked by：** 阻塞 issue 的真实 ID/链接及理由；无阻塞写 None (can start immediately)。已建立原生阻塞边时可省略本节。
- **Source references：** 规格和决定的定位；必要的未决项及状态。

标签使用项目已有 vocabulary；已存在且获准时使用 ready-for-agent，或服从用户指定，不擅自创建标签。两种形式均避免固化易过时的实现路径/代码；仅允许注明来源、裁剪到决定核心的 prototype 片段。