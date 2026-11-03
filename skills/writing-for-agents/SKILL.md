---
name: writing-for-agents
description: "Use when creating or editing agent-consumed documents: skills, instructions, prompts, agents, AGENTS.md, CLAUDE.md, or referenced guidance. Focus on discoverability, progressive disclosure, clear completion criteria, and avoiding stale duplication."
user-invocable: true
disable-model-invocation: false
---

# Writing for agents

Write documents for agents, not merely documents that read as complete to a
human. A skill, an `AGENTS.md`, a prompt, an instruction, or a document reached
by a pointer is consumed by an agent that must take the same process reliably
across runs. The packaging differs; the writing levers do not.

When writing a skill, read [skill mechanics](./references/skill-mechanics.md) before
choosing frontmatter or invocation. This installation's mechanics are adapted
for VS Code Copilot; never infer a Claude or other-host Skill API from upstream
wording.

## Context pointers

A **context pointer** is a reference in the agent's context that names
out-of-context material and states when to reach it. A skill description is a
pointer. A line in `AGENTS.md` naming a document is another. The pointer's
wording, not merely its target, decides when the agent reaches the material.
A must-have target behind a weak pointer is a variance bug: sharpen the pointer
first, and inline the material only if sharpening fails.

A pointer does two jobs: state what the material is and list the branches that
trigger it. A branch is a distinct case the document handles, so different runs
take different paths through it. Every word of an always-loaded pointer costs on
every turn, so prune it harder than the body.

- Front-load the leading word so the pointer performs its triggering work early.
- Use one trigger per branch. Collapse synonyms that name one branch; keep
	genuinely distinct branches.
- Cut identity the body already carries. The pointer should tell the agent when
	to reach the target, not repeat the target's title as decoration.

## The two loads

Every document and pointer spends one of two budgets:

- **Context load** is always-loaded material: an `AGENTS.md` line, a skill
	description, or anything present on every turn whether it fires or not.
- **Cognitive load** is the human's cost of knowing which documents exist and
	when to reach each. The human is the index. This is not a cost to minimise;
	spend it where human judgement matters and remove it where it does not.

Material reached through a pointer escapes context load at the price of the
pointer's line. Material with no pointer rides entirely on cognitive load.

## Information hierarchy

A document contains **steps** and **reference**. Steps are ordered actions. The
reference is definitions, rules, and facts consulted on demand. Place each piece
on the ladder according to how immediately every branch needs it:

1. **In-file step**: the primary tier, what the agent does in order.
2. **In-file reference**: on-demand rules that belong beside the steps or form
	 a legitimately flat peer set.
3. **Disclosed reference**: a branch-specific document reached through a
	 context pointer, from a sibling file through fully external references.

Push too little down and the top bloats. Push too much down and essential
material hides behind a weak pointer. **Progressive disclosure** is the move
down this ladder so the top remains legible. It is not primarily token
optimisation; it protects the hierarchy. Inline what every branch needs and
disclose what only some branches reach.

**Co-location** is the within-file companion to the ladder. Once a concept's
level is chosen, keep its definition, rules, and caveats under one heading so
reading one part brings its neighbours with it. Grouped material reads like
documentation written for an agent; scattered fragments make attention guess.
Co-location is distinct from duplication: duplication repeats one meaning,
scattering fragments one meaning across many places.

**Sprawl** is a document too long even when every line is unique. Cure it with
the ladder, branch-specific disclosure, and sequence splits. The goal is not
shortness; it is that each path carries the material it needs and no sediment.

## Steps and completion criteria

Every step ends with a completion criterion: the observable condition that says
the work is done. Two properties make a criterion strong:

	as "understanding reached" invite premature completion.
	modified model accounted for" drives the required legwork; "produce a change
	list" may not.

 Completion
because that is cheap. Only when the bound is irreducibly fuzzy and the agent
still rushes should you hide later steps by splitting the sequence. Hiding works
only across a real context boundary, such as a handoff or subagent dispatch; an
inline call leaves later steps visible.

The strongest criteria are both checkable and exhaustive. Make reference carry
an exhaustiveness bar too: "every rule applied" binds a flat reference set just
as "every step done" binds a sequence.

## When to split

Splitting one document spends one of the two loads, so split only when the cut
earns it:

- **By sequence**: split a run of steps when post-completion steps tempt the
	agent to rush the current step. Keeping later work out of view drives more
	legwork on the current task. Merge when exposing the next steps helps the
	current step instead.
- **By invocation**: for skill-specific splitting, read [skill mechanics](./references/skill-mechanics.md).

## Leading words

A **leading word** is a compact concept already available in the model's
pretraining that the agent thinks with while running the document, such as
_lesson_, _fog of war_, or _tracer bullets_. Repeated as a token rather than a
sentence, it accumulates a distributed definition and anchors behaviour with
few tokens. A coined term can work when defined clearly, but an unfamiliar word
costs definition tokens; prefer an existing concept first.

Leading words anchor twice. In the body they trigger the same behaviour each
time. In a pointer they improve invocation because the same word in prompts,
documents, and code links the material reliably.

Refactor repeated descriptions into leading words. For example, "fast,
deterministic, low-overhead" may become _tight_ when the document consistently
defines a tight loop. A leading word should sharpen attention, not merely make
prose shorter.

**Positive phrasing** matters. Negation activates the forbidden behaviour and
leaves it available in context. State the target behaviour directly, such as
"write one-line comments". Keep a prohibition only when it is a hard guardrail
that cannot be phrased positively, and pair it with the positive target.

## Pruning

Keep each meaning in one source of truth. Duplication costs maintenance and
tokens and inflates a meaning's apparent importance in the hierarchy. Repeating
a leading word is useful; repeating its full meaning is not.

The environment is also a source of truth: `package.json`, config files, the
directory layout, and command help. A document that repeats those facts is a
cache. Cache only what the agent cannot find by looking, such as an unwritten
convention, the reason behind a choice, or a gotcha the configuration does not
confess. Leave one-file, one-command lookups to the environment.

Check every line for relevance. Remove exposition that does not bear on the
document's behaviour and disclose branches that do not belong on the main path.
Otherwise stale layers settle as sediment until the live core is hard to find.

Hunt **no-ops** sentence by sentence. An instruction the model already obeys by
default pays load to say nothing. The test is model-relative: if a sentence does
not change behaviour, delete the whole sentence rather than merely trimming it.
A leading word too weak to beat the default is also a no-op; replace it with a
stronger behavioural anchor or remove it.

## Completion

Finish a document when its discovery entry is explicit, every branch has a
reachable method, every step has a clear and demanding completion criterion,
references sit at the right hierarchy level, and pruning has removed duplicated
or default-behaviour instructions. For a skill, also verify its actual host
frontmatter and loading model using [skill mechanics](./references/skill-mechanics.md).
