#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const required = [
  'AGENTS.md',
  'THIRD_PARTY_NOTICES.md',
  'skills/web-designer/SKILL.md',
  'skills/taste-skill/SKILL.md',
  'vendor/figma-design-pipeline/package.json',
  'vendor/figma-design-pipeline/LICENSE',
  'vendor/figma-design-pipeline/UPSTREAM.md',
  'vendor/figma-design-pipeline/skill/SKILL.md',
  'vendor/agent-skills/LICENSE',
  'vendor/agent-skills/UPSTREAM.md',
  'vendor/agent-skills/skills/frontend-ui-engineering/SKILL.md',
  'vendor/agent-skills/skills/browser-testing-with-devtools/SKILL.md',
  'vendor/agent-skills/skills/performance-optimization/SKILL.md',
  'vendor/agent-skills/skills/source-driven-development/SKILL.md',
  'vendor/agent-skills/skills/code-review-and-quality/SKILL.md',
  'vendor/diagram-design/LICENSE',
  'vendor/diagram-design/UPSTREAM.md',
  'vendor/diagram-design/skills/diagram-design/SKILL.md',
  'scripts/install-web-designer.mjs',
  'scripts/enable-project.mjs',
  'skill.sh',
  'package.json',
];

const failures = [];

for (const path of required) {
  if (!existsSync(join(root, path))) failures.push(`Missing required path: ${path}`);
}

for (const oneTimeWorkflow of [
  'import-figma-design-pipeline.yml',
  'import-design-stack-v2.yml',
]) {
  if (existsSync(join(root, '.github', 'workflows', oneTimeWorkflow))) {
    failures.push(`One-time importer workflow must not remain in the repository: ${oneTimeWorkflow}`);
  }
}

const primarySkill = readFileSync(join(root, 'skills', 'web-designer', 'SKILL.md'), 'utf8');
for (const marker of [
  'name: imon-web-designer',
  'figma_execute',
  'figma_plugin_status',
  'skills/taste-skill/SKILL.md',
  'frontend-ui-engineering',
  'browser-testing-with-devtools',
  'performance-optimization',
  'source-driven-development',
  'code-review-and-quality',
  'diagram-design',
  'img2threejs',
  'Impeccable',
]) {
  if (!primarySkill.includes(marker)) failures.push(`Primary skill is missing routing marker: ${marker}`);
}

const registry = readFileSync(join(root, 'skill.sh'), 'utf8');
if (!registry.includes('web-designer) echo "skills/web-designer/SKILL.md"')) {
  failures.push('skill.sh does not register web-designer.');
}
if (registry.includes('declare -A')) {
  failures.push('skill.sh must remain compatible with macOS Bash 3.2 and cannot use declare -A.');
}

const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (rootPackage.version !== '0.2.0') failures.push(`Unexpected Web-Designer version: ${rootPackage.version}`);
for (const scriptName of ['setup', 'setup:codex', 'setup:3d', 'enable:project', 'validate']) {
  if (!rootPackage.scripts?.[scriptName]) failures.push(`Missing package script: ${scriptName}`);
}

const figmaPackage = JSON.parse(readFileSync(join(root, 'vendor', 'figma-design-pipeline', 'package.json'), 'utf8'));
if (figmaPackage.name !== '@spicefactory/figma-design-pipeline') {
  failures.push(`Unexpected Figma vendor package name: ${figmaPackage.name}`);
}
if (figmaPackage.version !== '0.8.0') {
  failures.push(`Vendored figma-design-pipeline drifted from pinned 0.8.0: ${figmaPackage.version}`);
}
if (figmaPackage.engines?.node !== '>=24.0.0') {
  failures.push(`Unexpected Figma vendor Node requirement: ${figmaPackage.engines?.node}`);
}

const pinnedFiles = [
  ['vendor/figma-design-pipeline/UPSTREAM.md', 'f51a7ee82a34c374d2bc209cb8aac4d5a36044b6'],
  ['vendor/agent-skills/UPSTREAM.md', 'f63ec56a3cc936408d792956ae583c3c96a825bd'],
  ['vendor/diagram-design/UPSTREAM.md', 'ac490fd1ac4b4014100f93e729cb4ad198700bd4'],
];
for (const [path, commit] of pinnedFiles) {
  const text = readFileSync(join(root, path), 'utf8');
  if (!text.includes(commit)) failures.push(`${path} does not contain pinned commit ${commit}`);
}

const installer = readFileSync(join(root, 'scripts', 'install-web-designer.mjs'), 'utf8');
for (const marker of [
  '441af85a96523569511154b6321859b79f3592f5',
  'frontend-ui-engineering',
  'browser-testing-with-devtools',
  'diagram-design',
  '--with-3d',
]) {
  if (!installer.includes(marker)) failures.push(`Installer is missing marker: ${marker}`);
}

const projectBootstrap = readFileSync(join(root, 'scripts', 'enable-project.mjs'), 'utf8');
for (const marker of ['3.6.1', '--scope=project', 'impeccable']) {
  if (!projectBootstrap.toLowerCase().includes(marker.toLowerCase())) {
    failures.push(`Project bootstrap is missing Impeccable marker: ${marker}`);
  }
}

if (failures.length) {
  console.error('Web-Designer validation failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Web-Designer design stack v2 validation passed.');
console.log('Primary skill: imon-web-designer');
console.log(`Figma pipeline: ${figmaPackage.version} / Node ${figmaPackage.engines.node}`);
console.log('Engineering layer: addyosmani/agent-skills @ f63ec56');
console.log('Diagram layer: cathrynlavery/diagram-design @ ac490fd');
console.log('Project QA: impeccable@3.6.1');
console.log('Optional 3D: img2threejs @ 441af85');
