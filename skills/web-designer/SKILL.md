---
name: imon-web-designer
description: Agent-native web design orchestration combining visual direction, Figma inspection/mutation, production frontend engineering, browser/performance verification, deterministic design QA, branded diagrams, and optional procedural Three.js reconstruction. Use for new sites, redesigns, Figma-to-code, image-to-code, high-end marketing surfaces, and Figma-first workflows.
---

# I’MON Web Designer

This is the primary router for the Web-Designer stack. It keeps specialist capabilities separate so the agent gets **more judgment without loading everything at once**.

## Operating model

Use six layers. Do not collapse them into one giant prompt.

1. **Direction** — Taste skills decide what the interface should feel like.
2. **Design artifact** — Figma pipeline inspects, plans, mutates, exports, and syncs tokens.
3. **Engineering** — production skills enforce component, source, browser, and performance discipline.
4. **Special artifacts** — Diagram Design and optional img2threejs handle work ordinary frontend heuristics should not fake.
5. **Implementation** — code reproduces the approved visual system responsively and accessibly.
6. **Verification** — browser evidence + Impeccable deterministic QA + visual comparison decide whether the work is finished.

**Judgment and execution are different jobs.** Taste does not blindly write nodes. Figma tooling does not invent art direction. A linter does not choose a brand. A successful API call is not visual QA.

---

## 1. Route the task before loading skills

Load only the narrowest specialists required.

| Task | Primary specialist |
|---|---|
| New marketing / landing / portfolio site | `skills/taste-skill/SKILL.md` |
| Codex-heavy experimental layout/motion | `skills/gpt-tasteskill/SKILL.md` |
| Existing site redesign | `skills/redesign-skill/SKILL.md` |
| Screenshot / visual reference → code | `skills/image-to-code-skill/SKILL.md` |
| Calm premium direction | `skills/soft-skill/SKILL.md` |
| Minimal/editorial product UI | `skills/minimalist-skill/SKILL.md` |
| Brutalist / industrial direction | `skills/brutalist-skill/SKILL.md` |
| Brand exploration | `skills/brandkit/SKILL.md` |
| Figma is source or destination | Figma pipeline + this skill |
| Production frontend architecture | `frontend-ui-engineering` |
| Framework/library decision | `source-driven-development` |
| Runtime/browser verification | `browser-testing-with-devtools` |
| Performance concern / motion / WebGL | `performance-optimization` |
| Final code-health gate | `code-review-and-quality` |
| Process / architecture / roadmap / chart / diagram | `diagram-design` |
| Reference object → procedural Three.js | `img2threejs` **only if installed** |
| Final anti-slop / design-system QA | `impeccable` **when enabled in the target project** |

Do not load all visual style skills. Do not load all engineering skills for a trivial static edit. Progressive disclosure is mandatory.

---

## 2. Establish the source of truth

Evidence priority:

1. User-provided content and explicit constraints.
2. Approved Figma / production UI / existing codebase.
3. Supplied screenshots, references, videos, and assets.
4. Existing brand system and tokens.
5. Specialist-skill guidance.
6. Invention only where all previous layers are silent.

Never invent copy, metrics, products, navigation, or claims to make a layout convenient. Never replace an existing brand merely because an AI-default aesthetic is easier.

For redesigns: audit first. For Figma-to-code: inspect first. For screenshot-to-code: analyze hierarchy, geometry, type, spacing, imagery, states, and responsive implications before coding.

---

## 3. Design direction

Before implementation, derive a concise Design Read:

`surface → audience → visual language → interaction language → density → constraints → references to preserve/avoid`

Then load the relevant Taste specialist.

Explicitly reject generic AI defaults unless the brief asks for them: purple/blue glow, centered dark SaaS hero, three equal feature cards, glass everywhere, random pills, excessive rounded rectangles, arbitrary gradients, motion without narrative purpose, and interchangeable stock copy.

When the target project has Impeccable enabled, initialize its project context **after** direction is understood. `PRODUCT.md` / `DESIGN.md` should encode the approved direction, not replace it.

