import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as currencyFor, i as SECTORS, n as INDICES, o as displayName, p as matchSectors, s as findSector } from "./format-B_tqOT-9.mjs";
import { a as object, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-IjTZJfxr.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
var mem = /* @__PURE__ */ new Map();
function cached(key, ttlMs, fn) {
	const hit = mem.get(key);
	if (hit && Date.now() - hit.at < ttlMs) return Promise.resolve(hit.value);
	return fn().then((value) => {
		mem.set(key, {
			at: Date.now(),
			value
		});
		return value;
	});
}
async function fetchText(url, init = {}) {
	const { timeoutMs = 9e3, headers, ...rest } = init;
	const res = await fetch(url, {
		...rest,
		headers: {
			"User-Agent": UA,
			Accept: "*/*",
			...headers
		},
		signal: AbortSignal.timeout(timeoutMs)
	});
	if (!res.ok) throw new Error(`요청 실패 ${res.status}`);
	return res.text();
}
async function fetchJson(url, init) {
	const text = await fetchText(url, {
		...init,
		headers: {
			Accept: "application/json",
			...init?.headers
		}
	});
	return JSON.parse(text);
}
function decodeEntities(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}
function parseRss(xml) {
	return (xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []).map((block) => {
		const grab = (tag) => {
			const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
			return m ? decodeEntities(m[1].trim()) : "";
		};
		const titleRaw = grab("title");
		const dash = titleRaw.lastIndexOf(" - ");
		const source = dash > 0 ? titleRaw.slice(dash + 3).trim() : "Google News";
		const title = dash > 0 ? titleRaw.slice(0, dash).trim() : titleRaw;
		const url = grab("link");
		const pub = grab("pubDate");
		const publishedAt = pub ? new Date(pub).toISOString() : null;
		return {
			id: url || title,
			title,
			url,
			source,
			publishedAt: publishedAt && !Number.isNaN(Date.parse(publishedAt)) ? publishedAt : null,
			kind: "news"
		};
	});
}
async function googleNews(query) {
	return parseRss(await fetchText(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`));
}
function normalizeTitle(title) {
	return title.replace(/\s+/g, " ").replace(/[^\p{L}\p{N}]+/gu, "").toLowerCase();
}
async function collectReports(queries) {
	const list = (Array.isArray(queries) ? queries : [queries]).map((q) => q.trim()).filter(Boolean);
	return cached(`news:${list.join("|")}`, 3e5, async () => {
		const results = await Promise.allSettled(list.map((q) => googleNews(q)));
		const merged = [];
		for (const r of results) if (r.status === "fulfilled") merged.push(...r.value);
		const seen = /* @__PURE__ */ new Set();
		const unique = [];
		for (const item of merged) {
			if (!item.title || item.title.length < 8) continue;
			const keyTitle = normalizeTitle(item.title).slice(0, 48);
			if (seen.has(keyTitle)) continue;
			seen.add(keyTitle);
			unique.push(item);
		}
		unique.sort((a, b) => {
			const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
			return (b.publishedAt ? Date.parse(b.publishedAt) : 0) - ta;
		});
		return unique.slice(0, 18);
	});
}
function toYahooSymbol(item) {
	const code = (item.code ?? "").trim();
	if (!code) return null;
	const type = item.typeCode ?? "";
	if (type === "KOSPI") return `${code}.KS`;
	if (type === "KOSDAQ") return `${code}.KQ`;
	if (type === "KONEX") return `${code}.KN`;
	return code;
}
async function naverSearch(query) {
	const q = query.trim();
	if (!q) return [];
	return cached(`nsearch:${q}`, 6e4, async () => {
		const url = `https://m.stock.naver.com/front-api/search/autoComplete?query=${encodeURIComponent(q)}&target=stock`;
		try {
			return ((await fetchJson(url, { headers: { Referer: "https://m.stock.naver.com/" } })).result?.items ?? []).filter((item) => item.category === "stock" || !item.category).map((item) => {
				const symbol = toYahooSymbol(item);
				if (!symbol) return null;
				return {
					symbol,
					name: displayName(symbol, item.name),
					exchange: item.typeName || item.typeCode
				};
			}).filter((x) => x != null).slice(0, 8);
		} catch {
			return [];
		}
	});
}
var CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
var SPARK = "https://query1.finance.yahoo.com/v8/finance/spark";
var SEARCH = "https://query2.finance.yahoo.com/v1/finance/search";
function lastFinite(values) {
	if (!values) return null;
	for (let i = values.length - 1; i >= 0; i--) {
		const v = values[i];
		if (typeof v === "number" && Number.isFinite(v)) return v;
	}
	return null;
}
function compactSpark(values, max = 36) {
	const nums = (values ?? []).filter((v) => typeof v === "number" && Number.isFinite(v));
	if (nums.length <= max) return nums;
	const step = (nums.length - 1) / (max - 1);
	return Array.from({ length: max }, (_, i) => nums[Math.round(i * step)] ?? nums[nums.length - 1]);
}
async function fetchQuotes(symbols) {
	const unique = [...new Set(symbols.filter(Boolean))].slice(0, 80);
	if (!unique.length) return [];
	return cached(`spark:${unique.join(",")}`, 2e4, async () => {
		const chunks = [];
		for (let i = 0; i < unique.length; i += 10) chunks.push(unique.slice(i, i + 10));
		const maps = await Promise.all(chunks.map(async (chunk) => {
			return fetchJson(`${SPARK}?symbols=${encodeURIComponent(chunk.join(","))}&range=1d&interval=5m`);
		}));
		const bySymbol = Object.assign({}, ...maps);
		return unique.map((symbol) => {
			const row = bySymbol[symbol] ?? {};
			const spark = compactSpark(row.close);
			const price = row.fulldayPrice ?? lastFinite(row.close) ?? 0;
			const change = row.fulldayChange ?? 0;
			const changePercent = row.fulldayChangePercent ?? 0;
			return {
				symbol,
				name: displayName(symbol),
				currency: currencyFor(symbol),
				price,
				change,
				changePercent,
				previousClose: row.previousClose,
				spark
			};
		});
	});
}
async function fetchQuoteDetail(symbol) {
	return cached(`detail:${symbol}`, 2e4, async () => {
		const result = (await fetchJson(`${CHART}/${encodeURIComponent(symbol)}?interval=1d&range=5d`)).chart?.result?.[0];
		if (!result?.meta) throw new Error("시세를 찾지 못했습니다");
		const meta = result.meta;
		const close = result.indicators?.quote?.[0]?.close ?? [];
		const currency = meta.currency || currencyFor(symbol);
		const changePercent = meta.fulldayChangePercent ?? meta.regularMarketChangePercent ?? 0;
		const price = meta.regularMarketPrice ?? lastFinite(close) ?? 0;
		const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
		return {
			symbol: meta.symbol ?? symbol,
			name: displayName(symbol, meta.longName || meta.shortName),
			exchange: meta.exchangeName,
			currency: currency === "USD" && symbol.endsWith(".KS") ? "KRW" : currency,
			price,
			change: meta.fulldayChange ?? price - prev,
			changePercent,
			previousClose: prev,
			dayHigh: meta.regularMarketDayHigh,
			dayLow: meta.regularMarketDayLow,
			fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
			fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
			volume: meta.regularMarketVolume,
			spark: compactSpark(close)
		};
	});
}
var RANGE_QUERY = {
	"1d": {
		interval: "5m",
		range: "1d"
	},
	"5d": {
		interval: "15m",
		range: "5d"
	},
	"1mo": {
		interval: "1d",
		range: "1mo"
	},
	"3mo": {
		interval: "1d",
		range: "3mo"
	},
	"1y": {
		interval: "1d",
		range: "1y"
	},
	"5y": {
		interval: "1wk",
		range: "5y"
	}
};
async function fetchChart(symbol, range) {
	return cached(`chart:${symbol}:${range}`, 6e4, async () => {
		const q = RANGE_QUERY[range] ?? RANGE_QUERY["3mo"];
		const result = (await fetchJson(`${CHART}/${encodeURIComponent(symbol)}?interval=${q.interval}&range=${q.range}`)).chart?.result?.[0];
		if (!result) throw new Error("차트를 불러오지 못했습니다");
		const ts = result.timestamp ?? [];
		const close = result.indicators?.quote?.[0]?.close ?? [];
		const points = [];
		for (let i = 0; i < ts.length; i++) {
			const c = close[i];
			if (typeof c === "number" && Number.isFinite(c)) points.push({
				t: ts[i] * 1e3,
				close: c
			});
		}
		return {
			symbol,
			name: displayName(symbol, result.meta?.longName || result.meta?.shortName),
			currency: result.meta?.currency || currencyFor(symbol),
			range,
			points
		};
	});
}
async function yahooSearch(query) {
	if (!/^[a-zA-Z0-9 .^%=_-]+$/.test(query)) return {
		quotes: [],
		news: []
	};
	return cached(`ysear:${query}`, 6e4, async () => {
		const data = await fetchJson(`${SEARCH}?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=8`);
		return {
			quotes: (data.quotes ?? []).filter((q) => q.symbol && (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX")).map((q) => ({
				symbol: q.symbol,
				name: displayName(q.symbol, q.longname || q.shortname),
				exchange: q.exchDisp,
				sector: q.sector
			})),
			news: (data.news ?? []).map((n) => ({
				id: n.uuid || n.link || n.title || crypto.randomUUID(),
				title: n.title || "",
				url: n.link || "",
				source: n.publisher || "Yahoo Finance",
				publishedAt: n.providerPublishTime ? (/* @__PURE__ */ new Date(n.providerPublishTime * 1e3)).toISOString() : null,
				kind: "news"
			}))
		};
	});
}
var getMarketTape_createServerFn_handler = createServerRpc({
	id: "d4e04cf9926205abbe0bf95295ee57fbace0f6126ca19a69b62204b783ff8ef0",
	name: "getMarketTape",
	filename: "src/lib/finance/api.ts"
}, (opts) => getMarketTape.__executeServer(opts));
var getMarketTape = createServerFn({ method: "GET" }).handler(getMarketTape_createServerFn_handler, async () => {
	return (await fetchQuotes(INDICES.map((i) => i.symbol))).map((q) => ({
		...q,
		name: INDICES.find((i) => i.symbol === q.symbol)?.name ?? q.name
	}));
});
var getQuotes_createServerFn_handler = createServerRpc({
	id: "5df19f07672b3e73320276a1827e123f650d2445ce42ba2c598d0dfc5e98da7e",
	name: "getQuotes",
	filename: "src/lib/finance/api.ts"
}, (opts) => getQuotes.__executeServer(opts));
var getQuotes = createServerFn({ method: "GET" }).validator(object({ symbols: string().max(1600) })).handler(getQuotes_createServerFn_handler, async ({ data }) => {
	return fetchQuotes(data.symbols.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 80));
});
var getQuoteDetail_createServerFn_handler = createServerRpc({
	id: "285bf3f2278b715b6dd2d4004b6b523f451bdb24e349d8a8a83cdfc89af9f688",
	name: "getQuoteDetail",
	filename: "src/lib/finance/api.ts"
}, (opts) => getQuoteDetail.__executeServer(opts));
var getQuoteDetail = createServerFn({ method: "GET" }).validator(object({ symbol: string().min(1).max(24) })).handler(getQuoteDetail_createServerFn_handler, async ({ data }) => fetchQuoteDetail(data.symbol));
var getChart_createServerFn_handler = createServerRpc({
	id: "20d9912628ce706d42310e05c73a153306c8ceedce882428d0ea0c7a585aae88",
	name: "getChart",
	filename: "src/lib/finance/api.ts"
}, (opts) => getChart.__executeServer(opts));
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
})).handler(getChart_createServerFn_handler, async ({ data }) => fetchChart(data.symbol, data.range));
var searchMarkets_createServerFn_handler = createServerRpc({
	id: "a6f83ff9d2b99922e8f30145a9ba64e0c63e867c5d230b240c5307e789d9207c",
	name: "searchMarkets",
	filename: "src/lib/finance/api.ts"
}, (opts) => searchMarkets.__executeServer(opts));
var searchMarkets = createServerFn({ method: "GET" }).validator(object({ q: string().min(1).max(80) })).handler(searchMarkets_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim();
	const sectorHits = matchSectors(q).map((s) => ({
		kind: "sector",
		name: s.name,
		subtitle: s.blurb,
		sectorId: s.id
	}));
	const [naver, yahoo] = await Promise.allSettled([naverSearch(q), yahooSearch(q)]);
	const companies = /* @__PURE__ */ new Map();
	if (naver.status === "fulfilled") for (const item of naver.value) companies.set(item.symbol, {
		kind: "company",
		name: item.name,
		subtitle: item.exchange || item.symbol,
		symbol: item.symbol,
		exchange: item.exchange
	});
	if (yahoo.status === "fulfilled") for (const item of yahoo.value.quotes) {
		if (companies.has(item.symbol)) continue;
		companies.set(item.symbol, {
			kind: "company",
			name: item.name,
			subtitle: item.exchange || item.symbol,
			symbol: item.symbol,
			exchange: item.exchange
		});
	}
	return [...sectorHits, ...companies.values()].slice(0, 12);
});
var getSectorSnapshot_createServerFn_handler = createServerRpc({
	id: "fcc8c15eec51b475807956838a21e73624bae14c24ddd768eefbc88470478473",
	name: "getSectorSnapshot",
	filename: "src/lib/finance/api.ts"
}, (opts) => getSectorSnapshot.__executeServer(opts));
var getSectorSnapshot = createServerFn({ method: "GET" }).validator(object({ id: string().min(1).max(40) })).handler(getSectorSnapshot_createServerFn_handler, async ({ data }) => {
	const sector = findSector(data.id);
	if (!sector) throw new Error("섹터를 찾지 못했습니다");
	const quotes = (await fetchQuotes(sector.symbols)).filter((q) => q.price > 0);
	const withMove = quotes.filter((q) => Number.isFinite(q.changePercent) && q.price > 0);
	const changePercent = withMove.length === 0 ? 0 : withMove.reduce((sum, q) => sum + q.changePercent, 0) / withMove.length;
	return {
		...sector,
		quotes,
		changePercent
	};
});
var getAllSectors_createServerFn_handler = createServerRpc({
	id: "b16948628077eea00edff3f1d4e487b1493e8bc61edac19cd08403388e9f493e",
	name: "getAllSectors",
	filename: "src/lib/finance/api.ts"
}, (opts) => getAllSectors.__executeServer(opts));
var getAllSectors = createServerFn({ method: "GET" }).handler(getAllSectors_createServerFn_handler, async () => {
	const quotes = await fetchQuotes([...new Set(SECTORS.flatMap((s) => s.symbols))]);
	const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
	return SECTORS.map((sector) => {
		const sectorQuotes = sector.symbols.map((sym) => bySymbol.get(sym)).filter((q) => q != null && q.price > 0);
		const changePercent = sectorQuotes.length === 0 ? 0 : sectorQuotes.reduce((sum, q) => sum + q.changePercent, 0) / sectorQuotes.length;
		return {
			...sector,
			quotes: sectorQuotes,
			changePercent
		};
	});
});
var getReports_createServerFn_handler = createServerRpc({
	id: "203ecc0b6389c847fe47b0ab756bb9fa520e2ed19c2fd92098784129e7b1e6dd",
	name: "getReports",
	filename: "src/lib/finance/api.ts"
}, (opts) => getReports.__executeServer(opts));
var getReports = createServerFn({ method: "GET" }).validator(object({ query: string().min(1).max(120) })).handler(getReports_createServerFn_handler, async ({ data }) => collectReports(data.query));
var getMarketReports_createServerFn_handler = createServerRpc({
	id: "c0130e6f12a37cc66dc8d193951efd9fd1dc4a2d53c716afd9148acb4bfe914e",
	name: "getMarketReports",
	filename: "src/lib/finance/api.ts"
}, (opts) => getMarketReports.__executeServer(opts));
var getMarketReports = createServerFn({ method: "GET" }).handler(getMarketReports_createServerFn_handler, async () => {
	return collectReports(["코스피 when:1d", "뉴욕증시 when:1d"]);
});
var listSectors_createServerFn_handler = createServerRpc({
	id: "f98168f1fd5596321f33714537da829eefa7d61c63f8c39f78250f13340b7de4",
	name: "listSectors",
	filename: "src/lib/finance/api.ts"
}, (opts) => listSectors.__executeServer(opts));
var listSectors = createServerFn({ method: "GET" }).handler(listSectors_createServerFn_handler, async () => SECTORS);
//#endregion
export { getAllSectors_createServerFn_handler, getChart_createServerFn_handler, getMarketReports_createServerFn_handler, getMarketTape_createServerFn_handler, getQuoteDetail_createServerFn_handler, getQuotes_createServerFn_handler, getReports_createServerFn_handler, getSectorSnapshot_createServerFn_handler, listSectors_createServerFn_handler, searchMarkets_createServerFn_handler };
