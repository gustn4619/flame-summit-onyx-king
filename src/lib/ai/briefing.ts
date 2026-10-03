import { createServerFn } from "@tanstack/react-start";
import { BriefingTarget } from "./target";

export const briefingEvidenceFn = createServerFn({ method: "POST" })
  .validator(BriefingTarget)
  .handler(async ({ data }) => {
    const { marketEvidence } = await import("./sources.server");
    const { aiAvailability } = await import("./service.server");
    return { evidence: await marketEvidence(data), unavailable: aiAvailability() };
  });

export const generateBriefing = createServerFn({ method: "POST" })
  .validator(BriefingTarget)
  .handler(async ({ data }) => {
    const { marketEvidence } = await import("./sources.server");
    const { generateGrounded, aiAvailability } = await import("./service.server");
    const { publicAiError } = await import("./guard");
    const unavailable = aiAvailability();
    if (unavailable) return { ok: false as const, error: unavailable };
    try {
      return { ok: true as const, ...(await generateGrounded(await marketEvidence(data))) };
    } catch (error) {
      return { ok: false as const, error: publicAiError(error) };
    }
  });
