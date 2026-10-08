import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { contribution, unwrap } from './api.js';
export const name = 'project-summary';
export const inject = ['slots', 'remote'];
export function apply(ctx) {
    ctx.effect(() => {
        let off;
        let disposed = false;
        void ctx.remote.$mount(contribution).then(dispose => { if (disposed)
            void dispose();
        else
            off = dispose; }).catch(error => console.warn('[dsh-project-summary] Remote mount failed', error));
        return async () => { disposed = true; await off?.(); };
    }, 'project-summary: remote');
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'project-summary.floating', order: 20 }, props => _jsx(Boundary, { children: _jsx(Floating, { ...props, getApi: () => ctx.get('remote.projectSummary') }) })));
}
class Boundary extends React.Component {
    state = { error: false };
    static getDerivedStateFromError() { return { error: true }; }
    render() { return this.state.error ? _jsxs("aside", { className: "dps-card", children: [_jsx("p", { children: "\u9879\u76EE\u6982\u8981\u52A0\u8F7D\u5931\u8D25" }), _jsx("button", { onClick: () => this.setState({ error: false }), children: "\u91CD\u8BD5" })] }) : this.props.children; }
}
export function Icon({ name }) {
    const paths = { branch: 'M6 3v12m0-9c0 6 12 0 12 6v3M3 3a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0', changes: 'M7 3h10l4 4v14H3V3h4m9 0v6h5M7 13h10M7 17h7', commit: 'M1 12h6m10 0h6M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0', refresh: 'M20 7a9 9 0 1 0 1 9M20 2v6h-6', chevron: 'm6 9 6 6 6-6', close: 'm6 6 12 12M18 6 6 18', external: 'M14 3h7v7M21 3 10 14M10 3H3v18h18v-7' };
    return _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: paths[name] }) });
}
function initialCollapsed() { try {
    const saved = localStorage.getItem('dps.collapsed');
    return saved === null ? window.innerWidth < 900 : saved === 'true';
}
catch {
    return false;
} }
// Use the main conversation's real bounds, never the window's right edge.
// These semantic attributes are shipped by ConversationMainPanel / SessionHeader.
function useConversationPlacement(collapsed) {
    const [placement, setPlacement] = useState();
    useEffect(() => {
        let frame = 0;
        let observed = null;
        const update = () => {
            frame = 0;
            const corner = Array.from(document.querySelectorAll('[data-conversation-header-corner]')).find(el => el.closest('[data-phase]'));
            const root = corner?.closest('[data-phase]') ?? null;
            if (root !== observed) {
                if (observed)
                    observer.unobserve(observed);
                if (root)
                    observer.observe(root);
                observed = root;
            }
            const bounds = root?.getBoundingClientRect();
            if (!bounds || bounds.width < 100 || bounds.height < 100) {
                setPlacement(undefined);
                return;
            }
            const row = corner.parentElement.getBoundingClientRect();
            const width = Math.min(collapsed ? 186 : 296, bounds.width - 32);
            const top = Math.max(bounds.top + 12, row.bottom + 14);
            const next = { left: bounds.right - width - 16, top, width, maxHeight: Math.max(48, Math.min(bounds.bottom - top - 24, bounds.height * .68)), right: 'auto' };
            setPlacement(prev => prev && prev.left === next.left && prev.top === next.top && prev.width === next.width && prev.maxHeight === next.maxHeight ? prev : next);
        };
        const schedule = () => { if (!frame)
            frame = requestAnimationFrame(update); };
        const observer = new ResizeObserver(schedule);
        const mutation = new MutationObserver(schedule);
        mutation.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);
        update();
        return () => { observer.disconnect(); mutation.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
    }, [collapsed]);
    return placement;
}
function Floating({ useSessions, usePanelInfo, getApi }) {
    const visible = usePanelInfo(info => info.activePanelId === null);
    const sessionId = useSessions(state => Object.values(state.byId).find(s => (s.retainedBy.mainView ?? 0) > 0)?.id);
    const [collapsed, setCollapsed] = useState(initialCollapsed);
    const placement = useConversationPlacement(collapsed);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [revision, setRevision] = useState(0);
    const [showDiff, setShowDiff] = useState(false);
    useEffect(() => { try {
        localStorage.setItem('dps.collapsed', String(collapsed));
    }
    catch { } }, [collapsed]);
    // Session-keyed reset and cleanup prevents a slow old response displaying the wrong project.
    useEffect(() => { setSummary(null); setError(''); setShowDiff(false); }, [sessionId]);
    useEffect(() => {
        if (!sessionId || !visible)
            return;
        let cancelled = false;
        let timer;
        async function update() {
            if (document.visibilityState === 'hidden') {
                timer = setTimeout(update, 15_000);
                return;
            }
            setLoading(true);
            try {
                const api = getApi();
                if (!api)
                    throw new Error('等待项目概要服务连接…');
                const value = unwrap(await api.summary(sessionId));
                if (!cancelled) {
                    setSummary(value);
                    setError('');
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e instanceof Error ? e.message : '加载失败');
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                    if (!collapsed)
                        timer = setTimeout(update, 15_000);
                }
            }
        }
        void update();
        return () => { cancelled = true; clearTimeout(timer); };
    }, [sessionId, visible, collapsed, revision, getApi]);
    if (!visible || !sessionId || !placement)
        return null;
    const repo = summary?.kind === 'repo';
    return _jsxs("aside", { style: placement, className: `dps-card${collapsed ? ' dps-collapsed' : ''}`, "aria-label": "\u9879\u76EE\u6982\u8981", children: [_jsxs("header", { className: "dps-header", children: [_jsxs("button", { className: "dps-heading", "aria-expanded": !collapsed, onClick: () => setCollapsed(!collapsed), title: collapsed ? '展开项目概要' : '收起项目概要', children: [_jsx(Icon, { name: "branch" }), _jsx("span", { children: repo ? summary.name : '项目概要' })] }), !collapsed && _jsx("button", { className: `dps-icon-button${loading ? ' dps-loading' : ''}`, "aria-label": "\u5237\u65B0\u9879\u76EE\u6982\u8981", title: "\u5237\u65B0\uFF08PR \u6BCF\u5206\u949F\u66F4\u65B0\uFF09", disabled: loading, onClick: () => setRevision(n => n + 1), children: _jsx(Icon, { name: "refresh" }) }), _jsx("button", { className: `dps-icon-button dps-toggle${collapsed ? ' dps-closed' : ''}`, "aria-label": collapsed ? '展开项目概要' : '收起项目概要', onClick: () => setCollapsed(!collapsed), children: _jsx(Icon, { name: "chevron" }) })] }), !collapsed && _jsxs("div", { className: "dps-body", children: [error && _jsxs("p", { className: "dps-notice", role: "status", children: [error, " ", _jsx("button", { className: "dps-text-button", onClick: () => setRevision(n => n + 1), children: "\u91CD\u8BD5" })] }), !summary && !error && _jsx("p", { className: "dps-muted", role: "status", children: "\u6B63\u5728\u8BFB\u53D6\u9879\u76EE\u2026" }), summary && !repo && _jsx("p", { className: "dps-muted", children: summary.message }), repo && _jsxs(_Fragment, { children: [_jsxs("div", { className: "dps-branch", title: summary.branch, children: [_jsx(Icon, { name: "branch" }), _jsx("span", { className: "dps-ellipsis", children: summary.branch }), summary.detached && _jsx("span", { className: "dps-tag", children: "\u6E38\u79BB" })] }), !!(summary.ahead || summary.behind) && _jsxs("p", { className: "dps-sync", children: ["\u2191 ", summary.ahead, " \u9886\u5148 \u00B7 \u2193 ", summary.behind, " \u843D\u540E"] }), _jsxs("section", { className: "dps-section", children: [_jsxs("button", { className: "dps-change-button", onClick: () => setShowDiff(true), children: [_jsxs("span", { children: [_jsx(Icon, { name: "changes" }), "\u53D8\u66F4 ", _jsxs("small", { children: [summary.files?.length ?? 0, " \u4E2A\u6587\u4EF6"] })] }), _jsxs("span", { className: "dps-stats", children: [_jsxs("b", { children: ["+", summary.additions] }), _jsxs("i", { children: ["\u2212", summary.deletions] })] })] }), _jsxs("p", { className: "dps-hint", children: ["\u76F8\u5BF9 HEAD \u00B7 ", summary.untracked ? `${summary.untracked} 个未跟踪文件不计行数` : '含已暂存与未暂存修改', summary.binary ? ` · ${summary.binary} 个二进制文件` : ''] })] }), _jsxs("section", { className: "dps-section", children: [_jsx("h3", { children: "\u62C9\u53D6\u8BF7\u6C42" }), summary.pr ? _jsxs("a", { className: "dps-pr", href: summary.pr.url, target: "_blank", rel: "noopener noreferrer", children: [_jsx(Icon, { name: "branch" }), _jsxs("span", { children: [_jsx("span", { className: "dps-pr-title", children: summary.pr.title }), _jsxs("small", { children: ["#", summary.pr.number, " \u00B7 ", summary.pr.isDraft ? '草稿' : ({ OPEN: '开放', MERGED: '已合并', CLOSED: '已关闭' }[summary.pr.state] ?? summary.pr.state), " \u2192 ", summary.pr.baseRefName] })] }), _jsx(Icon, { name: "external" })] }) : _jsx("p", { className: "dps-muted", children: summary.prMessage })] }), _jsxs("section", { className: "dps-section", children: [_jsx("h3", { children: "\u6700\u8FD1\u63D0\u4EA4" }), summary.commits?.length ? summary.commits.slice(0, 3).map(commit => _jsxs("div", { className: "dps-commit", children: [_jsx(Icon, { name: "commit" }), _jsxs("div", { children: [_jsx("p", { title: commit.subject, children: commit.subject }), _jsxs("small", { children: [_jsx("code", { children: commit.hash }), " \u00B7 ", commit.author, " \u00B7 ", new Date(commit.time).toLocaleDateString()] })] })] }, commit.hash)) : _jsx("p", { className: "dps-muted", children: "\u5C1A\u65E0\u63D0\u4EA4" })] }), _jsxs("footer", { className: "dps-footer", children: ["\u53EA\u8BFB \u00B7 ", loading ? '更新中…' : `更新于 ${new Date(summary.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`] })] })] }), showDiff && _jsx(DiffModal, { sessionId: sessionId, getApi: getApi, files: summary?.files ?? [], onClose: () => setShowDiff(false) }, sessionId)] });
}
function DiffModal({ sessionId, getApi, files, onClose }) {
    const ref = useRef(null);
    const [diff, setDiff] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => { ref.current?.showModal(); return () => ref.current?.close(); }, []);
    useEffect(() => { let cancelled = false; const api = getApi(); if (!api) {
        setError('服务尚未连接');
        return;
    } void api.diff(sessionId).then(unwrap).then(result => { if (!cancelled)
        setDiff(result); }).catch(e => { if (!cancelled)
        setError(String(e)); }); return () => { cancelled = true; }; }, [sessionId, getApi]);
    return _jsxs("dialog", { ref: ref, className: "dps-dialog", onCancel: onClose, onClick: e => { if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
                onClose();
        } }, "aria-labelledby": "dps-diff-title", children: [_jsxs("header", { children: [_jsxs("div", { children: [_jsx("h2", { id: "dps-diff-title", children: "\u5DE5\u4F5C\u533A\u53D8\u66F4" }), _jsx("p", { children: "\u76F8\u5BF9 HEAD \u7684\u6700\u7EC8\u5185\u5BB9\uFF1B\u672A\u8DDF\u8E2A\u6587\u4EF6\u4EC5\u5217\u51FA\u540D\u79F0" })] }), _jsx("button", { className: "dps-icon-button", onClick: onClose, "aria-label": "\u5173\u95ED\u53D8\u66F4\u9884\u89C8", autoFocus: true, children: _jsx(Icon, { name: "close" }) })] }), _jsxs("div", { className: "dps-diff-scroll", children: [_jsx("ul", { className: "dps-files", children: files.map(f => _jsxs("li", { children: [_jsx("code", { children: f.status === '??' ? '新' : f.status.trim() }), _jsx("span", { children: f.path })] }, f.path)) }), (error || diff?.message) && _jsx("p", { className: "dps-notice", children: error || diff?.message }), !diff && !error && _jsx("p", { className: "dps-muted", children: "\u8BFB\u53D6 diff\u2026" }), diff && !diff.message && (diff.text ? _jsx("pre", { className: "dps-diff", children: diff.text.split('\n').map((line, i) => _jsx("div", { className: line.startsWith('+') && !line.startsWith('+++') ? 'dps-added' : line.startsWith('-') && !line.startsWith('---') ? 'dps-deleted' : line.startsWith('@@') ? 'dps-hunk' : '', children: line || ' ' }, i)) }) : _jsx("p", { className: "dps-muted", children: "\u6682\u65E0\u5DF2\u8DDF\u8E2A\u6587\u4EF6\u7684\u5185\u5BB9\u5DEE\u5F02\u3002" })), diff?.truncated && _jsx("p", { className: "dps-notice", children: "\u9884\u89C8\u5DF2\u622A\u65AD\u81F3 100,000 \u5B57\u7B26\u3002" })] })] });
}
