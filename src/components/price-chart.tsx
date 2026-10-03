import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getChart } from "@/lib/finance/api";
import { formatPrice } from "@/lib/finance/format";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const RANGES = [
  { id: "1d", label: "1일" },
  { id: "5d", label: "5일" },
  { id: "1mo", label: "1개월" },
  { id: "3mo", label: "3개월" },
  { id: "1y", label: "1년" },
  { id: "5y", label: "5년" },
] as const;

export function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("3mo");
  const chart = useQuery({
    queryKey: ["chart", symbol, range],
    queryFn: () => getChart({ data: { symbol, range } }),
  });

  const points = chart.data?.points ?? [];
  const first = points[0]?.close;
  const last = points[points.length - 1]?.close;
  const up = (last ?? 0) >= (first ?? 0);
  const stroke = up ? "var(--color-up)" : "var(--color-down)";
  const data = useMemo(
    () =>
      points.map((p) => ({
        t: p.t,
        close: p.close,
        label: new Date(p.t).toLocaleDateString("ko-KR", {
          month: "short",
          day: "numeric",
          ...(range === "1d" ? { hour: "2-digit", minute: "2-digit" } : {}),
        }),
      })),
    [points, range],
  );

  return (
    <div>
      <Tabs value={range} onValueChange={(v) => setRange(v as typeof range)}>
        <TabsList>
          {RANGES.map((r) => (
            <TabsTrigger key={r.id} value={r.id}>
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-4 h-56 sm:h-72">
        {chart.isLoading ? <Skeleton className="h-full w-full rounded-lg" /> : null}
        {chart.isError ? (
          <p className="flex h-full items-center text-sm text-muted-foreground">차트를 불러오지 못했습니다</p>
        ) : null}
        {!chart.isLoading && data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--color-muted-foreground)" }}
                formatter={(value) => [
                  formatPrice(Number(value), chart.data?.currency ?? "USD"),
                  "종가",
                ]}
              />
              <Area type="monotone" dataKey="close" stroke={stroke} fill="url(#fill)" strokeWidth={1.8} />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}
