# Web Designer

Agent-native web design and design-engineering system for **Codex, Claude Code, and Gemini CLI**.

Web-Designer is not one giant prompt. It separates art direction, Figma execution, frontend engineering, specialist visual artifacts, and verification into distinct layers, then routes each task to the narrowest useful skill.

## Stack v2

```text
Brief / Figma / code / references
              │
              ▼
       DIRECTION / TASTE
 Taste Skill + specialist modes
              │
              ▼
         FIGMA ENGINE
 inspect / audit / tokens / plan
 figma_execute / plugin bridge
              │
              ▼
     FRONTEND ENGINEERING
 architecture / source verification
 browser tests / performance / review
              │
       ┌──────┴──────┐
       ▼             ▼
  DIAGRAMS        OPTIONAL 3D
  editorial       img2threejs
  HTML/SVG        procedural WebGL
       └──────┬──────┘
              ▼
        IMPLEMENTATION
              │
              ▼
          PROOF / QA
 browser evidence + visual compare
 Impeccable deterministic detectors
```

The practical rule:

**Taste directs → Figma executes → engineering makes it real → browser/Impeccable prove it.**

## What is integrated

### 1. Taste Skill — visual direction

Original source from [`Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill), snapshot `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`.

Used for:

- anti-template / anti-AI-slop art direction;
- greenfield websites;
- Codex-heavy experimental layouts;
- redesigns;
- image/reference → code;
- premium/minimal/brutalist modes;
- brand exploration.

The original specialist skills, research, examples, and assets remain in `skills/`, `research/`, and related upstream paths.

### 2. SPFR Figma Design Pipeline — design artifact execution

Vendored at `vendor/figma-design-pipeline/`, pinned to:

```text
spfr/figma-design-pipeline
f51a7ee82a34c374d2bc209cb8aac4d5a36044b6
v0.8.0
```

Provides:

- tree/node inspection;
- Figma audits;
- token/style/component extraction;
- naming/layout/grouping/component planning;
- design-to-code mapping/codegen;
- token export/diff;
- `figma_execute` for batched mutations;
- Figma Desktop WebSocket plugin bridge.

Requires **Node.js 24+**.

### 3. Addy Osmani Agent Skills — production engineering

Full pinned upstream snapshot lives at `vendor/agent-skills/`:

```text
addyosmani/agent-skills
f63ec56a3cc936408d792956ae583c3c96a825bd
```

Web-Designer exposes only five focused skills by default:

- `frontend-ui-engineering` — components, responsive UI, semantics, accessibility;
- `source-driven-development` — verify framework/library decisions against authoritative docs;
- `browser-testing-with-devtools` — prove runtime behavior in the browser;
- `performance-optimization` — Core Web Vitals, bundles, media, motion/WebGL performance;
- `code-review-and-quality` — final engineering quality gate.

The entire catalog is retained for reproducibility and future expansion, but is **not** dumped into every agent context.

### 4. Diagram Design — editorial diagrams and structured visual content

Vendored at `vendor/diagram-design/`, pinned to:

```text
cathrynlavery/diagram-design
ac490fd1ac4b4014100f93e729cb4ad198700bd4
```

It provides branded self-contained HTML/SVG/PNG diagrams and 39 visual grammars: architecture, process, flow, sequence, timeline, Gantt, journey, Sankey, quadrant, charts, schemas, dependency graphs, UML, etc.

Use it when information genuinely communicates better visually than as generic cards or prose. Existing project/Figma tokens should skin the diagram instead of silently using upstream defaults.

### 5. Impeccable — deterministic design QA, enabled per project

Impeccable is intentionally **not vendored**. Web-Designer pins the supported integration to `impeccable@3.6.1` and installs it into the **actual target project**.

Why it is separate:

- 59 deterministic frontend detector rules;
- design/UX commands such as audit, critique, polish, harden, optimize, adapt, typeset, layout;
- provider-native hooks;
- live browser iteration infrastructure;
- project-local `PRODUCT.md` / `DESIGN.md` context.

It is a QA/iteration layer, not the art director. Approved brand/Figma/user intent outranks generic detector preferences.

### 6. img2threejs — optional reference → procedural Three.js

Not installed by default. `--with-3d` pins:

```text
img2threejs/img2threejs
441af85a96523569511154b6321859b79f3592f5
v1.5.1
```

Use for a concrete reference object or character that should become a procedural, animation-ready Three.js model with staged quality gates. Do **not** use it for ordinary particles, abstract shaders, globes, or decorative WebGL.

## Primary orchestrator

Main skill:

```text
skills/web-designer/SKILL.md
```

Install name:

```text
imon-web-designer
```

It routes tasks instead of concatenating all skills into one context.

Examples:

| Task | Route |
|---|---|
| New landing / portfolio / brand site | Taste + frontend engineering |
| Existing-site redesign | Redesign skill → implementation → browser/QA |
| Figma → code | Figma Pipeline → engineering → visual comparison |
| Screenshot/reference → site | Image-to-code → engineering → QA |
| Process/architecture/roadmap visual | Diagram Design |
| Heavy animation / WebGL | performance gate + appropriate implementation skill |
| Reference product/object → 3D | optional img2threejs |
| Final UI cleanup | browser evidence + Impeccable audit/critique/polish |

See [`skills/web-designer/SKILL.md`](skills/web-designer/SKILL.md) for the routing contract.

## Install

### 1. Clone

```bash
git clone https://github.com/IMONsergey/Web-Designer.git
cd Web-Designer
```

### 2. Node 24+

```bash
nvm install 24
nvm use 24
```

### 3. Install core stack

All supported agent CLIs:

```bash
npm run setup
```

Or one client:

```bash
npm run setup:codex
npm run setup:claude
npm run setup:gemini
```

Core setup installs/builds the Figma pipeline and links:

```text
imon-web-designer
frontend-ui-engineering
source-driven-development
browser-testing-with-devtools
performance-optimization
code-review-and-quality
diagram-design
```

### Optional 3D stack

```bash
npm run setup:3d
```

This additionally creates a pinned checkout under:

```text
~/.imon-web-designer/extras/img2threejs
```

and links `img2threejs` into the selected skill directories.

## Figma Desktop bridge

After setup:

```text
Figma Desktop
→ Plugins
→ Development
→ Import plugin from manifest
→ ~/.figma-design-pipeline/plugin/manifest.json
```

Run the plugin, then restart the agent CLI.

Before any Figma write task the agent should call:

```text
figma_plugin_status
```

All mutations should route through:

```text
figma_execute
```

If the bridge is disconnected, `figma_execute` remains the first path and can provide fallback JavaScript.

## Enable deterministic QA in a target project

Example for Codex:

```bash
npm run enable:project -- --project ../my-site --client codex
```

For all supported clients:

```bash
npm run enable:project -- --project ../my-site --client all
```

This runs the pinned Impeccable project installer. Inside the target project, initialize its design context once using the provider's Impeccable invocation (`/impeccable init` where supported).

For Codex, approve the project hook when Codex requests hook trust.

## Recommended workflow

### Greenfield website

```text
brief/references
→ Design Read
→ Taste direction
→ implementation plan
→ frontend-ui-engineering
→ build
→ browser-testing-with-devtools
→ performance-optimization when material
→ Impeccable audit/critique
→ targeted fixes
→ polish/harden
→ final screenshot/reference comparison
```

### Figma → production frontend

```text
figma_plugin_status
→ inspect tree/components/tokens
→ audit
→ preserve/define design direction
→ plan mutations if needed
→ figma_execute
→ screenshot + re-inspect
→ map components/tokens to existing code
→ implement responsively
→ browser evidence
→ compare render against Figma
→ Impeccable QA
```

### Branded diagram

```text
content/system to explain
→ decide whether a diagram is actually better than prose/table
→ Figma/project tokens
→ diagram-design semantic roles/profile
→ choose visual grammar
→ generate HTML/SVG
→ verify hierarchy/contrast/content
→ embed/export
```

### Reference object → WebGL hero

```text
npm run setup:3d
→ img2threejs intake
→ quality contract/spec
→ pass-by-pass procedural model
→ turntable/screenshots
→ corrections
→ integrate into site
→ browser/performance gate
→ fallback/reduced-motion strategy
```

## Repository structure

```text
AGENTS.md
skills/
  web-designer/             # primary I’MON orchestrator
  taste-skill/              # Taste default
  gpt-tasteskill/
  redesign-skill/
  image-to-code-skill/
  ...                       # focused Taste-derived modes
scripts/
  install-web-designer.mjs  # core installer + optional --with-3d
  enable-project.mjs        # per-project Impeccable QA/hooks
  validate-web-designer.mjs
vendor/
  figma-design-pipeline/    # pinned Figma MCP/plugin
  agent-skills/             # pinned Addy engineering pack
  diagram-design/           # pinned editorial diagram pack
THIRD_PARTY_NOTICES.md
```

Pinned vendor directories should remain upstream-clean. I’MON-specific routing and wrappers belong outside `vendor/`.

## Validation

Root integration checks:

```bash
npm run validate
```

Figma vendor validation:

```bash
npm run validate:vendor
```

GitHub Actions also syntax-checks integration scripts, validates selected vendor skill paths, and runs the Figma pipeline typecheck/tests/build.

## What is deliberately not bundled

A bigger skill folder is not automatically a better agent.

We currently **do not bundle**:

- `ui-ux-pro-max-skill` — too much overlap with Taste + Impeccable;
- `Graphify` — excellent codebase intelligence, but belongs beside the agent as project-understanding infrastructure rather than inside the design core;
- `Archify` — strong technical architecture artifact system, but overlaps the codebase/architecture intelligence layer more than the everyday design workflow;
- the entire `MengTo/Skills` catalog — highly relevant, but 123 skills would create routing noise. Specific workflows can be cherry-picked later.

Likely future MengTo candidates: full-page capture, video-to-superprompt, HTML-to-interaction-prompts, web-animation optimization, and a small number of proven GSAP/Three.js/Awwwards workflows.

## Upstream and licenses

See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for exact pinned revisions, license locations, and external integrations.
