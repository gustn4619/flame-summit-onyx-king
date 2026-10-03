import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as formatPrice, m as signedClass, u as formatPercent } from "./format-B_tqOT-9.mjs";
import { c as Bookmark, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as cn } from "./router-BXz9srNA.mjs";
import { a as Card, c as CardHeader, d as SearchBar, f as Skeleton, g as getMarketTape, h as getMarketReports, l as CardTitle, n as Badge, o as CardContent, p as getAllSectors, r as BriefingPanel, s as CardDescription, t as AppShell, u as ReportList, v as getQuotes, x as reportsToContext } from "./report-list-IVDFsG-c.mjs";
import { t as useWatchlist } from "./watchlist-CTCPVfK7.mjs";
import { n as Sparkline, t as QuoteRow } from "./quote-row-Cz01hgH4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-fJM4MaNI.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const watch = useWatchlist((s) => s.items);
	const tape = useQuery({
		queryKey: ["tape"],
		queryFn: () => getMarketTape()
	});
	const sectors = useQuery({
		queryKey: ["sectors"],
		queryFn: () => getAllSectors()
	});
	const reports = useQuery({
		queryKey: ["market-reports"],
		queryFn: () => getMarketReports()
	});
	const watchSymbols = watch.map((w) => w.symbol).join(",");
	const watchQuotes = useQuery({
		queryKey: ["watch", watchSymbols],
		queryFn: () => getQuotes({ data: { symbols: watchSymbols } }),
		enabled: watch.length > 0
	});
	const quoteMap = new Map((watchQuotes.data ?? []).map((q) => [q.symbol, q]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-steel uppercase",
					children: "Equity research desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl",
					children: [
						"리포트를 모으고,",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"기업과 섹터를 한눈에."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-muted-foreground",
					children: "시세, 뉴스, 공시성 헤드라인을 모아 요약합니다. 종목명이나 섹터를 검색해 브리핑을 열어보세요."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, { autoFocus: true })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8 -mx-4 overflow-x-auto px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-max gap-3",
				children: (tape.data ?? []).length === 0 && tape.isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-40 rounded-xl" }, i)) : (tape.data ?? []).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-40 rounded-xl bg-card px-3.5 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: q.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium tabular-nums",
							children: formatPrice(q.price, q.currency)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-xs tabular-nums", signedClass(q.changePercent)),
								children: formatPercent(q.changePercent)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
								values: q.spark,
								positive: q.changePercent >= 0,
								className: "h-5 w-12"
							})]
						})
					]
				}, q.symbol))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
			children: [(sectors.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/sector/$id",
				params: { id: s.id },
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: s.changePercent >= 0 ? "up" : "down",
						children: formatPercent(s.changePercent)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-muted-foreground",
					children: s.blurb
				})]
			}, s.id)), sectors.isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i)) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4 text-steel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "관심 종목"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "검색한 기업에서 별표로 추가할 수 있습니다" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-1",
				children: watch.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-sm text-muted-foreground",
					children: "관심 종목이 없습니다"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col",
					children: watch.map((item) => {
						const q = quoteMap.get(item.symbol);
						if (!q) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/company/$symbol",
							params: { symbol: item.symbol },
							className: "flex min-h-12 items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: item.symbol
							})]
						}, item.symbol);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteRow, { quote: {
							...q,
							name: item.name
						} }, item.symbol);
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "수집된 헤드라인" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "국내 증시 관련 뉴스와 리포트를 모았습니다" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [reports.data?.length ?? 0, "건"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: reports.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportList, { reports: (reports.data ?? []).slice(0, 8) }) })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingPanel, {
				title: "국내외 증시",
				cacheKey: `market:${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`,
				contextParts: () => {
					return `지수: ${(tape.data ?? []).map((q) => `${q.name} ${q.price} (${q.changePercent.toFixed(2)}%)`).join(", ")}\n섹터: ${(sectors.data ?? []).map((s) => `${s.name} ${s.changePercent.toFixed(2)}%`).join(", ")}\n헤드라인:\n${reportsToContext(reports.data ?? [])}`;
				}
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-8 flex items-center gap-1 text-xs text-muted-foreground",
			children: ["시세는 지연될 수 있으며 투자 판단의 근거로 사용하지 마세요", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
		})
	] });
}
//#endregion
export { Home as component };
