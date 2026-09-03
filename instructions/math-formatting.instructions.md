---
name: Math Formatting
description: Format all mathematical expressions for VS Code Copilot Chat
applyTo: "**"
---

# Mathematical formatting

- Use KaTeX-compatible Markdown for all mathematical expressions.
- Use `$...$` for inline mathematics.
- Use `$$...$$` for display mathematics.
- Put opening and closing `$$` on separate lines.
- Never use `\(...\)` or `\[...\]` as mathematical delimiters.
- Never output bare `(`, `)`, `[`, or `]` as substitutes for mathematical delimiters.
- Keep display equations separate from surrounding prose.