import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

test('distribution installs prebuilt entries without private host packages or a host version gate', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'dps-packaging-'));
  try {
    const [packed] = JSON.parse(execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', temp], { cwd: root, encoding: 'utf8' }));
    const profile = join(temp, 'profile');
    await mkdir(profile);
    await writeFile(join(profile, 'package.json'), JSON.stringify({ private: true, dependencies: { 'dsh-project-summary': `file:${join(temp, packed.filename)}` } }));
    execFileSync(npm, ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: profile, stdio: 'pipe' });
    const installed = join(profile, 'node_modules/dsh-project-summary');
    const meta = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
    for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies']) assert.deepEqual(Object.keys(meta[field] ?? {}), []);
    assert.equal(meta.engines?.dsh, undefined);
    assert.match(await readFile(join(installed, 'lib/index.js'), 'utf8'), /ProjectSummaryService/);
    assert.match(await readFile(join(installed, 'client/client.js'), 'utf8'), /window\.__ModuleLoader__\.load/);
    const modules = await readdir(join(profile, 'node_modules'));
    assert.ok(!modules.includes('@deepseek-ai'), 'must use host modules, not install competing copies');
  } finally { await rm(temp, { recursive: true, force: true }); }
});
