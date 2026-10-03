import { cached, decodeEntities, fetchText } from "./http";
import type { Report } from "./types";

function parseRss(xml: string): Report[] {
  const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  return blocks.map((block) => {
    const grab = (tag: string) => {
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
      kind: "news" as const,
    };
  });
}

async function googleNews(query: string): Promise<Report[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const xml = await fetchText(url);
  return parseRss(xml);
}

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, " ").replace(/[^\p{L}\p{N}]+/gu, "").toLowerCase();
}

export async function collectReports(queries: string | string[]): Promise<Report[]> {
  const list = (Array.isArray(queries) ? queries : [queries]).map((q) => q.trim()).filter(Boolean);
  const key = `news:${list.join("|")}`;
  return cached(key, 5 * 60_000, async () => {
    const results = await Promise.allSettled(list.map((q) => googleNews(q)));
    const merged: Report[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") merged.push(...r.value);
    }
    const seen = new Set<string>();
    const unique: Report[] = [];
    for (const item of merged) {
      if (!item.title || item.title.length < 8) continue;
      const keyTitle = normalizeTitle(item.title).slice(0, 48);
      if (seen.has(keyTitle)) continue;
      seen.add(keyTitle);
      unique.push(item);
    }
    unique.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    });
    return unique.slice(0, 18);
  });
}
