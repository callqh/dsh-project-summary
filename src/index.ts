import type { Context } from '@deepseek-ai/cordis';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { GitReader } from './git.js';
import type { DiffPreview, Summary } from './wire.js';

export const name = 'project-summary';
interface Sessions { get(id: string): { header: { cwd?: string } } | undefined }
export default class ProjectSummaryService extends TypertRemoteService {
  readonly reader = new GitReader();
  readonly cache = new Map<string, { at: number; task: Promise<Summary> }>();
  constructor(ctx: Context) { super(ctx, 'projectSummary'); }
  // Only an existing Session's host-owned cwd. Never accept a filesystem path from the browser.
  cwd(sessionId: string): string | undefined {
    if (typeof sessionId !== 'string' || sessionId.length > 200) return undefined;
    return (this.ctx.get('sessions') as Sessions | undefined)?.get(sessionId)?.header.cwd;
  }
  @Remote
  async summary(sessionId: string): Promise<Summary> {
    const cwd = this.cwd(sessionId);
    if (!cwd) return { kind: 'unavailable', message: '当前会话尚未就绪或没有工作目录', updatedAt: Date.now() };
    const memo = this.cache.get(cwd);
    if (memo && Date.now() - memo.at < 4_000) return memo.task;
    if (this.cache.size >= 50) this.cache.delete(this.cache.keys().next().value!);
    const task = this.reader.summary(cwd);
    this.cache.set(cwd, { at: Date.now(), task }); return task;
  }
  @Remote
  async diff(sessionId: string): Promise<DiffPreview> {
    const cwd = this.cwd(sessionId);
    return cwd ? this.reader.diff(cwd) : { text: '', truncated: false, message: '当前会话没有可访问的工作目录' };
  }
}
