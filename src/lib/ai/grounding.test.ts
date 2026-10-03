import assert from "node:assert/strict";
import test from "node:test";
import { safeSourceUrl, validateReport, type Evidence } from "./evidence.ts";
import { callModel, evidenceKey, modelPayload, MAX_OUTPUT_TOKENS } from "./model.server.ts";
import { browserIdentity, publicAiError } from "./guard.ts";

const evidence: Evidence = {
  target: "company:example",
  title: "검사 자료",
  asOf: "2026-10-03T00:01:00Z",
  limitations: ["제목만 확인"],
  sources: [
    {
      id: "S1",
      title: "자료 제목",
      url: "https://example.com/report",
      kind: "news-title",
      publishedAt: null,
      text: "제목만 제공",
    },
  ],
};
const claim = { text: "제목 범위의 요약", sourceIds: ["S1"] };
const report = { headline: claim, summary: claim, points: [claim], risks: [], watch: [] };

test("valid citations retain the exact server evidence", () => {
  const parsed = validateReport(JSON.stringify(report), evidence);
  assert.deepEqual(parsed.evidence, evidence);
});
test("unknown or empty citations are rejected", () => {
  assert.throws(() =>
    validateReport(
      JSON.stringify({ ...report, summary: { ...claim, sourceIds: ["FAKE"] } }),
      evidence,
    ),
  );
  assert.throws(() =>
    validateReport(JSON.stringify({ ...report, summary: { ...claim, sourceIds: [] } }), evidence),
  );
});
test("truncated JSON and model-invented source URLs are rejected", () => {
  assert.throws(() => validateReport(JSON.stringify(report).slice(0, -1), evidence));
  assert.throws(() =>
    validateReport(
      JSON.stringify({ ...report, sources: [{ url: "https://fake.example" }] }),
      evidence,
    ),
  );
});
test("source links reject executable, credentialed and non-HTTPS URLs", () => {
  for (const bad of [
    "javascript:alert(1)",
    "data:text/html,x",
    "http://example.com",
    "https://user:pass@example.com",
  ])
    assert.equal(safeSourceUrl(bad), null);
  assert.equal(safeSourceUrl("https://example.com/news"), "https://example.com/news");
});
test("cache key changes with evidence, target or observation interval", () => {
  const original = evidenceKey(evidence);
  assert.equal(evidenceKey({ ...evidence, asOf: "2026-10-03T00:02:00Z" }), original);
  assert.notEqual(evidenceKey({ ...evidence, asOf: "2026-10-03T00:06:00Z" }), original);
  assert.notEqual(evidenceKey({ ...evidence, target: "other" }), original);
  assert.notEqual(
    evidenceKey({ ...evidence, sources: [{ ...evidence.sources[0]!, text: "changed" }] }),
    original,
  );
});
test("empty or oversized context is rejected before API use", () => {
  assert.throws(() => modelPayload({ ...evidence, sources: [] }));
  assert.throws(() =>
    modelPayload({ ...evidence, sources: [{ ...evidence.sources[0]!, text: "가".repeat(20000) }] }),
  );
  assert.equal(modelPayload(evidence).max_tokens, MAX_OUTPUT_TOKENS);
});
test("length-limited model output is never repaired or retried", async () => {
  let calls = 0;
  await assert.rejects(
    callModel(evidence, "test-key", async () => {
      calls++;
      return new Response(
        JSON.stringify({
          choices: [{ finish_reason: "length", message: { content: JSON.stringify(report) } }],
        }),
      );
    }),
  );
  assert.equal(calls, 1);
});
test("provider errors do not create an automatic paid retry", async () => {
  let calls = 0;
  await assert.rejects(
    callModel(evidence, "test-key", async () => {
      calls++;
      return new Response("bad", { status: 400 });
    }),
  );
  assert.equal(calls, 1);
});
test("provider response goes through citation validation", async () => {
  const result = await callModel(
    evidence,
    "test-key",
    async () =>
      new Response(
        JSON.stringify({
          choices: [{ finish_reason: "stop", message: { content: JSON.stringify(report) } }],
        }),
      ),
  );
  assert.equal(result.summary.sourceIds[0], "S1");
});
test("browser identity validates signatures, not client-supplied IDs", () => {
  const identity = browserIdentity(undefined, "secret");
  assert.equal(browserIdentity(identity.cookie, "secret").hash, identity.hash);
  assert.equal(browserIdentity(identity.cookie, "other-secret").fresh, true);
  assert.equal(browserIdentity(identity.cookie.replace(/.$/, "x"), "secret").fresh, true);
});
test("unexpected infrastructure errors do not expose details", () => {
  assert.doesNotMatch(publicAiError(new Error("postgres://private-secret")), /private-secret/);
});
