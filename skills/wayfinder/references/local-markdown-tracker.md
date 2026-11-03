# Local Markdown Tracker

Use this reference when a repository has no supplied external issue tracker and the effort is authorized to persist a local map.

## Conventions

- One effort per directory: `.scratch/<effort>/`.
- The map is `.scratch/<effort>/map.md`.
- Child tickets are one file per ticket under `.scratch/<effort>/issues/`, numbered from `01` as `NN-<slug>.md`.
- A ticket records `Type:` as `research`, `prototype`, `grilling`, or `task`.
- A ticket records `Status:` as `open`, `claimed`, or `resolved`.
- A ticket may record `Blocked by: NN, NN` near the top.
- Comments and conversation history append under `## Comments`.

## Operations

When publishing a map or ticket, create the local Markdown file only after the user or current task has authorized persistence. Do not infer authorization from the existence of this reference.

To fetch a map, read `.scratch/<effort>/map.md` once at the beginning of the session. To fetch a ticket, read the referenced path or number. Do not load every child ticket unless the current decision needs it.

To find the frontier, scan `.scratch/<effort>/issues/` for tickets with `Status: open`, with every listed blocker marked `resolved`, and with no claim. Order the result by ticket number; the first is the default choice.

To claim a ticket, set `Status: claimed` and save it before doing decision work. To resolve it, append the answer under `## Answer`, set `Status: resolved`, and append a context pointer containing its title, gist, and path to the map's Decisions so far.

The `Blocked by:` line is a local fallback for native tracker dependencies. Keep the dependency graph acyclic and add references only when a blocker genuinely changes the later question.
