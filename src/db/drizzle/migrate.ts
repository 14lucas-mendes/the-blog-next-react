import { resolve } from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzleDb, sqliteDatabase } from ".";

try {
  migrate(drizzleDb, { migrationsFolder: resolve("src/db/drizzle/migrations") });
  console.info("Migrações aplicadas.");
} finally {
  sqliteDatabase.close();
}

