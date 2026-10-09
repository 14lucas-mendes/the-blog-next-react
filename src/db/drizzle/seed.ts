import { JsonPostRepository } from "@/repositories/post/json-post-repository";
import { drizzleDb, sqliteDatabase } from ".";
import { postsTable } from "./schemas";

async function seed() {
  const posts = await new JsonPostRepository().findAll();
  if (posts.length === 0) return;
  drizzleDb.transaction((tx) => {
    for (const post of posts) {
      tx.insert(postsTable).values(post).onConflictDoNothing().run();
    }
  });
  console.info("Seed concluído. Publicações existentes foram preservadas.");
}

seed().catch((error: unknown) => {
  console.error("Falha ao popular o banco:", error);
  process.exitCode = 1;
}).finally(() => {
  sqliteDatabase.close();
});

