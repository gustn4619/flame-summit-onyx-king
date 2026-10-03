import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_WATCHLIST } from "@/lib/finance/catalog";

export type WatchItem = { symbol: string; name: string };

type WatchState = {
  items: WatchItem[];
  hydrated: boolean;
  setHydrated: () => void;
  add: (item: WatchItem) => void;
  remove: (symbol: string) => void;
  has: (symbol: string) => boolean;
};

export const useWatchlist = create<WatchState>()(
  persist(
    (set, get) => ({
      items: DEFAULT_WATCHLIST,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      add: (item) => {
        if (get().items.some((x) => x.symbol === item.symbol)) return;
        set({ items: [...get().items, item] });
      },
      remove: (symbol) => set({ items: get().items.filter((x) => x.symbol !== symbol) }),
      has: (symbol) => get().items.some((x) => x.symbol === symbol),
    }),
    {
      name: "marketbrief-watchlist",
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
