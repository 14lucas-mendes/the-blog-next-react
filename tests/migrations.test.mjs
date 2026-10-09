import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const migrations = new URL("../src/db/drizzle/migrations/", import.meta.url);
const journal = JSON.parse(readFileSync(new URL("meta/_journal.json", migrations), "utf8"));

function applyMigration(db, entry) {
  db.exec(readFileSync(new URL(`${entry.tag}.sql`, migrations), "utf8"));
}

test("migrations store article content independently of its creation date", () => {
  const db = new DatabaseSync(":memory:");
  try {
    for (const entry of journal.entries) applyMigration(db, entry);
    db.prepare(`INSERT INTO posts
      (id, slug, title, author, excerpt, content, cover_image_url, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      "1", "article", "Article", "Author", "Summary", "**Article body**",
      "/image.png", 1, "2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z",
    );
    const post = db.prepare("SELECT content, created_at FROM posts").get();
    assert.equal(post.content, "**Article body**");
    assert.equal(post.created_at, "2026-01-01T00:00:00Z");
  } finally {
    db.close();
  }
});

test("upgrading an existing database preserves posts and their creation dates", () => {
  const db = new DatabaseSync(":memory:");
  try {
    applyMigration(db, journal.entries[0]);
    db.exec(`INSERT INTO posts VALUES
      ('1', 'legacy', 'Legacy', 'Author', 'Summary', '2025-01-01T00:00:00Z', '/image.png', 1, '2025-01-01T00:00:00Z')`);
    for (const entry of journal.entries.slice(1)) applyMigration(db, entry);
    const post = db.prepare("SELECT slug, created_at, content FROM posts").get();
    assert.equal(post.slug, "legacy");
    assert.equal(post.created_at, "2025-01-01T00:00:00Z");
    assert.equal(post.content, "");
  } finally {
    db.close();
  }
});
