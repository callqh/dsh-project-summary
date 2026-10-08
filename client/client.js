window.__ModuleLoader__.load({
	id: "dsh-project-summary",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		const style = document.createElement("style");
		style.dataset.plugin = "dsh-project-summary";
		style.textContent = ".dps-card{box-sizing:border-box;position:fixed;top:calc(var(--dsh-frame-top-clearance,0px) + 64px);right:20px;width:296px;max-width:calc(100vw - 32px);max-height:calc(100dvh - var(--dsh-frame-top-clearance,0px) - 112px);z-index:25;pointer-events:auto;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:18px;box-shadow:0 8px 32px #00000012;font:13px/1.5 system-ui,-apple-system,sans-serif;overflow:auto;scrollbar-width:thin}.dps-card *{box-sizing:border-box}.dps-card button,.dps-dialog button{font:inherit;color:inherit;cursor:pointer}.dps-header{display:flex;align-items:center;gap:4px;padding:13px 12px 9px 16px}.dps-heading{display:flex;gap:9px;align-items:center;min-width:0;flex:1;border:0;background:none;text-align:left;padding:0;font-weight:600!important}.dps-heading span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dps-heading svg{color:var(--dsw-alias-label-secondary);flex-shrink:0}.dps-icon-button{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary)!important;flex-shrink:0}.dps-icon-button:hover,.dps-change-button:hover{background:var(--dsw-alias-bg-layer-2)}.dps-icon-button:disabled{opacity:.45;cursor:default}.dps-card button:focus-visible,.dps-card a:focus-visible,.dps-dialog button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:3px}.dps-body{padding:0 16px 12px}.dps-branch{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:12px;padding:2px 0 8px}.dps-branch svg{flex-shrink:0}.dps-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dps-tag{font-size:10px;padding:0 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:4px;white-space:nowrap}.dps-sync{font-size:11px;margin:0 0 6px;color:var(--dsw-alias-label-secondary)}.dps-section{padding:12px 0;border-top:1px solid var(--dsw-alias-border-l1)}.dps-section h3{font-size:11px;letter-spacing:.02em;font-weight:500;color:var(--dsw-alias-label-secondary);margin:0 0 9px}.dps-change-button{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:5px 4px;border:0;border-radius:6px;background:none;text-align:left}.dps-change-button>span:first-child{display:flex;gap:8px;align-items:center}.dps-change-button small{font-size:11px;color:var(--dsw-alias-label-secondary)}.dps-stats{display:flex;gap:7px;font-size:12px;font-variant-numeric:tabular-nums}.dps-stats b,.dps-stats i{font-style:normal;font-weight:500}.dps-stats b{color:var(--dsw-alias-state-success-primary)}.dps-stats i{color:var(--dsw-alias-state-error-primary)}.dps-hint{font-size:10px;color:var(--dsw-alias-label-secondary);margin:6px 4px 0;opacity:.8}.dps-pr{display:flex;gap:9px;align-items:flex-start;text-decoration:none;color:inherit}.dps-pr>svg{flex-shrink:0;margin-top:3px;color:var(--dsw-alias-brand-primary)}.dps-pr>span{min-width:0;flex:1}.dps-pr-title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;line-height:1.6}.dps-pr small{display:block;color:var(--dsw-alias-label-secondary);font-size:10px;margin-top:4px}.dps-pr:hover .dps-pr-title{text-decoration:underline}.dps-commit{display:flex;gap:9px;margin-top:9px}.dps-commit>svg{flex-shrink:0;margin-top:3px;color:var(--dsw-alias-label-secondary)}.dps-commit>div{min-width:0}.dps-commit p{margin:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:12px}.dps-commit small{display:block;color:var(--dsw-alias-label-secondary);font-size:10px;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dps-commit code{font-family:ui-monospace,monospace}.dps-muted{font-size:12px;color:var(--dsw-alias-label-secondary);margin:4px 0}.dps-notice{font-size:12px;color:var(--dsw-alias-state-warn-primary);overflow-wrap:anywhere;margin:8px 0}.dps-footer{color:var(--dsw-alias-label-secondary);font-size:10px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:9px;opacity:.7}.dps-text-button{background:none;border:0;padding:0;text-decoration:underline}.dps-collapsed{width:186px;border-radius:13px;overflow:visible}.dps-collapsed .dps-header{padding:9px 9px 9px 13px}.dps-closed svg{transform:rotate(180deg)}.dps-dialog{pointer-events:auto;width:min(900px,calc(100vw - 40px));max-height:80dvh;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:13px/1.5 system-ui,sans-serif;box-shadow:0 24px 80px #0004;overflow:hidden}.dps-dialog::backdrop{background:#0006;backdrop-filter:blur(3px)}.dps-dialog header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--dsw-alias-border-l1)}.dps-dialog h2{font-size:15px;font-weight:600;margin:0}.dps-dialog header p{font-size:11px;color:var(--dsw-alias-label-secondary);margin:5px 0 0}.dps-diff-scroll{max-height:calc(80dvh - 100px);overflow:auto;padding:16px 22px}.dps-files{list-style:none;padding:0;margin:0 0 16px;max-height:140px;overflow:auto}.dps-files li{display:flex;gap:12px;padding:3px 0;font-size:12px;overflow-wrap:anywhere}.dps-files code{color:var(--dsw-alias-label-secondary);min-width:24px}.dps-diff{font:11px/1.65 ui-monospace,SFMono-Regular,monospace;white-space:pre;overflow:auto;margin:0;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:10px 0;background:var(--dsw-alias-bg-base);tab-size:4}.dps-diff>div{padding:0 10px;min-width:max-content}.dps-added{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 8%,transparent)}.dps-deleted{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent)}.dps-hunk{color:var(--dsw-alias-brand-primary)}@media(max-width:700px){.dps-card{right:12px;width:272px;top:calc(var(--dsh-frame-top-clearance,0px) + 58px)}.dps-collapsed{width:154px}.dps-dialog{width:calc(100vw - 24px)}.dps-dialog header,.dps-diff-scroll{padding:14px}}@media(prefers-reduced-motion:no-preference){.dps-loading svg{animation:dps-spin 1.4s linear infinite}@keyframes dps-spin{to{transform:rotate(360deg)}}}\n";
		document.head.appendChild(style);
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/api.ts
		const contribution = {
			package: "dsh-project-summary",
			descriptors: ["summary", "diff"].map((method) => ({
				id: `dsh-project-summary#projectSummary/${method}`,
				service: "projectSummary",
				namespace: "projectSummary",
				method,
				invocation: { kind: "direct" },
				parameters: [{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: `dsh-project-summary#projectSummary/${method}:sessionId`,
						create: () => ({ "~standard": {
							version: 1,
							vendor: "dsh-project-summary",
							validate: (value) => typeof value === "string" && value.length <= 200 ? { value } : { issues: [{ message: "Expected session id" }] }
						} })
					}
				}],
				result: { mode: "src-json" }
			}))
		};
		function unwrap(result) {
			if (result.ok) return result.value;
			throw new Error(result.error?.message || "与 Harness 通信失败");
		}
		//#endregion
		//#region src/client/index.tsx
		const name = "project-summary";
		const inject = ["slots", "remote"];
		function apply(ctx) {
			ctx.effect(() => {
				let off;
				let disposed = false;
				ctx.remote.$mount(contribution).then((dispose) => {
					if (disposed) dispose();
					else off = dispose;
				}).catch((error) => console.warn("[dsh-project-summary] Remote mount failed", error));
				return async () => {
					disposed = true;
					await off?.();
				};
			}, "project-summary: remote");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "project-summary.floating",
				order: 20
			}, (props) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Boundary, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Floating, {
				...props,
				getApi: () => ctx.get("remote.projectSummary")
			}) })));
		}
		var Boundary = class extends react.default.Component {
			state = { error: false };
			static getDerivedStateFromError() {
				return { error: true };
			}
			render() {
				return this.state.error ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
					className: "dps-card",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "项目概要加载失败" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: () => this.setState({ error: false }),
						children: "重试"
					})]
				}) : this.props.children;
			}
		};
		function Icon({ name }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: {
					branch: "M6 3v12m0-9c0 6 12 0 12 6v3M3 3a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
					changes: "M7 3h10l4 4v14H3V3h4m9 0v6h5M7 13h10M7 17h7",
					commit: "M1 12h6m10 0h6M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0",
					refresh: "M20 7a9 9 0 1 0 1 9M20 2v6h-6",
					chevron: "m6 9 6 6 6-6",
					close: "m6 6 12 12M18 6 6 18",
					external: "M14 3h7v7M21 3 10 14M10 3H3v18h18v-7"
				}[name] })
			});
		}
		function initialCollapsed() {
			try {
				const saved = localStorage.getItem("dps.collapsed");
				return saved === null ? window.innerWidth < 900 : saved === "true";
			} catch {
				return false;
			}
		}
		function useConversationPlacement(collapsed) {
			const [placement, setPlacement] = (0, react.useState)();
			(0, react.useEffect)(() => {
				let frame = 0;
				let observed = null;
				const update = () => {
					frame = 0;
					const corner = Array.from(document.querySelectorAll("[data-conversation-header-corner]")).find((el) => el.closest("[data-phase]"));
					const root = corner?.closest("[data-phase]") ?? null;
					if (root !== observed) {
						if (observed) observer.unobserve(observed);
						if (root) observer.observe(root);
						observed = root;
					}
					const bounds = root?.getBoundingClientRect();
					if (!bounds || bounds.width < 100 || bounds.height < 100) {
						setPlacement(void 0);
						return;
					}
					const row = corner.parentElement.getBoundingClientRect();
					const width = Math.min(collapsed ? 186 : 296, bounds.width - 32);
					const top = Math.max(bounds.top + 12, row.bottom + 14);
					const next = {
						left: bounds.right - width - 16,
						top,
						width,
						maxHeight: Math.max(48, Math.min(bounds.bottom - top - 24, bounds.height * .68)),
						right: "auto"
					};
					setPlacement((prev) => prev && prev.left === next.left && prev.top === next.top && prev.width === next.width && prev.maxHeight === next.maxHeight ? prev : next);
				};
				const schedule = () => {
					if (!frame) frame = requestAnimationFrame(update);
				};
				const observer = new ResizeObserver(schedule);
				const mutation = new MutationObserver(schedule);
				mutation.observe(document.body, {
					childList: true,
					subtree: true
				});
				window.addEventListener("resize", schedule);
				window.addEventListener("scroll", schedule, true);
				update();
				return () => {
					observer.disconnect();
					mutation.disconnect();
					cancelAnimationFrame(frame);
					window.removeEventListener("resize", schedule);
					window.removeEventListener("scroll", schedule, true);
				};
			}, [collapsed]);
			return placement;
		}
		function Floating({ useSessions, usePanelInfo, getApi }) {
			const visible = usePanelInfo((info) => info.activePanelId === null);
			const sessionId = useSessions((state) => Object.values(state.byId).find((s) => (s.retainedBy.mainView ?? 0) > 0)?.id);
			const [collapsed, setCollapsed] = (0, react.useState)(initialCollapsed);
			const placement = useConversationPlacement(collapsed);
			const [summary, setSummary] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)("");
			const [loading, setLoading] = (0, react.useState)(false);
			const [revision, setRevision] = (0, react.useState)(0);
			const [showDiff, setShowDiff] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				try {
					localStorage.setItem("dps.collapsed", String(collapsed));
				} catch {}
			}, [collapsed]);
			(0, react.useEffect)(() => {
				setSummary(null);
				setError("");
				setShowDiff(false);
			}, [sessionId]);
			(0, react.useEffect)(() => {
				if (!sessionId || !visible) return;
				let cancelled = false;
				let timer;
				async function update() {
					if (document.visibilityState === "hidden") {
						timer = setTimeout(update, 15e3);
						return;
					}
					setLoading(true);
					try {
						const api = getApi();
						if (!api) throw new Error("等待项目概要服务连接…");
						const value = unwrap(await api.summary(sessionId));
						if (!cancelled) {
							setSummary(value);
							setError("");
						}
					} catch (e) {
						if (!cancelled) setError(e instanceof Error ? e.message : "加载失败");
					} finally {
						if (!cancelled) {
							setLoading(false);
							if (!collapsed) timer = setTimeout(update, 15e3);
						}
					}
				}
				update();
				return () => {
					cancelled = true;
					clearTimeout(timer);
				};
			}, [
				sessionId,
				visible,
				collapsed,
				revision,
				getApi
			]);
			if (!visible || !sessionId || !placement) return null;
			const repo = summary?.kind === "repo";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
				style: placement,
				className: `dps-card${collapsed ? " dps-collapsed" : ""}`,
				"aria-label": "项目概要",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "dps-header",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								className: "dps-heading",
								"aria-expanded": !collapsed,
								onClick: () => setCollapsed(!collapsed),
								title: collapsed ? "展开项目概要" : "收起项目概要",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "branch" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: repo ? summary.name : "项目概要" })]
							}),
							!collapsed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: `dps-icon-button${loading ? " dps-loading" : ""}`,
								"aria-label": "刷新项目概要",
								title: "刷新（PR 每分钟更新）",
								disabled: loading,
								onClick: () => setRevision((n) => n + 1),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "refresh" })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: `dps-icon-button dps-toggle${collapsed ? " dps-closed" : ""}`,
								"aria-label": collapsed ? "展开项目概要" : "收起项目概要",
								onClick: () => setCollapsed(!collapsed),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "chevron" })
							})
						]
					}),
					!collapsed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dps-body",
						children: [
							error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "dps-notice",
								role: "status",
								children: [
									error,
									" ",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: "dps-text-button",
										onClick: () => setRevision((n) => n + 1),
										children: "重试"
									})
								]
							}),
							!summary && !error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dps-muted",
								role: "status",
								children: "正在读取项目…"
							}),
							summary && !repo && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "dps-muted",
								children: summary.message
							}),
							repo && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dps-branch",
									title: summary.branch,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "branch" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dps-ellipsis",
											children: summary.branch
										}),
										summary.detached && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "dps-tag",
											children: "游离"
										})
									]
								}),
								!!(summary.ahead || summary.behind) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "dps-sync",
									children: [
										"↑ ",
										summary.ahead,
										" 领先 · ↓ ",
										summary.behind,
										" 落后"
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
									className: "dps-section",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										className: "dps-change-button",
										onClick: () => setShowDiff(true),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "changes" }),
											"变更 ",
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [summary.files?.length ?? 0, " 个文件"] })
										] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: "dps-stats",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: ["+", summary.additions] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("i", { children: ["−", summary.deletions] })]
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "dps-hint",
										children: [
											"相对 HEAD · ",
											summary.untracked ? `${summary.untracked} 个未跟踪文件不计行数` : "含已暂存与未暂存修改",
											summary.binary ? ` · ${summary.binary} 个二进制文件` : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
									className: "dps-section",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "拉取请求" }), summary.pr ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("a", {
										className: "dps-pr",
										href: summary.pr.url,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "branch" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "dps-pr-title",
												children: summary.pr.title
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
												"#",
												summary.pr.number,
												" · ",
												summary.pr.isDraft ? "草稿" : {
													OPEN: "开放",
													MERGED: "已合并",
													CLOSED: "已关闭"
												}[summary.pr.state] ?? summary.pr.state,
												" → ",
												summary.pr.baseRefName
											] })] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "external" })
										]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "dps-muted",
										children: summary.prMessage
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
									className: "dps-section",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "最近提交" }), summary.commits?.length ? summary.commits.slice(0, 3).map((commit) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "dps-commit",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "commit" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											title: commit.subject,
											children: commit.subject
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: commit.hash }),
											" · ",
											commit.author,
											" · ",
											new Date(commit.time).toLocaleDateString()
										] })] })]
									}, commit.hash)) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "dps-muted",
										children: "尚无提交"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
									className: "dps-footer",
									children: ["只读 · ", loading ? "更新中…" : `更新于 ${new Date(summary.updatedAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									})}`]
								})
							] })
						]
					}),
					showDiff && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DiffModal, {
						sessionId,
						getApi,
						files: summary?.files ?? [],
						onClose: () => setShowDiff(false)
					}, sessionId)
				]
			});
		}
		function DiffModal({ sessionId, getApi, files, onClose }) {
			const ref = (0, react.useRef)(null);
			const [diff, setDiff] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)("");
			(0, react.useEffect)(() => {
				ref.current?.showModal();
				return () => ref.current?.close();
			}, []);
			(0, react.useEffect)(() => {
				let cancelled = false;
				const api = getApi();
				if (!api) {
					setError("服务尚未连接");
					return;
				}
				api.diff(sessionId).then(unwrap).then((result) => {
					if (!cancelled) setDiff(result);
				}).catch((e) => {
					if (!cancelled) setError(String(e));
				});
				return () => {
					cancelled = true;
				};
			}, [sessionId, getApi]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dialog", {
				ref,
				className: "dps-dialog",
				onCancel: onClose,
				onClick: (e) => {
					if (e.target === e.currentTarget) {
						const r = e.currentTarget.getBoundingClientRect();
						if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
					}
				},
				"aria-labelledby": "dps-diff-title",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
					id: "dps-diff-title",
					children: "工作区变更"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "相对 HEAD 的最终内容；未跟踪文件仅列出名称" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: "dps-icon-button",
					onClick: onClose,
					"aria-label": "关闭变更预览",
					autoFocus: true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, { name: "close" })
				})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dps-diff-scroll",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: "dps-files",
							children: files.map((f) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: f.status === "??" ? "新" : f.status.trim() }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: f.path })] }, f.path))
						}),
						(error || diff?.message) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dps-notice",
							children: error || diff?.message
						}),
						!diff && !error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dps-muted",
							children: "读取 diff…"
						}),
						diff && !diff.message && (diff.text ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
							className: "dps-diff",
							children: diff.text.split("\n").map((line, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: line.startsWith("+") && !line.startsWith("+++") ? "dps-added" : line.startsWith("-") && !line.startsWith("---") ? "dps-deleted" : line.startsWith("@@") ? "dps-hunk" : "",
								children: line || " "
							}, i))
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dps-muted",
							children: "暂无已跟踪文件的内容差异。"
						})),
						diff?.truncated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "dps-notice",
							children: "预览已截断至 100,000 字符。"
						})
					]
				})]
			});
		}
		//#endregion
		exports.Icon = Icon;
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});
