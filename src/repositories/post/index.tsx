import { DrizzlePostRepository } from "./drizzle-post-repository";
import type { PostRepository } from "./post-repository";
import { drizzleDb } from "@/db/drizzle";

export const postRepository: PostRepository = new DrizzlePostRepository(drizzleDb);

