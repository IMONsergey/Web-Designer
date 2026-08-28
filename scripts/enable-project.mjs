#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const IMPECCABLE_VERSION = '3.6.1';
const args = process.argv.slice(2);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}

const projectArg = valueAfter('--project');
const client = valueAfter('--client') ?? 'codex';
const validClients = new Set(['all', 'codex', 'claude', 'gemini']);

if (!projectArg) {
  console.error('Missing --project. Example: node scripts/enable-project.mjs --project ../my-site --client codex');
  process.exit(1);
}

if (!validClients.has(client)) {
  console.error(`Unsupported --client ${client}. Use all, codex, claude, or gemini.`);
  process.exit(1);
}

const project = resolve(projectArg);
if (!existsSync(project)) {
  console.error(`Project directory does not exist: ${project}`);
  process.exit(1);
}

const providerMap = {
  all: 'codex,claude,gemini',
  codex: 'codex',
  claude: 'claude',
  gemini: 'gemini',
};

console.log(`Enabling deterministic design QA in ${project}`);
console.log(`Impeccable: ${IMPECCABLE_VERSION}`);
console.log(`Providers: ${providerMap[client]}`);

const result = spawnSync(
  'npx',
  [
    '-y',
    `impeccable@${IMPECCABLE_VERSION}`,
    'install',
    `--providers=${providerMap[client]}`,
    '--scope=project',
  ],
  {
    cwd: project,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('\nProject QA layer enabled.');
console.log('Run /impeccable init (or the provider-equivalent skill invocation) once inside the project to establish PRODUCT.md / DESIGN.md context.');
console.log('Use Impeccable after the Web-Designer direction is established: audit -> critique/polish -> harden/optimize as needed.');
console.log('For Codex, approve the project hook when Codex asks for hook trust.');