---

## 4. Figma execution layer

Use the vendored `figma-design-pipeline` whenever Figma participates.

### Routing

| Operation | Tool |
|---|---|
| Check high-speed bridge | `figma_plugin_status` |
| Tree / node inspection | `figma_get_tree`, `figma_find_nodes` |
| Structural audit | `figma_audit` |
| Tokens / styles / components | `figma_extract_tokens`, `figma_get_styles`, `figma_get_components` |
| Naming/layout/grouping/component plans | `figma_plan_*` |
| **Any mutation** | **`figma_execute`** |
| Screenshot | official Figma screenshot tool |
| New file | official Figma file-creation tool |
| Figma → code mapping | `figma_map_components` |
| Page/schema generation | `figma_generate_page`, `figma_generate_schema` |
| Token export/diff | `figma_export_tokens`, `figma_diff_tokens` |

For write tasks, call `figma_plugin_status` first. Even if disconnected, call `figma_execute`; use its fallback rather than improvising ad-hoc writes.

### Figma sequence

**Inspect → Audit → Direction → Plan → Execute → Screenshot → Re-inspect.**

After meaningful batches verify clipping, font substitution, broken instances, constraints, auto-layout, layer drift, duplicate styles, and content fidelity.

Treat `vendor/figma-design-pipeline/` as pinned upstream. I’MON-specific behavior belongs outside `vendor/`.

---

## 5. Production engineering layer

Visual quality does not excuse fragile code. Pull the vendored Addy skills only when their gate is relevant.

### `frontend-ui-engineering`
Use for component architecture, responsive behavior, design-system integration, state boundaries, semantics, keyboard/focus behavior, and accessibility.

### `source-driven-development`
Use before introducing or changing framework/library behavior. Verify against authoritative documentation rather than coding from model memory.

### `browser-testing-with-devtools`
Use after implementation and for bugs. Inspect real DOM/layout, console, network, runtime behavior, and screenshots. Do not infer runtime correctness from source code alone.

### `performance-optimization`
Use for animation-heavy pages, large assets, client rendering, Core Web Vitals, WebGL, canvas, bundles, and regressions. Measure before optimizing.

### `code-review-and-quality`
Use as the final engineering review on non-trivial changes. Design approval is not permission to ship poor maintainability.

For ordinary frontend work the engineering order is:

`existing repo inspection → implementation → browser evidence → performance gate when relevant → code review`

---

## 6. Implementation rules

1. Inspect the target repo and dependency manifest before choosing libraries.
2. Reuse tokens/components before creating new ones.
3. Preserve semantic HTML, focus states, keyboard navigation, reduced motion, and readable responsive order.
4. Match visual hierarchy before adding animation.
5. Responsive design must preserve intent, not mechanically shrink desktop.
6. Never ship placeholders, fake data, lorem ipsum, invented claims, or TODO sections as finished work.
7. Keep performance inside the design definition: avoid uncontrolled client rendering, giant assets, scroll-state rerenders, pointless WebGL, and blocking animation.
8. Prefer a small coherent component system over premature abstraction.

### Motion
Motion must explain hierarchy, continuity, state, or brand character. Prefer transform/opacity. Use GSAP, canvas, shaders, or Three.js only when the intended experience benefits materially. Respect reduced-motion preferences.

---

## 7. Diagram / visual-content route

Use `diagram-design` when a section communicates better as a visual system than prose/cards: architecture, process, flow, sequence, timeline, Gantt, journey, quadrant, chart, Sankey, schema, roadmap-like structures, etc.

Do **not** use it for decorative pseudo-diagrams or simple lists.

### Brand bridge
If Figma/design tokens exist:

`Figma tokens → semantic roles → diagram-design style/profile → generated HTML/SVG/PNG`

Do not silently use Diagram Design's default skin inside an established brand. Use the project's typography/color hierarchy and maintain contrast.

For embedding into a site, preserve the diagram's semantic hierarchy and accessibility. Prefer SVG/HTML when interaction/responsiveness matters; raster exports are for static delivery.

