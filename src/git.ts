import { execFile } from 'node:child_process';
import { basename } from 'node:path';
import type { ChangedFile, Commit, DiffPreview, PullRequest, Summary } from './wire.js';

// No shell, hooks, fsmonitor, textconv, external diff, pager, or optional index writes.
const FLAGS = ['--no-pager', '--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null'];
export function run(file: string, args: string[], cwd: string, limit = 2_000_000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(file, args, { cwd, timeout: 8_000, maxBuffer: limit, encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0', GH_PROMPT_DISABLED: '1', GH_PAGER: 'cat', GH_HOST: 'github.com' } }, (error, stdout, stderr) => {
      if (error) { Object.assign(error, { stderr }); reject(error); } else resolve(stdout);
    });
  });
}
export const git = (cwd: string, args: string[]) => run('git', [...FLAGS, ...args], cwd);
export function parseStatus(text: string): ChangedFile[] {
  const parts = text.split('\0'); const files: ChangedFile[] = [];
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i]; if (!entry) continue;
    const status = entry.slice(0, 2); const path = entry.slice(3);
    files.push({ status, path });
    // -z rename/copy: target appears first, old name is the next NUL field.
    if (/[RC]/.test(status)) i++;
  }
  return files;
}
export function parseNumstat(text: string) {
  let additions = 0, deletions = 0, binary = 0;
  const parts = text.split('\0');
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i]; if (!entry) continue;
    const fields = entry.split('\t');
    if (fields[0] === '-') binary++;
    else { additions += Number(fields[0]) || 0; deletions += Number(fields[1]) || 0; }
    if (fields.slice(2).join('\t') === '') i += 2;
  }
  return { additions, deletions, binary };
}
export function githubRepo(remote: string): string | null {
  const match = remote.trim().match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
  return match?.[1] ?? null;
}
export function parseCommits(text: string): Commit[] {
  const fields = text.split('\0'); const commits: Commit[] = [];
  for (let i = 0; i + 3 < fields.length; i += 4) {
    const hash = fields[i].trim(); if (hash) commits.push({ hash, subject: fields[i + 1], author: fields[i + 2], time: fields[i + 3] });
  }
  return commits;
}
export class GitReader {
  readonly prCache = new Map<string, { at: number; value: { pr: PullRequest | null; prMessage: string } }>();
  async pullRequest(cwd: string, branch: string, detached: boolean) {
    const remote = await git(cwd, ['remote', 'get-url', 'origin']).catch(() => '');
    const repo = githubRepo(remote);
    if (!repo) return { pr: null, prMessage: '未连接 GitHub origin 仓库' };
    if (detached) return { pr: null, prMessage: '游离 HEAD，无关联分支' };
    const key = `${repo}:${branch}`; const cache = this.prCache.get(key);
    if (cache && Date.now() - cache.at < 60_000) return cache.value;
    let value: { pr: PullRequest | null; prMessage: string };
    try {
      const raw = await run('gh', ['pr', 'list', '--repo', repo, '--head', branch, '--state', 'all', '--limit', '10', '--json', 'number,title,url,state,baseRefName,isDraft'], cwd);
      const prs = JSON.parse(raw) as PullRequest[];
      const pr = prs.find(p => p.state === 'OPEN') ?? prs[0] ?? null;
      value = { pr: pr && /^https:\/\/github\.com\//.test(pr.url) ? pr : null, prMessage: pr ? '' : '当前分支暂无 PR' };
    } catch { value = { pr: null, prMessage: 'PR 暂不可用，请检查 gh 安装、登录或网络' }; }
    if (this.prCache.size >= 50) this.prCache.delete(this.prCache.keys().next().value!);
    this.prCache.set(key, { at: Date.now(), value }); return value;
  }
  async summary(cwd: string): Promise<Summary> {
    let root: string;
    try { root = (await git(cwd, ['rev-parse', '--show-toplevel'])).trim(); }
    catch (error: any) {
      return { kind: error?.code === 128 && /not a git repository/i.test(error?.stderr ?? '') ? 'not-repo' : 'unavailable', message: error?.code === 128 && /not a git repository/i.test(error?.stderr ?? '') ? '当前项目不是 Git 仓库' : 'Git 暂不可用，请检查目录和 Git 安装', updatedAt: Date.now() };
    }
    try {
      const branchRaw = await git(cwd, ['symbolic-ref', '--short', '-q', 'HEAD']).catch(() => '');
      const detached = !branchRaw.trim();
      const head = await git(cwd, ['rev-parse', '--verify', 'HEAD']).catch(() => '');
      const branch = branchRaw.trim() || (head ? `HEAD · ${head.trim().slice(0, 8)}` : '无提交');
      const [status, stats, history, divergence, pr] = await Promise.all([
        git(cwd, ['status', '--porcelain=v1', '-z', '--untracked-files=normal']),
        head ? git(cwd, ['diff', '--no-ext-diff', '--no-textconv', '--numstat', '-z', 'HEAD', '--']) : git(cwd, ['diff', '--no-ext-diff', '--no-textconv', '--cached', '--numstat', '-z', '--']),
        git(cwd, ['log', '-5', '--format=%h%x00%s%x00%an%x00%aI', '-z']).catch(() => ''),
        git(cwd, ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}', '--']).catch(() => '0\t0'),
        this.pullRequest(cwd, branch, detached),
      ]);
      const files = parseStatus(status); const [ahead, behind] = divergence.trim().split(/\s+/).map(Number);
      return { kind: 'repo', name: basename(root), branch, detached, ahead: ahead || 0, behind: behind || 0, ...parseNumstat(stats), files, untracked: files.filter(f => f.status === '??').length, commits: parseCommits(history), ...pr, updatedAt: Date.now() };
    } catch { return { kind: 'unavailable', message: '读取 Git 状态失败（目录不可访问、输出过大或超时）', updatedAt: Date.now() }; }
  }
  async diff(cwd: string): Promise<DiffPreview> {
    try {
      const head = await git(cwd, ['rev-parse', '--verify', 'HEAD']).catch(() => '');
      const args = ['diff', '--no-ext-diff', '--no-textconv', '--no-color', '--no-renames', '--unified=3'];
      const text = head ? await git(cwd, [...args, 'HEAD', '--']) : await git(cwd, [...args, '--cached', '--']);
      return { text: text.slice(0, 100_000), truncated: text.length > 100_000 };
    } catch { return { text: '', truncated: false, message: '无法预览 diff：输出过大、超时或仓库不可访问' }; }
  }
}
