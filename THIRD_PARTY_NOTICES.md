# Third-party notices

This repository combines an integration/orchestration layer maintained in `IMONsergey/Web-Designer` with pinned or optional third-party open-source work.

## Taste Skill

- Upstream: `Leonxlnx/taste-skill`
- Snapshot commit: `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`
- Repository: https://github.com/Leonxlnx/taste-skill
- License: MIT
- Copyright: © 2026 Leonxlnx
- License text: root `LICENSE`

The original Taste Skill source, specialist skills, research, examples, scripts, and assets are retained under their upstream license.

## SPFR Figma Design Pipeline

- Upstream: `spfr/figma-design-pipeline`
- Snapshot commit: `f51a7ee82a34c374d2bc209cb8aac4d5a36044b6`
- Version: `0.8.0`
- Repository: https://github.com/spfr/figma-design-pipeline
- License: MIT
- Copyright: © 2026 SpiceFactory, LLC
- License text: `vendor/figma-design-pipeline/LICENSE`

The pipeline is vendored under `vendor/figma-design-pipeline/`. Project-specific integration logic should remain outside that directory.

## Addy Osmani Agent Skills

- Upstream: `addyosmani/agent-skills`
- Snapshot commit: `f63ec56a3cc936408d792956ae583c3c96a825bd`
- Repository: https://github.com/addyosmani/agent-skills
- License: MIT
- Copyright: © 2025 Addy Osmani
- License text: `vendor/agent-skills/LICENSE`

The full upstream snapshot is retained under `vendor/agent-skills/` for reproducibility. Web-Designer exposes only a focused subset by default: `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization`, `source-driven-development`, and `code-review-and-quality`. Other upstream skills remain available for deliberate future routing but are not automatically loaded.

## Diagram Design

- Upstream: `cathrynlavery/diagram-design`
- Snapshot commit: `ac490fd1ac4b4014100f93e729cb4ad198700bd4`
- Repository: https://github.com/cathrynlavery/diagram-design
- License: MIT
- Copyright: © 2025 Cathryn Lavery
- License text: `vendor/diagram-design/LICENSE`

The pinned snapshot is retained under `vendor/diagram-design/`. Web-Designer routes diagram/chart/process/architecture-style communication tasks to its `diagram-design` skill when a visual communicates the content better than ordinary page UI.

## Impeccable (external project QA integration)

- Upstream: `pbakaus/impeccable`
- Supported integration version: `3.6.1`
- Repository: https://github.com/pbakaus/impeccable
- License: Apache-2.0
- Not vendored in this repository.

`scripts/enable-project.mjs` invokes the pinned npm package for a **target project**. This keeps Impeccable's provider hooks, live-browser runtime, deterministic detector, and project-specific state beside the actual site rather than copying its large repository into Web-Designer.

## img2threejs (optional external 3D extra)

- Upstream: `img2threejs/img2threejs`
- Pinned commit: `441af85a96523569511154b6321859b79f3592f5`
- Version at that snapshot: `1.5.1`
- Repository: https://github.com/img2threejs/img2threejs
- License: Apache-2.0
- Not vendored in this repository.

When setup is run with `--with-3d`, the installer creates a pinned local checkout under `~/.imon-web-designer/extras/img2threejs` and exposes its skill to selected agents. It is intentionally optional because reference-to-procedural-3D reconstruction is a specialist workflow, not a requirement for ordinary web design.

## Integration layer

Files created specifically for the unified Web-Designer workflow — including `skills/web-designer/`, `AGENTS.md`, repository setup/validation scripts, routing policy, and integration documentation — are separate from pinned upstream snapshots.

Preserve the corresponding upstream copyright and license notices whenever third-party code or substantial portions are redistributed.
