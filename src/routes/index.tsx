import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bookmark } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BriefingPanel } from "@/components/briefing-panel";
import { QuoteRow } from "@/components/quote-row";
import { ReportList } from "@/components/report-list";
import { SearchBar } from "@/components/search-bar";
import { Sparkline } from "@/components/sparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllSectors, getMarketReports, getMarketTape, getQuotes } from "@/lib/finance/api";
import { formatPercent, formatPrice, signedClass } from "@/lib/finance/format";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const watch = useWatchlist((s) => s.items);
  const tape = useQuery({ queryKey: ["tape"], queryFn: () => getMarketTape() });
  const sectors = useQuery({ queryKey: ["sectors"], queryFn: () => getAllSectors() });
  const reports = useQuery({ queryKey: ["market-reports"], queryFn: () => getMarketReports() });
  const watchSymbols = watch.map((w) => w.symbol).join(",");
  const watchQuotes = useQuery({
    queryKey: ["watch", watchSymbols],
    queryFn: () => getQuotes({ data: { symbols: watchSymbols } }),
    enabled: watch.length > 0,
  });

  const quoteMap = new Map((watchQuotes.data ?? []).map((q) => [q.symbol, q]));

  return (
    <AppShell>
      <section className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.18em] text-steel uppercase">
          Equity research desk
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
          리포트를 모으고,
          <br />
          기업과 섹터를 한눈에.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          시세, 뉴스, 공시성 헤드라인을 모아 요약합니다. 종목명이나 섹터를 검색해 브리핑을
          열어보세요.
        </p>
        <div className="mt-6">
          <SearchBar autoFocus />
        </div>
      </section>

      <section className="mt-8 -mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-3">
          {(tape.data ?? []).length === 0 && tape.isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-40 rounded-xl" />
              ))
            : (tape.data ?? []).map((q) => (
                <div
                  key={q.symbol}
                  className="w-40 rounded-xl bg-card px-3.5 py-3 shadow-[var(--shadow-border)]"
                >
                  <p className="text-xs text-muted-foreground">{q.name}</p>
                  <p className="mt-1 font-medium tabular-nums">
                    {formatPrice(q.price, q.currency)}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={cn("text-xs tabular-nums", signedClass(q.changePercent))}>
                      {formatPercent(q.changePercent)}
                    </span>
                    <Sparkline
                      values={q.spark}
                      positive={q.changePercent >= 0}
                      className="h-5 w-12"
                    />
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(sectors.data ?? []).map((s) => (
          <Link
            key={s.id}
            to="/sector/$id"
            params={{ id: s.id }}
            className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{s.name}</p>
              <Badge variant={s.changePercent >= 0 ? "up" : "down"}>
                {formatPercent(s.changePercent)}
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.blurb}</p>
          </Link>
        ))}
        {sectors.isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : null}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-steel" />
              <CardTitle className="text-base">관심 종목</CardTitle>
            </div>
            <CardDescription>검색한 기업에서 별표로 추가할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            {watch.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">관심 종목이 없습니다</p>
            ) : (
              <div className="flex flex-col">
                {watch.map((item) => {
                  const q = quoteMap.get(item.symbol);
                  if (!q) {
                    return (
                      <Link
                        key={item.symbol}
                        to="/company/$symbol"
                        params={{ symbol: item.symbol }}
                        className="flex min-h-12 items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-accent"
                      >
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.symbol}</span>
                      </Link>
                    );
                  }
                  return <QuoteRow key={item.symbol} quote={{ ...q, name: item.name }} />;
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-end justify-between">
            <div>
              <CardTitle>수집된 헤드라인</CardTitle>
              <CardDescription>국내 증시 관련 뉴스와 리포트를 모았습니다</CardDescription>
            </div>
            <span className="text-xs text-muted-foreground">{reports.data?.length ?? 0}건</span>
          </CardHeader>
          <CardContent>
            {reports.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ReportList reports={(reports.data ?? []).slice(0, 8)} />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <BriefingPanel target={{ kind: "market" }} />
      </section>

      <p className="mt-8 flex items-center gap-1 text-xs text-muted-foreground">
        시세는 지연될 수 있으며 투자 판단의 근거로 사용하지 마세요
        <ArrowRight className="size-3" />
      </p>
    </AppShell>
  );
}
