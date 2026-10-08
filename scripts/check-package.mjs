import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const meta = JSON.parse(await readFile('package.json', 'utf8'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const [packed] = JSON.parse(execFileSync(npm, ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
const names = packed.files.map(file => file.path);
for (const required of ['lib/index.js', 'lib/git.js', 'client/client.js', 'cordis.patch.yml', 'README.md', 'README.en.md', 'LICENSE', 'SECURITY.md']) {
  assert.ok(names.includes(required), `Missing package file: ${required}`);
}
assert.equal(meta.dsh.client.platform, 'web');
assert.equal(meta.dsh.bundle.patch, './cordis.patch.yml');
assert.ok(!meta.scripts.prepare && !meta.scripts.install && !meta.scripts.postinstall, 'End users must not need install scripts');
const forbiddenPaths = /(?:node_modules|verification|tests|\.env)(?:\/|$)|\.tgz$/;
for (const name of names) {
  assert.ok(!forbiddenPaths.test(name), `Unexpected package member: ${name}`);
  const text = await readFile(name, 'utf8');
  // Reject local workstation paths and common credential forms without printing matches.
  assert.ok(!/(?:\/Users\/|\/Applications\/|\/home\/[\w.-]+\/)/.test(text), `Local path in ${name}`);
  assert.ok(!/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{20,})/.test(text), `Potential credential in ${name}`);
}
const client = await readFile('client/client.js', 'utf8');
assert.match(client, /^window\.__ModuleLoader__\.load\(\{\s*id:\s*"dsh-project-summary"/, 'Missing DSH module-loader envelope');
console.log(`Package checks passed: ${meta.name}@${meta.version}, ${names.length} files, no install scripts, no detected credentials or workstation paths.`);
