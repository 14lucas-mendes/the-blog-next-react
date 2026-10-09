import assert from "node:assert/strict";
import { resolve } from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import test from "node:test";
import { createDatabase } from "../src/db/drizzle/connection.ts";
import { postsTable } from "../src/db/drizzle/schemas.ts";
import { DrizzlePostRepository } from "../src/repositories/post/drizzle-post-repository.ts";
import { JsonPostRepository } from "../src/repositories/post/json-post-repository.ts";
import { createPostQueries } from "../src/lib/post/create-post-queries.ts";

const post = (id, published = true) => ({
  id, slug: `post-${id}`, title: `Post ${id}`, author: "Author", excerpt: "Summary",
  content: "**Markdown body**", coverImageUrl: "/image.png", published,
  createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z",
});

async function withRepository(run) {
  const { sqlite, db } = createDatabase(":memory:");
  try {
    migrate(db, { migrationsFolder: resolve("src/db/drizzle/migrations") });
    db.insert(postsTable).values([post("1"), post("2", false), post("3"), post("4")]).run();
    await run(new DrizzlePostRepository(db));
  } finally {
    sqlite.close();
  }
}

test("public queries exclude drafts, paginate deterministically and omit article bodies", async () => {
  await withRepository(async (repo) => {
    const first = await repo.findAllPublic({ limit: 2 });
    const second = await repo.findAllPublic({ limit: 2, offset: 2 });
    assert.deepEqual(first.map((item) => item.id), ["4", "3"]);
    assert.deepEqual(second.map((item) => item.id), ["1"]);
    assert.equal(Object.hasOwn(first[0], "content"), false);
    assert.equal((await repo.findAll()).length, 4);
    assert.deepEqual((await repo.findAllPublic({ offset: 1 })).map((item) => item.id), ["3", "1"]);
  });
});

test("reading a post preserves its body and date and treats absence as undefined", async () => {
  await withRepository(async (repo) => {
    const result = await repo.findBySlugPublic("post-1");
    assert.equal(result.content, "**Markdown body**");
    assert.equal(result.createdAt, "2026-01-01T00:00:00Z");
    assert.equal(await repo.findBySlugPublic("post-2"), undefined);
    assert.equal(await repo.findBySlugPublic("missing"), undefined);
    assert.equal(await repo.findById("missing"), undefined);
    assert.equal((await repo.findById("2")).published, false);
  });
});

test("public page queries keep full and final pages and reject pages beyond the last", async () => {
  const { sqlite, db } = createDatabase(":memory:");
  try {
    migrate(db, { migrationsFolder: resolve("src/db/drizzle/migrations") });
    db.insert(postsTable).values([
      ...Array.from({ length: 11 }, (_, index) => post(String(index))), post("draft", false),
    ]).run();
    const queries = createPostQueries(new DrizzlePostRepository(db));
    const first = await queries.findPublicPostPageCached(1);
    const last = await queries.findPublicPostPageCached(2);
    assert.equal(first.posts.length, 10);
    assert.equal(first.hasNextPage, true);
    assert.equal(last.posts.length, 1);
    assert.equal(last.hasNextPage, false);
    assert.equal(new Set([...first.posts, ...last.posts].map((item) => item.id)).size, 11);
    assert.equal(Object.hasOwn(first.posts[0], "content"), false);
    await assert.rejects(queries.findPublicPostPageCached(3), (error) => error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
  } finally {
    sqlite.close();
  }
});

test("JSON and SQLite repositories agree on access to drafts and missing posts", async () => {
  const repo = new JsonPostRepository();
  const draft = (await repo.findAll()).find((item) => !item.published);
  assert.ok(draft);
  assert.equal((await repo.findById(draft.id)).id, draft.id);
  assert.equal(await repo.findBySlugPublic(draft.slug), undefined);
  assert.equal(await repo.findById("missing"), undefined);
  const summaries = await repo.findAllPublic({ limit: 2 });
  assert.equal(summaries.length, 2);
  assert.equal(Object.hasOwn(summaries[0], "content"), false);
});
