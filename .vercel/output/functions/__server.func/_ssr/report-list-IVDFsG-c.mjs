import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { f as formatTimeAgo, r as POPULAR_SEARCHES } from "./format-B_tqOT-9.mjs";
import { a as object, o as string, t as _enum } from "../_libs/zod.mjs";
import { a as Layers, i as Search, o as ExternalLink, r as Sparkles, s as Building2, t as X } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-BXz9srNA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-list-IVDFsG-c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMarketTape = createServerFn({ method: "GET" }).handler(createSsrRpc("d4e04cf9926205abbe0bf95295ee57fbace0f6126ca19a69b62204b783ff8ef0"));
var getQuotes = createServerFn({ method: "GET" }).validator(object({ symbols: string().max(1600) })).handler(createSsrRpc("5df19f07672b3e73320276a1827e123f650d2445ce42ba2c598d0dfc5e98da7e"));
var getQuoteDetail = createServerFn({ method: "GET" }).validator(object({ symbol: string().min(1).max(24) })).handler(createSsrRpc("285bf3f2278b715b6dd2d4004b6b523f451bdb24e349d8a8a83cdfc89af9f688"));
var getChart = createServerFn({ method: "GET" }).validator(object({
	symbol: string().min(1).max(24),
	range: _enum([
		"1d",
		"5d",
		"1mo",
		"3mo",
		"1y",
		"5y"
	])
})).handler(createSsrRpc("20d9912628ce706d42310e05c73a153306c8ceedce882428d0ea0c7a585aae88"));
var searchMarkets = createServerFn({ method: "GET" }).validator(object({ q: string().min(1).max(80) })).handler(createSsrRpc("a6f83ff9d2b99922e8f30145a9ba64e0c63e867c5d230b240c5307e789d9207c"));
var getSectorSnapshot = createServerFn({ method: "GET" }).validator(object({ id: string().min(1).max(40) })).handler(createSsrRpc("fcc8c15eec51b475807956838a21e73624bae14c24ddd768eefbc88470478473"));
var getAllSectors = createServerFn({ method: "GET" }).handler(createSsrRpc("b16948628077eea00edff3f1d4e487b1493e8bc61edac19cd08403388e9f493e"));
var getReports = createServerFn({ method: "GET" }).validator(object({ query: string().min(1).max(120) })).handler(createSsrRpc("203ecc0b6389c847fe47b0ab756bb9fa520e2ed19c2fd92098784129e7b1e6dd"));
var getMarketReports = createServerFn({ method: "GET" }).handler(createSsrRpc("c0130e6f12a37cc66dc8d193951efd9fd1dc4a2d53c716afd9148acb4bfe914e"));
createServerFn({ method: "GET" }).handler(createSsrRpc("f98168f1fd5596321f33714537da829eefa7d61c63f8c39f78250f13340b7de4"));
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	ref,
	className: cn("flex h-11 w-full rounded-md bg-muted px-3 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", className),
	...props
}));
Input.displayName = "Input";
function SearchBar({ autoFocus = false, size = "lg" }) {
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(0);
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const boxRef = (0, import_react.useRef)(null);
	const listId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebounced(q.trim()), 220);
		return () => clearTimeout(t);
	}, [q]);
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			if (!boxRef.current?.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	const search = useQuery({
		queryKey: ["search", debounced],
		queryFn: () => searchMarkets({ data: { q: debounced } }),
		enabled: debounced.length >= 1
	});
	const hits = search.data ?? [];
	const showPopular = open && !debounced;
	const showHits = open && debounced.length >= 1;
	function go(hit) {
		setOpen(false);
		setQ("");
		if (hit.kind === "sector" && hit.sectorId) {
			navigate({
				to: "/sector/$id",
				params: { id: hit.sectorId }
			});
			return;
		}
		if (hit.symbol) navigate({
			to: "/company/$symbol",
			params: { symbol: hit.symbol }
		});
	}
	function goHref(href) {
		setOpen(false);
		setQ("");
		const parts = href.split("/").filter(Boolean);
		if (parts[0] === "sector" && parts[1]) navigate({
			to: "/sector/$id",
			params: { id: parts[1] }
		});
		else if (parts[0] === "company" && parts[1]) navigate({
			to: "/company/$symbol",
			params: { symbol: decodeURIComponent(parts[1]) }
		});
	}
	function onKeyDown(e) {
		if (!open) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const hit = hits[active];
			if (hit) go(hit);
		} else if (e.key === "Escape") setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boxRef,
		className: "relative w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				autoFocus,
				placeholder: "기업, 섹터, 티커 검색",
				"aria-autocomplete": "list",
				"aria-controls": listId,
				"aria-expanded": open,
				role: "combobox",
				className: cn("pl-10 pr-10", size === "lg" && "h-12 rounded-lg text-base"),
				onFocus: () => setOpen(true),
				onChange: (e) => {
					setQ(e.target.value);
					setOpen(true);
					setActive(0);
				},
				onKeyDown
			}),
			q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "검색어 지우기",
				className: "absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground",
				onClick: () => setQ(""),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}) : null,
			showPopular ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute z-40 mt-2 w-full rounded-xl bg-popover p-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
					children: "자주 찾는 검색"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: POPULAR_SEARCHES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-9 rounded-full bg-muted px-3 text-sm text-foreground hover:bg-accent",
						onClick: () => goHref(p.href),
						children: p.label
					}, p.href))
				})]
			}) : null,
			showHits ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				id: listId,
				role: "listbox",
				className: "absolute z-40 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-popover py-2 shadow-[var(--shadow-border)]",
				children: [
					search.isFetching && !hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-6 text-sm text-muted-foreground",
						children: "검색 중…"
					}) : null,
					!search.isFetching && !hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-6 text-sm text-muted-foreground",
						children: "일치하는 기업이나 섹터가 없습니다"
					}) : null,
					hits.map((hit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"aria-selected": i === active,
						className: cn("flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent", i === active && "bg-accent"),
						onMouseEnter: () => setActive(i),
						onClick: () => go(hit),
						children: [
							hit.kind === "sector" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-steel" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex min-w-0 flex-1 flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm font-medium",
									children: hit.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-xs text-muted-foreground",
									children: hit.subtitle
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] tracking-wide text-muted-foreground uppercase",
								children: hit.kind === "sector" ? "섹터" : "기업"
							})
						]
					}) }, `${hit.kind}-${hit.symbol ?? hit.sectorId}`))
				]
			}) : null
		]
	});
}
function AppShell({ children, compactSearch = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex shrink-0 items-baseline gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-medium tracking-tight",
						children: "마켓브리프"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs tracking-wide text-muted-foreground sm:inline",
						children: "리서치 데스크"
					})]
				}), compactSearch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, { size: "md" })
				}) : null]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:py-8",
			children
		})]
	});
}
var generateBriefing = createServerFn({ method: "POST" }).validator(object({
	title: string().min(1).max(120),
	context: string().min(1).max(8e3),
	cacheKey: string().min(1).max(80)
})).handler(createSsrRpc("c266ecd774c5be816c0892635bf6ae862dfa47058039fdecccd9e474485f64c6"));
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		up: "bg-up/15 text-up",
		down: "bg-down/15 text-down",
		steel: "bg-steel/15 text-steel"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			outline: "shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] bg-transparent",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			destructive: "bg-destructive text-primary-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-card text-card-foreground shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 px-5 pt-5", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-lg font-medium tracking-tight", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-5 pb-5 pt-4", className),
		...props
	});
}
var stanceLabel = {
	bullish: "우호",
	neutral: "중립",
	bearish: "경계"
};
function stanceVariant(stance) {
	if (stance === "bullish") return "up";
	if (stance === "bearish") return "down";
	return "steel";
}
function BriefingPanel({ title, cacheKey, contextParts }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [briefing, setBriefing] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function run() {
		setLoading(true);
		setError(null);
		try {
			const result = await generateBriefing({ data: {
				title,
				context: contextParts(),
				cacheKey
			} });
			if (!result.ok) {
				setError(result.error);
				toast.error(result.error);
				return;
			}
			setBriefing(result.briefing);
		} catch {
			setError("브리핑을 만들지 못했습니다");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "flex-row items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI 브리핑" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "수집된 시세와 헤드라인을 바탕으로 요약합니다. 투자 권유가 아닙니다." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => void run(),
			disabled: loading,
			size: "sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), loading ? "작성 중" : briefing ? "다시 생성" : "브리핑 생성"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-down",
			children: error
		}) : null,
		!briefing && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "버튼을 누르면 오늘 모은 리포트를 한 장의 메모로 정리합니다."
		}) : null,
		briefing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: stanceVariant(briefing.stance),
						children: stanceLabel[briefing.stance]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-snug font-medium",
						children: briefing.headline
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: briefing.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefList, {
					label: "핵심",
					items: briefing.bullets
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefList, {
							label: "촉매",
							items: briefing.catalysts
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefList, {
							label: "리스크",
							items: briefing.risks
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefList, {
							label: "관찰 포인트",
							items: briefing.watch
						})
					]
				})
			]
		}) : null
	] })] });
}
function BriefList({ label, items }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1.5",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "text-sm leading-snug",
			children: item
		}, item))
	})] });
}
function reportsToContext(reports) {
	return reports.slice(0, 12).map((r) => `- ${r.title} (${r.source}${r.publishedAt ? `, ${r.publishedAt.slice(0, 10)}` : ""})`).join("\n");
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function ReportList({ reports, empty }) {
	if (!reports.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-sm text-muted-foreground",
		children: empty ?? "수집된 리포트가 없습니다"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: r.url,
			target: "_blank",
			rel: "noreferrer",
			className: "group flex items-start gap-3 py-3.5 transition-colors duration-150 hover:text-steel",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[15px] leading-snug font-medium",
					children: r.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-1 block text-xs text-muted-foreground",
					children: [r.source, r.publishedAt ? ` · ${formatTimeAgo(r.publishedAt)}` : ""]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" })]
		}) }, r.id))
	});
}
//#endregion
export { getQuoteDetail as _, Card as a, getSectorSnapshot as b, CardHeader as c, SearchBar as d, Skeleton as f, getMarketTape as g, getMarketReports as h, Button as i, CardTitle as l, getChart as m, Badge as n, CardContent as o, getAllSectors as p, BriefingPanel as r, CardDescription as s, AppShell as t, ReportList as u, getQuotes as v, reportsToContext as x, getReports as y };
