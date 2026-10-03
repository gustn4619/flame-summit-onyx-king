import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { guardedGeneration, type QueryClient } from "./guard.ts";
import type { GroundedReport } from "./evidence.ts";

const pg = new PGlite();
await pg.exec(
  await readFile(new URL("../../../migrations/0002_ai_requests.sql", import.meta.url), "utf8"),
);
const sql: QueryClient = {
  query: async <T>(text: string, params?: unknown[]) => (await pg.query<T>(text, params)).rows,
};
const claim = { text: "검사 전용", sourceIds: ["S1"] };
const report: GroundedReport = {
  headline: claim,
  summary: claim,
  points: [claim],
  risks: [],
  watch: [],
  evidence: {
    target: "test",
    title: "검사",
    asOf: new Date().toISOString(),
    sources: [],
    limitations: [],
  },
  generatedAt: new Date().toISOString(),
};
const limits = { dailyCalls: 20, dailyBudgetCents: 500, reserveCents: 25 };
const reset = () => pg.exec("truncate ai_budget, ai_requests, ai_clients");

test("durable guard reservations", async (t) => {
  await t.test("same request in flight starts only one generation", async () => {
    await reset();
    let resolve!: (v: GroundedReport) => void;
    let started!: () => void;
    let calls = 0;
    const ready = new Promise<void>((r) => {
      started = r;
    });
    const first = guardedGeneration(sql, "same", "a", () => {
      calls++;
      started();
      return new Promise((r) => {
        resolve = r;
      });
    });
    await ready;
    await assert.rejects(
      guardedGeneration(sql, "same", "b", async () => {
        calls++;
        return report;
      }),
      /이미 분석 중/,
    );
    resolve(report);
    await first;
    assert.equal(calls, 1);
  });
  await t.test(
    "successful cache is shared across client objects without charging again",
    async () => {
      await reset();
      let calls = 0;
      await guardedGeneration(sql, "cached", "a", async () => {
        calls++;
        return report;
      });
      const result = await guardedGeneration({ ...sql }, "cached", "b", async () => {
        calls++;
        return report;
      });
      assert.equal(result.cached, true);
      assert.equal(calls, 1);
      assert.equal(
        (await sql.query<{ calls: number }>("select calls from ai_budget"))[0]!.calls,
        1,
      );
    },
  );
  await t.test("fourth request from same browser is rejected", async () => {
    await reset();
    for (let i = 0; i < 3; i++) await guardedGeneration(sql, `key${i}`, "a", async () => report);
    await assert.rejects(
      guardedGeneration(sql, "fourth", "a", async () => report),
      /브라우저/,
    );
  });
  await t.test("daily requests and reserved budget independently prevent model calls", async () => {
    for (const policy of [
      { ...limits, dailyCalls: 1 },
      { ...limits, dailyBudgetCents: 25 },
    ]) {
      await reset();
      await guardedGeneration(sql, "one", "a", async () => report, policy);
      let called = false;
      await assert.rejects(
        guardedGeneration(
          sql,
          "two",
          "b",
          async () => {
            called = true;
            return report;
          },
          policy,
        ),
        /오늘/,
      );
      assert.equal(called, false);
    }
  });
  await t.test("global concurrency limit spans different requests and clients", async () => {
    await reset();
    const releases: (() => void)[] = [];
    const running: Promise<unknown>[] = [];
    for (let i = 0; i < 2; i++) {
      let ready!: () => void;
      const start = new Promise<void>((r) => {
        ready = r;
      });
      running.push(
        guardedGeneration(
          sql,
          `pending${i}`,
          `client${i}`,
          () =>
            new Promise((resolve) => {
              releases.push(() => resolve(report));
              ready();
            }),
        ),
      );
      await start;
    }
    await assert.rejects(
      guardedGeneration(sql, "third", "c", async () => report),
      /현재 분석/,
    );
    releases.forEach((r) => r());
    await Promise.all(running);
  });
  await t.test("failed attempts consume allowance and release the in-flight slot", async () => {
    await reset();
    await assert.rejects(
      guardedGeneration(sql, "failure", "a", async () => {
        throw new Error("timeout");
      }),
    );
    assert.equal((await sql.query<{ calls: number }>("select calls from ai_budget"))[0]!.calls, 1);
    assert.equal((await sql.query("select * from ai_requests")).length, 0);
    assert.equal((await guardedGeneration(sql, "failure", "a", async () => report)).cached, false);
  });
  await t.test("expired leases recover after a crashed worker", async () => {
    await reset();
    await sql.query("select ai_claim('grounded-ai-v1','old','a','owner',20,500,25)");
    await sql.query("update ai_requests set expires_at=clock_timestamp()-interval '1 second'");
    assert.equal((await guardedGeneration(sql, "old", "b", async () => report)).cached, false);
  });
  await t.test("Korean calendar day rollover resets the daily allowance", async () => {
    await reset();
    await guardedGeneration(sql, "yesterday", "a", async () => report);
    await sql.query("update ai_budget set day=day-1,calls=20,reserved_cents=500");
    await guardedGeneration(sql, "today", "b", async () => report);
    assert.equal((await sql.query<{ calls: number }>("select calls from ai_budget"))[0]!.calls, 1);
  });
  await pg.close();
});
