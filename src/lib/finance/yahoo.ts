import { displayName } from "./catalog";
import { currencyFor } from "./format";
import { cached, fetchJson } from "./http";
import type { ChartPoint, ChartSeries, Quote, Report } from "./types";

const CHART = "https://query1.finance.yahoo.com/v8/finance/chart";
const SPARK = "https://query1.finance.yahoo.com/v8/finance/spark";
const SEARCH = "https://query2.finance.yahoo.com/v1/finance/search";

type SparkRow = {
  symbol?: string;
  fulldayPrice?: number;
  fulldayChange?: number;
  fulldayChangePercent?: number;
  previousClose?: number;
  close?: Array<number | null>;
};

type ChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        symbol?: string;
        exchangeName?: string;
        regularMarketPrice?: number;
        regularMarketChangePercent?: number;
        fulldayChange?: number;
        fulldayChangePercent?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        longName?: string;
        shortName?: string;
        chartPreviousClose?: number;
        previousClose?: number;
        instrumentType?: string;
      };
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }>;
    error?: { description?: string } | null;
  };
};

function lastFinite(values: Array<number | null | undefined> | undefined) {
  if (!values) return null;
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return null;
}

function compactSpark(values: Array<number | null | undefined> | undefined, max = 36) {
  const nums = (values ?? []).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (nums.length <= max) return nums;
  const step = (nums.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => nums[Math.round(i * step)] ?? nums[nums.length - 1]!);
}

export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const unique = [...new Set(symbols.filter(Boolean))].slice(0, 80);
  if (!unique.length) return [];
  return cached(`spark:v2:${unique.join(",")}`, 20_000, async () => {
    const chunks: string[][] = [];
    for (let i = 0; i < unique.length; i += 10) chunks.push(unique.slice(i, i + 10));
    const maps = await Promise.all(
      chunks.map(async (chunk) => {
        const url = `${SPARK}?symbols=${encodeURIComponent(chunk.join(","))}&range=1d&interval=5m`;
        return fetchJson<Record<string, SparkRow>>(url);
      }),
    );
    const bySymbol: Record<string, SparkRow> = Object.assign({}, ...maps);
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
        spark,
      } satisfies Quote;
    });
  });
}

export async function fetchQuoteDetail(symbol: string): Promise<Quote> {
  return cached(`detail:${symbol}`, 20_000, async () => {
    const url = `${CHART}/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const data = await fetchJson<ChartResponse>(url);
    const result = data.chart?.result?.[0];
    if (!result?.meta) throw new Error("시세를 찾지 못했습니다");
    const meta = result.meta;
    const close = result.indicators?.quote?.[0]?.close ?? [];
    const currency = currencyFor(symbol, meta.currency || "USD");
    const changePercent = meta.fulldayChangePercent ?? meta.regularMarketChangePercent ?? 0;
    const price = meta.regularMarketPrice ?? lastFinite(close) ?? 0;
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
    return {
      symbol: meta.symbol ?? symbol,
      name: displayName(symbol, meta.longName || meta.shortName),
      exchange: meta.exchangeName,
      currency,
      price,
      change: meta.fulldayChange ?? price - prev,
      changePercent,
      previousClose: prev,
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      volume: meta.regularMarketVolume,
      spark: compactSpark(close),
    } satisfies Quote;
  });
}

export type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "1y" | "5y";

const RANGE_QUERY: Record<ChartRange, { interval: string; range: string }> = {
  "1d": { interval: "5m", range: "1d" },
  "5d": { interval: "15m", range: "5d" },
  "1mo": { interval: "1d", range: "1mo" },
  "3mo": { interval: "1d", range: "3mo" },
  "1y": { interval: "1d", range: "1y" },
  "5y": { interval: "1wk", range: "5y" },
};

export async function fetchChart(symbol: string, range: ChartRange): Promise<ChartSeries> {
  return cached(`chart:${symbol}:${range}`, 60_000, async () => {
    const q = RANGE_QUERY[range] ?? RANGE_QUERY["3mo"];
    const url = `${CHART}/${encodeURIComponent(symbol)}?interval=${q.interval}&range=${q.range}`;
    const data = await fetchJson<ChartResponse>(url);
    const result = data.chart?.result?.[0];
    if (!result) throw new Error("차트를 불러오지 못했습니다");
    const ts = result.timestamp ?? [];
    const close = result.indicators?.quote?.[0]?.close ?? [];
    const points: ChartPoint[] = [];
    for (let i = 0; i < ts.length; i++) {
      const c = close[i];
      if (typeof c === "number" && Number.isFinite(c)) points.push({ t: ts[i]! * 1000, close: c });
    }
    return {
      symbol,
      name: displayName(symbol, result.meta?.longName || result.meta?.shortName),
      currency: currencyFor(symbol, result.meta?.currency || "USD"),
      range,
      points,
    };
  });
}

type YahooSearch = {
  quotes?: Array<{
    symbol?: string;
    shortname?: string;
    longname?: string;
    exchDisp?: string;
    quoteType?: string;
    sector?: string;
    typeDisp?: string;
  }>;
  news?: Array<{
    uuid?: string;
    title?: string;
    link?: string;
    publisher?: string;
    providerPublishTime?: number;
  }>;
};

export async function yahooSearch(query: string) {
  if (!/^[a-zA-Z0-9 .^%=_-]+$/.test(query)) return { quotes: [], news: [] as Report[] };
  return cached(`ysear:${query}`, 60_000, async () => {
    const url = `${SEARCH}?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=8`;
    const data = await fetchJson<YahooSearch>(url);
    const quotes = (data.quotes ?? [])
      .filter((q) => q.symbol && (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX"))
      .map((q) => ({
        symbol: q.symbol!,
        name: displayName(q.symbol!, q.longname || q.shortname),
        exchange: q.exchDisp,
        sector: q.sector,
      }));
    const news: Report[] = (data.news ?? []).map((n) => ({
      id: n.uuid || n.link || n.title || crypto.randomUUID(),
      title: n.title || "",
      url: n.link || "",
      source: n.publisher || "Yahoo Finance",
      publishedAt: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toISOString() : null,
      kind: "news" as const,
    }));
    return { quotes, news };
  });
}
