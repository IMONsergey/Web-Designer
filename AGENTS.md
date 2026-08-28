# Web-Designer agent instructions

Use `skills/web-designer/SKILL.md` as the primary orchestration layer for design work in this repository.

## Required routing

- Load only the specialist design skill relevant to the task; do not stack every visual style skill.
- When Figma is involved, use the Figma design pipeline for inspection/planning and `figma_execute` for mutations.
- Call `figma_plugin_status` before Figma write work.
- Treat `vendor/figma-design-pipeline/` as pinned third-party source. Do not make project-specific edits inside it.
- Existing content, Figma, brand assets, and the current codebase outrank generic design heuristics.
- Audit before redesigning; inspect before generating; visually verify after meaningful changes.
- Never declare a UI complete solely because code compiles or an API write succeeds.

## Quality bar

Avoid templated AI aesthetics. Preserve hierarchy, content fidelity, responsive intent, accessibility, and performance. Motion should have a functional or brand reason. Figma-to-code work must be compared back to the source design.

## Important paths

- `skills/web-designer/SKILL.md` — primary orchestrator
- `skills/taste-skill/SKILL.md` — general visual intelligence
- `skills/gpt-tasteskill/SKILL.md` — stricter Codex/GPT direction
- `skills/redesign-skill/SKILL.md` — redesign workflow
- `skills/image-to-code-skill/SKILL.md` — reference-to-code workflow
- `vendor/figma-design-pipeline/` — Figma MCP/plugin execution layer
- `THIRD_PARTY_NOTICES.md` — upstream revisions and licenses
