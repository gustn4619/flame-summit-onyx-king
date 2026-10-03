import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BriefingPanel } from "@/components/briefing-panel";
import { QuoteRow } from "@/components/quote-row";
import { ReportList } from "@/components/report-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getReports, getSectorSnapshot } from "@/lib/finance/api";
import { formatPercent } from "@/lib/finance/format";

export const Route = createFileRoute("/sector/$id")({ component: SectorPage });

function SectorPage() {
  const { id } = Route.useParams();
  const sector = useQuery({
    queryKey: ["sector", id],
    queryFn: () => getSectorSnapshot({ data: { id } }),
  });
  const reports = useQuery({
    queryKey: ["sector-reports", id, sector.data?.newsQuery],
    queryFn: () =>
      getReports({
        data: { query: sector.data?.newsQuery ?? id },
      }),
    enabled: Boolean(sector.data),
  });

  return (
    <AppShell compactSearch>
      {sector.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : null}
      {sector.isError ? (
        <div className="py-16 text-center">
          <h1 className="font-display text-2xl">섹터를 찾지 못했습니다</h1>
          <Button asChild className="mt-6">
            <Link to="/">대시보드로</Link>
          </Button>
        </div>
      ) : null}
      {sector.data ? (
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {sector.data.nameEn}
            </p>
            <div className="mt-1 flex flex-wrap items-end gap-3">
              <h1 className="font-display text-4xl font-medium tracking-tight">
                {sector.data.name}
              </h1>
              <Badge variant={sector.data.changePercent >= 0 ? "up" : "down"}>
                평균 {formatPercent(sector.data.changePercent)}
              </Badge>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {sector.data.blurb}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
            <Card>
              <CardHeader>
                <CardTitle>구성 종목</CardTitle>
                <CardDescription>대표 종목의 당일 등락</CardDescription>
              </CardHeader>
              <CardContent>
                {sector.data.quotes.map((q) => (
                  <QuoteRow key={q.symbol} quote={q} />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>섹터 헤드라인</CardTitle>
                <CardDescription>관련 뉴스를 모아 두었습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <ReportList reports={reports.data ?? []} />
                )}
              </CardContent>
            </Card>
          </div>

          <BriefingPanel target={{ kind: "sector", id }} />
          <p className="text-xs text-muted-foreground">
            구성 종목 평균은 시가총액 가중이 아닌 단순 평균입니다
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}
