# Copilot User Layer Specification

> **Status:** Frozen v1 Baseline
> **Version:** 1.0
> **Last Updated:** 2026-09-03
> **Scope:** User-level VS Code Copilot Agent environment (`~/.copilot`) only

## 0. Purpose

This document is the single source of truth for the user's personal VS Code Copilot Agent environment.

It records:

- current architecture;
- verified capabilities;
- accepted design decisions;
- frozen, deferred, and optional components;
- open questions;
- implementation roadmap;
- acceptance criteria;
- change history.

Repository-specific configuration belongs to `.github/` and is intentionally out of scope unless explicitly discussed.

---

# 1. Primary Goal

Build a stable personal Copilot Agent environment under:

```text
~/.copilot/
```

The environment should support both:

1. software engineering;
2. scientific research.

The goal is **not** to maximize the number of agents, skills, tools, or prompts.

The goal is to build a coherent system with:

- clear responsibility boundaries;
- minimal duplication with native Copilot capabilities;
- reusable workflows across repositories;
- strong context isolation;
- evidence-driven reasoning;
- deliberate tool access;
- maintainable configuration;
- safe defaults.

---

# 2. Core Design Principles

## P1. Native First

Use native Copilot capabilities whenever they already solve the problem well.

```text
Ask            → discussion / understanding
Plan           → planning
Agent          → implementation / execution
Explore        → codebase exploration
Code Review    → implementation / diff review
runSubagent    → subagent orchestration
```

Do **not** recreate these as custom agents without a demonstrated need.

Therefore, do not create by default:

```text
planner.agent.md
implementer.agent.md
explorer.agent.md
reviewer.agent.md
```

Custom components should fill genuine gaps.

---

## P2. User Layer ≠ Repository Layer

User Layer answers:

> How do I want agents to work across projects?

Repository Layer answers:

> How does this repository actually work?

User-level configuration may contain:

- general engineering principles;
- reusable scientific-research workflows;
- generic debugging methodology;
- generic verification rules;
- reusable specialized agents;
- cross-project safety policy.

User-level configuration must **not** assume:

- Python;
- pytest;
- uv;
- npm;
- a specific repository structure;
- a specific research project;
- a specific model architecture;
- project-specific validation commands.

Those belong to repository-level `.github/` configuration.

---

## P3. Specialize by Cognitive Responsibility

Do not create agents merely because they have different academic titles or domains.

Bad specialization:

```text
AI Expert
ML Expert
CV Expert
Research Expert
```

Prefer agents with genuinely different optimization objectives:

```text
Literature Scout
    → maximize literature coverage / recall

Evidence Auditor
    → maximize skepticism toward claims and evidence

Experiment Designer
    → maximize discriminative experimental design

Reproducibility Engineer
    → maximize implementation feasibility and reproducibility

Critic
    → identify important weaknesses in current reasoning
```

Agent differences should be functional, not cosmetic.

---

## P4. Skills and Subagents Have Different Jobs

Use a **Skill** when the question is:

> How should an agent perform this kind of work?

Examples:

```text
systematic-debugging
verification-before-completion
paper-reading
grill-me
```

Use a **Subagent** when the task benefits from:

- an independent context window;
- a distinct objective;
- substantial information gathering;
- context compression;
- parallel or semi-parallel investigation;
- independent criticism.

Example:

```text
Literature Scout
    searches many sources
        ↓
    filters and structures evidence
        ↓
    returns concise findings to coordinator
```

---

## P5. Context Isolation Is a Major Reason for Subagents

Subagents are not simply "more GPTs".

Their value includes:

```text
independent context
    +
specialization
    +
information compression
    +
possible parallelization
```

Large amounts of exploratory material should remain inside worker contexts whenever practical.

The parent agent should receive concise, structured findings rather than every intermediate search and reading step.

---

## P6. Prefer Orchestrator–Worker Architecture for Research

Scientific research uses a lead/coordinator plus specialized workers.

```text
                     Research Coordinator
                              │
                   decomposes research task
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
      Worker                Worker                Worker
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                     Coordinator synthesis
```

The coordinator owns:

- task decomposition;
- routing;
- worker selection;
- synthesis;
- conflict detection;
- deciding whether a second investigation wave is required.

Workers own specialized investigations.

---

## P7. Research Delegation Policy = Aggressive, Bounded, Role-Aware, and Phase-Aware

The Research Coordinator should prefer delegation whenever a subproblem benefits materially from:

- independent context;
- specialized objectives;
- substantial information gathering;
- competing evidence paths.

However:

> **Aggressive ≠ unbounded.**

Default guardrails:

```text
First wave:
    up to 4 independent worker tasks

Second wave:
    only when there is an evidence gap,
    unresolved conflict,
    implementation ambiguity,
    or a critical unverified assumption

Duplicate-role calls:
    avoid unless independent search tracks,
    replication, or competing hypotheses justify them
```

Delegation should also be **role-aware**:

```text
Literature Scout
    → discovery / coverage

Evidence Auditor
    → claim-evidence rigor

Experiment Designer
    → discriminating experiments

Reproducibility Engineer
    → implementation / reproduction realism

Explore
    → repository structure / symbols / concrete code facts

Critic
    → independent challenge after substantive work exists
```

For broad exploratory research, prefer a phase-aware pattern:

```text
Wave 1 — Discovery
    ↓
Intermediate Synthesis
    ↓
Wave 2 — Targeted Analysis
    ↓
Final Synthesis
```

Do not place Critic in first-wave discovery merely to increase worker count.

The coordinator should not invoke every worker merely because they exist.

---

## P8. Use Reflection Selectively

For important plans and designs:

```text
Main / Coordinator
        ↓
     proposal
        ↓
      Critic
        ↓
     findings
        ↓
 revised proposal
```

Critic should be independent and should not merely defend the existing plan.

Reflection is a default high-value pattern.

---

## P9. Do Not Maintain Multi-Agent Debate in v1

Position-based Multi-Agent Debate is **not part of the maintained Research Layer**.

Reason:

- specialized workers already provide independent evidence-oriented perspectives;
- Critic already provides reflection / adversarial review;
- Research Coordinator already synthesizes competing findings;
- position-based debate adds orchestration and token cost without enough expected benefit for the user's normal research workflow;
- assigning agents to defend positions can encourage artificial disagreement or selective evidence use.

For difficult A-vs-B decisions, use:

```text
Research Coordinator
    ↓
targeted specialized workers
    ↓
Critic
    ↓
evidence-based synthesis
```

