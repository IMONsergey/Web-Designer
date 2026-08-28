# Third-party notices

This repository combines an integration layer maintained in `IMONsergey/Web-Designer` with third-party open-source work.

## Taste Skill

- Upstream: `Leonxlnx/taste-skill`
- Snapshot commit: `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`
- Upstream repository: https://github.com/Leonxlnx/taste-skill
- License: MIT
- Copyright: © 2026 Leonxlnx
- License text: root `LICENSE`

The original Taste Skill source, specialist skills, research, examples, scripts, and assets are retained in this repository under their upstream license.

## SPFR Figma Design Pipeline

- Upstream: `spfr/figma-design-pipeline`
- Snapshot commit: `f51a7ee82a34c374d2bc209cb8aac4d5a36044b6`
- Version: `0.8.0`
- Upstream repository: https://github.com/spfr/figma-design-pipeline
- License: MIT
- Copyright: © 2026 SpiceFactory, LLC
- License text: `vendor/figma-design-pipeline/LICENSE`

The pipeline is vendored unchanged under `vendor/figma-design-pipeline/`. Project-specific integration logic should live outside that directory.

## Integration layer

Files created specifically for the unified Web-Designer workflow (for example `skills/web-designer/`, `AGENTS.md`, repository setup/validation scripts and integration documentation) are separate from the pinned upstream snapshots. Preserve the upstream license notices whenever upstream code or substantial portions are redistributed.
