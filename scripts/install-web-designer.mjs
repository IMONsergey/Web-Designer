#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const figmaVendorDir = join(repoRoot, 'vendor', 'figma-design-pipeline');
const agentSkillsVendorDir = join(repoRoot, 'vendor', 'agent-skills');
const diagramVendorDir = join(repoRoot, 'vendor', 'diagram-design');
const primarySkillSource = join(repoRoot, 'skills', 'web-designer');

const IMG2THREEJS_REPO = 'https://github.com/img2threejs/img2threejs.git';
const IMG2THREEJS_COMMIT = '441af85a96523569511154b6321859b79f3592f5';

const args = process.argv.slice(2);
const clientIndex = args.indexOf('--client');
const client = clientIndex >= 0 ? args[clientIndex + 1] : 'all';
const force = args.includes('--force');
const with3d = args.includes('--with-3d');
const validClients = new Set(['all', 'codex', 'claude', 'gemini']);

if (!validClients.has(client)) {
  console.error(`Unsupported --client ${client}. Use all, codex, claude, or gemini.`);
  process.exit(1);
}

const major = Number(process.versions.node.split('.')[0]);
if (!Number.isFinite(major) || major < 24) {
  console.error(`Node 24+ is required by figma-design-pipeline. Current: ${process.version}`);
  process.exit(1);
}

function run(command, commandArgs, cwd) {
  console.log(`\n> ${command} ${commandArgs.join(' ')}`);
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function linkSkill(name, source, targetDir) {
  if (!existsSync(source)) {
    console.error(`Skill source is missing: ${source}`);
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });
  const destination = join(targetDir, name);

  if (existsSync(destination)) {
    const stat = lstatSync(destination);
    if (stat.isSymbolicLink() || force) {
      rmSync(destination, { recursive: true, force: true });
    } else {
      console.warn(`Skipping ${destination}: it already exists and is not a symlink. Use --force to replace it.`);
      return;
    }
  }

  symlinkSync(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
  console.log(`Linked ${name} -> ${destination}`);
}

function syncPinnedGitRepo({ repository, commit, destination }) {
  mkdirSync(dirname(destination), { recursive: true });

  if (existsSync(destination) && !existsSync(join(destination, '.git'))) {
    if (!force) {
      console.error(`${destination} exists but is not a Git checkout. Re-run with --force to replace it.`);
      process.exit(1);
    }
    rmSync(destination, { recursive: true, force: true });
  }

  if (!existsSync(destination)) {
    run('git', ['clone', repository, destination], repoRoot);
  } else {
    run('git', ['remote', 'set-url', 'origin', repository], destination);
  }

  run('git', ['fetch', 'origin', commit], destination);
  run('git', ['checkout', '--detach', commit], destination);
}

for (const required of [
  join(figmaVendorDir, 'package.json'),
  join(agentSkillsVendorDir, 'skills', 'frontend-ui-engineering', 'SKILL.md'),
  join(diagramVendorDir, 'skills', 'diagram-design', 'SKILL.md'),
]) {
  if (!existsSync(required)) {
    console.error(`Required vendored dependency is missing: ${required}`);
    process.exit(1);
  }
}

console.log('Installing vendored figma-design-pipeline...');
run('npm', ['ci'], figmaVendorDir);
run('npm', ['run', 'build'], figmaVendorDir);
run('npm', ['run', 'install:clients', '--', '--client', client, '--skip-build'], figmaVendorDir);

const home = homedir();
const targets = {
  codex: join(home, '.codex', 'skills'),
  claude: join(home, '.claude', 'skills'),
  gemini: join(home, '.gemini', 'skills'),
};

const coreSkills = [
  ['imon-web-designer', primarySkillSource],
  ['frontend-ui-engineering', join(agentSkillsVendorDir, 'skills', 'frontend-ui-engineering')],
  ['browser-testing-with-devtools', join(agentSkillsVendorDir, 'skills', 'browser-testing-with-devtools')],
  ['performance-optimization', join(agentSkillsVendorDir, 'skills', 'performance-optimization')],
  ['source-driven-development', join(agentSkillsVendorDir, 'skills', 'source-driven-development')],
  ['code-review-and-quality', join(agentSkillsVendorDir, 'skills', 'code-review-and-quality')],
  ['diagram-design', join(diagramVendorDir, 'skills', 'diagram-design')],
];

let img2threejsSource = null;
if (with3d) {
  img2threejsSource = join(home, '.imon-web-designer', 'extras', 'img2threejs');
  console.log('\nInstalling optional img2threejs capability...');
  syncPinnedGitRepo({
    repository: IMG2THREEJS_REPO,
    commit: IMG2THREEJS_COMMIT,
    destination: img2threejsSource,
  });
}

const selected = client === 'all' ? Object.keys(targets) : [client];
for (const targetClient of selected) {
  for (const [name, source] of coreSkills) {
    linkSkill(name, source, targets[targetClient]);
  }
  if (img2threejsSource) {
    linkSkill('img2threejs', img2threejsSource, targets[targetClient]);
  }
}

console.log('\nWeb-Designer setup complete.');
console.log(`Primary skill: ${primarySkillSource}`);
console.log('Engineering skills: frontend-ui-engineering, browser-testing-with-devtools, performance-optimization, source-driven-development, code-review-and-quality');
console.log('Visual-content skill: diagram-design');
if (img2threejsSource) console.log(`Optional 3D skill: ${img2threejsSource}`);
console.log(`Figma plugin manifest: ${join(home, '.figma-design-pipeline', 'plugin', 'manifest.json')}`);
console.log('Open Figma Desktop, import that development plugin manifest, run the plugin, then restart your agent CLI.');
console.log('For deterministic Impeccable QA/hooks, enable Web-Designer inside each target project with scripts/enable-project.mjs.');
