# 实验运行记录模板

每个实际 run 一份，放项目自己的唯一 run 目录。已有调度器/实验追踪系统能提供字段时引用它，不重复抄录。

- run ID / task ID / parent / owner：
- 当前课题 / 代码库或 worktree / 实际记录入口：
- launch 来源与实际范围（Auto 继承默认授权，无需第二次批准）：
- 唯一方法正文 / 实验协议位置：
- Q/H/M/P revisions 与依赖产物：
- code worktree / git SHA / dirty diff 快照与指纹 / 未跟踪必要文件快照：
- 完整配置快照、覆盖参数与指纹：
- 数据来源、revision、划分、预处理：
- seed、流顺序、reset、状态持久性、预测/更新时机：
- 环境或 lockfile、checkpoint 来源与指纹：
- 精确命令 / cwd / 必需环境变量名（不记录秘密值）：
- 主机 / GPU UUID / 设备预留位置：
- PID 与进程起始标识或 job ID：
- 开始/结束时间 / 状态 / 退出码来源：
- 唯一 stdout/stderr 日志、状态文件、checkpoint、原始指标位置：
- 预期比较、核心指标与允许解释：
- 最新观察 / 下次检查时间：
- 版本是否仍 current / 已知偏差 / 失败原因：
- 父级验收结果与证据：

启动前核对版本、授权、设备和是否已有同一 run；启动成功不代表实验完成。失败重试产生新 attempt/run，保留旧证据，不覆盖日志。