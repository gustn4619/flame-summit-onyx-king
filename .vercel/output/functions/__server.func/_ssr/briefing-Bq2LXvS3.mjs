import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-Bq2LXvS3.js
var briefingCache = /* @__PURE__ */ new Map();
var Stance = _enum([
	"bullish",
	"neutral",
	"bearish"
]);
var BriefingSchema = object({
	headline: string(),
	stance: Stance,
	summary: string(),
	bullets: array(string()).max(8),
	catalysts: array(string()).max(6),
	risks: array(string()).max(6),
	watch: array(string()).max(6)
});
function extractJson(text) {
	const fenced = text.match(/```json([\s\S]*?)```/);
	const raw = fenced ? fenced[1] : text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end < 0) throw new Error("JSON not found");
	return JSON.parse(raw.slice(start, end + 1));
}
var generateBriefing_createServerFn_handler = createServerRpc({
	id: "c266ecd774c5be816c0892635bf6ae862dfa47058039fdecccd9e474485f64c6",
	name: "generateBriefing",
	filename: "src/lib/ai/briefing.ts"
}, (opts) => generateBriefing.__executeServer(opts));
var generateBriefing = createServerFn({ method: "POST" }).validator(object({
	title: string().min(1).max(120),
	context: string().min(1).max(8e3),
	cacheKey: string().min(1).max(80)
})).handler(generateBriefing_createServerFn_handler, async ({ data }) => {
	const cached = briefingCache.get(data.cacheKey);
	if (cached && Date.now() - cached.at < 18e5) return {
		ok: true,
		briefing: cached.value,
		cached: true
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI 브리핑을 이 환경에서 사용할 수 없습니다"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .3,
			max_tokens: 1200,
			messages: [{
				role: "system",
				content: "당신은 한국 주식 리서치 애널리스트입니다. 제공된 시세와 뉴스만 근거로 간결한 브리핑을 JSON으로 작성합니다. 가격 예측이나 매수/매도 권유는 하지 않습니다. 모든 문자열은 한국어입니다."
			}, {
				role: "user",
				content: `대상: ${data.title}\n\n자료:\n${data.context}\n\n다음 JSON만 반환하세요:\n{"headline":"한 줄 헤드라인","stance":"bullish|neutral|bearish","summary":"3~5문장 개요","bullets":["핵심 포인트"],"catalysts":["단기 촉매"],"risks":["리스크"],"watch":["앞으로 볼 것"]}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `브리핑 생성에 실패했습니다 (${res.status})`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		const parsed = BriefingSchema.parse(extractJson(text));
		const briefing = {
			...parsed,
			stance: parsed.stance
		};
		briefingCache.set(data.cacheKey, {
			at: Date.now(),
			value: briefing
		});
		return {
			ok: true,
			briefing,
			cached: false
		};
	} catch {
		return {
			ok: false,
			error: "브리핑 형식을 해석하지 못했습니다"
		};
	}
});
//#endregion
export { generateBriefing_createServerFn_handler };
