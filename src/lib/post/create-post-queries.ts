import type { PostRepository } from "@/repositories/post/post-repository";
import { POSTS_PER_PAGE } from "@/utils/pagination";
import { notFound } from "next/navigation";
import { cache } from "react";

export function createPostQueries(repository: PostRepository) {
  const findAllPublicPostsCached = cache(
    async (limit?: number, offset = 0) => repository.findAllPublic({ limit, offset }),
  );

  const findPublicPostPageCached = cache(async (page: number) => {
    const results = await findAllPublicPostsCached(POSTS_PER_PAGE + 1, (page - 1) * POSTS_PER_PAGE);
    if (page > 1 && results.length === 0) notFound();
    return { posts: results.slice(0, POSTS_PER_PAGE), hasNextPage: results.length > POSTS_PER_PAGE };
  });

  const findPostBySlugCached = cache(async (slug: string) => {
    const post = await repository.findBySlugPublic(slug);
    if (!post) notFound();
    return post;
  });

  const findPostByIdCached = cache(async (id: string) => repository.findById(id));

  return { findAllPublicPostsCached, findPublicPostPageCached, findPostBySlugCached, findPostByIdCached };
}
