# 来源与适配

- source: https://github.com/mattpocock/skills
- source-commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- source-path: `skills/engineering/wayfinder`
- adaptation-version: `2`
- license: [MIT 原文](./LICENSE)，Copyright (c) 2026 Matt Pocock。

保留目的地、已决索引、精确问题依赖、尚未具体化与范围外划分。支持本地 Markdown，不依赖 tracker、标签、认领、未知 Skill API 或远程研究分支；不强制单会话单决定。`assets/map-template.md`、`decision-template.md` 为本地适配补充，地图结构借鉴上游正文，均不是上游同名独立文件。

更新时比较固定上游、目标上游与本包差异；按本包版本迁移，不直接覆盖。版本 1 为初次安装；版本 2 补两份模板、入口指针和逐包来源记录。运行不依赖源码缓存。