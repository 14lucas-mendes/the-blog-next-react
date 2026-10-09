import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { postsTable } from "./schemas";

export function createDatabase(path: string) {
  const sqlite = new Database(path);
  const db = drizzle(sqlite, { schema: { posts: postsTable } });
  return { sqlite, db };
}

export type BlogDatabase = ReturnType<typeof createDatabase>["db"];

