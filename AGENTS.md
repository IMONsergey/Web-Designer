# Web-Designer agent instructions

Use `skills/web-designer/SKILL.md` as the primary orchestration layer for design work in this repository.

## Core model

Do not treat Web-Designer as one giant design prompt. Route work through narrow specialist layers:

1. **Taste / art direction** — choose the visual and interaction language.
2. **Figma execution** — inspect, plan, mutate, export, and sync the design artifact.
3. **Frontend engineering** — build semantically, responsively, accessibly, and against authoritative sources.
4. **Special artifacts** — diagrams and optional procedural 3D only when the task genuinely requires them.
5. **Verification** — browser/runtime evidence, performance checks where relevant, deterministic Impeccable QA, and visual comparison.

## Required routing

- Load only the narrowest specialist skill relevant to the task. Progressive disclosure is mandatory.
- Existing user content, approved Figma, production UI, code, brand assets, and explicit references outrank generic skill heuristics.
- Audit before redesigning. Inspect before generating. Verify after meaningful changes.

### Visual direction

Use the Taste-derived skills under `skills/` for art direction. Do not stack contradictory style skills. They decide design intent; they do not replace engineering or Figma execution.

### Figma

- Use the Figma Design Pipeline for inspection/planning.
- Call `figma_plugin_status` before write work.
- Use `figma_execute` for Figma mutations.
- A successful mutation response is not visual QA; screenshot/re-inspect afterward.
- Treat `vendor/figma-design-pipeline/` as pinned third-party source. Do not put I’MON-specific changes inside it.

### Production frontend engineering

Pull these focused skills from `vendor/agent-skills/` when relevant:

- `frontend-ui-engineering`
- `browser-testing-with-devtools`
- `performance-optimization`
- `source-driven-development`
- `code-review-and-quality`

The complete Addy snapshot is vendored for reproducibility, but do **not** load its entire skill catalog into one task.

### Diagrams and structured visual communication

Use `vendor/diagram-design/skills/diagram-design/` for diagrams, architecture/process visuals, journeys, Gantt/timeline/chart/schema-like communication when a visual genuinely explains the material better than ordinary UI or prose. Apply project brand/tokens instead of silently using the upstream default skin.

### Impeccable QA

Impeccable is an external per-project QA layer, pinned by `scripts/enable-project.mjs`. Use it after the design direction is understood, not as the art director. Its detector findings are evidence to inspect; intentional approved brand/Figma decisions may override generic preferences.

### Optional procedural 3D

`img2threejs` is optional and is installed only with `--with-3d`. Use it for reference-object/character → procedural Three.js reconstruction. Do not invoke it for ordinary particles, abstract shader backgrounds, globes, or simple decorative WebGL.

## Quality bar

Avoid templated AI aesthetics and implementation shortcuts. Preserve:

- content fidelity;
- composition and hierarchy;
- typography and spacing intent;
- responsive behavior rather than desktop shrinkage;
- semantic HTML, keyboard/focus behavior, accessibility, and reduced motion;
- runtime performance, especially for media, animation, canvas, and WebGL;
- source-design fidelity when implementing approved Figma/reference work.

Never declare a UI complete solely because code compiles, tests pass, or an API write succeeds. The final meaningful change must be visually/runtime verified.

## Vendor boundaries

Pinned upstream directories are read-only integration dependencies unless the task is explicitly an upstream update:

- `vendor/figma-design-pipeline/`
- `vendor/agent-skills/`
- `vendor/diagram-design/`

Put I’MON-specific routing, policy, wrappers, and setup logic outside `vendor/`.

## Important paths

- `skills/web-designer/SKILL.md` — primary orchestrator
- `skills/taste-skill/SKILL.md` — general visual intelligence
- `skills/gpt-tasteskill/SKILL.md` — stricter Codex/GPT direction
- `skills/redesign-skill/SKILL.md` — redesign workflow
- `skills/image-to-code-skill/SKILL.md` — reference-to-code workflow
- `vendor/figma-design-pipeline/` — Figma MCP/plugin execution layer
- `vendor/agent-skills/` — engineering and verification workflows
- `vendor/diagram-design/` — branded diagram engine/skill
- `scripts/install-web-designer.mjs` — core + optional 3D installation
- `scripts/enable-project.mjs` — per-project Impeccable QA/hooks
- `THIRD_PARTY_NOTICES.md` — upstream revisions and licenses
