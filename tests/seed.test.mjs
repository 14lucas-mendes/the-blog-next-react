import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

function command(path, database) {
  return spawnSync(process.execPath, ["--import", "./scripts/register-typescript.mjs", path], {
    encoding: "utf8",
    env: { ...process.env, DATABASE_PATH: database },
  });
}

test("the seed CLI inserts once, can be rerun and preserves edited posts", () => {
  const folder = mkdtempSync(join(tmpdir(), "blog-seed-"));
  const path = join(folder, "posts.sqlite3");
  try {
    let result = command("src/db/drizzle/migrate.ts", path);
    assert.equal(result.status, 0, result.stderr);
    result = command("src/db/drizzle/seed.ts", path);
    assert.equal(result.status, 0, result.stderr);
    const db = new DatabaseSync(path);
    try {
      assert.equal(db.prepare("SELECT count(*) AS count FROM posts").get().count, 10);
      const row = db.prepare("SELECT id FROM posts LIMIT 1").get();
      db.prepare("UPDATE posts SET content = ? WHERE id = ?").run("Edited body", row.id);
      result = command("src/db/drizzle/seed.ts", path);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(db.prepare("SELECT count(*) AS count FROM posts").get().count, 10);
      assert.equal(db.prepare("SELECT content FROM posts WHERE id = ?").get(row.id).content, "Edited body");
    } finally {
      db.close();
    }
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("the seed CLI exits unsuccessfully when migrations have not been applied", () => {
  const folder = mkdtempSync(join(tmpdir(), "blog-seed-error-"));
  try {
    const result = command("src/db/drizzle/seed.ts", join(folder, "unmigrated.sqlite3"));
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Falha ao popular o banco/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
