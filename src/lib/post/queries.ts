import { postRepository } from "@/repositories/post";
import { notFound } from "next/navigation";
import { cache } from "react";

export const findAllPublicPostsCached = cache(
  async (limit?: number, offset = 0) => postRepository.findAllPublic({ limit, offset }),
);

export const findPostBySlugCached = cache(async (slug: string) => {
  const post = await postRepository.findBySlugPublic(slug);
  if (!post) notFound();
  return post;
});

export const findPostByIdCached = cache(
  async (id: string) => postRepository.findById(id),
);

