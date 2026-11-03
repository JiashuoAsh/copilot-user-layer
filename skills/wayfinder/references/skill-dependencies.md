# Wayfinder Dependency Methods

Wayfinder's upstream workflow names `grilling`, `domain-modeling`, and
`research`. This installation keeps those methods available as local guidance.
They are methods, not promises that a Copilot Skill API, background agent, or
subagent is installed.

## Grilling

Use for a HITL decision. Model the discussion as a design tree and work in
rounds. The frontier is every decision whose prerequisites are settled. Ask the
whole current frontier in one round, number each question, and give a
recommended answer. Wait for the user's actual answers before moving to the
next round. A later question whose prerequisite is still open belongs to a later
round.

Facts are agent work: inspect files, tools, and primary sources rather than
asking the user for facts that can be looked up. Human decisions remain human
decisions. The grilling session ends when the frontier is empty and no branch is
silently assumed. Record the user's decisions in the ticket; do not resolve a
HITL ticket from the agent's recommendation alone.

## Domain modeling

Use when a decision depends on terminology, domain boundaries, or relationships.
Read the relevant glossary when one exists. If a term conflicts with the
glossary, surface the conflict immediately. Sharpen vague or overloaded terms
into candidate canonical terms, and stress-test relationships with concrete edge
case scenarios. Cross-check claims about behaviour against code when code is
available.

Update a glossary inline only when the current task authorizes that write and
the glossary is an assigned path. Keep glossary entries free of implementation
details. Offer an ADR only when the choice is hard to reverse, surprising
without context, and the result of a real trade-off. Otherwise record the
decision in the Wayfinder ticket alone.

## Research

Use for an AFK research ticket when a decision waits on an external or local
fact. Investigate high-trust primary sources: official documentation, source
code, specifications, or first-party APIs. Follow every material claim back to
the source that owns it. Capture findings in one Markdown artifact in the
assigned path, citing each claim and distinguishing fact, inference, and gap.

If the environment lacks a background-agent or Skill invocation facility, do the
authorized research in the current session or mark it pending. Never claim a
parallel run, branch, remote issue, or external publication that did not occur.
