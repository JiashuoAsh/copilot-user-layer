---
name: wayfinder
description: "Use when a large effort has several interdependent unresolved decisions, so the route to the destination is not yet clear and decisions must persist across sessions. Do not use merely because implementation is large when the approach is settled."
user-invocable: true
disable-model-invocation: false
---

# Wayfinder

A loose idea has arrived, too big for one agent session, and wrapped in fog: the
way from here to the **destination** is not visible yet. Wayfinding finds that
way, rather than charging at the destination. It charts a map of decision
tickets, then resolves them one at a time until the route is clear.

The destination may be a specification to hand off, a decision to lock before
planning starts, or a change made in place. The map is domain-agnostic.

## Plan, don't do

Wayfinder is planning by default. Each ticket resolves a decision, and the map
is done when the way is clear, with nothing left to decide before someone goes
and does the thing. The pull to implement is usually the signal that the map
has reached its edge and should be handed off. An effort may opt into execution
in its **Notes**, but absent that, produce decisions, not destination
deliverables.

## Refer by name

Every map and ticket has a name. In human-facing narration and the map's
Decisions so far, refer to the name, never to a bare id, number, or slug. Keep
the id and path inside the link, where they support navigation without replacing
the readable title.

## The Map

The whole map is the low-resolution view loaded once per session. Open tickets
are child files found by query, not copied into the map.

```markdown
## Destination

<what reaching the end of this map looks like>

## Notes

<domain; methods to consult; standing preferences; whether execution is in scope>

## Decisions so far

- [<closed ticket title>](link): <one-line gist of the answer>

## Not yet specified

- <in-scope fog that is not yet a precise question>

## Out of scope

- <work consciously ruled beyond the destination, with the reason>
```

The map is an index, not a store. A decision lives in exactly one ticket; the
map records only a gist and a context pointer. Read [the map template](./assets/map-template.md)
when creating a local map. Read [the decision template](./assets/decision-template.md)
when recording the detail of an individual decision.

### Local Markdown tracker

When no external tracker is supplied, use the local Markdown tracker described
in [the local tracker reference](./references/local-markdown-tracker.md). The
canonical map is `.scratch/<effort>/map.md`; each child ticket is one numbered
file under `.scratch/<effort>/issues/`. This is a local convention, not a reason
to create a remote issue, branch, or push.

### Tickets

Each ticket is a child of the map. Its body is one question, sized to one agent
session:

```markdown
## Question

<the decision or investigation this ticket resolves>
```

Record `Type:` as one of `research`, `prototype`, `grilling`, or `task`, and
record its `Status:`. A session claims a ticket before doing work by setting its
status to `claimed`; that claim lets concurrent sessions skip it. A ticket is
unblocked when every ticket in `Blocked by:` is resolved. The **frontier** is
the open, unblocked, unclaimed tickets, ordered by ticket number.

The answer is recorded under `## Answer` on resolution. Assets and evidence are
linked from the ticket rather than pasted into the map. For each resolved ticket,
append a context pointer to the map's Decisions so far.

## Ticket Types

Every ticket is either **HITL** (human in the loop) or **AFK** (agent-driven).
A HITL ticket resolves through live exchange; the agent never supplies the
human's decision.

- **Research** (AFK): read high-trust primary sources or local resources to
  surface facts a decision waits on. Capture findings with citations. Use the
  local method in [the dependency reference](./references/skill-dependencies.md)
  instead of assuming a Skill API or background-agent guarantee.
- **Prototype** (HITL): make a cheap, rough, concrete artifact to raise the
  fidelity of a discussion about appearance or behaviour, then link it as an
  asset. Stop for human reaction before treating it as a decision.
- **Grilling** (HITL): conversation that stress-tests a plan or decision. Work
  in rounds over the current frontier, give a recommendation, and wait for the
  user's answer. For domain decisions, also apply the domain-modeling method
  described in the dependency reference.
- **Task** (HITL or AFK): manual work required before a decision can be made.
  It earns a place by unblocking a decision, not by delivering the destination.
  AFK work may be driven by the agent; HITL work becomes a precise checklist.

## Fog of war

