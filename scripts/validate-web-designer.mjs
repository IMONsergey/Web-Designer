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
  'scripts/install-web-designer.mjs',
  'skill.sh',
];

const failures = [];

for (const path of required) {
  if (!existsSync(join(root, path))) failures.push(`Missing required path: ${path}`);
}

if (existsSync(join(root, '.github', 'workflows', 'import-figma-design-pipeline.yml'))) {
  failures.push('One-time figma importer workflow must not remain in the repository.');
}

const primarySkill = readFileSync(join(root, 'skills', 'web-designer', 'SKILL.md'), 'utf8');
for (const marker of ['name: imon-web-designer', 'figma_execute', 'figma_plugin_status', 'skills/taste-skill/SKILL.md']) {
  if (!primarySkill.includes(marker)) failures.push(`Primary skill is missing routing marker: ${marker}`);
}

const registry = readFileSync(join(root, 'skill.sh'), 'utf8');
if (!registry.includes('[web-designer]="skills/web-designer/SKILL.md"')) {
  failures.push('skill.sh does not register web-designer.');
}

const vendorPackage = JSON.parse(readFileSync(join(root, 'vendor', 'figma-design-pipeline', 'package.json'), 'utf8'));
if (vendorPackage.name !== '@spicefactory/figma-design-pipeline') {
  failures.push(`Unexpected vendor package name: ${vendorPackage.name}`);
}
if (vendorPackage.version !== '0.8.0') {
  failures.push(`Vendored figma-design-pipeline version drifted from pinned 0.8.0: ${vendorPackage.version}`);
}
if (vendorPackage.engines?.node !== '>=24.0.0') {
  failures.push(`Unexpected vendor Node requirement: ${vendorPackage.engines?.node}`);
}

const upstream = readFileSync(join(root, 'vendor', 'figma-design-pipeline', 'UPSTREAM.md'), 'utf8');
if (!upstream.includes('f51a7ee82a34c374d2bc209cb8aac4d5a36044b6')) {
  failures.push('Vendor UPSTREAM.md does not contain the pinned upstream commit.');
}

if (failures.length) {
  console.error('Web-Designer validation failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Web-Designer integration validation passed.');
console.log(`Primary skill: imon-web-designer`);
console.log(`Figma pipeline: ${vendorPackage.version} / Node ${vendorPackage.engines.node}`);
