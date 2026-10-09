import type { MetadataRoute } from "next";
import { findAllPublicPostsCached } from "@/lib/post/queries";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await findAllPublicPostsCached();
  return [
    { url: new URL("/", siteUrl).href, changeFrequency: "weekly", priority: 1 },
    ...posts.map((post) => ({
      url: new URL(`/post/${post.slug}`, siteUrl).href,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

