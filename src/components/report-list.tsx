import { ExternalLink } from "lucide-react";
import { formatTimeAgo } from "@/lib/finance/format";
import type { Report } from "@/lib/finance/types";

export function ReportList({ reports, empty }: { reports: Report[]; empty?: string }) {
  if (!reports.length) {
    return <p className="py-10 text-sm text-muted-foreground">{empty ?? "수집된 리포트가 없습니다"}</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {reports.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 py-3.5 transition-colors duration-150 hover:text-steel"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] leading-snug font-medium">{r.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {r.source}
                {r.publishedAt ? ` · ${formatTimeAgo(r.publishedAt)}` : ""}
              </span>
            </span>
            <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </a>
        </li>
      ))}
    </ul>
  );
}
