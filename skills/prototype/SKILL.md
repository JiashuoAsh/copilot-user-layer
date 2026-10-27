---
name: prototype
description: "Use when a concrete design question about UI, interaction, state, logic, or technical feasibility is easier to answer with a small throwaway artifact than with prose. Choose the smallest prototype that can discriminate among options."
user-invocable: true
disable-model-invocation: false
---

# 用原型回答具体问题

原型是回答问题的临时制品，不是低质量生产实现。先写明要回答的问题、预期观察、停止条件和限制，再选择路径：

- **UI 外观或布局：** 阅读 [`references/ui.md`](./references/ui.md)。选择能比较结构差异的方案，而非只换颜色或文案。
- **逻辑或状态模型：** 阅读 [`references/logic.md`](./references/logic.md)。覆盖难以凭文字判断的边界状态，并让状态变化可见。
- **技术可行性或性能：** 阅读 [`references/feasibility.md`](./references/feasibility.md)。设计最小实验测量关键假设和约束。

## 通用规则

1. 若问题分支明显，直接选对应参考；否则根据周边代码和目标判断，关键歧义会改变产物时先澄清。
2. 遵循仓库约定放置原型并明显标记为临时。没有约定且获准写文件时，使用 `.scratch/<effort>/prototype/`；不为安装或讨论预先创建空目录。
3. 默认隔离生产数据与外部副作用；需要持久化时使用专门的临时存储并标注清理方式。
4. 原型只实现能回答问题的最小范围。是否需要测试或测量由要验证的主张决定；不为速度牺牲区分假设所必需的证据。
5. 记录结论、证据、局限和下一步。原型不自动部署、提交、推送或合入生产；获选方案应按正式工程标准重写或整合，而非默认复制临时代码。

## 完成判据

预先定义的问题得到有证据支撑的判断，或明确说明实验未能判定；记录哪些条件未覆盖。无执行权限或工具时只提供原型设计，不声称已运行。
