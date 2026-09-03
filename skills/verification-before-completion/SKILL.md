---
name: verification-before-completion
description: >-
  Evidence gate for engineering completion claims. Use when work is about to be
  reported as fixed, working, passing, validated, complete, or done. Require
  fresh, relevant, discriminating evidence from the current workflow or run
  appropriate repository-defined validation before making the claim. Do not use
  as a substitute for debugging, code review, or repository exploration.
user-invocable: false
disable-model-invocation: false
metadata:
  tags: verification, validation, completion, evidence
---

# Verification Before Completion

## Purpose

This Skill is a completion-claim gate:

```text
implementation / fix
        ↓
claim
        ↓
required evidence
        ↓
fresh validation or reusable fresh evidence
        ↓
inspect result
        ↓
scoped conclusion
```

It is not a testing framework, debugger, reviewer, or release process.

# Layer 1 — Invariants

## 1. No completion claim without evidence

Do not claim work is fixed, resolved, working, passing, validated, complete, or
done unless evidence supports that exact claim.

Editing code is not verification. A plausible implementation is not verification.
A tool call whose result was not inspected is not verification.

## 2. Evidence must be fresh

Evidence must correspond to the current relevant state.

Do not rely only on:
- a run from before the change;
- a previous session after relevant code/state changed;
- an assumed CI result;
- a historical successful build;
- “the same pattern worked elsewhere.”

Fresh does **not** mean the parent agent must personally rerun every check.

Evidence produced by another worker in the current workflow may be reused when:
- it corresponds to the current code/configuration/state;
- the relevant result is available to inspect;
- the check supports the claim;
- no later change invalidated it.

Do not mechanically rerun expensive validation merely so the parent owns the
command invocation.

## 3. Evidence must be relevant

The check must directly support the claim.

```text
Claim:
    the original failing test is fixed

Relevant:
    rerun the original test or equivalent regression check

Insufficient:
    an unrelated test passes
```

```text
Claim:
    the project builds

Relevant:
    repository-defined build/compile succeeds

Insufficient:
    lint passes
```

Do not use adjacent evidence to justify a stronger claim.

## 4. Evidence must be discriminating

Ask:

> Could this check have failed if the claim were false?

If effectively no, it is weak evidence.

Weak examples:
- a test that never executes the changed path;
- a search that can succeed regardless of behavior;
- a smoke test that never reaches the affected component;
- a performance claim inferred only from code shape.

Prefer checks capable of exposing the failure being ruled out.

## 5. Claim scope must not exceed evidence scope

If only a targeted check was run, report the targeted result.

Do not upgrade:

```text
targeted test passes
```

into:

```text
the entire project is correct
```

Report the strongest conclusion justified by the evidence — no stronger.

## 6. Never manufacture a pass

Do not:
- delete or skip meaningful failing tests merely to make a suite pass;
- loosen assertions without technical justification;
- suppress relevant errors/warnings merely to produce success;
- disable validation hooks;
- change expected results to match a bug unless intended behavior changed;
- exclude failing cases without explaining and justifying the exclusion.

A real validation failure is evidence to investigate, not an obstacle to hide.

# Layer 2 — Operational Workflow

## Step 1. Identify the exact claim

Examples:

```text
the bug is fixed
the targeted regression test passes
the new behavior works
the configuration is valid
the refactor preserved behavior
the project builds
the generated artifact is usable
performance improved
```

Different claims require different evidence.

## Step 2. Determine the minimum useful evidence

| Claim | Useful evidence |
|---|---|
| Bug fixed | Original reproduction or targeted regression check no longer fails |
| Failing test fixed | Original failing test/check passes |
| Build works | Repository-defined build/compile succeeds |
| Feature works | Direct behavior check through the relevant interface |
| Refactor preserved behavior | Relevant contract/behavior checks succeed |
| Config valid | Repository-defined parser/validator/load/dry-run succeeds |
| Artifact usable | Output exists and intended structure/content is inspected |
| Performance improved | Actual measurement under stated conditions |

Use repository-specific commands only when the current repository defines or uses
them.

## Step 3. Reuse valid fresh evidence when available

Before rerunning anything, inspect evidence already produced in the current
workflow, including evidence from workers such as Reproducibility Engineer.

Reuse it only if it is:

```text
current
+
inspectable
+
relevant
+
discriminating
```

If any condition is missing, run or request appropriate validation.

## Step 4. Use repository-defined validation

The User Layer defines the verification principle, not project commands.

Prefer the repository's own:
- tests;
- build system;
- relevant lint/static checks;
- validation scripts;
- smoke/integration checks;
- documented development workflow.

Do not assume `pytest`, `uv`, `npm`, `cargo`, `make`, `ruff`, `mypy`, or any other
specific tool. Those belong to the Repo Layer or the actual repository.

## Step 5. Verify proportionately

A useful progression is:

```text
most direct targeted check
        ↓
relevant broader checks
        ↓
full validation only when justified
```

Consider:
- change size and risk;
- affected surface area;
- public API/compatibility impact;
- state, persistence, or concurrency;
- validation cost and availability.

Do not run an expensive full suite mechanically for every small change.

Do not skip a cheap, highly diagnostic check merely because a broader but less
relevant check passed.

## Step 6. Inspect the actual result

Inspect what matters:
- exit status;
- pass/fail count;
- error output;
- material warnings;
- generated artifacts;
- runtime behavior;
- measured values.

“Command executed” is not enough.

If the result is ambiguous, do not treat it as success.

## Step 7. Report a scoped conclusion

A useful completion report distinguishes:

```text
Implemented:
    what changed

Verified:
    what fresh evidence was run or reused
    and what it established

Not verified:
    remaining validation and why
```

If everything relevant is verified, the final section may be unnecessary.

Do not convert “implemented but unverified” into “done and working.”

# Layer 3 — Exceptions and Boundaries

## Validation unavailable

Meaningful validation may be blocked by missing hardware, external services,
credentials, datasets, environment constraints, platform availability, or
excessive runtime/cost.

Do not install dependencies, mutate environments, or launch unexpectedly expensive
work merely to avoid reporting uncertainty.

Instead state:
- what was implemented;
- what was verified;
- what could not be verified;
- why;
- the next useful check when practical.

## Validation fails

If a relevant check fails:

```text
do not claim completion
        ↓
inspect the failure
        ↓
determine whether it is related
        ↓
revise or debug
```

For unexplained failures, use `systematic-debugging`.

Do not assume every failure was caused by the latest change, but do not ignore it
without evidence.

## Existing worker evidence

Multi-agent workflows do not require duplicate verification by default.

A worker result may support the parent claim if:
1. the worker actually ran the relevant check;
2. the result is returned with enough detail to inspect;
3. the evidence still matches the current state;
4. the parent does not overstate what it proves.

If relevant code/state changes afterward, the evidence may no longer be fresh.

## Verification, review, and debugging are different

```text
systematic-debugging
→ why did it fail, and what is the root cause?

verification-before-completion
→ does fresh evidence justify the completion claim?

Critic
→ is the reasoning/design missing something important?

Native Code Review
→ does the implementation/diff contain problems?
```

A review cannot prove code runs. A passing test cannot prove the design is sound.
Use both when warranted.

## Safety

Verification does not justify destructive or high-consequence operations.

Do not silently:
- delete user/application data;
- reset repositories destructively;
- mutate global environments;
- install or replace dependencies;
- overwrite important checkpoints/artifacts;
- change system permissions;
- launch unexpectedly expensive or long-running validation.

When such validation is genuinely necessary, explain why and obtain the required
approval.

# Completion Gate

Before making a completion claim, answer:

```text
1. What exactly am I claiming?
2. What evidence directly supports it?
3. Is the evidence fresh for the current state?
4. Could the check have exposed the failure if the claim were false?
5. Did I inspect the actual result?
6. Is my wording no broader than the evidence?
7. What remains unverified?
```

If these cannot be answered, narrow the claim or obtain better evidence.

# Role Boundary Summary

This Skill owns:

```text
completion claim
    → evidence requirement
    → validation/reuse
    → result inspection
    → scoped reporting
```

It does not own:

```text
root-cause diagnosis       → systematic-debugging
repository investigation  → Explore / native search
implementation planning   → Native Agent / Plan
reasoning challenge        → Critic
diff-oriented review       → Native Code Review
```

Final principle:

> Report the strongest conclusion justified by fresh, relevant, discriminating
> evidence — no stronger.