Do not create or maintain a Debate agent unless a future real-world failure demonstrates that the current architecture cannot resolve an important class of decisions.

---

## P10. Keep the System Small Until Roles Prove Useful

Every custom component must answer:

1. What native capability is insufficient?
2. What unique responsibility does this component add?
3. Does it require independent context?
4. Would a Skill be sufficient instead?
5. Does it overlap an existing component?

If there is no clear answer, do not add it.

---

## P11. Share Specialized Workers Without Nesting Top-Level Coordinators

Engineering and scientific research have different top-level owners:

```text
Native Agent
    → engineering task ownership / implementation

Research Coordinator
    → scientific research orchestration / synthesis
```

Specialized workers may be shared across those top-level modes when their cognitive responsibility is directly useful.

```text
             Native Agent              Research
                  \                      /
                   \                    /
                    Shared Workers
```

For example, Native Agent may directly consult:

- Reproducibility Engineer when a scientific method must become concrete implementation;
- Evidence Auditor when a scientific claim materially affects an engineering decision;
- Experiment Designer when implementation needs a discriminating scientific validation plan;
- Literature Scout only when external scientific literature is genuinely required;
- Critic when a substantive plan or diagnosis needs an independent challenge.

Do **not** route ordinary engineering work through the Research Coordinator.

Default rule:

```text
Engineering owns implementation.
Research owns scientific synthesis.
Specialized workers may be shared.
Top-level coordinators should not be nested by default.
```

This avoids coordinator nesting, ownership ambiguity, recursive subagent orchestration, and unnecessary context cost.

---

# 3. Verified Environment

## 3.1 Model / Provider

The current environment uses a custom OpenAI-compatible endpoint with VS Code Copilot.

Verified capabilities:

| Capability | Status |
|---|---:|
| Chat | ✅ |
| Agent | ✅ |
| Tool calling | ✅ |
| `runSubagent` exposed | ✅ |
| Actual subagent execution | ✅ |
| Explore subagent through Custom Endpoint | ✅ |
| Critic custom subagent | ✅ |
| Native Code Review | ✅ Enabled |
| Rubber Duck | ⭕ Unavailable / optional |

The following execution path has been verified:

```text
Custom Endpoint GPT
        ↓
Copilot Main Agent
        ↓
runSubagent
        ↓
Explore / custom worker
        ↓
independent worker context
        ↓
summary returned to parent
```

Rubber Duck is not considered a blocker because general subagent orchestration works.

---

# 4. Target User-Layer Directory Structure

The maintained User Layer v1 structure is:

```text
~/.copilot/
│
├── instructions/
│   └── engineering.instructions.md
│
├── skills/
│   ├── systematic-debugging/
│   │   └── SKILL.md
│   │
│   ├── verification-before-completion/
│   │   └── SKILL.md
│   │
│   ├── paper-reading/
│   │   └── SKILL.md
│   │
│   └── grill-me/
│       └── SKILL.md
│
├── agents/
│   ├── core/
│   │   └── critic.agent.md
│   │
│   └── research/
│       ├── research.agent.md
│       ├── literature-scout.agent.md
│       ├── evidence-auditor.agent.md
│       ├── experiment-designer.agent.md
│       └── reproducibility-engineer.agent.md
│
└── hooks/
    └── safety/
        └── ...        # optional / deferred; not required by v1
```

The maintained v1 architecture does not require an `optional/debate.agent.md`.

Safety hooks may remain on disk as experimental/optional configuration, but User Layer v1 does not depend on them.

## 4.1 Agent Directory Discovery Policy

Do not rely on undocumented recursive discovery of nested directories under `~/.copilot/agents/`.

Register grouped Agent roots explicitly through VS Code settings:

```json
{
  "chat.agentFilesLocations": {
    "~/.copilot/agents/core": true,
    "~/.copilot/agents/research": true
  }
}
```

If an empty `optional/` directory or registration entry already exists, it is harmless, but it is not part of the maintained v1 specification.

This allows clean responsibility-based organization without flattening all `.agent.md` files into one directory.

---

# 5. Current User Layer

Frozen v1 status:

| Component | Status | Notes |
|---|---:|---|
| Engineering Instructions | ✅ Verified / retained | Global cross-project engineering behavior |
| `systematic-debugging` | ✅ Audited — PASS WITH PATCH | Root-cause methodology retained; narrowed, platform-agnostic, safer User-Layer version |
| `verification-before-completion` | ✅ Accepted v1 policy | Completion evidence gate; fresh/relevant/discriminating evidence; multi-agent evidence may be reused |
| `paper-reading` | ✅ Verified | Concrete-paper analysis through registered Skill mechanism |
| `grill-me` | ✅ Retained; manual-only policy | Intensive questioning should not auto-trigger |
| Native Explore | ✅ Verified | Repository reality / symbols / call sites / state flow |
| Critic | ✅ Verified | Shared read-only reasoning/design/diagnosis critic |
| Native Code Review | ✅ Enabled | Implementation/diff review; no custom reviewer needed |
| Research Coordinator | ✅ Verified / frozen v1 | Aggressive, bounded, role-aware, phase-aware |
| Literature Scout | ✅ Verified | Literature discovery worker |
| Evidence Auditor | ✅ Verified | Claim-evidence worker |
| Experiment Designer | ✅ Verified | Discriminating experimental-design worker |
| Reproducibility Engineer | ✅ Verified | Scientific method → implementation/reproducibility worker |
| Research → `paper-reading` integration | ✅ Verified | Uses registered Skill, not guessed filesystem paths |
| Research → Critic integration | ✅ Verified | Reflection after substantive work |
| Research multi-worker routing | ✅ Verified | Bounded worker routing |
| Native Agent → shared research workers | ✅ Architecture accepted | Direct cross-layer worker use allowed; no Research Coordinator nesting |
| Multi-Agent Debate | ❌ Removed | Not part of maintained v1 |
| User Safety Hooks | ⏸ Deferred / optional | Prototype exists; real VS Code hook invocation was not made a v1 dependency |
| MCP / Tool baseline | ✅ Locked for v1 | Minimum-necessary policy; no speculative global MCP expansion |
| User Layer v1 | ✅ Frozen baseline | Future changes require a demonstrated recurring capability gap |

---

# 6. Engineering Layer v1

**Status:** ✅ **Engineering Layer v1 frozen**

Native Agent is the engineering coordinator and owns implementation.

