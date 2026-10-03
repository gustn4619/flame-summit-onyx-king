import { Link } from "@tanstack/react-router";
import { Sparkline } from "@/components/sparkline";
import { formatPercent, formatPrice, signedClass } from "@/lib/finance/format";
import type { Quote } from "@/lib/finance/types";
import { cn } from "@/lib/utils";

export function QuoteRow({ quote }: { quote: Quote }) {
  const inner = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{quote.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{quote.symbol}</span>
      </span>
      <Sparkline values={quote.spark} positive={quote.changePercent >= 0} className="hidden sm:block" />
      <span className="w-24 text-right">
        <span className="block font-medium tabular-nums">{formatPrice(quote.price, quote.currency)}</span>
        <span className={cn("block text-xs tabular-nums", signedClass(quote.changePercent))}>
          {formatPercent(quote.changePercent)}
        </span>
      </span>
    </>
  );

  const cls =
    "flex min-h-14 items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-accent";

  return (
    <Link to="/company/$symbol" params={{ symbol: quote.symbol }} className={cls}>
      {inner}
    </Link>
  );
}
