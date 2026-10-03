import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as formatPrice, m as signedClass, u as formatPercent } from "./format-B_tqOT-9.mjs";
import { i as cn } from "./router-BXz9srNA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quote-row-Cz01hgH4.js
var import_jsx_runtime = require_jsx_runtime();
function Sparkline({ values, className, positive }) {
	if (!values.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-7 w-16", className) });
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const w = 72;
	const h = 28;
	const d = values.map((v, i) => {
		const x = values.length === 1 ? w / 2 : i / (values.length - 1) * w;
		const y = h - (v - min) / span * 26 - 1;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-7 w-16 overflow-visible", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: positive ? "var(--color-up)" : "var(--color-down)",
			strokeWidth: "1.6",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function QuoteRow({ quote }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm font-medium",
				children: quote.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-xs text-muted-foreground",
				children: quote.symbol
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
			values: quote.spark,
			positive: quote.changePercent >= 0,
			className: "hidden sm:block"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "w-24 text-right",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-medium tabular-nums",
				children: formatPrice(quote.price, quote.currency)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("block text-xs tabular-nums", signedClass(quote.changePercent)),
				children: formatPercent(quote.changePercent)
			})]
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/company/$symbol",
		params: { symbol: quote.symbol },
		className: "flex min-h-14 items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-accent",
		children: inner
	});
}
//#endregion
export { Sparkline as n, QuoteRow as t };
