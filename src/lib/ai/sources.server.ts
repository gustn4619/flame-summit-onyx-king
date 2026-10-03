import { INDICES, findSector } from "../finance/catalog";
import { fetchQuoteDetail, fetchQuotes } from "../finance/yahoo";
import { collectReports } from "../finance/news";
import type { Quote } from "../finance/types";
import { safeSourceUrl, type Evidence, type EvidenceSource } from "./evidence";
import type { BriefingTarget } from "./target";

const cache = new Map<string, { until: number; value: Promise<Evidence> }>();
export function marketEvidence(target: BriefingTarget): Promise<Evidence> {
  const key = JSON.stringify(target);
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return hit.value;
  for (const [id, entry] of cache) if (entry.until <= Date.now()) cache.delete(id);
  if (cache.size >= 40) cache.delete(cache.keys().next().value!);
  const value = collect(target).catch((error: unknown) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { until: Date.now() + 300_000, value });
  return value;
}
async function collect(target: BriefingTarget): Promise<Evidence> {
  let title = "국내외 증시";
  let query: string | string[] = ["코스피 when:1d", "뉴욕증시 when:1d"];
  let quotes: Quote[] = [];
  const limitations = [
    "뉴스는 제목만 확인합니다. 기사 본문이나 공시 원문을 읽은 분석이 아닙니다.",
    "출처 링크 검사는 인용 대상의 존재를 확인하며, AI 해석의 정확성을 보증하지 않습니다.",
    "시세는 지연될 수 있습니다. 수집 시각은 거래 발생 시각이 아닙니다.",
  ];
  try {
    if (target.kind === "company") {
      const quote = await fetchQuoteDetail(target.symbol);
      title = `${quote.name} (${target.symbol})`;
      query = `${quote.name} 주식 when:14d`;
      quotes = [quote];
    } else if (target.kind === "sector") {
      const sector = findSector(target.id);
      if (!sector) throw new Error("Unknown sector");
      title = `${sector.name} 섹터`;
      query = sector.newsQuery;
      quotes = await fetchQuotes(sector.symbols);
    } else quotes = await fetchQuotes(INDICES.map((item) => item.symbol));
  } catch {
    if (target.kind !== "market") throw new Error("대상 자료를 확인하지 못했습니다.");
    limitations.push("시세 자료를 가져오지 못했습니다. 뉴스 제목만 사용합니다.");
  }
  const sources: EvidenceSource[] = quotes
    .filter((q) => Number.isFinite(q.price) && q.price > 0)
    .slice(0, 12)
    .map((q, index) => ({
      id: `Q${index + 1}`,
      title: `${q.name} (${q.symbol}) 시세`,
      url: `https://finance.yahoo.com/quote/${encodeURIComponent(q.symbol)}/`,
      kind: "market-data",
      publishedAt: null,
      text: `가격 ${q.price} ${q.currency}\n전일 종가 ${q.previousClose ?? "미확인"}\n거래량 ${q.volume ?? "미확인"}`,
    }));
  if (sources.length < quotes.length)
    limitations.push("확인할 수 없는 가격은 분석에서 제외했습니다.");
  const reports = await collectReports(query);
  for (const report of reports.slice(0, 8)) {
    const url = safeSourceUrl(report.url);
    if (url)
      sources.push({
        id: `N${sources.length + 1}`,
        title: report.title.slice(0, 240),
        url,
        kind: "news-title",
        publishedAt: report.publishedAt,
        text: `제목: ${report.title.slice(0, 240)}. 매체: ${report.source.slice(0, 80)}. 기사 본문 미확인.`,
      });
  }
  if (!reports.length) limitations.push("뉴스 자료가 없습니다. 관련 뉴스가 없다는 뜻은 아닙니다.");
  return {
    target: JSON.stringify(target),
    title,
    sources,
    limitations,
    asOf: new Date().toISOString(),
  };
}
