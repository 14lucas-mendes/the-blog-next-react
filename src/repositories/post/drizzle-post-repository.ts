import type { PostModel, PostSummaryModel } from "@/models/post/post-model";
import type { BlogDatabase } from "@/db/drizzle/connection";
import type { PostRepository, PublicPostPagination } from "./post-repository";
import { drizzleDb } from "@/db/drizzle";

export class DrizzlePostRepository implements PostRepository {
  constructor(private readonly db: BlogDatabase = drizzleDb) {}

  async findAllPublic({ limit, offset = 0 }: PublicPostPagination = {}): Promise<PostSummaryModel[]> {
    return this.db.query.posts.findMany({
      columns: { content: false },
      orderBy: (posts, { desc }) => [desc(posts.createdAt), desc(posts.id)],
      where: (posts, { eq }) => eq(posts.published, true),
      limit: limit ?? (offset > 0 ? Number.MAX_SAFE_INTEGER : undefined),
      offset,
    });
  }

  async findBySlugPublic(slug: string): Promise<PostModel | undefined> {
    return this.db.query.posts.findFirst({
      where: (posts, { eq, and }) => and(eq(posts.published, true), eq(posts.slug, slug)),
    });
  }

  async findAll(): Promise<PostModel[]> {
    return this.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt), desc(posts.id)],
    });
  }

  async findById(id: string): Promise<PostModel | undefined> {
    return this.db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });
  }
}