The map is deliberately incomplete. The **fog of war** is the dim view of
in-scope decisions that cannot yet be phrased sharply because they depend on
open questions. Resolving a ticket clears the fog ahead and graduates whatever
is now specifiable into fresh tickets, one at a time.

Use this test:

- Create a ticket when the question can already be stated precisely, even if it
  is blocked.
- Keep it in **Not yet specified** when it cannot yet be stated precisely.

Do not pre-slice fog into ticket-sized work. One resolution may graduate several
tickets, or none. Keep decided work out of the fog, keep live tickets out of it,
and keep ruled-out work in Out of scope.

## Out of scope

Fog points toward the destination. Work beyond the destination is **out of
scope**, not fog. Record the boundary and why it is excluded. If an existing
ticket is later found to be beyond the destination, close it as out of scope and
record the boundary in the map; do not put it in Decisions so far, because a
scope boundary is not a step on the route.

## Invocation

### Chart the map

When the user brings a loose idea:

1. **Name the destination.** Establish the observable result that ends the map.
	Ask only decisions that belong to the current frontier. Reuse prior
	discussion and files; never answer a human decision on the user's behalf.
2. **Map the frontier.** Scan breadth-first across the problem. Separate settled
	decisions, precise open questions, fog, and out-of-scope work. Add a blocking
	edge only when the earlier answer genuinely changes the later question. If
	there is no fog and one session can see the whole route, do not create a map.
3. **Create the map.** Fill Destination and Notes, leave Decisions so far empty,
	and sketch the fog in Not yet specified.
4. **Create tickets, then wire dependencies.** Create all currently precise
	tickets first so their paths exist; add `Blocked by:` references in a second
	pass. Everything still imprecise stays in the fog.
5. **Resolve research tickets only when authorized.** Read primary sources and
	capture findings in the assigned local artifact. Do not create a branch,
	remote issue, PR, or external write merely because upstream describes one.
6. **Stop charting.** Charting creates the route; it does not hand-resolve its
	tickets. The map is complete for this invocation when the map, frontier,
	fog, and stopping condition are recorded.

### Work through the map

When the user provides a map, a ticket is optional:

1. Load the map's low-resolution body, not every ticket.
2. Choose the named ticket, or the first frontier ticket. Claim it before work.
3. Resolve it according to its `Type:`. Zoom into related tickets, evidence,
	and Notes only as needed. Use the local dependency methods rather than
	assuming unavailable invocation tools.
4. Record the answer, set `Status: resolved`, and append a context pointer to
	Decisions so far. For HITL tickets, the answer must reflect the user's actual
	decision; do not manufacture agreement.
5. Add newly surfaced tickets and dependencies. Graduate only fog that has
	become precise. If a ticket is beyond the destination, move it to the
	out-of-scope boundary. Update tickets invalidated by the decision.

Never resolve more than one non-research ticket in one session. Research tickets
may run in parallel only when the authorized execution environment supports it;
otherwise record the research as pending rather than claiming completion.

### Session cadence

At the start of every session, read the map once, read Notes, and query the
frontier. Claim one ticket before zooming. During the session, keep the decision
tree breadth-first: settle the current question, record its evidence, then
recompute the frontier. At the end, leave the map in a state another session
can resume: claimed work is explicit, unresolved blockers are named, and the
next takeable ticket is visible.

### Completion

Stop when the destination is observable, every route-blocking decision is
resolved or explicitly accepted as non-blocking, the remaining fog is not yet
precise, and the next work can proceed without another decision map. Report the
route, evidence pointers, remaining risks, and the implementation handoff. Do
not imply that planning evidence proves the destination or a scientific claim.

## Permissions and adaptation

Automatic discovery of this skill does not grant permission to write files,
create issues, run commands, publish externally, create branches, or push. Those
actions require current user authorization and the available tool's actual
capability. Preserve the user's existing trigger policy. This installation uses
Copilot's `user-invocable` and `disable-model-invocation` fields; it does not
assume Claude's Skill tool, issue-tracker API, assignments, native blocking, or
background-agent guarantees. See [skill dependencies](./references/skill-dependencies.md)
for the local replacements.
