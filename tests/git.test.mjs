import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GitReader, git, githubRepo, parseStatus, parseNumstat, parseCommits } from '../lib/git.js';

async function repo() {
  const cwd = await mkdtemp(join(tmpdir(), 'dps-test-'));
  await git(cwd, ['init', '-b', 'main']);
  await git(cwd, ['config', 'user.name', 'Test']); await git(cwd, ['config', 'user.email', 'test@example.com']);
  return cwd;
}
test('NUL status parses spaces, newlines and rename targets', () => {
  assert.deepEqual(parseStatus(' M file name\0R  renamed\0old name\0?? newline\nfile\0'), [{ status: ' M', path: 'file name' }, { status: 'R ', path: 'renamed' }, { status: '??', path: 'newline\nfile' }]);
});
test('numstat handles rename and binary without double counting paths', () => {
  assert.deepEqual(parseNumstat(['2\t1\ta', '-\t-\tb', '2\t3\t', 'old', 'new', ''].join('\0')), { additions: 4, deletions: 4, binary: 1 });
});
test('only exact GitHub remotes accepted, no credentials or other hosts', () => {
  assert.equal(githubRepo('git@github.com:org/repo.git'), 'org/repo');
  assert.equal(githubRepo('https://github.com/org/repo.git'), 'org/repo');
  assert.equal(githubRepo('ssh://git@github.com/org/repo.git'), 'org/repo');
  for (const url of ['https://github.com.evil/org/repo', 'https://token@github.com/org/repo', '-x', 'https://gitlab.com/org/repo']) assert.equal(githubRepo(url), null);
});
test('commit parser preserves subjects and authors', () => {
  assert.deepEqual(parseCommits(['abc123', 'fix: 中文', 'User', '2026-01-01T00:00:00Z', ''].join('\0')), [{ hash: 'abc123', subject: 'fix: 中文', author: 'User', time: '2026-01-01T00:00:00Z' }]);
});
test('non repository reports a quiet empty state', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'dps-empty-')); assert.equal((await new GitReader().summary(cwd)).kind, 'not-repo');
});
test('unborn repository includes staged stats, untracked names, no history', async () => {
  const cwd = await repo(); await writeFile(join(cwd, 'first.txt'), 'first\n'); await git(cwd, ['add', 'first.txt']); await writeFile(join(cwd, 'untracked.txt'), 'new\n');
  const result = await new GitReader().summary(cwd);
  assert.equal(result.kind, 'repo'); assert.equal(result.branch, 'main'); assert.equal(result.additions, 1); assert.equal(result.untracked, 1); assert.deepEqual(result.commits, []);
});
test('summary uses final HEAD-to-worktree diff and does not change index', async () => {
  const cwd = await repo(); await writeFile(join(cwd, 'hello.txt'), 'one\ntwo\n'); await git(cwd, ['add', '.']); await git(cwd, ['commit', '-m', 'first commit']);
  await writeFile(join(cwd, 'hello.txt'), 'one\nthree\n'); await git(cwd, ['add', '.']); await writeFile(join(cwd, 'hello.txt'), 'one\nfour\n'); await writeFile(join(cwd, 'new.txt'), 'private content\n');
  const indexBefore = await readFile(join(cwd, '.git/index'));
  const reader = new GitReader(); const result = await reader.summary(cwd); const diff = await reader.diff(cwd);
  assert.equal(result.kind, 'repo'); assert.equal(result.additions, 1); assert.equal(result.deletions, 1); assert.equal(result.files.length, 2); assert.equal(result.commits[0].subject, 'first commit');
  assert.match(diff.text, /\+four/); assert.doesNotMatch(diff.text, /private content/); assert.deepEqual(await readFile(join(cwd, '.git/index')), indexBefore);
});
test('detached HEAD is explicitly represented', async () => {
  const cwd = await repo(); await writeFile(join(cwd, 'a'), 'a'); await git(cwd, ['add', '.']); await git(cwd, ['commit', '-m', 'init']); await git(cwd, ['checkout', '--detach']);
  const result = await new GitReader().summary(cwd); assert.equal(result.detached, true); assert.match(result.branch, /^HEAD · /);
});
test('repository fsmonitor cannot execute during a read', async () => {
  const cwd = await repo(); const marker = join(cwd, 'executed'); await git(cwd, ['config', 'core.fsmonitor', `touch ${marker}`]);
  const result = await new GitReader().summary(cwd); assert.equal(result.kind, 'repo'); await assert.rejects(readFile(marker));
});
