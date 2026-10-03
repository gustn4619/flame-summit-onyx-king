const KRW_NO_DECIMAL = new Set(["KRW", "JPY", "VND"]);

export function formatPrice(value: number | null | undefined, currency = "USD") {
  if (value == null || Number.isNaN(value)) return "—";
  if (currency === "INDEX" || currency === "FX") {
    return new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }
  const digits = KRW_NO_DECIMAL.has(currency) ? 0 : value >= 1000 ? 2 : value >= 1 ? 2 : 4;
  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: digits,
      minimumFractionDigits: KRW_NO_DECIMAL.has(currency) ? 0 : Math.min(2, digits),
    }).format(value);
  } catch {
    return value.toLocaleString("ko-KR", { maximumFractionDigits: digits });
  }
}

export function formatNumber(value: number | null | undefined, digits = 2) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function signedClass(value: number | null | undefined) {
  if (value == null || Number.isNaN(value) || value === 0) return "text-muted-foreground";
  return value > 0 ? "text-up" : "text-down";
}

export function formatTimeAgo(iso: string | null) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const min = Math.round(diff / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}일 전`;
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(t);
}

export function isIndexSymbol(symbol: string) {
  return symbol.startsWith("^") || symbol.endsWith("=X");
}

export function currencyFor(symbol: string, fallback = "USD") {
  if (symbol === "KRW=X") return "FX";
  if (symbol.startsWith("^")) return "INDEX";
  if (symbol.endsWith(".KS") || symbol.endsWith(".KQ") || symbol.endsWith(".KN")) return "KRW";
  return fallback;
}
