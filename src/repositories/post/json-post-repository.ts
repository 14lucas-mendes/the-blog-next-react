import type { PostModel, PostSummaryModel } from "@/models/post/post-model";
import type { PostRepository, PublicPostPagination } from "./post-repository";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

const postsFilePath = resolve(process.cwd(), "src/db/seed/posts.json");

export class JsonPostRepository implements PostRepository {
  private async readFromDisk(): Promise<PostModel[]> {
    const { posts } = JSON.parse(await readFile(postsFilePath, "utf8")) as { posts: PostModel[] };
    return posts;
  }

  async findAllPublic({ limit, offset = 0 }: PublicPostPagination = {}): Promise<PostSummaryModel[]> {
    const posts = (await this.findAll()).filter((post) => post.published);
    return posts.slice(offset, limit === undefined ? undefined : offset + limit).map((post) => ({
      id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl, published: post.published,
      createdAt: post.createdAt, updatedAt: post.updatedAt, author: post.author,
    }));
  }

  async findAll(): Promise<PostModel[]> {
    return (await this.readFromDisk()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    );
  }

  async findById(id: string): Promise<PostModel | undefined> {
    return (await this.findAll()).find((post) => post.id === id);
  }

  async findBySlugPublic(slug: string): Promise<PostModel | undefined> {
    return (await this.findAll()).find((post) => post.published && post.slug === slug);
  }
}