---

## 8. Optional procedural 3D route

`img2threejs` is an **extra**, not the default Three.js workflow. It is installed only with `--with-3d` / `npm run setup:3d`.

Use it when the brief contains a concrete reference object/character that should become a procedural, animation-ready Three.js model. Follow its staged gates and local state; do not one-shot approximate geometry and call it matched.

Do **not** use img2threejs for generic abstract backgrounds, simple particles, globes, shader fields, or ordinary product cards. Those should use direct Three.js/WebGL implementation when justified.

If `img2threejs` is not installed, do not pretend its pipeline is available. Either use a simpler justified Three.js route or install the extra.

---

## 9. Deterministic design QA with Impeccable

Impeccable is deliberately **not vendored** because it is a large independently updated tool with provider hooks and browser/live infrastructure. The repository pins the supported integration to `impeccable@3.6.1` through `scripts/enable-project.mjs`.

Enable it per target project so hooks and project context live where the site actually lives.

Use it as a verification layer:

- `audit` — deterministic/technical issues;
- `critique` — hierarchy/clarity/design review;
- `polish` — final design-system alignment;
- `harden` — overflow, edge states, resilience;
- `optimize` — performance cleanup;
- `adapt` — device-specific quality;
- `animate`, `typeset`, `layout` only when those dimensions need intervention.

**Conflict rule:** approved user/Figma/brand direction beats a generic detector preference. A finding is evidence to inspect, not permission to overwrite intentional design.

Recommended completion loop:

`render → browser inspect → visual compare → Impeccable audit/critique → targeted fix → re-render → polish/harden → final compare`

---

## 10. Design-system loop

For an existing system:

`Figma variables/styles → normalized tokens → code tokens → components → rendered result → token/visual diff back to Figma`

Do not maintain two silent token systems. If Figma and code disagree, determine authority explicitly and reconcile.

The same tokens should inform diagrams and auxiliary visual artifacts where practical.

---

## 11. Visual QA gate

### Desktop
- composition and alignment;
- type rendering and hierarchy;
- spacing rhythm and section transitions;
- image crops/focal points;
- hover/focus/active states;
- motion timing;
- no generic component regressions.

### Mobile
- no clipping/overflow;
- no leaked desktop absolute positioning;
- usable touch targets;
- sensible content order;
- sane text measure;
- safe animation degradation;
- `100dvh` / safe-area behavior where relevant.

### Figma/reference fidelity
Compare final render against the approved source. DOM correctness alone is insufficient.

### Performance
For motion/WebGL/large-media work, collect actual runtime evidence. Do not label something "optimized" because the code looks reasonable.

### Content
Verify exact provided content, spelling, data, links, assets, and states.

---

## 12. Completion criteria

A task is finished only when:

- direction is context-specific and coherent;
- correct specialist skills were used without context dumping;
- Figma writes used the correct execution path;
- tokens/components are not needlessly duplicated;
- code runs with declared dependencies;
- desktop/mobile are addressed when applicable;
- runtime/browser QA happened after the final meaningful change;
- performance evidence exists when performance is material;
- Impeccable findings are resolved or deliberately documented when enabled;
- no placeholder implementation remains;
- vendor snapshots remain unmodified unless intentionally updating upstream.

---

## Repository map

- `skills/web-designer/` — orchestration layer.
- `skills/*` — Taste and visual-direction specialists from Taste Skill.
- `vendor/figma-design-pipeline/` — Figma MCP/server/plugin execution layer.
- `vendor/agent-skills/` — pinned engineering/verification workflows.
- `vendor/diagram-design/` — pinned branded diagram engine/skill.
- `scripts/install-web-designer.mjs` — installs core skills + Figma pipeline; optional `--with-3d`.
- `scripts/enable-project.mjs` — enables pinned Impeccable project QA/hooks.
- `AGENTS.md` — repository operating rules.

When in doubt: **Taste directs → Figma executes → engineering makes it real → browser/Impeccable prove it → specialist artifact engines handle the unusual parts.**
