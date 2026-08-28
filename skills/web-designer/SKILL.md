---
name: imon-web-designer
description: Agent-native web design orchestration skill combining design taste, Figma inspection and mutation, design-token sync, design-to-code, motion, responsive implementation, and visual QA. Use for new sites, redesigns, Figma-to-code, image-to-code, and Figma-first design workflows.
---

# Web Designer

This is the primary orchestration skill for this repository.

It does **not** replace the specialist skills in `skills/`. It routes work between them and the vendored `figma-design-pipeline` so that visual direction, Figma execution, implementation, and QA stay consistent.

## Core principle

Separate **judgment** from **execution**:

- Taste/design skills decide *what the interface should feel like and why*.
- Figma tools inspect, plan, mutate, and export the design artifact.
- Code tools implement the approved system without flattening it into generic UI.
- QA compares the result back to the source/reference instead of trusting the first render.

Do not let the Figma pipeline choose the art direction by itself. Do not let a taste skill blindly write Figma nodes without using the Figma execution layer.

## 1. Classify the task

Choose one primary route before doing work.

| Route | Use when | Specialist skill |
|---|---|---|
| Greenfield web design | New landing, portfolio, campaign, brand site | `skills/taste-skill/SKILL.md` |
| Codex-heavy experimental web | Stronger anti-template direction, motion, layout variance | `skills/gpt-tasteskill/SKILL.md` |
| Existing-site redesign | A codebase/site already exists | `skills/redesign-skill/SKILL.md` |
| Reference/image → implementation | Screenshot, visual reference, or generated comp is the source | `skills/image-to-code-skill/SKILL.md` |
| Calm premium UI | Restrained, expensive, low-noise direction | `skills/soft-skill/SKILL.md` |
| Minimal/editorial product UI | Tight hierarchy and restrained product language | `skills/minimalist-skill/SKILL.md` |
| Brutalist/industrial direction | Explicit hard, mechanical, typographic direction | `skills/brutalist-skill/SKILL.md` |
| Brand exploration | Identity, palette, type, logo-system work | `skills/brandkit/SKILL.md` |
| Figma-first workflow | Any task where Figma is a source or destination | this skill + Figma pipeline |

Load only the specialist skill(s) relevant to the route. Do not concatenate every style skill into one prompt.

## 2. Establish the source of truth

Before creating anything, identify the hierarchy of evidence:

1. User-provided content and explicit constraints.
2. Existing Figma file / production UI / codebase.
3. Supplied references and screenshots.
4. Existing brand assets and design tokens.
5. Specialist skill heuristics.
6. Your own invention, only where the previous layers are silent.

Never replace known content with invented copy merely to make a layout easier. Never erase a brand system just because a default AI aesthetic is more convenient.

For redesigns, audit before proposing. For Figma-to-code, inspect before generating. For image-to-code, analyze geometry, hierarchy, type, spacing, color, imagery, and responsive implications before coding.

## 3. Produce a Design Read

Before implementation, state internally or in the work log:

`Page/product type → audience → visual language → interaction language → density → key constraints.`

Then load the relevant taste skill and derive a direction. Avoid generic AI defaults: random violet/blue gradients, centered dark SaaS hero, equal three-card grids, glass everywhere, arbitrary glow, and motion with no narrative purpose.

The specialist taste skill remains authoritative for detailed visual heuristics. This orchestrator is authoritative for sequencing and tool routing.

## 4. Figma routing rules

When a Figma file is involved, use the vendored `figma-design-pipeline` skill and tools.

### Mandatory routing

| Operation | Preferred tool |
|---|---|
| Check write bridge | `figma_plugin_status` |
| Inspect tree / find nodes | `figma_get_tree`, `figma_find_nodes` |
| Audit structure/quality | `figma_audit` |
| Read tokens/styles/components | `figma_extract_tokens`, `figma_get_styles`, `figma_get_components` |
| Plan naming/layout/grouping/components | `figma_plan_*` |
| **Any Figma mutation** | **`figma_execute`** |
| Screenshot / visual confirmation | official Figma MCP screenshot tool |
| Create a new Figma file | official Figma MCP file-creation tool |
| Map design to code | `figma_map_components` |
| Generate page/schema | `figma_generate_page`, `figma_generate_schema` |
| Export/sync tokens | `figma_export_tokens`, `figma_diff_tokens` |

At the start of a Figma write task, call `figma_plugin_status`.

If the plugin bridge is disconnected, still call `figma_execute` first. The pipeline can return fallback JavaScript for the official Figma MCP. Do **not** switch to ad-hoc direct write calls just because the bridge is unavailable.

Treat `vendor/figma-design-pipeline/` as upstream code. Do not patch it for project-specific behavior unless the task explicitly requires maintaining a fork. Integration changes belong outside `vendor/`.

## 5. Figma-first workflow

