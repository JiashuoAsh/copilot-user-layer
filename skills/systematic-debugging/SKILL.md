---
name: systematic-debugging
description: >-
  Evidence-first root-cause debugging for bugs, failing tests/builds, regressions,
  performance anomalies, integration failures, and other unexpected technical
  behavior whose cause is not yet established. Use before implementing a fix when
  diagnosis is required. Do not use for routine feature work or ordinary code
  changes without a failure to investigate.
license: MIT
compatibility: >-
  Platform-agnostic. Uses repository-defined diagnostics, logs, version-control
  history, tests, and runtime inspection when available. No specific language,
  shell, test framework, database, operating system, or VCS is required.
user-invocable: true
disable-model-invocation: false
metadata:
  tags: debugging, troubleshooting, root-cause, investigation, evidence
  source: Adapted from obra/superpowers (Jesse Vincent, MIT) and revised for a cross-project User Layer.
---

# Systematic Debugging

## Goal

Diagnose unexpected technical behavior before implementing a fix.

```text
failure
  ↓
evidence
  ↓
root-cause hypothesis
  ↓
discriminating check
  ↓
confirmed cause
  ↓
minimal fix
  ↓
validation
```

Use the smallest amount of process that establishes the cause with adequate
confidence.

> Do not implement a speculative fix before investigating the root cause.

A temporary containment may be appropriate during an incident, but label it as
mitigation rather than as the root-cause fix.

---

## Phase 1 — Establish the Failure

### Read the evidence

Inspect the available:

- error messages, warnings, stack traces, and failing assertions;
- logs, exit codes, relevant file paths, symbols, and runtime state;
- source/configuration at the reported failure point and related call sites.

Do not rely on a summary when detailed failure information is available.

### Reproduce or characterize

Determine the trigger, inputs, environment, configuration, expected result, and
actual result.

Use repository-defined test/build/run/diagnostic commands when available. Do not
assume `pytest`, `npm`, `cargo`, Bash, Git, or any other specific tool.

If the issue is nondeterministic, characterize when it occurs and gather more
evidence instead of guessing.

### Inspect relevant context

When applicable, compare recent changes in:

- code;
- dependencies;
- configuration;
- data/schema;
- environment/runtime;
- deployment state.

Use version-control history only when version control is actually available.

### Isolate the boundary

For multi-component systems, locate the first point where actual behavior diverges
from expected behavior.

Inspect relevant component boundaries:

```text
input → transformation/component → output → state/side effects
```

Prefer read-only inspection and minimal reversible instrumentation.

### Trace bad data or state upstream

When an invalid value appears deep in a call chain, trace backward to the earliest
incorrect transition and prefer fixing the source over repeatedly guarding
downstream symptoms.

### Check environment differences

When behavior differs across test/dev/CI/production/machines, compare material
differences such as schema, data shape, dependency versions, runtime flags,
permissions, filesystem/platform behavior, concurrency, and persisted state.

### External research

Use targeted web research only when local evidence is insufficient. Prefer exact
error text, component/version context, official documentation, issue trackers,
release notes, and authoritative technical sources.

**Phase 1 exit:** enough evidence exists to state a concrete root-cause hypothesis.

---

## Phase 2 — Compare Working and Failing Patterns

When useful:

1. Find a similar working path or implementation.
2. Compare the relevant authoritative reference or contract.
3. Enumerate material differences in control flow, data, configuration, state
   lifecycle, dependencies, initialization, cleanup, and error handling.
4. Prioritize differences that predict the observed failure.

Do not copy a reference implementation without understanding the assumptions that
make it work.

---

## Phase 3 — Test One Hypothesis

State one concrete hypothesis:

> I think **X** is the root cause because **Y evidence** predicts **Z behavior**.

Separate facts from inference and uncertainty.

Design the smallest check that would distinguish whether the hypothesis is true:

- targeted diagnostic;
- focused test;
- controlled input;
- temporary assertion;
- minimal reversible change;
- configuration comparison.

Change one variable at a time.

If the hypothesis is supported, proceed to the fix. If contradicted, use the new
evidence to form a new hypothesis.

Do not preserve a failed speculative fix and stack another one on top.

If the cause remains unknown, say so and continue investigation. Ask the user only
when required information is inaccessible, a consequential choice is needed, or
a safe next step cannot be derived from available evidence.

---

## Phase 4 — Implement the Root-Cause Fix

### Regression evidence

Create the smallest useful regression check when practical. Prefer an automated
test when the repository supports one.

A pre-existing failing automated test is not mandatory for production-only,
nondeterministic, infrastructure, integration, or environment-specific failures.
In those cases, define another concrete validation method and state its limitation.

### Minimal coherent fix

Address the confirmed cause.

Avoid:

- unrelated refactoring or opportunistic cleanup;
- unnecessary dependencies;
- unrelated interface changes;
- broad defensive patches that merely hide the failure.

### Validate

Use fresh repository-appropriate evidence:

```text
targeted reproduction/regression check
        ↓
relevant repository-defined validation
        ↓
broader checks when justified
```

Do not assume a full test suite is always required or affordable.

Do not claim success if meaningful validation could not be run. Final
completion-claim discipline belongs to `verification-before-completion`.

---

## Repeated Failed Attempts

Several failed fix attempts are a signal to stop stacking patches and reset the
investigation.

Reassess:

- the original assumptions;
- whether the failure boundary is correct;
- hidden state and lifecycle;
- environment differences;
- coupling or architectural constraints.

Repeated failures may indicate an architectural problem, but do not automatically
conclude that the architecture is wrong after an arbitrary number of attempts.

Use independent review when the diagnosis is consequential or remains uncertain.

---

## Safety

Debugging does not justify destructive actions.

Do not silently:

- delete user/application data;
- reset repositories destructively;
- remove persistent state;
- kill unrelated processes;
- alter system permissions;
- install/replace dependencies;
- mutate global environments;
- overwrite checkpoints/artifacts;
- broaden exception handling merely to suppress failures.

If a destructive or environment-changing diagnostic is genuinely necessary,
explain why and obtain the required approval first.

---

## Role Boundaries

This Skill owns:

```text
root-cause investigation
hypothesis formation
diagnostic testing
minimal root-cause fix discipline
```

It does not replace:

```text
repository exploration        → Explore / native search
general architecture planning → Native Agent / Plan
independent reasoning review  → Critic
diff-oriented review          → Native Code Review
completion evidence gate      → verification-before-completion
```

---

## Quick Reference

| Phase | Question | Exit |
|---|---|---|
| 1. Evidence | What is actually failing, where, and under what conditions? | Concrete root-cause hypothesis |
| 2. Pattern | What materially differs from a working/intended case? | Relevant differences identified |
| 3. Hypothesis | What explanation best predicts the evidence? | Hypothesis supported or rejected |
| 4. Fix | What is the smallest coherent correction? | Root cause addressed and freshly validated |

> Understand enough to explain the failure before claiming to have fixed it.
