import type { Claim, Evidence, GroundedReport } from "@/lib/ai/evidence";
import { SOURCE_LABEL } from "@/lib/ai/evidence";

export function EvidenceView({ evidence }: { evidence: Evidence }) {
  return (
    <div className="space-y-4 text-sm">
      <p className="font-medium">분석 근거 · {evidence.title}</p>
      <p className="text-xs opacity-70">
        자료 확인: {new Date(evidence.asOf).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}{" "}
        (한국 시간)
      </p>
      <ul className="space-y-1 text-xs opacity-70">
        {evidence.limitations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {!evidence.sources.length ? <p>확인 가능한 근거 자료가 없습니다.</p> : null}
      <div className="space-y-3">
        {evidence.sources.map((source) => (
          <details key={source.id} className="rounded-lg border border-border p-3">
            <summary className="cursor-pointer leading-relaxed">
              [{source.id}] {source.title}{" "}
              <span className="ml-2 text-xs opacity-70">{SOURCE_LABEL[source.kind]}</span>
            </summary>
            <p className="mt-2 text-xs opacity-70">
              {source.publishedAt ? `발표·접수: ${source.publishedAt}` : "원본 기준시각 미제공"}
            </p>
            <p className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-relaxed">
              {source.text}
            </p>
            <a
              className="mt-3 inline-block underline underline-offset-4"
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              근거 원문 열기 ↗
            </a>
          </details>
        ))}
      </div>
    </div>
  );
}

function CitedClaim({ claim, evidence }: { claim: Claim; evidence: Evidence }) {
  return (
    <div className="text-sm leading-relaxed">
      <p>{claim.text}</p>
      <div className="mt-1 flex flex-wrap gap-3">
        {claim.sourceIds.map((id) => {
          const source = evidence.sources.find((s) => s.id === id);
          return source ? (
            <a
              key={id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
              title={source.title}
            >
              [{id}] 근거
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}
export function GroundedReportView({ report }: { report: GroundedReport }) {
  return (
    <div className="space-y-5">
      <CitedClaim claim={report.headline} evidence={report.evidence} />
      <CitedClaim claim={report.summary} evidence={report.evidence} />
      {(
        [
          ["핵심", report.points],
          ["리스크", report.risks],
          ["확인할 사항", report.watch],
        ] as const
      ).map(([label, claims]) =>
        claims.length ? (
          <section key={label} className="space-y-3">
            <h3 className="font-medium">{label}</h3>
            {claims.map((claim, index) => (
              <CitedClaim key={index} claim={claim} evidence={report.evidence} />
            ))}
          </section>
        ) : null,
      )}
      <EvidenceView evidence={report.evidence} />
    </div>
  );
}
