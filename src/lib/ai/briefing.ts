import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Briefing, BriefingStance } from "@/lib/finance/types";

const briefingCache = new Map<string, { at: number; value: Briefing }>();

const Stance = z.enum(["bullish", "neutral", "bearish"]);

const BriefingSchema = z.object({
  headline: z.string(),
  stance: Stance,
  summary: z.string(),
  bullets: z.array(z.string()).max(8),
  catalysts: z.array(z.string()).max(6),
  risks: z.array(z.string()).max(6),
  watch: z.array(z.string()).max(6),
});

function extractJson(text: string) {
  const fenced = text.match(/```json([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("JSON not found");
  return JSON.parse(raw.slice(start, end + 1));
}

export const generateBriefing = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(1).max(120),
      context: z.string().min(1).max(8000),
      cacheKey: z.string().min(1).max(80),
    }),
  )
  .handler(async ({ data }) => {
    const cached = briefingCache.get(data.cacheKey);
    if (cached && Date.now() - cached.at < 30 * 60_000) {
      return { ok: true as const, briefing: cached.value, cached: true };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI 브리핑을 이 환경에서 사용할 수 없습니다" };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.3,
        max_tokens: 1200,
        messages: [
          {
            role: "system",
            content:
              "당신은 한국 주식 리서치 애널리스트입니다. 제공된 시세와 뉴스만 근거로 간결한 브리핑을 JSON으로 작성합니다. 가격 예측이나 매수/매도 권유는 하지 않습니다. 모든 문자열은 한국어입니다.",
          },
          {
            role: "user",
            content: `대상: ${data.title}\n\n자료:\n${data.context}\n\n다음 JSON만 반환하세요:\n{"headline":"한 줄 헤드라인","stance":"bullish|neutral|bearish","summary":"3~5문장 개요","bullets":["핵심 포인트"],"catalysts":["단기 촉매"],"risks":["리스크"],"watch":["앞으로 볼 것"]}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `브리핑 생성에 실패했습니다 (${res.status})` };
    }

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = BriefingSchema.parse(extractJson(text));
      const briefing: Briefing = {
        ...parsed,
        stance: parsed.stance as BriefingStance,
      };
      briefingCache.set(data.cacheKey, { at: Date.now(), value: briefing });
      return { ok: true as const, briefing, cached: false };
    } catch {
      return { ok: false as const, error: "브리핑 형식을 해석하지 못했습니다" };
    }
  });
