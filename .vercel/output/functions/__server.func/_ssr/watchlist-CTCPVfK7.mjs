import { t as DEFAULT_WATCHLIST } from "./format-B_tqOT-9.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watchlist-CTCPVfK7.js
var useWatchlist = create()(persist((set, get) => ({
	items: DEFAULT_WATCHLIST,
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	add: (item) => {
		if (get().items.some((x) => x.symbol === item.symbol)) return;
		set({ items: [...get().items, item] });
	},
	remove: (symbol) => set({ items: get().items.filter((x) => x.symbol !== symbol) }),
	has: (symbol) => get().items.some((x) => x.symbol === symbol)
}), {
	name: "marketbrief-watchlist",
	partialize: (s) => ({ items: s.items }),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
//#endregion
export { useWatchlist as t };
