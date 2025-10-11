import { drizzle } from "drizzle-orm/better-sqlite3";
import { postsTable } from "./schemas";
import Database from "better-sqlite3";
import { resolve } from "path";

const sqliteDataBasePath = resolve(process.cwd(), "db.sqlite3");
const sqliteDataBase = new Database(sqliteDataBasePath);

export const drizzleDb = drizzle(sqliteDataBase, {
  schema: {
    posts: postsTable,
  },
  logger: true,
});
