import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as formatPercent } from "./format-B_tqOT-9.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Route } from "./router-BXz9srNA.mjs";
import { a as Card, b as getSectorSnapshot, c as CardHeader, f as Skeleton, i as Button, l as CardTitle, n as Badge, o as CardContent, r as BriefingPanel, s as CardDescription, t as AppShell, u as ReportList, x as reportsToContext, y as getReports } from "./report-list-IVDFsG-c.mjs";
import { t as QuoteRow } from "./quote-row-Cz01hgH4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sector._id-CQPZOnUN.js
var import_jsx_runtime = require_jsx_runtime();
function SectorPage() {
	const { id } = Route.useParams();
	const sector = useQuery({
		queryKey: ["sector", id],
		queryFn: () => getSectorSnapshot({ data: { id } })
	});
	const reports = useQuery({
		queryKey: [
			"sector-reports",
			id,
			sector.data?.newsQuery
		],
		queryFn: () => getReports({ data: { query: sector.data?.newsQuery ?? id } }),
		enabled: Boolean(sector.data)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		compactSearch: true,
		children: [
			sector.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-xl" })]
			}) : null,
			sector.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "섹터를 찾지 못했습니다"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "대시보드로"
					})
				})]
			}) : null,
			sector.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: sector.data.nameEn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl font-medium tracking-tight",
								children: sector.data.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: sector.data.changePercent >= 0 ? "up" : "down",
								children: ["평균 ", formatPercent(sector.data.changePercent)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
							children: sector.data.blurb
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "구성 종목" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "대표 종목의 당일 등락" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: sector.data.quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteRow, { quote: q }, q.symbol)) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "섹터 헤드라인" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "관련 뉴스를 모아 두었습니다" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: reports.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, i))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportList, { reports: reports.data ?? [] }) })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefingPanel, {
						title: `${sector.data.name} 섹터`,
						cacheKey: `sec:${id}:${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`,
						contextParts: () => {
							const s = sector.data;
							if (!s) return "";
							const names = s.quotes.map((q) => `${q.name} ${q.changePercent.toFixed(2)}%`).join(", ");
							return `평균 등락 ${s.changePercent.toFixed(2)}%\n구성: ${names}\n헤드라인:\n${reportsToContext(reports.data ?? [])}`;
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "구성 종목 평균은 시가총액 가중이 아닌 단순 평균입니다"
					})
				]
			}) : null
		]
	});
}
//#endregion
export { SectorPage as component };
