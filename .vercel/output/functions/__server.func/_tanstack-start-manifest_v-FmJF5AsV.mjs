//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-FmJF5AsV.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/company/$symbol",
			"/sector/$id"
		],
		preloads: [
			"/assets/index-DoTGAR04.js",
			"/assets/utils-DquNU7o9.js",
			"/assets/preload-helper-C8OwLRyM.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DoTGAR04.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DWIiHe4K.js",
			"/assets/report-list-DE-R6j6x.js",
			"/assets/watchlist-Do9CM3Hj.js",
			"/assets/quote-row-CRnbYeaa.js"
		]
	},
	"/company/$symbol": {
		filePath: "/workspace/src/routes/company.$symbol.tsx",
		children: void 0,
		preloads: [
			"/assets/company._symbol-CHpaYO4-.js",
			"/assets/report-list-DE-R6j6x.js",
			"/assets/watchlist-Do9CM3Hj.js"
		]
	},
	"/sector/$id": {
		filePath: "/workspace/src/routes/sector.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/sector._id-CjcjUE-o.js",
			"/assets/report-list-DE-R6j6x.js",
			"/assets/quote-row-CRnbYeaa.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
