export type Quote = {
  symbol: string;
  name: string;
  exchange?: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose?: number;
  dayHigh?: number;
  dayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  volume?: number;
  spark: number[];
};

export type ChartPoint = {
  t: number;
  close: number;
};

export type ChartSeries = {
  symbol: string;
  name: string;
  currency: string;
  range: string;
  points: ChartPoint[];
};

export type SearchHit = {
  kind: "company" | "sector";
  name: string;
  subtitle: string;
  symbol?: string;
  sectorId?: string;
  exchange?: string;
};

export type Report = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string | null;
  kind: "news" | "filing";
};

export type SectorDef = {
  id: string;
  name: string;
  nameEn: string;
  blurb: string;
  newsQuery: string;
  symbols: string[];
};

export type SectorSnapshot = SectorDef & {
  changePercent: number;
  quotes: Quote[];
};

export type BriefingStance = "bullish" | "neutral" | "bearish";

export type Briefing = {
  headline: string;
  stance: BriefingStance;
  summary: string;
  bullets: string[];
  catalysts: string[];
  risks: string[];
  watch: string[];
};
