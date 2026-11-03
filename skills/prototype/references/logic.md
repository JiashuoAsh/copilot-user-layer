# 逻辑与状态原型分支

仅当核心问题是状态模型、状态转移或业务逻辑是否符合预期时使用。如果问题是界面外观，改读 [`ui.md`](./ui.md)。

1. 在 demo 顶部用可见文字明确状态模型、要回答的问题、预期观察、停止条件和限制。
2. 将真正回答问题的逻辑隔离为一个可移植的纯模块：可用 reducer、显式 state machine、纯函数集合或确实拥有持续内部状态的清晰 class/module。模块不得引用 DOM、`document` 或按钮 handler；页面只能调用模块。
3. 使用一个免安装、可双击打开、可邮件分享的单 HTML 文件，内联 HTML/CSS/JS，不用 framework、bundler 或 server。使用领域语言，不把 reducer 或内部 API 术语暴露给非开发者。
4. 按层次展示标题与问题说明、完整当前状态、每个 action 一个始终可用的 free-play 按钮，以及按 tab 组织的 guided walkthrough。每个场景说明初始情况和观察重点，每一步是真实按钮，开始时重置到已知初始状态；优先覆盖 happy path、难推理的 edge case 和非法 action。
5. 页面保持克制：清晰字体、充足间距和一个 accent colour，不添加会抢走状态与按钮注意力的动画或装饰。记录运行方法、每次动作后的观察、未覆盖条件和结论。
6. 结论成立后，将已验证的纯逻辑模块迁入正式代码；保留 HTML shell、逻辑模块和结论作为 throwaway 分支或等价审计位置的 primary source。无执行能力时给出设计，不称其为已验证。
