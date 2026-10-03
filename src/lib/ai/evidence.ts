import { z } from "zod";

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  kind: "filing-excerpt" | "filing-title" | "news-title" | "market-data";
  publishedAt: string | null;
  text: string;
}
export interface Evidence {
  target: string;
  title: string;
  asOf: string;
  sources: EvidenceSource[];
  limitations: string[];
}
const Claim = z
  .object({
    text: z.string().trim().min(1).max(700),
    sourceIds: z.array(z.string()).min(1).max(6),
  })
  .strict();
export const ReportSchema = z
  .object({
    headline: Claim,
    summary: Claim,
    points: z.array(Claim).min(1).max(4),
    risks: z.array(Claim).max(3),
    watch: z.array(Claim).max(3),
  })
  .strict();
export type Claim = z.infer<typeof Claim>;
export type GroundedReport = z.infer<typeof ReportSchema> & {
  evidence: Evidence;
  generatedAt: string;
};

export function safeSourceUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function validateReport(raw: string, evidence: Evidence): GroundedReport {
  // Truncation and unknown fields fail closed; never repair incomplete model output.
  const report = ReportSchema.parse(JSON.parse(raw));
  const ids = new Set(evidence.sources.map((source) => source.id));
  for (const claim of [
    report.headline,
    report.summary,
    ...report.points,
    ...report.risks,
    ...report.watch,
  ]) {
    if (claim.sourceIds.some((id) => !ids.has(id))) {
      throw new Error("AI 결과에 확인되지 않은 출처가 포함되어 있습니다.");
    }
  }
  return { ...report, evidence, generatedAt: new Date().toISOString() };
}

export const SOURCE_LABEL: Record<EvidenceSource["kind"], string> = {
  "filing-excerpt": "공시 본문 발췌",
  "filing-title": "공시 제목만 확인",
  "news-title": "뉴스 제목만 확인",
  "market-data": "수치 자료",
};
