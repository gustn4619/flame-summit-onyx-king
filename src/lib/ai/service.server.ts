import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { Evidence } from "./evidence";
import { AiError, browserIdentity, guardedGeneration } from "./guard";
import { callModel, evidenceKey, modelPayload } from "./model.server";

export function aiAvailability(): string | null {
  if (!process.env.XAI_API_KEY)
    return "AI 연결이 설정되지 않았습니다. 아래에서 실제 근거 자료를 확인할 수 있습니다.";
  if (!process.env.DATABASE_URL?.trim())
    return "AI 사용량을 안전하게 기록할 저장소가 설정되지 않았습니다. 근거 자료만 표시합니다.";
  return null;
}

export async function generateGrounded(evidence: Evidence) {
  const unavailable = aiAvailability();
  if (unavailable) throw new AiError(unavailable);
  modelPayload(evidence); // Reject oversized/empty input before quota reservation.
  const identity = browserIdentity(getCookie("ai_browser"), process.env.XAI_API_KEY!);
  if (identity.fresh)
    setCookie("ai_browser", identity.cookie, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400,
    });
  const { getSql } = await import("../db");
  return guardedGeneration(await getSql(), evidenceKey(evidence), identity.hash, () =>
    callModel(evidence, process.env.XAI_API_KEY!),
  );
}
