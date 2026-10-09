import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "../src/lib/site-config.ts";

test("production requires an explicit public URL", () => {
  for (const SITE_URL of [undefined, "", "   "]) {
    assert.throws(() => getSiteUrl({ NODE_ENV: "production", SITE_URL }), /SITE_URL é obrigatória/);
  }
  assert.equal(getSiteUrl({ NODE_ENV: "production", SITE_URL: "https://blog.example.com" }).origin, "https://blog.example.com");
});

test("development falls back to localhost and configured URLs must use HTTP or HTTPS", () => {
  assert.equal(getSiteUrl({ NODE_ENV: "development" }).origin, "http://localhost:3000");
  assert.equal(getSiteUrl({ SITE_URL: " http://localhost:4000 " }).origin, "http://localhost:4000");
  assert.throws(() => getSiteUrl({ SITE_URL: "ftp://example.com" }), /HTTP ou HTTPS/);
  assert.throws(() => getSiteUrl({ SITE_URL: "invalid-url" }), TypeError);
});
