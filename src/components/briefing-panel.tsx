import { useState } from "react";
import type { Evidence, GroundedReport } from "@/lib/ai/evidence";
import { EvidenceView, GroundedReportView } from "@/components/ai-evidence";
import { Button } from "@/components/ui/button";
import { briefingEvidenceFn, generateBriefing } from "@/lib/ai/briefing";
import type { BriefingTarget } from "@/lib/ai/target";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function BriefingPanel({ target }: { target: BriefingTarget }) {
  return <BriefingContent key={JSON.stringify(target)} target={target} />;
}
function BriefingContent({ target }: { target: BriefingTarget }) {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [report, setReport] = useState<GroundedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  async function run(analyze: boolean) {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (!analyze) {
        const result = await briefingEvidenceFn({ data: target });
        setEvidence(result.evidence);
        setReport(null);
        setUnavailable(result.unavailable);
      } else {
        const result = await generateBriefing({ data: target });
        if (result.ok) {
          setReport(result.report);
          setCached(result.cached);
        } else setError(result.error);
      }
    } catch {
      setError("근거 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>근거를 확인하는 AI 브리핑</CardTitle>
        <CardDescription>
          서버가 직접 조회한 시세와 뉴스 제목을 사용합니다. 근거 확인은 AI를 호출하지 않습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void run(false)} disabled={loading} variant="secondary">
            {loading ? "확인 중…" : "분석 근거 확인"}
          </Button>
          <Button onClick={() => void run(true)} disabled={loading || !!unavailable}>
            AI 분석 실행
          </Button>
        </div>
        <p className="mt-3 text-xs opacity-70">
          같은 자료의 분석을 재사용합니다. 브라우저별 10분당 3회, 전체 동시 2건·하루 20회 이내로
          제한합니다.
        </p>
        {unavailable || error ? (
          <p role="status" className="mt-3 text-sm opacity-70">
            {error ?? unavailable}
          </p>
        ) : null}
        {report ? (
          <div className="space-y-4">
            <p className="text-xs opacity-70">
              {cached ? "저장된 분석" : "새 분석"} ·{" "}
              {new Date(report.generatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}{" "}
              (한국 시간)
            </p>
            <GroundedReportView report={report} />
          </div>
        ) : evidence ? (
          <EvidenceView evidence={evidence} />
        ) : null}
      </CardContent>
    </Card>
  );
}
