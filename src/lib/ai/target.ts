import { z } from "zod";
export const BriefingTarget = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("market") }).strict(),
  z
    .object({
      kind: z.literal("company"),
      symbol: z.string().regex(/^[A-Z0-9^][A-Z0-9.^=-]{0,23}$/),
    })
    .strict(),
  z.object({ kind: z.literal("sector"), id: z.string().regex(/^[a-z-]{1,40}$/) }).strict(),
]);
export type BriefingTarget = z.infer<typeof BriefingTarget>;
