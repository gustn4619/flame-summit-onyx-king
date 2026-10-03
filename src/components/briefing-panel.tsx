import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateBriefing } from "@/lib/ai/briefing";
import type { Briefing, Report } from "@/lib/finance/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stanceLabel = {
  bullish: "우호",
  neutral: "중립",
  bearish: "경계",
} as const;

function stanceVariant(stance: Briefing["stance"]) {
  if (stance === "bullish") return "up" as const;
  if (stance === "bearish") return "down" as const;
  return "steel" as const;
}

export function BriefingPanel({
  title,
  cacheKey,
  contextParts,
}: {
  title: string;
  cacheKey: string;
  contextParts: () => string;
}) {
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateBriefing({
        data: { title, context: contextParts(), cacheKey },
      });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setBriefing(result.briefing);
    } catch {
      setError("브리핑을 만들지 못했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>AI 브리핑</CardTitle>
          <CardDescription>수집된 시세와 헤드라인을 바탕으로 요약합니다. 투자 권유가 아닙니다.</CardDescription>
        </div>
        <Button onClick={() => void run()} disabled={loading} size="sm">
          <Sparkles />
          {loading ? "작성 중" : briefing ? "다시 생성" : "브리핑 생성"}
        </Button>
      </CardHeader>
      <CardContent>
        {error ? <p className="text-sm text-down">{error}</p> : null}
        {!briefing && !error ? (
          <p className="text-sm text-muted-foreground">
            버튼을 누르면 오늘 모은 리포트를 한 장의 메모로 정리합니다.
          </p>
        ) : null}
        {briefing ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={stanceVariant(briefing.stance)}>{stanceLabel[briefing.stance]}</Badge>
              <p className="font-display text-xl leading-snug font-medium">{briefing.headline}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{briefing.summary}</p>
            <BriefList label="핵심" items={briefing.bullets} />
            <div className="grid gap-4 sm:grid-cols-3">
              <BriefList label="촉매" items={briefing.catalysts} />
              <BriefList label="리스크" items={briefing.risks} />
              <BriefList label="관찰 포인트" items={briefing.watch} />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function BriefList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function reportsToContext(reports: Report[]) {
  return reports
    .slice(0, 12)
    .map((r) => `- ${r.title} (${r.source}${r.publishedAt ? `, ${r.publishedAt.slice(0, 10)}` : ""})`)
    .join("\n");
}