Do not add an extra Engineering Coordinator, Implementer, Debugger, Tester, QA, or Architecture agent unless repeated real work demonstrates a genuine missing responsibility.

## 6.1 Final Engineering Topology

```text
                              USER
                               │
                               ▼
                         Native Agent
                    engineering task owner
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                     │
          ▼                    ▼                     ▼
       Explore        systematic-debugging     Shared Workers*
    repo reality            Skill              when justified
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               ▼
                        diagnosis / plan
                               │
                               ▼
                        implementation
                               │
                               ▼
                 verification-before-completion
                               │
                      fresh scoped evidence
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
              Critic                  Native Code Review
        reasoning / design             implementation / diff
                               │
                               ▼
                         completion report
```

`*` Shared scientific workers are consulted selectively; they do not take engineering task ownership.

The conceptual engineering lifecycle is:

```text
UNDERSTAND
    ↓
INSPECT
    ↓
DIAGNOSE / PLAN
    ↓
IMPLEMENT
    ↓
VERIFY
    ↓
REVIEW
    ↓
REPORT
```

This is not a mandatory full pipeline. Simple work may compress to:

```text
inspect → edit → targeted verification
```

## 6.2 Engineering Delegation Policy

Engineering uses:

```text
DIRECT-FIRST
+
EVIDENCE-DRIVEN
+
SELECTIVE DELEGATION
+
NO COORDINATOR NESTING
```

Routing rules:

| Situation | Route |
|---|---|
| Simple implementation | Native Agent |
| Need repository facts, symbols, call sites, state flow | Explore |
| Unexplained bug/test/build/runtime/regression failure | `systematic-debugging` |
| Substantive plan/diagnosis/design needs independent challenge | Critic |
| Concrete paper must be understood | `paper-reading` |
| Scientific method must become concrete implementation | Reproducibility Engineer |
| Scientific claim materially affects implementation scope | Evidence Auditor |
| Need an experiment that distinguishes competing explanations | Experiment Designer |
| Explicit or genuinely necessary scientific literature lookup | Literature Scout |
| Implementation is about to be reported complete | `verification-before-completion` |
| Existing implementation/diff needs review | Native Code Review |
| Broad scientific synthesis is the primary task | User selects Research |

Do not invoke every worker merely because it exists.

Critic should have a concrete reasoning object to criticize; it is not a first-wave discovery worker.

Literature Scout has a high trigger threshold in engineering tasks.

## 6.3 Cross-Layer Worker Sharing

Allowed:

```text
Native Agent → Reproducibility Engineer
Native Agent → Evidence Auditor
Native Agent → Experiment Designer
Native Agent → Literature Scout   # only when justified
Native Agent → Critic
```

Not the default:

```text
Native Agent → Research Coordinator → worker
```

Research remains user-invocable and is not made an automatic child coordinator of Native Agent.

## 6.4 Engineering Freeze Policy

Engineering Layer v1 is architecturally complete.

Modify it only when real engineering work shows a repeatable failure or capability gap:

```text
real engineering task
    ↓
repeatable failure / capability gap
    ↓
identify whether the cause is routing, Skill, tool, prompt, or role design
    ↓
make the smallest justified change
```

Safety Hooks are explicitly outside the blocking core and remain optional/deferred.

---

# 7. Scientific Research Layer

**Status:** ✅ **Research Layer v1 frozen**

The maintained research architecture uses a coordinator, specialized epistemic workers, reusable Skills, native Explore, and selective reflection through Critic.

## 7.1 Final Research Topology

```text
                       Research Coordinator
                 AGGRESSIVE / BOUNDED / ROLE-AWARE
                         / PHASE-AWARE
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
  Literature Scout     Evidence Auditor     Experiment Designer
  breadth / search     claim / evidence     experimental logic
          │                   │                    │
          └──────────────┬────┴─────┬──────────────┘
                         │          │
                         ▼          ▼
                  paper-reading   Reproducibility Engineer
                      Skill          implementation / repro
                         │          │
                         └────┬─────┘
                              ▼
                           Critic
                              │
                              ▼
                       Research Synthesis
```

Native `Explore` remains available alongside this topology for repository structure, symbol tracing, and concrete codebase investigation.

No Debate agent, nested debate, or agent swarm is required for Research v1.

## 7.2 Freeze Policy

Research Layer v1 is considered architecturally complete.

Freeze means:

> Do not add or redesign research agents without a demonstrated failure from real scientific work.

Future maintenance should follow:

```text
real research task
    ↓
repeatable failure or capability gap
    ↓
identify whether the gap is routing, prompt, Skill, tool, or role design
    ↓
make the smallest justified change
```

Do not modify the architecture merely because another agent role could theoretically be added.

---

# 8. Research Roles

## 8.1 Research Coordinator

**Type:** user-invocable coordinator
**Status:** ✅ Verified / frozen v1
**Delegation policy:** aggressive, bounded, role-aware, phase-aware

Primary responsibilities:

- understand the research question;
- determine which parts should be delegated;
- split broad questions into independent investigation tracks;
- select appropriate workers;
- synthesize evidence;
- detect contradictions;
- identify missing evidence;
- trigger a second investigation wave when justified;
- produce the final research-level answer.

The coordinator should not personally perform every deep investigation.

Recommended invocation policy:

```yaml
user-invocable: true
disable-model-invocation: true
```

Research mode should be explicitly selected by the user rather than spontaneously activated during ordinary coding tasks.

### Coordinator Tool Policy

Maintained v1 tool set:

```text
vscode
read
search
web
agent
todo
```

Rationale:

- enough local context for coordination;
- enough external access for small targeted verification;
- `agent` enables worker orchestration;
- `todo` supports bounded task decomposition;
- avoids turning Research into a mega-agent that bypasses specialized workers.

Do not give Research broad editing, dependency-installation, environment-management, browser-automation, or implementation tools by default.

### Delegation Guardrails

```text
First wave:
    maximum ~4 independent worker tasks by default

Second wave:
    evidence gaps / conflicts / implementation ambiguity /
    critical unverified assumptions only

Avoid:
    calling every worker by default
    duplicate workers without justification
    recursive delegation without clear value
```

For broad exploratory tasks:

```text
Wave 1 — Discovery
    ↓
Intermediate Synthesis
    ↓
Wave 2 — Targeted Analysis
    ↓
Final Synthesis
```

For an already explicit target, route directly to the relevant worker rather than forcing a discovery wave.

Critic is normally a post-synthesis / post-proposal reflection step, not a first-wave literature worker.

