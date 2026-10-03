import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/search-bar";

export function AppShell({
  children,
  compactSearch = false,
}: {
  children: ReactNode;
  compactSearch?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
          <Link to="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-display text-xl font-medium tracking-tight">마켓브리프</span>
            <span className="hidden text-xs tracking-wide text-muted-foreground sm:inline">리서치 데스크</span>
          </Link>
          {compactSearch ? (
            <div className="min-w-0 flex-1">
              <SearchBar size="md" />
            </div>
          ) : null}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</div>
    </div>
  );
}
