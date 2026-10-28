# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/productivity/handoff`
- adaptation-version: `3`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留按接手目标压缩状态、引用已有产物和去除敏感信息。仅用户通过 `/handoff` 或明确点名调用本技能时使用，禁用模型调用；默认聊天输出，不因上下文变长中断任务。授权保存时优先项目路径，无项目短期交接支持 Windows TEMP。`assets/handoff-template.md` 为本地适配补充，不是上游同名文件。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 补交接模板、入口指针和逐包来源记录；版本 3 限定为用户显式调用，保留 slash 入口并禁用模型调用。运行不依赖源码缓存。