---

## 8.2 Literature Scout

Primary question:

> What relevant work exists?

Optimize for:

```text
coverage / recall / source discovery
```

Responsibilities:

- discover relevant literature;
- identify major research directions;
- identify seminal and recent work;
- distinguish directly relevant from peripheral work;
- construct a candidate literature map;
- provide source metadata and evidence to the coordinator;
- flag uncertain or conflicting bibliographic information.

Should **not**:

- make the final novelty judgment;
- deeply audit every experiment;
- edit repository files;
- run arbitrary shell commands;
- install dependencies;
- clone repositories unless explicitly handed to another role.

### Initial Tool Policy

```text
✅ web
✅ search
✅ read

❌ edit
❌ execute / terminal
❌ browser by default
```

Rationale:

- `web` handles current external information and ordinary literature discovery;
- `search` handles workspace/local research material;
- `read` handles known local files;
- browser interaction is unnecessary for the first version;
- implementation / repo execution belongs to Reproducibility Engineer.

### Future Upgrade

If native web retrieval proves insufficient for scholarly recall or citation metadata, consider a dedicated academic-search MCP layer such as tools backed by:

```text
OpenAlex
Crossref
Semantic Scholar
arXiv
```

Do not add this preemptively.

---

## 8.3 Deep Paper Analysis → Reuse `paper-reading` Skill

**Status:** ✅ Verified integration

A standalone `Scientific Analyst` Subagent is **cancelled**.

Deep analysis of a concrete paper or small explicitly named set of papers is handled by the existing:

```text
paper-reading Skill
```

Reasons:

- paper reading is primarily a reusable method/workflow;
- the existing Skill already covers method mechanisms, assumptions, formulas, experiments, limitations, and reproducibility risks;
- a separate Scientific Analyst Agent would substantially duplicate this capability.

Verified routing:

```text
Research
    ↓
concrete paper identified
    ↓
registered paper-reading Skill
    ↓
deep paper workflow
    ↓
optional targeted Auditor / Designer / Repro / Critic work
    ↓
Research synthesis
```

### Skill Invocation Discipline

Use the registered Agent Skill mechanism when `paper-reading` is appropriate.

Do not manually emulate Skill loading by guessing filesystem paths to `SKILL.md`.

The canonical maintained Skill remains under:

```text
~/.copilot/skills/paper-reading/
```

A temporary failed lookup to `~/.agents/skills/...` was observed during testing, but VS Code Customizations correctly discovered the canonical Skill and subsequent automatic Skill routing succeeded.

Do not duplicate the Skill into multiple personal Skill roots merely to mask a guessed-path failure.

Potential future enhancement:

- test Skill context forking / isolated execution only if a real context-management need appears;
- preserve the Skill as the canonical paper-analysis methodology.

---

## 8.4 Evidence Auditor

Primary question:

> Do the experiments actually support the claims?

Responsibilities:

- map Claim → Evidence;
- inspect baseline fairness;
- inspect ablations;
- inspect evaluation protocols;
- identify missing controls;
- detect unsupported conclusions;
- distinguish empirical evidence from speculation;
- identify confounders;
- identify data leakage or evaluation leakage risks;
- flag evidence that is insufficient for the claimed scope.

Optimize for:

```text
skepticism / evidential rigor
```

Should not invent criticism merely to appear critical.

---

## 8.5 Experiment Designer

Primary question:

> How should this hypothesis be tested?

Responsibilities:

- define research hypotheses;
- select appropriate baselines;
- design controls;
- design ablations;
- define metrics;
- identify failure cases;
- separate diagnostic experiments from headline experiments;
- design experiments capable of distinguishing competing explanations;
- detect when an experiment cannot answer the intended question.

Optimize for:

```text
discriminative experimental design
```

---

## 8.6 Reproducibility Engineer

Primary question:

> Can this idea actually be implemented and reproduced?

Responsibilities:

- inspect implementation feasibility;
- inspect repository/code requirements;
- identify hidden dependencies;
- evaluate training/adaptation requirements;
- identify compute and memory constraints;
- identify ambiguous implementation details;
- identify reproducibility risks;
- translate scientific descriptions into concrete implementation requirements;
- use Explore when repository inspection is needed.

Optimize for:

```text
implementation realism
```

---

## 8.7 Critic

**Status:** ✅ Implemented and verified

Role:

Independent second opinion shared by engineering and research workflows.

May review:

- research plans;
- architecture;
- method designs;
- experimental plans;
- debugging conclusions;
- implementation decisions;
- coordinator syntheses.

Optimize for:

```text
finding important weaknesses missed by the primary agent
```

Critic remains read-only and should not silently become an implementer.

---

## 8.8 Multi-Agent Debate

**Status:** ❌ Removed from maintained Research v1

Decision:

```text
Do not maintain a Debate agent.
Do not enable nested debate.
Do not build an agent swarm.
```

Reason:

The maintained combination of:

```text
specialized epistemic workers
    +
Critic reflection
    +
Research synthesis
```

already provides the useful multi-perspective analysis required for normal scientific research.

For strong competing hypotheses, route the disagreement through evidence-oriented roles rather than assigning agents to defend positions.

Reconsider Debate only if a concrete, repeatable real-world task demonstrates that this architecture cannot resolve an important class of scientific decisions.

---

# 9. Research Routing Rules

The Research Coordinator should not invoke every worker for every task.

## 9.1 Broad Literature Question

```text
Research Coordinator
        ↓
Literature Scout × independent tracks as justified
        ↓
Intermediate literature map
        ↓
key concrete papers → paper-reading Skill as needed
        ↓
targeted second-wave workers only if necessary
        ↓
Coordinator synthesis
```

## 9.2 Analyze One Concrete Paper

```text
Research
        ↓
paper-reading Skill
        ↓
Evidence Auditor if empirical support must be challenged
        ↓
Experiment Designer if missing evidence must be designed
        ↓
Reproducibility Engineer if implementation realism matters
        ↓
Critic only when an independent second opinion is useful
        ↓
Research synthesis
```

Do not ask every worker to reread the paper from scratch.

## 9.3 Design a New Method

```text
Research Coordinator
        ↓
Literature Scout / paper-reading as needed
        ↓
preliminary method synthesis
        ↓
Experiment Designer
        +
Evidence Auditor when claims/evidence require auditing
        +
Reproducibility Engineer when implementation feasibility matters
        ↓
Critic
        ↓
revision / synthesis
```

