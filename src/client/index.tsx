import React, { useEffect, useRef, useState } from 'react';
import { contribution, unwrap, type Api } from './api.js';
import type { DiffPreview, Summary } from '../wire.js';
export const name = 'project-summary';
export const inject = ['slots', 'remote'];
type Hook<T> = <S>(selector: (snapshot: T) => S) => S;
interface Props {
  usePanelInfo: Hook<{ activePanelId: string | null }>;
  useSessions: Hook<{ byId: Record<string, { id: string; retainedBy: Record<string, number> }> }>;
}
interface ClientContext {
  get(key: string): unknown;
  effect(callback: () => unknown, label?: string): unknown;
  remote: { $mount(contribution: unknown): Promise<() => Promise<void>> };
  slots: { inject(name: string, callback: () => (() => void)): unknown; register(options: { name: string; id: string; order: number }, component: (props: Props) => React.ReactNode): () => void };
}
export function apply(ctx: ClientContext) {
  ctx.effect(() => {
    let off: (() => Promise<void>) | undefined; let disposed = false;
    void ctx.remote.$mount(contribution).then(dispose => { if (disposed) void dispose(); else off = dispose; }).catch(error => console.warn('[dsh-project-summary] Remote mount failed', error));
    return async () => { disposed = true; await off?.(); };
  }, 'project-summary: remote');
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'project-summary.floating', order: 20 }, props => <Boundary><Floating {...props} getApi={() => ctx.get('remote.projectSummary') as Api | undefined} /></Boundary>));
}
class Boundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <aside className="dps-card"><p>项目概要加载失败</p><button onClick={() => this.setState({ error: false })}>重试</button></aside> : this.props.children; }
}
export function Icon({ name }: { name: 'branch' | 'changes' | 'commit' | 'refresh' | 'chevron' | 'close' | 'external' }) {
  const paths = { branch: 'M6 3v12m0-9c0 6 12 0 12 6v3M3 3a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0', changes: 'M7 3h10l4 4v14H3V3h4m9 0v6h5M7 13h10M7 17h7', commit: 'M1 12h6m10 0h6M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0', refresh: 'M20 7a9 9 0 1 0 1 9M20 2v6h-6', chevron: 'm6 9 6 6 6-6', close: 'm6 6 12 12M18 6 6 18', external: 'M14 3h7v7M21 3 10 14M10 3H3v18h18v-7' };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
function initialCollapsed() { try { const saved = localStorage.getItem('dps.collapsed'); return saved === null ? window.innerWidth < 900 : saved === 'true'; } catch { return false; } }
// Use the main conversation's real bounds, never the window's right edge.
// These semantic attributes are shipped by ConversationMainPanel / SessionHeader.
function useConversationPlacement(collapsed: boolean) {
  const [placement, setPlacement] = useState<React.CSSProperties | undefined>();
  useEffect(() => {
    let frame = 0; let observed: Element | null = null;
    const update = () => {
      frame = 0;
      const corner = Array.from(document.querySelectorAll('[data-conversation-header-corner]')).find(el => el.closest('[data-phase]'));
      const root = corner?.closest('[data-phase]') ?? null;
      if (root !== observed) { if (observed) observer.unobserve(observed); if (root) observer.observe(root); observed = root; }
      const bounds = root?.getBoundingClientRect();
      if (!bounds || bounds.width < 100 || bounds.height < 100) { setPlacement(undefined); return; }
      const row = corner!.parentElement!.getBoundingClientRect();
      const width = Math.min(collapsed ? 186 : 296, bounds.width - 32);
      const top = Math.max(bounds.top + 12, row.bottom + 14);
      const next = { left: bounds.right - width - 16, top, width, maxHeight: Math.max(48, Math.min(bounds.bottom - top - 24, bounds.height * .68)), right: 'auto' };
      setPlacement(prev => prev && prev.left === next.left && prev.top === next.top && prev.width === next.width && prev.maxHeight === next.maxHeight ? prev : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, true);
    update();
    return () => { observer.disconnect(); mutation.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
  }, [collapsed]);
  return placement;
}
function Floating({ useSessions, usePanelInfo, getApi }: Props & { getApi: () => Api | undefined }) {
  const visible = usePanelInfo(info => info.activePanelId === null);
  const sessionId = useSessions(state => Object.values(state.byId).find(s => (s.retainedBy.mainView ?? 0) > 0)?.id);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const placement = useConversationPlacement(collapsed);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0); const [showDiff, setShowDiff] = useState(false);
  useEffect(() => { try { localStorage.setItem('dps.collapsed', String(collapsed)); } catch {} }, [collapsed]);
  // Session-keyed reset and cleanup prevents a slow old response displaying the wrong project.
  useEffect(() => { setSummary(null); setError(''); setShowDiff(false); }, [sessionId]);
  useEffect(() => {
    if (!sessionId || !visible) return;
    let cancelled = false; let timer: ReturnType<typeof setTimeout>;
    async function update() {
      if (document.visibilityState === 'hidden') { timer = setTimeout(update, 15_000); return; }
      setLoading(true);
      try {
        const api = getApi(); if (!api) throw new Error('等待项目概要服务连接…');
        const value = unwrap(await api.summary(sessionId!));
        if (!cancelled) { setSummary(value); setError(''); }
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : '加载失败'); }
      finally { if (!cancelled) { setLoading(false); if (!collapsed) timer = setTimeout(update, 15_000); } }
    }
    void update(); return () => { cancelled = true; clearTimeout(timer); };
  }, [sessionId, visible, collapsed, revision, getApi]);
  if (!visible || !sessionId || !placement) return null;
  const repo = summary?.kind === 'repo';
  return <aside style={placement} className={`dps-card${collapsed ? ' dps-collapsed' : ''}`} aria-label="项目概要">
    <header className="dps-header">
      <button className="dps-heading" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)} title={collapsed ? '展开项目概要' : '收起项目概要'}><Icon name="branch" /><span>{repo ? summary.name : '项目概要'}</span></button>
      {!collapsed && <button className={`dps-icon-button${loading ? ' dps-loading' : ''}`} aria-label="刷新项目概要" title="刷新（PR 每分钟更新）" disabled={loading} onClick={() => setRevision(n => n + 1)}><Icon name="refresh" /></button>}
      <button className={`dps-icon-button dps-toggle${collapsed ? ' dps-closed' : ''}`} aria-label={collapsed ? '展开项目概要' : '收起项目概要'} onClick={() => setCollapsed(!collapsed)}><Icon name="chevron" /></button>
    </header>
    {!collapsed && <div className="dps-body">
      {error && <p className="dps-notice" role="status">{error} <button className="dps-text-button" onClick={() => setRevision(n => n + 1)}>重试</button></p>}
      {!summary && !error && <p className="dps-muted" role="status">正在读取项目…</p>}
      {summary && !repo && <p className="dps-muted">{summary.message}</p>}
      {repo && <>
        <div className="dps-branch" title={summary.branch}><Icon name="branch" /><span className="dps-ellipsis">{summary.branch}</span>{summary.detached && <span className="dps-tag">游离</span>}</div>
        {!!(summary.ahead || summary.behind) && <p className="dps-sync">↑ {summary.ahead} 领先 · ↓ {summary.behind} 落后</p>}
        <section className="dps-section">
          <button className="dps-change-button" onClick={() => setShowDiff(true)}><span><Icon name="changes" />变更 <small>{summary.files?.length ?? 0} 个文件</small></span><span className="dps-stats"><b>+{summary.additions}</b><i>−{summary.deletions}</i></span></button>
          <p className="dps-hint">相对 HEAD · {summary.untracked ? `${summary.untracked} 个未跟踪文件不计行数` : '含已暂存与未暂存修改'}{summary.binary ? ` · ${summary.binary} 个二进制文件` : ''}</p>
        </section>
        <section className="dps-section"><h3>拉取请求</h3>{summary.pr ? <a className="dps-pr" href={summary.pr.url} target="_blank" rel="noopener noreferrer"><Icon name="branch" /><span><span className="dps-pr-title">{summary.pr.title}</span><small>#{summary.pr.number} · {summary.pr.isDraft ? '草稿' : ({ OPEN: '开放', MERGED: '已合并', CLOSED: '已关闭' }[summary.pr.state] ?? summary.pr.state)} → {summary.pr.baseRefName}</small></span><Icon name="external" /></a> : <p className="dps-muted">{summary.prMessage}</p>}</section>
        <section className="dps-section"><h3>最近提交</h3>{summary.commits?.length ? summary.commits.slice(0, 3).map(commit => <div className="dps-commit" key={commit.hash}><Icon name="commit" /><div><p title={commit.subject}>{commit.subject}</p><small><code>{commit.hash}</code> · {commit.author} · {new Date(commit.time).toLocaleDateString()}</small></div></div>) : <p className="dps-muted">尚无提交</p>}</section>
        <footer className="dps-footer">只读 · {loading ? '更新中…' : `更新于 ${new Date(summary.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</footer>
      </>}
    </div>}
    {showDiff && <DiffModal key={sessionId} sessionId={sessionId} getApi={getApi} files={summary?.files ?? []} onClose={() => setShowDiff(false)} />}
  </aside>;
}
function DiffModal({ sessionId, getApi, files, onClose }: { sessionId: string; getApi: () => Api | undefined; files: NonNullable<Summary['files']>; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null); const [diff, setDiff] = useState<DiffPreview | null>(null); const [error, setError] = useState('');
  useEffect(() => { ref.current?.showModal(); return () => ref.current?.close(); }, []);
  useEffect(() => { let cancelled = false; const api = getApi(); if (!api) { setError('服务尚未连接'); return; } void api.diff(sessionId).then(unwrap).then(result => { if (!cancelled) setDiff(result); }).catch(e => { if (!cancelled) setError(String(e)); }); return () => { cancelled = true; }; }, [sessionId, getApi]);
  return <dialog ref={ref} className="dps-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }} aria-labelledby="dps-diff-title">
    <header><div><h2 id="dps-diff-title">工作区变更</h2><p>相对 HEAD 的最终内容；未跟踪文件仅列出名称</p></div><button className="dps-icon-button" onClick={onClose} aria-label="关闭变更预览" autoFocus><Icon name="close" /></button></header>
    <div className="dps-diff-scroll"><ul className="dps-files">{files.map(f => <li key={f.path}><code>{f.status === '??' ? '新' : f.status.trim()}</code><span>{f.path}</span></li>)}</ul>
    {(error || diff?.message) && <p className="dps-notice">{error || diff?.message}</p>}
    {!diff && !error && <p className="dps-muted">读取 diff…</p>}
    {diff && !diff.message && (diff.text ? <pre className="dps-diff">{diff.text.split('\n').map((line, i) => <div key={i} className={line.startsWith('+') && !line.startsWith('+++') ? 'dps-added' : line.startsWith('-') && !line.startsWith('---') ? 'dps-deleted' : line.startsWith('@@') ? 'dps-hunk' : ''}>{line || ' '}</div>)}</pre> : <p className="dps-muted">暂无已跟踪文件的内容差异。</p>)}
    {diff?.truncated && <p className="dps-notice">预览已截断至 100,000 字符。</p>}</div>
  </dialog>;
}