Use this sequence when Figma is the design source or destination.

### A. Inspect
- Read file/page/frame hierarchy.
- Identify components, variants, styles, variables, auto-layout, constraints, and obvious one-off duplication.
- Extract tokens where useful.
- Capture screenshots of the relevant frames.

### B. Audit
Check:
- hierarchy and spacing rhythm;
- type scale and line lengths;
- color/token consistency;
- component reuse;
- auto-layout and responsive constraints;
- naming and layer hygiene;
- accessibility risks;
- desktop/mobile relationship;
- visual defects introduced by generation.

### C. Direction
Load the relevant taste skill and decide what to preserve, what to change, and what the interface should become. Do not mutate Figma while the direction is still ambiguous.

### D. Plan
Use pipeline planning tools for grouping/layout/components/naming when the task is large enough to benefit from explicit batches.

### E. Execute
Use `figma_execute` for writes. Prefer coherent batches over hundreds of tiny mutations. Preserve existing reusable components and variables unless there is a clear reason to replace them.

### F. Verify in Figma
After meaningful write batches:
- re-read the changed subtree;
- take a screenshot;
- check clipping, overflow, missing fonts, broken instances, wrong constraints, duplicate styles, and accidental position drift.

A successful API response is not visual QA.

## 6. Code implementation workflow

When implementing from Figma/reference:

1. Inspect the existing repo and `package.json` before choosing libraries.
2. Extract or infer reusable tokens instead of scattering magic values.
3. Map Figma components to existing code components before generating new ones.
4. Preserve semantic HTML, accessibility, keyboard states, focus, and reduced-motion behavior.
5. Reproduce the visual hierarchy first; add motion after layout is stable.
6. Use responsive behavior that reflects design intent, not a mechanical desktop shrink.
7. Do not ship placeholder sections, lorem ipsum, fake metrics, or invented claims unless explicitly requested.
8. Keep performance in the design definition: avoid unnecessary client rendering, giant uncompressed assets, uncontrolled WebGL, scroll handlers that rerender the tree, and animation that blocks interaction.

### Motion
Motion must explain hierarchy, continuity, state, or brand character. It must not exist only because the library is available.

Prefer transform/opacity-based motion. Use GSAP/Three.js only when they materially improve the intended experience. Provide reduced-motion behavior for non-essential animation.

### Three.js / WebGL
Use for scenes that genuinely benefit from depth, procedural graphics, spatial interaction, shaders, or hero-level art direction. Do not turn ordinary card UI into WebGL.

Keep a non-WebGL fallback when the visual is important to comprehension or conversion.

## 7. Design-system loop

For projects with an existing design system:

`Figma variables/styles → normalized tokens → code tokens → component implementation → diff back against Figma.`

Use `figma_extract_tokens`, `figma_export_tokens`, and `figma_diff_tokens` when available.

Do not silently create two independent token systems. If Figma and code disagree, identify the authority for that project and reconcile deliberately.

## 8. Visual QA gate

Before calling a design task complete, verify all relevant states.

### Desktop
- composition and alignment;
- hierarchy and type rendering;
- section transitions;
- image crop and focal points;
- hover/focus states;
- motion timing;
- no accidental generic component styling.

### Mobile
- no clipped text or controls;
- no desktop-only absolute positioning leaks;
- touch targets remain usable;
- content order still makes sense;
- text measure is sane;
- interactive/motion effects degrade safely;
- `100dvh`/safe-area behavior is correct where applicable.

### Figma fidelity
If implementing an approved Figma design, compare render to source. Do not declare completion from DOM inspection alone.

### Content fidelity
Ensure the final interface contains the provided content, spelling, data, and asset choices. Design polish does not justify silently rewriting facts.

## 9. Completion criteria

A task is complete only when the requested artifact is actually usable:

- direction is coherent and context-specific;
- Figma writes (if any) used the correct mutation path;
- design tokens/components are not needlessly duplicated;
- code runs and required dependencies are declared;
- desktop and mobile are both addressed when applicable;
- visual QA has been performed after the final meaningful change;
- no placeholder implementation remains;
- no unrelated vendor modifications are mixed into the change.

## 10. Repository map

- `skills/web-designer/` — primary orchestration skill.
- `skills/taste-skill/` — default anti-slop visual intelligence.
- `skills/gpt-tasteskill/` — stricter GPT/Codex visual direction.
- `skills/redesign-skill/` — audit-first redesign workflow.
- `skills/image-to-code-skill/` — reference/image-to-code workflow.
- `skills/*` — other specialist design modes.
- `vendor/figma-design-pipeline/` — pinned upstream MCP server + Figma plugin + upstream skill.
- `scripts/install-web-designer.mjs` — local setup for pipeline + this skill.
- `AGENTS.md` — repository-level agent instructions.

When in doubt: **taste decides, Figma pipeline executes, QA verifies.**