## 9.4 Evaluate an Existing Proposed Method

```text
Research Coordinator
        ↓
Evidence Auditor
        +
Experiment Designer
        ↓
Critic when a broader independent challenge is valuable
        ↓
synthesis
```

## 9.5 Turn a Method into Implementation

```text
paper-reading / method understanding
        ↓
Reproducibility Engineer
        ↓
Explore if repository inspection is required
        ↓
implementation requirements / risks
```

## 9.6 Strong Competing Hypotheses

Use evidence-oriented specialization rather than position-based Debate:

```text
Research Coordinator
        ↓
Evidence Auditor
        +
Experiment Designer
        +
Literature Scout / Reproducibility Engineer as justified
        ↓
Critic
        ↓
evidence-based synthesis
```

Do not force a winner when evidence is insufficient.

## 9.7 Simple Tasks

If the question is straightforward and does not materially benefit from independent context or specialized investigation:

```text
Research
    → answer directly
```

Aggressive delegation does not require delegation for trivial work.

---

# 10. Skill Layer

Target core User Skills:

```text
systematic-debugging
verification-before-completion
paper-reading
grill-me
```

Research Skills should be added only when they encode reusable methodology rather than separate worker responsibilities.

---

## 10.1 `systematic-debugging`

**Status:** ✅ Audited — **PASS WITH PATCH**

Purpose:

> Why is this failing, and what is the root cause?

Accepted User-Layer behavior:

```text
failure
  ↓
evidence
  ↓
root-cause hypothesis
  ↓
smallest discriminating check
  ↓
confirmed cause
  ↓
minimal coherent fix
  ↓
validation
```

The retained Skill is intentionally generic and cross-project:

- no global assumption of Python, pytest, Git, Bash, npm, or another specific tool;
- use repository-defined diagnostics and validation;
- prefer evidence before speculative patches;
- trace bad data/state upstream;
- treat repeated failed fixes as a signal to reassess evidence and assumptions, not automatic proof of an architectural flaw;
- do not silently perform destructive or environment-mutating diagnostics;
- keep role boundaries with Explore, Critic, Code Review, and verification.

Recommended invocation policy:

```yaml
user-invocable: true
disable-model-invocation: false
```

Trigger narrowly for actual failures whose cause is not yet established, not for routine feature work.

---

## 10.2 `verification-before-completion`

**Status:** ✅ Accepted as Engineering v1 completion gate

Purpose:

> What fresh evidence supports the exact claim that the task is complete?

Core invariant:

```text
No completion claim without evidence.
```

Evidence should be:

```text
fresh
+
relevant
+
discriminating
+
inspectable
```

Key policy:

- claim scope must not exceed evidence scope;
- targeted evidence may justify a targeted claim without pretending the whole project is validated;
- a check is stronger when it could actually fail if the claim were false;
- evidence produced by another worker in the current workflow may be reused when it still matches the current state and is inspectable;
- do not mechanically rerun expensive validation merely so the parent agent owns the command;
- use repository-defined validation rather than global pytest/npm/etc. assumptions;
- never manufacture a passing result by weakening meaningful validation;
- if meaningful validation cannot be run, report what is implemented, what is verified, and what remains unverified;
- unexplained validation failures return to `systematic-debugging`.

Invocation policy:

```yaml
user-invocable: false
disable-model-invocation: false
```

This is a completion-claim gate, not a testing framework, debugger, reviewer, or release process.

---

## 10.3 `paper-reading`

**Status:** ✅ Existing / retained / integration verified

Purpose:

Deep critical analysis of one concrete paper or a small explicitly named set.

This Skill replaces the previously proposed standalone `Scientific Analyst` Subagent.

Research Coordinator automatic routing to the registered Skill has been smoke-tested successfully.

Canonical location:

```text
~/.copilot/skills/paper-reading/
```

Do not duplicate the same Skill across multiple personal Skill roots unless a future migration is deliberate and documented.

---

## 10.4 `grill-me`

**Status:** ✅ Retained; manual-only policy accepted

Desired invocation policy:

```yaml
user-invocable: true
disable-model-invocation: true
```

Reason:

Grill Me is intentionally intensive and should run only when explicitly requested.

It must never unexpectedly interrogate the user during an ordinary task.

---

# 11. Components Explicitly Rejected or Deferred

Do not add by default:

```text
planner.agent.md
implementer.agent.md
explorer.agent.md
reviewer.agent.md
scientific-analyst.agent.md
debate.agent.md
```

Reasons:

```text
Plan                     → native capability
Agent                    → native implementation capability
Explore                  → native subagent
Code Review              → native reviewer
Scientific Analyst       → paper-reading Skill already covers it
Debate                   → specialized workers + Critic + synthesis are sufficient for v1
```

Also rejected for the maintained v1 architecture:

```text
nested-subagent debate
agent swarm
deep recursive orchestration
```

Do not add generic agents such as:

```text
AI Expert
ML Expert
Thinking Agent
General Researcher
Coding Expert
```

unless a unique cognitive responsibility can be demonstrated by a repeated real-world capability gap.

A generic `Researcher` worker is unnecessary because the top-level Research Coordinator already owns research orchestration.

---

# 12. Hooks Policy

**Status:** ⏸ **Deferred / optional for User Layer v1**

Hooks are not required for the frozen User Layer v1 architecture.

A safety-hook prototype was developed for destructive command detection, and its standalone PowerShell/Bash guard logic was tested. However, real VS Code `PreToolUse` invocation behavior was not made a release blocker and further Hook work was intentionally deferred because it is low-frequency and the VS Code Hooks surface remains nonessential to the core workflow.

If revisited, User-level hooks should enforce only deterministic rules valid across essentially all repositories.

Reasonable future uses:

```text
high-confidence destructive command checkpoint
secret protection
irreversible operation checks
```

Do not place repository-specific validation in User hooks.

Examples that belong to Repo Layer:

```text
pytest
uv run ...
npm test
cargo test
ruff
project-specific build commands
```

Hooks must remain an outer guardrail, not a substitute for semantic Instructions, Skills, normal tool permissions, or repository-level policy.

---

# 13. Tool / MCP Policy

**Status:** ✅ **v1 baseline locked**

Principle:

```text
Minimum necessary tool exposure.
```

Core native capabilities may include:

```text
read
search
edit
execute / terminal
agent / runSubagent
todo
web where appropriate
```

Individual custom agents should receive only the tools required by their role.

Frozen examples:

```text
Research Coordinator
    vscode + read + search + web + agent + todo

Literature Scout
    web + search + read

Evidence Auditor
    read + search + web

Experiment Designer
    read + search + web

Reproducibility Engineer
    read + search + web + execute

Critic
    read-only investigation/search capability
```

MCP policy for v1:

- do not install global MCP servers merely because they might be useful;
- native tools remain the default;
- keep cross-application MCP auto-discovery disabled;
- keep collision behavior conservative (`disable`);
- do not enable server-side sampling unless a concrete server requires it;
- experimental MCP Apps / assisted installers are not part of the required v1 baseline;
- academic-search MCP is deferred until native literature retrieval repeatedly shows a real limitation;
- browser automation, databases, Playwright, Docker-specific MCP, RPFM, and other specialized tools should generally be repository/workspace-specific unless recurring cross-project use is demonstrated.

`Chat › MCP: Access = all` is acceptable as a transport-level master switch when the actual installed/configured MCP inventory remains intentionally small; it does not justify broad MCP installation.

Do not equate:

```text
more tools = better agent
```

Too many tools can increase:

- context overhead;
- routing ambiguity;
- accidental tool selection;
- security surface.

Sensitive or destructive capabilities should not receive broad global auto-approval.

Future MCP additions require a concrete recurring use case or demonstrated gap.

---

# 14. Security / Maintenance Policy

Do not treat the entire:

```text
~/.copilot/
```

directory as configuration source code.

It may also contain runtime/state data such as:

```text
session-state/
chats/
logs/
ide/
installed-plugins/
config.json
settings.json
...
```

Do not blindly run:

```bash
git init
git add .
git push
```

inside `~/.copilot`.

If configuration is backed up or version-controlled, include only explicitly reviewed customization directories/files such as:

```text
instructions/
skills/
agents/
hooks/
```

Never commit secrets, tokens, credentials, private session state, or logs.

---

# 15. Construction Roadmap

## 15.1 Foundation — Complete

```text
U0  Custom Endpoint compatibility          ✅
U1  Engineering Instructions               ✅
U2  Skill / Subagent architecture          ✅
U3  Critic + native engineering roles      ✅
N1  Native Explore                         ✅
N2  Native Code Review                     ✅
N3  runSubagent compatibility              ✅
```

## 15.2 Research Layer — Frozen v1

```text
R0  Research topology design               ✅
R1  Grouped agent directories              ✅
R2  chat.agentFilesLocations               ✅
R3  Research Coordinator                   ✅
R3.1 Phase-aware refinement                ✅
R4  Literature Scout                       ✅
R5  Coordinator → Scout integration        ✅
R6  Evidence Auditor                       ✅
R7  Experiment Designer                    ✅
R8  Reproducibility Engineer               ✅
R9  paper-reading integration              ✅
R10 Critic integration smoke test          ✅
R11 Multi-worker routing smoke test         ✅
R12 Research Layer freeze v1               ✅
```

## 15.3 Engineering Layer — Frozen v1

```text
E0  Engineering topology design            ✅
E1  Audit systematic-debugging             ✅ PASS WITH PATCH
E2  verification-before-completion         ✅ Accepted v1 gate
E3  Engineering routing discipline         ✅
E4  Shared research-worker architecture    ✅ Accepted
E5  Engineering safety Hooks               ⏸ Deferred / optional
E6  Engineering Layer acceptance           ✅
E7  ENGINEERING LAYER FREEZE               ✅
```

Engineering v1 does not require Hooks to function.

## 15.4 User Layer — Frozen v1 Baseline

```text
U4  Tool / MCP baseline audit              ✅ Locked for v1
U5  Security / backup policy               ✅ Defined
U6  User Layer structural acceptance       ✅
U7  USER LAYER v1 FREEZE                   ✅
```

The v1 freeze is architectural and operational, not a claim that every optional integration has been exhaustively benchmarked.

Deferred items remain explicitly non-blocking:

```text
Safety Hooks / VS Code PreToolUse integration
Academic-search MCP
parallelism performance benchmarking
future repo-specific .github layers
```

---

# 16. Open Questions

## Q1. `paper-reading` vs Scientific Analyst

**Resolved.**

Decision:

```text
Reuse paper-reading Skill.
Do not create Scientific Analyst Subagent.
```

Status: ✅ Closed

---

## Q2. Literature Scout Tool Access

**Resolved for v1.**

Initial tool policy:

```text
web + search + read
```

No edit, terminal/execute, or browser by default.

Academic-search MCP is deferred until native retrieval demonstrates a real limitation.

Status: ✅ Closed for v1

---

## Q3. Parallel Subagents

**Resolved sufficiently for v1.**

Observed behavior:

- the current Custom Endpoint can execute multiple subagents;
- Research successfully issued multiple worker calls during real research tests;
- bounded multi-worker orchestration is functional.

Precise latency/concurrency benchmarking is not required for the architecture freeze.

Future performance tuning may measure:

- actual overlap in execution;
- provider rate limits;
- latency benefit from parallel dispatch.

Status: ✅ Closed for architecture / performance benchmarking deferred

---

## Q4. Research Coordinator Autonomy

**Resolved.**

Policy:

```text
AGGRESSIVE
+
BOUNDED
+
ROLE-AWARE
+
PHASE-AWARE
```

Status: ✅ Closed

---

## Q5. Generic Researcher Agent

**Resolved for v1.**

Decision:

```text
Do not create a generic Researcher worker.
```

The top-level Research Coordinator plus specialized workers already cover the needed responsibilities.

Status: ✅ Closed for v1

---

## Q6. Multi-Agent Debate

**Resolved.**

Decision:

```text
Remove Debate from the maintained Research Layer.
```

Do not maintain:

- `debate.agent.md`;
- nested-subagent debate;
- agent swarm behavior.

Reconsider only after a demonstrated real-world capability gap.

Status: ✅ Closed

---

## Q7. Academic Search MCP

Native `web` is sufficient for v1.

Revisit only if literature recall, citation metadata, or scholarly graph navigation proves inadequate in repeated real tasks.

Status: ⬜ Deferred

---

## Q8. Research Layer Changes After Freeze

What justifies modifying Research v1?

Decision rule:

```text
real task
    ↓
repeatable failure / measurable capability gap
    ↓
smallest justified change
```

Speculative complexity or an interesting new agent pattern is not sufficient justification.

Status: ✅ Policy resolved; future changes evidence-driven

---

## Q9. Native Agent → Research Coordinator

**Resolved for v1.**

Decision:

