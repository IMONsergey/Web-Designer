# Web Designer

Agent-native web design workflow that combines **design judgment**, **Figma execution**, **design-to-code**, and **visual QA** in one repository.

The project currently integrates two open-source foundations:

- **Taste Skill** — anti-template visual intelligence and specialist design skills.
- **SPFR Figma Design Pipeline** — Figma inspection, auditing, planning, token sync, codegen, and high-performance batched writes.

Our own `imon-web-designer` skill sits above both and decides which layer should do what.

> Status: early integration. The upstream projects are pinned so the system remains reproducible while the orchestration layer evolves.

## Why this exists

A design agent needs more than a long prompt.

A useful workflow has separate layers:

```text
Brief / references / existing product
              │
              ▼
      Design Read + Taste
   visual direction / hierarchy
              │
              ▼
       Figma intelligence
 inspect / audit / tokens / plan
              │
              ▼
        Figma execution
   figma_execute / plugin bridge
              │
              ▼
        Design → Code
 components / tokens / responsive
              │
              ▼
          Visual QA
 Figma ↔ render ↔ reference comparison
```

The key rule is simple:

**Taste decides. Figma Pipeline executes. QA verifies.**

## Primary skill

The main entry point is:

```text
skills/web-designer/SKILL.md
```

Install name:

```text
imon-web-designer
```

It routes tasks to the existing specialist skills instead of loading every design rule at once.

Examples:

- Greenfield site → `taste-skill`
- Stronger Codex / experimental art direction → `gpt-tasteskill`
- Existing site → `redesign-skill`
- Screenshot/reference → `image-to-code-skill`
- Figma as source or destination → `imon-web-designer` + Figma Design Pipeline

See [`skills/web-designer/SKILL.md`](skills/web-designer/SKILL.md) for the full routing and QA protocol.

## Figma layer

The upstream pipeline is vendored at:

```text
vendor/figma-design-pipeline/
```

Pinned upstream:

```text
spfr/figma-design-pipeline
f51a7ee82a34c374d2bc209cb8aac4d5a36044b6
v0.8.0
```

It provides:

- Figma tree inspection and search
- audits
- token/style/component extraction
- naming/layout/grouping/component planning
- component mapping and code generation
- token export/diff
- `figma_execute` for batched writes
- Figma Desktop plugin bridge

The vendored package currently requires **Node.js 24+**.

Do not put project-specific modifications inside `vendor/figma-design-pipeline/`. Integration logic belongs in the root repository so upstream can be updated cleanly.

## Quick setup

### 1. Clone

```bash
git clone https://github.com/IMONsergey/Web-Designer.git
cd Web-Designer
```

### 2. Use Node 24+

```bash
node --version
```

If necessary:

```bash
nvm install 24
nvm use 24
```

### 3. Install for all supported agent CLIs

```bash
npm run setup
```

Or only one client:

```bash
npm run setup:codex
npm run setup:claude
npm run setup:gemini
```

The setup script:

1. installs dependencies for the vendored Figma pipeline;
2. builds its MCP server and Figma plugin;
3. registers the pipeline with the selected CLI(s);
4. installs/symlinks the upstream pipeline skill;
5. symlinks `imon-web-designer` into the selected CLI skill directory.

### 4. Enable the fast Figma write bridge

After setup, open **Figma Desktop**:

```text
Plugins → Development → Import plugin from manifest
```

Choose:

```text
~/.figma-design-pipeline/plugin/manifest.json
```

Run the plugin. Then restart the coding-agent CLI.

At the start of a Figma write task the agent should call:

```text
figma_plugin_status
```

When connected, Figma mutations go through `figma_execute` and the plugin bridge. If disconnected, `figma_execute` remains the first write path and can provide fallback JavaScript.

## Example workflows

### Figma → production frontend

```text
Inspect the selected Figma page, audit hierarchy/components/tokens,
load the Web Designer skill, map the design to the existing codebase,
implement it responsively, then visually compare the rendered result
against Figma before finishing.
```

### Existing site → Figma redesign → code

```text
Audit the existing site first. Preserve valid brand/content constraints.
Create a design direction using the redesign/taste skills, apply the
approved changes in Figma through the pipeline, then implement the same
token/component system in code and run visual QA.
```

### Reference image → Figma → code

```text
Use image-to-code analysis to extract composition, hierarchy, type,
spacing, imagery and interaction intent. Reconstruct the system in Figma,
verify visually, then implement it in code without flattening the design.
```

## Repository structure

```text
AGENTS.md
skills/
  web-designer/          # primary orchestration skill
  taste-skill/           # general anti-slop design intelligence
  gpt-tasteskill/        # stricter GPT/Codex direction
  redesign-skill/
  image-to-code-skill/
  ...                    # specialist design modes
scripts/
  install-web-designer.mjs
  validate-web-designer.mjs
vendor/
  figma-design-pipeline/ # pinned upstream MCP server + Figma plugin
THIRD_PARTY_NOTICES.md
```

The original Taste Skill research, examples, assets, scripts, and specialist skills remain in the repository.

## Validation

Integration checks:

```bash
npm run validate
```

Full vendored pipeline check/build:

```bash
cd vendor/figma-design-pipeline
npm ci
npm run check
npm test
npm run build
```

GitHub Actions runs both validation layers on pushes and pull requests.

## Upstream and licenses

This repository contains third-party MIT-licensed source. Attribution and pinned revisions are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Figma Design Pipeline: https://github.com/spfr/figma-design-pipeline

Preserve the relevant upstream license notices when redistributing their code or substantial portions of it.
