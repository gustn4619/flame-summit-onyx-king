import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as formatCompact, d as formatPrice, i as SECTORS, l as formatNumber, m as signedClass, o as displayName, u as formatPercent } from "./format-B_tqOT-9.mjs";
import { c as Bookmark, l as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as cn, r as Route$1 } from "./router-BXz9srNA.mjs";
import { _ as getQuoteDetail, a as Card, c as CardHeader, f as Skeleton, i as Button, l as CardTitle, m as getChart, n as Badge, o as CardContent, r as BriefingPanel, s as CardDescription, t as AppShell, u as ReportList, x as reportsToContext, y as getReports } from "./report-list-IVDFsG-c.mjs";
import { t as useWatchlist } from "./watchlist-CTCPVfK7.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { n as Root2, r as Trigger, t as List } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company._symbol-RFkbCJQU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors duration-150 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-border)]", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var RANGES = [
	{
		id: "1d",
		label: "1일"
	},
	{
		id: "5d",
		label: "5일"
	},
	{
		id: "1mo",
		label: "1개월"
	},
	{
		id: "3mo",
		label: "3개월"
	},
	{
		id: "1y",
		label: "1년"
	},
	{
		id: "5y",
		label: "5년"
	}
];
function PriceChart({ symbol }) {
	const [range, setRange] = (0, import_react.useState)("3mo");
	const chart = useQuery({
		queryKey: [
			"chart",
			symbol,
			range
		],
		queryFn: () => getChart({ data: {
			symbol,
			range
		} })
	});
	const points = chart.data?.points ?? [];
	const first = points[0]?.close;
	const stroke = (points[points.length - 1]?.close ?? 0) >= (first ?? 0) ? "var(--color-up)" : "var(--color-down)";
	const data = (0, import_react.useMemo)(() => points.map((p) => ({
		t: p.t,
		close: p.close,
		label: new Date(p.t).toLocaleDateString("ko-KR", {
			month: "short",
			day: "numeric",
			...range === "1d" ? {
				hour: "2-digit",
				minute: "2-digit"
			} : {}
		})
	})), [points, range]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
		value: range,
		onValueChange: (v) => setRange(v),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
			value: r.id,
			children: r.label
		}, r.id)) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 h-56 sm:h-72",
		children: [
			chart.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full rounded-lg" }) : null,
			chart.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "flex h-full items-center text-sm text-muted-foreground",
				children: "차트를 불러오지 못했습니다"
			}) : null,
			!chart.isLoading && data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 8,
						right: 8,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "fill",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: stroke,
								stopOpacity: .25
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: stroke,
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "label",
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							hide: true,
							domain: ["auto", "auto"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								background: "var(--color-popover)",
								border: "1px solid var(--color-border)",
								borderRadius: 8,
								fontSize: 12
							},
							labelStyle: { color: "var(--color-muted-foreground)" },
							formatter: (value) => [formatPrice(Number(value), chart.data?.currency ?? "USD"), "종가"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "close",
							stroke,
							fill: "url(#fill)",
							strokeWidth: 1.8
						})
					]
				})
			}) : null
		]
	})] });
}
function CompanyPage() {
	const { symbol: raw } = Route$1.useParams();
	const symbol = decodeURIComponent(raw);
	const quote = useQuery({
		queryKey: ["quote", symbol],
		queryFn: () => getQuoteDetail({ data: { symbol } })
	});
	const name = displayName(symbol, quote.data?.name);
	const reports = useQuery({
		queryKey: ["reports", symbol],
		queryFn: () => getReports({ data: { query: `${name} 주식 when:14d` } })
	});
	const has = useWatchlist((s) => s.has(symbol));
	const add = useWatchlist((s) => s.add);
	const remove = useWatchlist((s) => s.remove);
	const relatedSectors = SECTORS.filter((s) => s.symbols.includes(symbol));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		compactSearch: true,
		children: [
			quote.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-72" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-xl" })
				]
			}) : null,
			quote.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: "종목을 찾지 못했습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: symbol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "대시보드로"
						})
					})
				]
			}) : null,
			quote.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tracking-wide text-muted-foreground",
								children: [
									quote.data.exchange ?? "EQUITY",
									" · ",
									symbol
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl tabular-nums",
									children: formatPrice(quote.data.price, quote.data.currency)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("pb-1 text-lg tabular-nums", signedClass(quote.data.changePercent)),
									children: formatPercent(quote.data.changePercent)
								})]
							}),
							relatedSectors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: relatedSectors.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/sector/$id",
									params: { id: s.id },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "steel",
										children: s.name
									})
								}, s.id))
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: has ? "secondary" : "outline",
							onClick: () => has ? remove(symbol) : add({
								symbol,
								name
							}),
							children: [has ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {}), has ? "관심 해제" : "관심 추가"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "pt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, { symbol })
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "전일 대비",
								value: `${quote.data.change > 0 ? "+" : ""}${formatPrice(quote.data.change, quote.data.currency)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "52주 범위",
								value: `${formatNumber(quote.data.fiftyTwoWeekLow)} – ${formatNumber(quote.data.fiftyTwoWeekHigh)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "당일 범위",
								value: quote.data.dayLow != null ? `${formatNumber(quote.data.dayLow)} – ${formatNumber(quote.data.dayHigh)}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "거래량",
								value: formatCompact(quote.data.volume)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingPanel, {
						title: `${name} (${symbol})`,
						cacheKey: `co:${symbol}:${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`,
						contextParts: () => {
							const q = quote.data;
							if (!q) return "";
							return [
								`가격 ${q.price} ${q.currency}, 등락 ${q.changePercent.toFixed(2)}%`,
								`52주 ${q.fiftyTwoWeekLow}–${q.fiftyTwoWeekHigh}, 거래량 ${q.volume ?? "n/a"}`,
								"헤드라인:",
								reportsToContext(reports.data ?? [])
							].join("\n");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "수집된 리포트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "공개 뉴스와 헤드라인을 모았습니다" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: reports.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportList, { reports: reports.data ?? [] }) })] })
				]
			}) : null
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-medium tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { CompanyPage as component };