```text
Do not make Native Agent automatically invoke the Research Coordinator.
```

Native Agent may directly use specialized shared workers when justified.

Reason: avoid coordinator nesting, ownership ambiguity, recursive orchestration, and context cost.

Status: ✅ Closed for v1

---

## Q10. Engineering Safety Hooks

**Resolved for v1.**

Decision:

```text
Hooks are optional / deferred and do not block User Layer v1.
```

Standalone guard logic may remain available for future use, but real VS Code Hook integration is not a required dependency.

Status: ⏸ Deferred / non-blocking

---

## Q11. Global MCP Expansion

**Resolved for v1.**

Decision:

```text
Do not add global MCP servers without demonstrated recurring need.
```

Native tools are sufficient for the current baseline.

Status: ✅ Baseline locked; future additions evidence-driven

---

## Q12. User Layer Changes After Freeze

Use the same maintenance rule across Engineering and Research:

```text
real task
    ↓
repeatable failure / concrete capability gap
    ↓
identify exact cause
    ↓
smallest justified change
```

Interesting new tools, agents, or Skills are not sufficient justification by themselves.

Status: ✅ Policy resolved

---

# 17. Acceptance Criteria

**User Layer v1 architecture is accepted and frozen.**

Acceptance is based on the following baseline:

1. Native Agent remains the owner of engineering implementation.
2. Simple engineering tasks remain direct and do not trigger an agent roster.
3. Explore owns ordinary repository reality inspection.
4. `systematic-debugging` provides evidence-first root-cause discipline for unexplained failures.
5. `verification-before-completion` gates completion claims with fresh, relevant, discriminating evidence.
6. Critic challenges substantive reasoning/design/diagnosis without replacing implementation review.
7. Native Code Review remains the implementation/diff reviewer.
8. Research Coordinator can delegate to specialized research workers and synthesize their findings.
9. Research delegation remains aggressive, bounded, role-aware, and phase-aware.
10. `paper-reading` covers concrete-paper analysis without a duplicated Scientific Analyst agent.
11. Literature Scout, Evidence Auditor, Experiment Designer, and Reproducibility Engineer retain distinct cognitive responsibilities.
12. Native Agent may directly consult shared scientific workers when engineering genuinely needs their expertise.
13. Native Agent does not route ordinary engineering tasks through the Research Coordinator.
14. Top-level coordinators are not nested by default.
15. Multi-Agent Debate, nested debate, deep recursive orchestration, and agent swarms are not required.
16. Skills do not encode repository-specific commands in the User Layer.
17. Tool exposure remains role-specific and understandable.
18. Global MCP expansion is evidence-driven rather than speculative.
19. User-level security/backup policy excludes runtime state, secrets, chats, logs, and credentials from blind version control.
20. Safety Hooks are optional and may remain deferred without invalidating v1.
21. The system remains small enough to explain, maintain, and revise deliberately.
22. Frozen architecture changes only after a demonstrated repeatable failure or capability gap.

The freeze does **not** claim:

- exhaustive performance benchmarking of subagent parallelism;
- successful deployment of optional safety Hooks on every platform;
- installation or validation of academic-search MCP;
- completion of repository-specific `.github/` layers.

Those are explicitly outside the blocking v1 baseline.

---

# 18. Decision Log

## D001 — Native-first architecture

**Decision:** Use Copilot native capabilities before creating custom equivalents.
**Status:** Accepted.

---

## D002 — Separate User and Repo layers

**Decision:** User Layer stores personal reusable behavior; Repo Layer stores repository facts and workflows.
**Status:** Accepted.

---

## D003 — Use specialized cognitive roles

**Decision:** Research agents are separated by optimization objective rather than academic-domain labels.
**Status:** Accepted.

---

## D004 — Use orchestrator–worker for research

**Decision:** Research Coordinator controls specialized worker agents and synthesizes their results.
**Status:** Accepted.

---

## D005 — Critic is a shared cross-domain subagent

**Decision:** The existing Critic is reused for both engineering and scientific research.
**Status:** Accepted and verified.

---

## D006 — Reflection before position-based debate

**Decision:** Use specialized workers plus Critic reflection for difficult research decisions. Do not treat Multi-Agent Debate as a default quality mechanism.
**Status:** Accepted.

---

## D007 — Custom Endpoint supports subagents

**Decision:** Treat Custom Endpoint + `runSubagent` as supported in the current environment.
**Evidence:** Explore, Critic, and research workers executed successfully through the current endpoint.
**Status:** Verified.

---

## D008 — Reuse `paper-reading`

**Decision:** Cancel standalone Scientific Analyst Subagent. Use the existing `paper-reading` Skill for deep single-paper analysis.
**Reason:** Skill semantics fit the task and avoid duplicated responsibility.
**Status:** Accepted and integration verified.

---

## D009 — Literature Scout tool policy

**Decision:** Initial Literature Scout tools are `web + search + read`.
**Excluded by default:** edit, terminal/execute, browser.
**Status:** Accepted.

---

## D010 — Aggressive Research Delegation

**Decision:** Research Coordinator uses aggressive delegation with bounded fan-out.
**Status:** Accepted.

---

## D011 — Multi-Agent Debate removed

**Decision:** Do not maintain Multi-Agent Debate in Research v1.
**Reason:** Specialized epistemic workers, Critic reflection, and coordinator synthesis already cover the useful multi-perspective analysis while avoiding position-driven artificial disagreement and extra orchestration cost.
**Status:** Accepted; supersedes the v0.2 optional-Debate decision.

---

## D012 — Grouped Agent Directories

**Decision:** Organize maintained agents by responsibility under `core/` and `research/`. Register these directories explicitly through `chat.agentFilesLocations` instead of relying on implicit recursive discovery.
**Status:** Accepted and verified.

---

## D013 — Research Coordinator tool policy

**Decision:** Maintain a coordinator-focused tool set:

```text
vscode + read + search + web + agent + todo
```

**Reason:** Enough capability for orchestration and targeted verification without collapsing the coordinator into a mega-agent.
**Status:** Accepted.

---

## D014 — Phase-aware Research orchestration

**Decision:** Broad exploratory research uses:

```text
Wave 1 Discovery
    ↓
Intermediate Synthesis
    ↓
Wave 2 Targeted Analysis
    ↓
Final Synthesis
```

Explicit targeted questions may route directly to the relevant worker.
**Status:** Accepted and smoke-tested.

---

## D015 — Registered Skill mechanism for `paper-reading`

