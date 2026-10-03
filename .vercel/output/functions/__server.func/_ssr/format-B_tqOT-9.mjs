//#region node_modules/.nitro/vite/services/ssr/assets/format-B_tqOT-9.js
var INDICES = [
	{
		symbol: "^KS11",
		name: "KOSPI"
	},
	{
		symbol: "^KQ11",
		name: "KOSDAQ"
	},
	{
		symbol: "^GSPC",
		name: "S&P 500"
	},
	{
		symbol: "^IXIC",
		name: "NASDAQ"
	},
	{
		symbol: "^DJI",
		name: "Dow"
	},
	{
		symbol: "KRW=X",
		name: "USD/KRW"
	}
];
var SECTORS = [
	{
		id: "semiconductor",
		name: "반도체",
		nameEn: "Semiconductors",
		blurb: "메모리, 파운드리, 소부장",
		newsQuery: "반도체 주식 when:14d",
		symbols: [
			"005930.KS",
			"000660.KS",
			"042700.KS",
			"NVDA",
			"TSM",
			"ASML",
			"AVGO",
			"AMD",
			"MU"
		]
	},
	{
		id: "battery",
		name: "2차전지",
		nameEn: "Batteries",
		blurb: "셀·소재·전고체",
		newsQuery: "2차전지 배터리 주식 when:14d",
		symbols: [
			"373220.KS",
			"006400.KS",
			"003670.KS",
			"247540.KQ",
			"086520.KQ",
			"TSLA"
		]
	},
	{
		id: "auto",
		name: "자동차",
		nameEn: "Autos",
		blurb: "완성차와 부품",
		newsQuery: "현대차 기아 자동차 주식 when:14d",
		symbols: [
			"005380.KS",
			"000270.KS",
			"012330.KS",
			"TSLA",
			"TM"
		]
	},
	{
		id: "bio",
		name: "바이오",
		nameEn: "Biopharma",
		blurb: "제약·CDMO·신약",
		newsQuery: "바이오 제약 주식 when:14d",
		symbols: [
			"207940.KS",
			"068270.KS",
			"196170.KQ",
			"LLY",
			"NVO",
			"MRNA"
		]
	},
	{
		id: "finance",
		name: "금융",
		nameEn: "Financials",
		blurb: "은행, 증권, 보험",
		newsQuery: "은행 금융주 when:14d",
		symbols: [
			"105560.KS",
			"055550.KS",
			"086790.KS",
			"323410.KS",
			"JPM",
			"GS"
		]
	},
	{
		id: "platform",
		name: "인터넷",
		nameEn: "Platforms",
		blurb: "검색, 커머스, 콘텐츠",
		newsQuery: "네이버 카카오 주식 when:14d",
		symbols: [
			"035420.KS",
			"035720.KS",
			"259960.KS",
			"GOOGL",
			"META",
			"AMZN"
		]
	},
	{
		id: "defense",
		name: "방산",
		nameEn: "Defense",
		blurb: "항공·함정·지상",
		newsQuery: "방산 수출 주식 when:14d",
		symbols: [
			"012450.KS",
			"047810.KS",
			"079550.KS",
			"064350.KS",
			"LMT",
			"RTX"
		]
	},
	{
		id: "shipbuilding",
		name: "조선·해운",
		nameEn: "Shipbuilding",
		blurb: "수주와 운임",
		newsQuery: "조선 해운 수주 when:14d",
		symbols: [
			"009540.KS",
			"329180.KS",
			"010140.KS",
			"042660.KS",
			"011200.KS"
		]
	},
	{
		id: "energy",
		name: "에너지",
		nameEn: "Energy",
		blurb: "정유·전력·원전",
		newsQuery: "에너지 정유 원전 주식 when:14d",
		symbols: [
			"096770.KS",
			"015760.KS",
			"034020.KS",
			"XOM",
			"NEE"
		]
	},
	{
		id: "ai-software",
		name: "AI 소프트웨어",
		nameEn: "AI Software",
		blurb: "클라우드와 보안",
		newsQuery: "AI 소프트웨어 클라우드 주식 when:14d",
		symbols: [
			"MSFT",
			"PLTR",
			"ORCL",
			"NOW",
			"CRM",
			"CRWD",
			"NVDA"
		]
	}
];
var NAME_OVERRIDES = {
	"^KS11": "KOSPI",
	"^KQ11": "KOSDAQ",
	"^GSPC": "S&P 500",
	"^IXIC": "NASDAQ",
	"^DJI": "Dow",
	"KRW=X": "USD/KRW",
	"005930.KS": "삼성전자",
	"000660.KS": "SK하이닉스",
	"373220.KS": "LG에너지솔루션",
	"207940.KS": "삼성바이오로직스",
	"005380.KS": "현대차",
	"000270.KS": "기아",
	"068270.KS": "셀트리온",
	"105560.KS": "KB금융",
	"035420.KS": "NAVER",
	"006400.KS": "삼성SDI",
	"012330.KS": "현대모비스",
	"055550.KS": "신한지주",
	"066570.KS": "LG전자",
	"096770.KS": "SK이노베이션",
	"035720.KS": "카카오",
	"009540.KS": "HD한국조선해양",
	"329180.KS": "HD현대중공업",
	"010140.KS": "삼성중공업",
	"012450.KS": "한화에어로스페이스",
	"047810.KS": "한국항공우주",
	"079550.KS": "LIG넥스원",
	"064350.KS": "현대로템",
	"042660.KS": "한화오션",
	"011200.KS": "HMM",
	"015760.KS": "한국전력",
	"034020.KS": "두산에너빌리티",
	"003670.KS": "포스코퓨처엠",
	"247540.KQ": "에코프로비엠",
	"086520.KQ": "에코프로",
	"196170.KQ": "알테오젠",
	"042700.KS": "한미반도체",
	"323410.KS": "카카오뱅크",
	"259960.KS": "크래프톤",
	"009150.KS": "삼성전기",
	"018260.KS": "삼성에스디에스",
	"051910.KS": "LG화학",
	NVDA: "엔비디아",
	AAPL: "애플",
	MSFT: "마이크로소프트",
	GOOGL: "알파벳",
	AMZN: "아마존",
	META: "메타",
	TSLA: "테슬라",
	TSM: "TSMC",
	AVGO: "브로드컴",
	AMD: "AMD",
	ASML: "ASML",
	MU: "마이크론",
	LLY: "일라이릴리",
	NVO: "노보노디스크",
	JPM: "JP모건",
	GS: "골드만삭스",
	LMT: "록히드마틴",
	RTX: "RTX",
	XOM: "엑손모빌",
	NEE: "넥스트에라",
	PLTR: "팔란티어",
	ORCL: "오라클",
	NOW: "서비스나우",
	CRM: "세일즈포스",
	CRWD: "크라우드스트라이크",
	MRNA: "모더나",
	TM: "토요타"
};
var DEFAULT_WATCHLIST = [
	{
		symbol: "005930.KS",
		name: "삼성전자"
	},
	{
		symbol: "000660.KS",
		name: "SK하이닉스"
	},
	{
		symbol: "005380.KS",
		name: "현대차"
	},
	{
		symbol: "035420.KS",
		name: "NAVER"
	},
	{
		symbol: "NVDA",
		name: "엔비디아"
	},
	{
		symbol: "AAPL",
		name: "애플"
	}
];
var POPULAR_SEARCHES = [
	{
		label: "삼성전자",
		href: "/company/005930.KS"
	},
	{
		label: "SK하이닉스",
		href: "/company/000660.KS"
	},
	{
		label: "엔비디아",
		href: "/company/NVDA"
	},
	{
		label: "반도체",
		href: "/sector/semiconductor"
	},
	{
		label: "방산",
		href: "/sector/defense"
	},
	{
		label: "2차전지",
		href: "/sector/battery"
	}
];
function displayName(symbol, fallback) {
	return NAME_OVERRIDES[symbol] ?? fallback ?? symbol;
}
function findSector(id) {
	return SECTORS.find((s) => s.id === id) ?? null;
}
function matchSectors(query) {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return SECTORS.filter((s) => s.name.includes(query.trim()) || s.nameEn.toLowerCase().includes(q) || s.id.includes(q) || s.blurb.includes(query.trim()));
}
var KRW_NO_DECIMAL = /* @__PURE__ */ new Set([
	"KRW",
	"JPY",
	"VND"
]);
function formatPrice(value, currency = "USD") {
	if (value == null || Number.isNaN(value)) return "—";
	if (currency === "INDEX" || currency === "FX") return new Intl.NumberFormat("ko-KR", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	}).format(value);
	const digits = KRW_NO_DECIMAL.has(currency) ? 0 : value >= 1e3 ? 2 : value >= 1 ? 2 : 4;
	try {
		return new Intl.NumberFormat("ko-KR", {
			style: "currency",
			currency,
			currencyDisplay: "narrowSymbol",
			maximumFractionDigits: digits,
			minimumFractionDigits: KRW_NO_DECIMAL.has(currency) ? 0 : Math.min(2, digits)
		}).format(value);
	} catch {
		return value.toLocaleString("ko-KR", { maximumFractionDigits: digits });
	}
}
function formatNumber(value, digits = 2) {
	if (value == null || Number.isNaN(value)) return "—";
	return new Intl.NumberFormat("ko-KR", {
		maximumFractionDigits: digits,
		minimumFractionDigits: 0
	}).format(value);
}
function formatCompact(value) {
	if (value == null || Number.isNaN(value)) return "—";
	return new Intl.NumberFormat("ko-KR", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(value);
}
function formatPercent(value) {
	if (value == null || Number.isNaN(value)) return "—";
	return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
function signedClass(value) {
	if (value == null || Number.isNaN(value) || value === 0) return "text-muted-foreground";
	return value > 0 ? "text-up" : "text-down";
}
function formatTimeAgo(iso) {
	if (!iso) return "";
	const t = new Date(iso).getTime();
	if (Number.isNaN(t)) return "";
	const diff = Date.now() - t;
	const min = Math.round(diff / 6e4);
	if (min < 1) return "방금";
	if (min < 60) return `${min}분 전`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `${hr}시간 전`;
	const day = Math.round(hr / 24);
	if (day < 7) return `${day}일 전`;
	return new Intl.DateTimeFormat("ko-KR", {
		month: "short",
		day: "numeric"
	}).format(t);
}
function currencyFor(symbol, fallback = "USD") {
	if (symbol === "KRW=X") return "FX";
	if (symbol.endsWith(".KS") || symbol.endsWith(".KQ") || symbol === "^KS11" || symbol === "^KQ11") return "KRW";
	if (symbol.startsWith("^")) return "INDEX";
	return fallback;
}
//#endregion
export { currencyFor as a, formatCompact as c, formatPrice as d, formatTimeAgo as f, SECTORS as i, formatNumber as l, signedClass as m, INDICES as n, displayName as o, matchSectors as p, POPULAR_SEARCHES as r, findSector as s, DEFAULT_WATCHLIST as t, formatPercent as u };
