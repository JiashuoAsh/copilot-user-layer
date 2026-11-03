# Skill mechanics: VS Code Copilot adaptation

This reference adapts the upstream skill mechanics to the VS Code Copilot
installation in this profile. Read it when creating or editing a skill, choosing
its invocation policy, splitting one skill into several, or designing a router.
Do not assume Claude Code's Skill API or invocation semantics apply here.

## Invocation

Copilot exposes two independent decisions in this installation:

- `user-invocable: true` provides a user-facing slash entry.
- `disable-model-invocation: false` allows model discovery from the skill's
	`description`; setting it to `true` disables model invocation.

These controls are not the upstream host's single invocation switch. Preserve
the existing trigger policy unless the task explicitly asks to change it. A
description is a discovery pointer: when model discovery is enabled, name the
actual trigger branches in the description. Keep the skill `name` aligned with
its directory and keep its description focused on when to load it.

An enabled trigger does not guarantee the skill is selected, and discoverability
does not grant permission to edit files, run commands, access external services,
or publish. Actual tool availability and user authorization remain separate.

## Splitting by invocation

Split off a skill when a distinct trigger should discover it independently or
when another skill genuinely needs to refer to it. The new skill adds human
cognitive load and, when model-discoverable, a permanent discovery surface. Make
that reach worth its cost. Otherwise keep the method in the current skill or a
plain reference file with an explicit context pointer.

The upstream distinction between model-invoked and user-invoked skills is a
design analogy, not a literal Copilot contract. Verify fields and behaviour in
the actual VS Code environment before relying on a platform-specific claim.

## Router skills

When the human-facing slash skills multiply beyond what a user can remember, a
router skill can name them and explain when to choose each. In Copilot, a router
may also be model-discoverable only if its frontmatter explicitly enables that
policy and its description accurately describes the routing triggers. A router
must not claim that it can invoke other skills through an unavailable API; it
can direct the agent or user to an available entry point.
