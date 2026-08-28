#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const vendorDir = join(repoRoot, 'vendor', 'figma-design-pipeline');
const skillSource = join(repoRoot, 'skills', 'web-designer');

const args = process.argv.slice(2);
const clientIndex = args.indexOf('--client');
const client = clientIndex >= 0 ? args[clientIndex + 1] : 'all';
const force = args.includes('--force');
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

function linkSkill(name, targetDir) {
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

  symlinkSync(skillSource, destination, process.platform === 'win32' ? 'junction' : 'dir');
  console.log(`Linked ${name} -> ${destination}`);
}

if (!existsSync(join(vendorDir, 'package.json'))) {
  console.error('Vendored figma-design-pipeline is missing. Re-sync vendor/figma-design-pipeline first.');
  process.exit(1);
}

console.log('Installing vendored figma-design-pipeline...');
run('npm', ['ci'], vendorDir);
run('npm', ['run', 'build'], vendorDir);
run('npm', ['run', 'install:clients', '--', '--client', client, '--skip-build'], vendorDir);

const home = homedir();
const targets = {
  codex: join(home, '.codex', 'skills'),
  claude: join(home, '.claude', 'skills'),
  gemini: join(home, '.gemini', 'skills'),
};

const selected = client === 'all' ? Object.keys(targets) : [client];
for (const name of selected) {
  linkSkill('imon-web-designer', targets[name]);
}

console.log('\nWeb-Designer setup complete.');
console.log(`Primary skill: ${skillSource}`);
console.log(`Figma plugin manifest after pipeline install: ${join(home, '.figma-design-pipeline', 'plugin', 'manifest.json')}`);
console.log('Open Figma Desktop, import that development plugin manifest, run the plugin, then restart your agent CLI.');
