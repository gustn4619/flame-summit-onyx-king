import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { GroundedReport } from "./evidence.ts";
export interface QueryClient {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
}
export const AI_SCOPE = "grounded-ai-v1";
export class AiError extends Error {}
export function publicAiError(error: unknown): string {
  return error instanceof AiError
    ? error.message
    : "분석을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}
export const LIMITS = { dailyCalls: 20, dailyBudgetCents: 500, reserveCents: 25 };
export const LIMIT_MESSAGE: Record<string, string> = {
  busy: "같은 자료를 이미 분석 중입니다. 잠시 후 다시 확인해 주세요.",
  concurrency: "현재 분석 요청이 많습니다. 잠시 후 다시 시도해 주세요.",
  client: "이 브라우저의 분석 횟수 제한에 도달했습니다. 10분 후 다시 시도해 주세요.",
  daily: "오늘의 AI 사용 한도에 도달했습니다. 내일 다시 이용해 주세요.",
};
export function browserIdentity(cookie: string | undefined, secret: string) {
  const sign = (id: string) =>
    createHmac("sha256", secret).update(`ai-browser:${id}`).digest("hex");
  const parts = cookie?.split(".") ?? [];
  const valid =
    /^[a-f0-9-]{36}$/.test(parts[0] ?? "") &&
    /^[a-f0-9]{64}$/.test(parts[1] ?? "") &&
    timingSafeEqual(Buffer.from(parts[1]!), Buffer.from(sign(parts[0]!)));
  const id = valid ? parts[0]! : randomUUID();
  return { cookie: `${id}.${sign(id)}`, hash: sign(id), fresh: !valid };
}

export async function guardedGeneration(
  sql: QueryClient,
  key: string,
  client: string,
  generate: () => Promise<GroundedReport>,
  limits = LIMITS,
) {
  const owner = randomUUID();
  const [row] = await sql.query<{ decision: { status: string; result?: GroundedReport } }>(
    "select ai_claim($1,$2,$3,$4,$5,$6,$7) as decision",
    [AI_SCOPE, key, client, owner, limits.dailyCalls, limits.dailyBudgetCents, limits.reserveCents],
  );
  const decision = row?.decision;
  if (decision?.status === "cached" && decision.result)
    return { report: decision.result, cached: true };
  if (decision?.status !== "claimed")
    throw new AiError(
      LIMIT_MESSAGE[decision?.status ?? ""] ?? "AI 사용 한도를 확인하지 못했습니다.",
    );
  try {
    const report = await generate();
    await sql.query(
      "update ai_requests set result=$4::jsonb, expires_at=clock_timestamp()+interval '30 minutes' where scope=$1 and cache_key=$2 and owner=$3",
      [AI_SCOPE, key, owner, JSON.stringify(report)],
    );
    return { report, cached: false };
  } finally {
    // Failed or timed-out attempts remain charged to the daily/client allowance.
    await sql.query(
      "delete from ai_requests where scope=$1 and cache_key=$2 and owner=$3 and result is null",
      [AI_SCOPE, key, owner],
    );
  }
}
