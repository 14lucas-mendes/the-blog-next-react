import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/drizzle/migrations",
  schema: "./src/db/drizzle/schemas.ts",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DATABASE_PATH ?? "./db.sqlite3" },
});

