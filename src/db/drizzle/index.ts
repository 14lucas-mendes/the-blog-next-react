import { resolve } from "node:path";
import { createDatabase } from "./connection";

const databasePath = resolve(process.env.DATABASE_PATH ?? "db.sqlite3");
const { sqlite, db } = createDatabase(databasePath);

export const sqliteDatabase = sqlite;
export const drizzleDb = db;

