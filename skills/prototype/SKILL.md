---
name: prototype
description: "Use when a concrete design question about UI, interaction, state, logic, or technical feasibility is easier to answer with a small throwaway artifact than with prose. Choose the smallest prototype that can discriminate among options."
user-invocable: true
disable-model-invocation: false
---

# Prototype

原型是回答一个具体问题的临时制品，不是低质量生产实现。先写明问题、预期观察、停止条件、限制和假设，再选择唯一的主分支：

- **逻辑、状态或数据模型：** 阅读 [`references/logic.md`](./references/logic.md)。使用纯逻辑模块和一个免安装、可双击打开的单 HTML demo，覆盖 free-play 与 guided walkthrough。
- **UI 外观、布局或交互结构：** 阅读 [`references/ui.md`](./references/ui.md)。在同一路由上生成多个结构显著不同、可分享和切换的方案。
- **技术可行性或性能：** 阅读 [`references/feasibility.md`](./references/feasibility.md)。设计最小实验测量关键假设和约束。

如果分支确实不明确，依据周边代码判断：页面或组件通常走 UI，后端模块或状态模型通常走 logic；在原型顶部写明该假设。不要把 UI 原型误当作逻辑原型，或反过来。

## 两个分支共同适用

1. 从第一天就明确标记为 throwaway，放在实际使用位置附近并遵守仓库的启动约定；未有约定且获准写文件时使用 `.scratch/<effort>/prototype/`。
2. 默认只使用内存状态并隔离生产数据、生产构建、真实外部服务和其他副作用；确需持久化时使用明确标注的临时存储并写清清理方式。
3. 只实现能区分候选解释或回答问题的最小范围。不要添加无关抽象、未来功能或生产级错误处理；但不能删掉回答问题所需的方法、状态、观察或证据。
4. 每次状态变化或方案切换都展示完整相关状态。完成后记录结论、证据、局限、未覆盖条件和下一步；没有运行权限时只能提供设计，不能声称已运行。
5. 原型不自动部署、提交、推送或合入生产。验证后的结论应进入正式实现或决策记录，原型本身作为 primary source 留在 throwaway 分支或等价的审计位置。

## 完成判据

预先定义的问题得到有证据支撑的判断，或明确说明实验未能判定；结论能指向原型和观察结果，且写清哪些条件未覆盖。UI 要交付可分享的方案 URL/切换键；logic 要交付可双击运行的 HTML、可复用的纯逻辑模块和场景结论。
