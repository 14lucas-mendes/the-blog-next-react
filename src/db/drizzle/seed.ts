import { JsonPostRepository } from "@/repositories/post/json-post-repository";
import { postsTable } from "./schemas";
import { drizzleDb } from ".";

async () => {
  const jsonPostRepository = new JsonPostRepository();

  const posts = await new JsonPostRepository().findAll();

  try {
    await drizzleDb.insert(postsTable).values(posts);
  } catch (e) {
    console.error("Error seeding posts:", e);
  }
};
