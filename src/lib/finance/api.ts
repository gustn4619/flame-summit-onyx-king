import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { INDICES, SECTORS, findSector, matchSectors } from "./catalog";
import { collectReports } from "./news";
import { naverSearch } from "./naver";
import { fetchChart, fetchQuoteDetail, fetchQuotes, yahooSearch, type ChartRange } from "./yahoo";
import type { Quote, SearchHit, SectorSnapshot } from "./types";

export const getMarketTape = createServerFn({ method: "GET" }).handler(async () => {
  const quotes = await fetchQuotes(INDICES.map((i) => i.symbol));
  return quotes.map((q) => ({
    ...q,
    name: INDICES.find((i) => i.symbol === q.symbol)?.name ?? q.name,
  }));
});

export const getQuotes = createServerFn({ method: "GET" })
  .validator(z.object({ symbols: z.string().max(1600) }))
  .handler(async ({ data }) => {
    const symbols = data.symbols
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 80);
    return fetchQuotes(symbols);
  });

export const getQuoteDetail = createServerFn({ method: "GET" })
  .validator(z.object({ symbol: z.string().min(1).max(24) }))
  .handler(async ({ data }) => fetchQuoteDetail(data.symbol));

export const getChart = createServerFn({ method: "GET" })
  .validator(
    z.object({
      symbol: z.string().min(1).max(24),
      range: z.enum(["1d", "5d", "1mo", "3mo", "1y", "5y"]),
    }),
  )
  .handler(async ({ data }) => fetchChart(data.symbol, data.range as ChartRange));

export const searchMarkets = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().min(1).max(80) }))
  .handler(async ({ data }) => {
    const q = data.q.trim();
    const sectorHits: SearchHit[] = matchSectors(q).map((s) => ({
      kind: "sector",
      name: s.name,
      subtitle: s.blurb,
      sectorId: s.id,
    }));
    const [naver, yahoo] = await Promise.allSettled([
      naverSearch(q),
      yahooSearch(q),
    ]);
    const companies = new Map<string, SearchHit>();
    if (naver.status === "fulfilled") {
      for (const item of naver.value) {
        companies.set(item.symbol, {
          kind: "company",
          name: item.name,
          subtitle: item.exchange || item.symbol,
          symbol: item.symbol,
          exchange: item.exchange,
        });
      }
    }
    if (yahoo.status === "fulfilled") {
      for (const item of yahoo.value.quotes) {
        if (companies.has(item.symbol)) continue;
        companies.set(item.symbol, {
          kind: "company",
          name: item.name,
          subtitle: item.exchange || item.symbol,
          symbol: item.symbol,
          exchange: item.exchange,
        });
      }
    }
    return [...sectorHits, ...companies.values()].slice(0, 12);
  });

export const getSectorSnapshot = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(40) }))
  .handler(async ({ data }) => {
    const sector = findSector(data.id);
    if (!sector) throw new Error("섹터를 찾지 못했습니다");
    const quotes = (await fetchQuotes(sector.symbols)).filter((q) => q.price > 0);
    const withMove = quotes.filter((q) => Number.isFinite(q.changePercent) && q.price > 0);
    const changePercent =
      withMove.length === 0
        ? 0
        : withMove.reduce((sum, q) => sum + q.changePercent, 0) / withMove.length;
    return { ...sector, quotes, changePercent } satisfies SectorSnapshot;
  });

export const getAllSectors = createServerFn({ method: "GET" }).handler(async () => {
  const symbols = [...new Set(SECTORS.flatMap((s) => s.symbols))];
  const quotes = await fetchQuotes(symbols);
  const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));
  return SECTORS.map((sector) => {
    const sectorQuotes = sector.symbols
      .map((sym) => bySymbol.get(sym))
      .filter((q): q is Quote => q != null && q.price > 0);
    const changePercent =
      sectorQuotes.length === 0
        ? 0
        : sectorQuotes.reduce((sum, q) => sum + q.changePercent, 0) / sectorQuotes.length;
    return { ...sector, quotes: sectorQuotes, changePercent } satisfies SectorSnapshot;
  });
});

export const getReports = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().min(1).max(120),
    }),
  )
  .handler(async ({ data }) => collectReports(data.query));

export const getMarketReports = createServerFn({ method: "GET" }).handler(async () => {
  return collectReports(["코스피 when:1d", "뉴욕증시 when:1d"]);
});

export const listSectors = createServerFn({ method: "GET" }).handler(async () => SECTORS);
