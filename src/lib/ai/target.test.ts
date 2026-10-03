import assert from "node:assert/strict";
import test from "node:test";
import { BriefingTarget } from "./target.ts";
test("browser context and cache keys cannot enter the analysis endpoint", () => {
  assert.equal(
    BriefingTarget.safeParse({ kind: "market", context: "invented prices", cacheKey: "victim" })
      .success,
    false,
  );
  assert.equal(
    BriefingTarget.safeParse({ title: "fake", context: "fake", cacheKey: "victim" }).success,
    false,
  );
});
test("only bounded identifiers are accepted", () => {
  assert.deepEqual(BriefingTarget.parse({ kind: "company", symbol: "005930.KS" }), {
    kind: "company",
    symbol: "005930.KS",
  });
  assert.equal(
    BriefingTarget.safeParse({ kind: "company", symbol: "https://evil.test" }).success,
    false,
  );
  assert.equal(BriefingTarget.safeParse({ kind: "sector", id: "../private" }).success, false);
});
