---
name: Personal Engineering Principles
description: General software-engineering behavior that should apply across all repositories.
applyTo: "**"
---

# Engineering Principles

## Understand Before Editing

* Inspect the relevant implementation before making changes.
* Search for existing abstractions, utilities, tests, and call sites before creating new ones.
* Do not infer repository behavior from filenames or assumptions when it can be verified from the code.
* For non-trivial changes, understand the affected execution path before editing.

## Prefer Root-Cause Fixes

* Diagnose the underlying cause of a failure rather than suppressing its symptoms.
* Do not add broad exception handling, fallback behavior, or special cases merely to hide an unexplained failure.
* When debugging, reproduce the failure when practical before changing the implementation.

## Keep Changes Focused

* Prefer the smallest coherent change that fully solves the requested problem.
* Avoid unrelated refactoring during feature work or bug fixes.
* Reuse existing abstractions when they are appropriate.
* Do not introduce new dependencies unless they provide a clear benefit over the existing stack.
* Preserve existing public interfaces and behavior unless changing them is part of the requested task.

## Validate Work

* Treat implementation and validation as parts of the same task.
* Use the repository's own tests, linters, type checkers, build commands, or other validation tools when available.
* Start with targeted validation and expand to broader validation when appropriate.
* If validation fails, investigate the failure rather than immediately assuming the validation is wrong.
* Do not report a task as successfully completed while relevant known validation failures remain unresolved.

## Protect Test Quality

* Never weaken, delete, skip, or bypass a meaningful test merely to make the implementation pass.
* When fixing a reproducible bug, add or update a regression test when practical.
* Prefer tests of observable behavior over tests that unnecessarily depend on implementation details.

## Preserve Repository Intent

* Follow repository-specific instructions, architecture, conventions, and tooling when they do not conflict with these personal principles.
* Prefer repository-defined commands and workflows over assuming a particular language, package manager, framework, or operating system.
* Do not apply conventions from one repository to another without evidence that they are appropriate.

## Safety and Destructive Actions

* Avoid destructive or irreversible operations unless they are clearly necessary for the requested task.
* Do not discard unrelated user changes.
* Do not expose, hard-code, print, or commit credentials, tokens, passwords, private keys, or other secrets.
* Treat existing uncommitted work as user-owned unless explicitly instructed otherwise.

## Communication

* Distinguish verified facts from assumptions.
* When an assumption materially affects an implementation decision, verify it from the repository when possible.
* When reporting completion, summarize the substantive change and the validation actually performed.
* Do not claim that a command, test, or validation step succeeded unless it was actually run successfully.

## Engineering Tool Routing

* Inspect the repository, its dependency files, and existing implementation before consulting external documentation.
* Use Context7 when implementation depends on current or version-specific library, framework, SDK, or API documentation.
* Prefer documentation matching the dependency version used by the repository.
* Use Hugging Face when engineering work depends on Hub models, datasets, Spaces, repository metadata, or model-specific integration details.
* For Python projects, use Pylance for workspace-aware import analysis, symbol inspection, type diagnostics, refactoring, debugging, and profiling when those capabilities are relevant.
* Use Jupyter tools only for actual notebook or kernel tasks; do not introduce notebooks into ordinary projects merely because the tools are available.
* Use Container Tools when the repository already uses containers, Dev Containers, Dockerfiles, or containerized execution.
* Use ordinary repository search and inspection before external tools when the answer is already present in the codebase.
* Do not use Semantic Scholar, arXiv, or Zotero for ordinary software-engineering tasks. Use them only when scientific evidence or literature is materially required.
* Tool availability does not imply mandatory use. Invoke a tool only when it improves correctness, evidence, or efficiency.

## Engineering Worker Routing

The Native Agent owns engineering tasks and implementation.

Prefer direct work for simple tasks. Delegate only when independent context or
specialized reasoning materially improves the result.

Use:

- Explore for repository structure, symbols, call sites, and state flow.
- `systematic-debugging` for unexplained failures before speculative fixes.
- Critic for an independent review of a substantive plan, diagnosis, or design.
- `paper-reading` for concrete-paper understanding when implementation depends on it.
- Reproducibility Engineer to translate scientific methods into implementation requirements.
- Evidence Auditor when a scientific claim materially affects an engineering decision.
- Experiment Designer when implementation requires discriminating scientific validation.
- Literature Scout only for explicit or genuinely necessary scientific literature discovery.
- `verification-before-completion` before claiming engineering work is complete.
- Native Code Review for implementation/diff review.

Do not route ordinary engineering tasks through the Research Coordinator.
Do not invoke every available worker merely because it exists.
Top-level coordinators should not be nested by default.