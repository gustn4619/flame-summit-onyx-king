import { displayName } from "./catalog";
import { cached, fetchJson } from "./http";

type NaverItem = {
  code?: string;
  name?: string;
  typeCode?: string;
  typeName?: string;
  nationCode?: string;
  category?: string;
};

type NaverResponse = {
  result?: { items?: NaverItem[] };
};

function toYahooSymbol(item: NaverItem) {
  const code = (item.code ?? "").trim();
  if (!code) return null;
  const type = item.typeCode ?? "";
  if (type === "KOSPI") return `${code}.KS`;
  if (type === "KOSDAQ") return `${code}.KQ`;
  if (type === "KONEX") return `${code}.KN`;
  return code;
}

export async function naverSearch(query: string) {
  const q = query.trim();
  if (!q) return [];
  return cached(`nsearch:${q}`, 60_000, async () => {
    const url = `https://m.stock.naver.com/front-api/search/autoComplete?query=${encodeURIComponent(q)}&target=stock`;
    try {
      const data = await fetchJson<NaverResponse>(url, {
        headers: { Referer: "https://m.stock.naver.com/" },
      });
      return (data.result?.items ?? [])
        .filter((item) => item.category === "stock" || !item.category)
        .map((item) => {
          const symbol = toYahooSymbol(item);
          if (!symbol) return null;
          return {
            symbol,
            name: displayName(symbol, item.name),
            exchange: item.typeName || item.typeCode,
          };
        })
        .filter((x): x is { symbol: string; name: string; exchange: string | undefined } => x != null)
        .slice(0, 8);
    } catch {
      return [];
    }
  });
}
