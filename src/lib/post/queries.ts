import { postRepository } from "@/repositories/post";
import { createPostQueries } from "./create-post-queries";

export const {
  findAllPublicPostsCached, findPublicPostPageCached, findPostBySlugCached, findPostByIdCached,
} = createPostQueries(postRepository);

