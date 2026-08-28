#!/usr/bin/env bash

# Portable local skill registry (works with macOS Bash 3.2+).
skill_path() {
  case "${1:-}" in
    web-designer) echo "skills/web-designer/SKILL.md" ;;
    taste-skill) echo "skills/taste-skill/SKILL.md" ;;
    taste-skill-v1) echo "skills/taste-skill-v1/SKILL.md" ;;
    gpt-taste) echo "skills/gpt-tasteskill/SKILL.md" ;;
    image-to-code-skill) echo "skills/image-to-code-skill/SKILL.md" ;;
    imagegen-frontend-web) echo "skills/imagegen-frontend-web/SKILL.md" ;;
    imagegen-frontend-mobile) echo "skills/imagegen-frontend-mobile/SKILL.md" ;;
    brandkit) echo "skills/brandkit/SKILL.md" ;;
    redesign-skill) echo "skills/redesign-skill/SKILL.md" ;;
    soft-skill) echo "skills/soft-skill/SKILL.md" ;;
    output-skill) echo "skills/output-skill/SKILL.md" ;;
    minimalist-skill) echo "skills/minimalist-skill/SKILL.md" ;;
    brutalist-skill) echo "skills/brutalist-skill/SKILL.md" ;;
    stitch-skill) echo "skills/stitch-skill/SKILL.md" ;;
    "")
      echo "Usage: source ./skill.sh <skill-name>"
      echo "Available skills: web-designer taste-skill taste-skill-v1 gpt-taste image-to-code-skill imagegen-frontend-web imagegen-frontend-mobile brandkit redesign-skill soft-skill output-skill minimalist-skill brutalist-skill stitch-skill"
      return 1 2>/dev/null || exit 1
      ;;
    *)
      echo "Unknown skill: $1" >&2
      return 1 2>/dev/null || exit 1
      ;;
  esac
}

skill_path "${1:-}"