**Decision:** Concrete-paper analysis should use the registered `paper-reading` Skill mechanism, not guessed filesystem paths or a duplicated Scientific Analyst agent.
**Status:** Accepted and verified.

---

## D016 — Research Layer v1 Freeze

**Decision:** Freeze the current Research architecture after R1–R11 acceptance.
**Maintenance rule:** modify the architecture only after a demonstrated, repeatable real-world failure or capability gap.
**Status:** Accepted.

---

## D017 — Shared Research Workers Across Top-Level Coordinators

**Decision:** Native Agent and Research Coordinator may both use specialized workers directly when appropriate.
**Constraint:** Native Agent does not automatically invoke Research Coordinator.
**Principle:** Engineering owns implementation; Research owns scientific synthesis; top-level coordinators are not nested by default.
**Status:** Accepted.

---

## D018 — Engineering Delegation Policy

**Decision:** Engineering uses:

```text
DIRECT-FIRST
+
EVIDENCE-DRIVEN
+
SELECTIVE DELEGATION
+
NO COORDINATOR NESTING
```

Simple work stays direct; delegation must materially improve context isolation or specialized reasoning.
**Status:** Accepted.

---

## D019 — `systematic-debugging` Audit

**Decision:** Retain the Skill after User-Layer adaptation.
**Audit result:** PASS WITH PATCH.
**Key changes:** narrow trigger, platform/tool neutrality, safer diagnostics, remove absolute test/VCS assumptions, preserve root-cause methodology.
**Status:** Accepted.

---

## D020 — `verification-before-completion` Completion Gate

**Decision:** Use a model-invocable, non-user-invocable Skill as the engineering completion evidence gate.
**Evidence policy:** fresh + relevant + discriminating + inspectable; reuse current worker evidence when valid; report unverified scope explicitly.
**Status:** Accepted.

---

## D021 — Safety Hooks Deferred

**Decision:** Safety Hooks are optional and non-blocking for User Layer v1.
**Reason:** semantic Engineering/Research architecture is complete; Hook integration is low-frequency and not required for the core workflow.
**Status:** Deferred.

---

## D022 — Tool / MCP Baseline Lock

**Decision:** Keep native tools and minimum-necessary role toolsets as the v1 baseline. Do not add global MCP servers without recurring demonstrated need.
**Status:** Accepted.

---

## D023 — User Layer v1 Freeze

**Decision:** Freeze Research Layer v1, Engineering Layer v1, and the Tool/MCP baseline as the personal Copilot User Layer v1.
**Maintenance rule:** changes require a repeatable real-world failure or concrete capability gap and should be the smallest justified modification.
**Status:** Accepted.

---

# 19. Change Log

## v1.0 — 2026-09-03

- Promoted the specification from active construction to **Frozen v1 Baseline**.
- Added P11: specialized workers may be shared across Native Agent and Research without nesting top-level coordinators.
- Froze Engineering Layer v1 with Native Agent as engineering owner.
- Formalized Engineering routing as **DIRECT-FIRST + EVIDENCE-DRIVEN + SELECTIVE DELEGATION + NO COORDINATOR NESTING**.
- Recorded the `systematic-debugging` audit result as **PASS WITH PATCH** and documented its narrowed cross-project role.
- Accepted `verification-before-completion` as the completion evidence gate with fresh, relevant, discriminating, inspectable evidence and reusable worker evidence.
- Documented direct Native Agent use of Reproducibility Engineer, Evidence Auditor, Experiment Designer, Literature Scout (high threshold), and Critic.
- Kept Research Coordinator user-invocable rather than making it an automatic child coordinator of Native Agent.
- Marked Engineering Safety Hooks as **deferred / optional / non-blocking**.
- Locked the Tool/MCP v1 baseline around minimum necessary tools and no speculative global MCP expansion.
- Updated roadmap, acceptance criteria, and open questions to reflect frozen Research + Engineering layers.
- Added D017–D023.
- Defined the global post-freeze maintenance rule: real task → repeatable failure/capability gap → smallest justified change.

## v0.3 — 2026-09-02

- Completed and froze Research Layer v1.
- Marked Research Coordinator, Literature Scout, Evidence Auditor, Experiment Designer, Reproducibility Engineer, Critic integration, and multi-worker routing as verified.
- Recorded successful automatic `paper-reading` Skill routing for concrete-paper analysis.
- Added Skill invocation discipline: use the registered Skill mechanism and do not guess `SKILL.md` filesystem paths.
- Upgraded Research delegation policy from merely aggressive/bounded to aggressive + bounded + role-aware + phase-aware.
- Added explicit Research Coordinator v1 tool policy: `vscode + read + search + web + agent + todo`.
- Formalized discovery → intermediate synthesis → targeted analysis → final synthesis.
- Removed Multi-Agent Debate from the maintained Research Layer.
- Removed Debate from target directory structure, routing rules, roadmap requirements, and acceptance criteria.
- Closed the generic Researcher and Debate questions for v1.
- Marked multi-subagent orchestration as sufficiently verified for architecture freeze; detailed performance benchmarking remains optional.
- Replaced the Research roadmap with completed R1–R12 and set U4 as the next User Layer task.
- Added Research freeze maintenance rule: architecture changes require demonstrated real-world failure or capability gap.
- Added D013–D016 and superseded the previous optional-Debate decision.

## v0.2 — 2026-09-02

- Replaced planned Scientific Analyst Subagent with existing `paper-reading` Skill.
- Defined Literature Scout v1 tool policy: `web + search + read`.
- Set Research Coordinator policy to aggressive delegation with bounded fan-out.
- Added Multi-Agent Debate as optional/manual-only capability. *(Historical; superseded in v0.3.)*
- Added grouped Agent directory architecture (`core/`, `research/`, `optional/`). *(The maintained v1 roots are now `core/` and `research/`.)*
- Added explicit `chat.agentFilesLocations` registration strategy.
- Updated Research topology and routing rules.
- Updated roadmap and acceptance criteria.
- Closed Open Questions Q1, Q2, and Q4.
- Added D008–D012 to Decision Log.

## v0.1 — 2026-09-02

- Established initial complete User Layer architecture.
- Added scientific Research Layer design.
- Adopted orchestrator–worker topology.
- Defined planned research worker roles.
- Formalized Skill vs Subagent distinction.
- Recorded verified Custom Endpoint subagent support.
- Recorded Critic as a working custom subagent.
- Defined roadmap, open questions, and acceptance criteria.
