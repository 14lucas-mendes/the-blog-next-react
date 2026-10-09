import { HomePosts } from "@/components/HomePosts";
import { findPublicPostPageCached } from "@/lib/post/queries";
import { getPageNumber } from "@/utils/pagination";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const page = getPageNumber((await searchParams).page);
  await findPublicPostPageCached(page);
  return { alternates: { canonical: page === 1 ? "/" : `/?page=${page}` } };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = getPageNumber((await searchParams).page);
  const { posts, hasNextPage } = await findPublicPostPageCached(page);
  return <HomePosts posts={posts} page={page} hasNextPage={hasNextPage} />;
}
