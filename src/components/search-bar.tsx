import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Layers3, Search, X } from "lucide-react";
import { searchMarkets } from "@/lib/finance/api";
import { POPULAR_SEARCHES } from "@/lib/finance/catalog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { SearchHit } from "@/lib/finance/types";

export function SearchBar({ autoFocus = false, size = "lg" }: { autoFocus?: boolean; size?: "lg" | "md" }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [debounced, setDebounced] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const search = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchMarkets({ data: { q: debounced } }),
    enabled: debounced.length >= 1,
  });

  const hits = search.data ?? [];
  const showPopular = open && !debounced;
  const showHits = open && debounced.length >= 1;

  function go(hit: SearchHit) {
    setOpen(false);
    setQ("");
    if (hit.kind === "sector" && hit.sectorId) {
      void navigate({ to: "/sector/$id", params: { id: hit.sectorId } });
      return;
    }
    if (hit.symbol) {
      void navigate({ to: "/company/$symbol", params: { symbol: hit.symbol } });
    }
  }

  function goHref(href: string) {
    setOpen(false);
    setQ("");
    const parts = href.split("/").filter(Boolean);
    if (parts[0] === "sector" && parts[1]) {
      void navigate({ to: "/sector/$id", params: { id: parts[1] } });
    } else if (parts[0] === "company" && parts[1]) {
      void navigate({ to: "/company/$symbol", params: { symbol: decodeURIComponent(parts[1]) } });
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = hits[active];
      if (hit) go(hit);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        autoFocus={autoFocus}
        placeholder="기업, 섹터, 티커 검색"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        role="combobox"
        className={cn("pl-10 pr-10", size === "lg" && "h-12 rounded-lg text-base")}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
      />
      {q ? (
        <button
          type="button"
          aria-label="검색어 지우기"
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setQ("")}
        >
          <X className="size-4" />
        </button>
      ) : null}

      {showPopular ? (
        <div className="absolute z-40 mt-2 w-full rounded-xl bg-popover p-3 shadow-[var(--shadow-border)]">
          <p className="px-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">자주 찾는 검색</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((p) => (
              <button
                key={p.href}
                type="button"
                className="h-9 rounded-full bg-muted px-3 text-sm text-foreground hover:bg-accent"
                onClick={() => goHref(p.href)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showHits ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-popover py-2 shadow-[var(--shadow-border)]"
        >
          {search.isFetching && !hits.length ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">검색 중…</li>
          ) : null}
          {!search.isFetching && !hits.length ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">일치하는 기업이나 섹터가 없습니다</li>
          ) : null}
          {hits.map((hit, i) => (
            <li key={`${hit.kind}-${hit.symbol ?? hit.sectorId}`}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent",
                  i === active && "bg-accent",
                )}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(hit)}
              >
                {hit.kind === "sector" ? (
                  <Layers3 className="size-4 text-steel" />
                ) : (
                  <Building2 className="size-4 text-muted-foreground" />
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{hit.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{hit.subtitle}</span>
                </span>
                <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  {hit.kind === "sector" ? "섹터" : "기업"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
