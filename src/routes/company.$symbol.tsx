import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BriefingPanel, reportsToContext } from "@/components/briefing-panel";
import { PriceChart } from "@/components/price-chart";
import { ReportList } from "@/components/report-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getQuoteDetail, getReports } from "@/lib/finance/api";
import { SECTORS, displayName } from "@/lib/finance/catalog";
import { formatCompact, formatNumber, formatPercent, formatPrice, signedClass } from "@/lib/finance/format";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/$symbol")({ component: CompanyPage });

function CompanyPage() {
  const { symbol: raw } = Route.useParams();
  const symbol = decodeURIComponent(raw);
  const quote = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => getQuoteDetail({ data: { symbol } }),
  });
  const name = displayName(symbol, quote.data?.name);
  const reports = useQuery({
    queryKey: ["reports", symbol],
    queryFn: () =>
      getReports({
        data: {
          query: `${name} 주식 when:14d`,
        },
      }),
  });

  const has = useWatchlist((s) => s.has(symbol));
  const add = useWatchlist((s) => s.add);
  const remove = useWatchlist((s) => s.remove);
  const relatedSectors = SECTORS.filter((s) => s.symbols.includes(symbol));

  return (
    <AppShell compactSearch>
      {quote.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-16 w-72" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : null}
      {quote.isError ? (
        <div className="py-16 text-center">
          <h1 className="font-display text-2xl">종목을 찾지 못했습니다</h1>
          <p className="mt-2 text-sm text-muted-foreground">{symbol}</p>
          <Button asChild className="mt-6">
            <Link to="/">대시보드로</Link>
          </Button>
        </div>
      ) : null}
      {quote.data ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground">
                {quote.data.exchange ?? "EQUITY"} · {symbol}
              </p>
              <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">{name}</h1>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <p className="font-display text-3xl tabular-nums">
                  {formatPrice(quote.data.price, quote.data.currency)}
                </p>
                <p className={cn("pb-1 text-lg tabular-nums", signedClass(quote.data.changePercent))}>
                  {formatPercent(quote.data.changePercent)}
                </p>
              </div>
              {relatedSectors.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedSectors.map((s) => (
                    <Link key={s.id} to="/sector/$id" params={{ id: s.id }}>
                      <Badge variant="steel">{s.name}</Badge>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <Button
              variant={has ? "secondary" : "outline"}
              onClick={() => (has ? remove(symbol) : add({ symbol, name }))}
            >
              {has ? <BookmarkCheck /> : <Bookmark />}
              {has ? "관심 해제" : "관심 추가"}
            </Button>
          </div>

          <Card>
            <CardContent className="pt-5">
              <PriceChart symbol={symbol} />
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="전일 대비"
              value={`${quote.data.change > 0 ? "+" : ""}${formatPrice(quote.data.change, quote.data.currency)}`}
            />
            <Stat
              label="52주 범위"
              value={`${formatNumber(quote.data.fiftyTwoWeekLow)} – ${formatNumber(quote.data.fiftyTwoWeekHigh)}`}
            />
            <Stat
              label="당일 범위"
              value={
                quote.data.dayLow != null
                  ? `${formatNumber(quote.data.dayLow)} – ${formatNumber(quote.data.dayHigh)}`
                  : "—"
              }
            />
            <Stat label="거래량" value={formatCompact(quote.data.volume)} />
          </div>

          <BriefingPanel
            title={`${name} (${symbol})`}
            cacheKey={`co:${symbol}:${new Date().toISOString().slice(0, 10)}`}
            contextParts={() => {
              const q = quote.data;
              if (!q) return "";
              return [
                `가격 ${q.price} ${q.currency}, 등락 ${q.changePercent.toFixed(2)}%`,
                `52주 ${q.fiftyTwoWeekLow}–${q.fiftyTwoWeekHigh}, 거래량 ${q.volume ?? "n/a"}`,
                "헤드라인:",
                reportsToContext(reports.data ?? []),
              ].join("\n");
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle>수집된 리포트</CardTitle>
              <CardDescription>공개 뉴스와 헤드라인을 모았습니다</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <ReportList reports={reports.data ?? []} />
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
