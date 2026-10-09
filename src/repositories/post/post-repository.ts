import type { PostModel, PostSummaryModel } from "@/models/post/post-model";

export type PublicPostPagination = { limit?: number; offset?: number };

export interface PostRepository {
  findAllPublic(pagination?: PublicPostPagination): Promise<PostSummaryModel[]>;
  findAll(): Promise<PostModel[]>;
  findById(id: string): Promise<PostModel | undefined>;
  findBySlugPublic(slug: string): Promise<PostModel | undefined>;
}

