import { SinglePost } from "@/components/SinglePost";
import { findPostBySlugCached } from "@/lib/post/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
type PostSlugPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PostSlugPageProps): Promise<Metadata> {
  const post = await findPostBySlugCached((await params).slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/post/${post.slug}` },
    openGraph: {
      type: "article", title: post.title, description: post.excerpt,
      url: `/post/${post.slug}`, images: [{ url: post.coverImageUrl, alt: post.title }],
      publishedTime: post.createdAt, modifiedTime: post.updatedAt, authors: [post.author],
    },
    twitter: {
      card: "summary_large_image", title: post.title,
      description: post.excerpt, images: [post.coverImageUrl],
    },
  };
}

export default async function PostSlugPage({ params }: PostSlugPageProps) {
  const { slug } = await params;
  const post = await findPostBySlugCached(slug);
  return <SinglePost post={post} />;
}

