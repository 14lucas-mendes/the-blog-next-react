import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull().default(""),
  coverImageUrl: text("cover_image_url").notNull(),
  published: integer("published", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (posts) => [
  index("posts_published_created_at_idx").on(posts.published, posts.createdAt, posts.id),
]);

export type PostTableSelectModel = typeof postsTable.$inferSelect;
export type PostTableInsertModel = typeof postsTable.$inferInsert;

