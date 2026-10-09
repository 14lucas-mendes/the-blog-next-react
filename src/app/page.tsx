import { PostFeatured } from "@/components/PostFeatured";
import PostsList from "@/components/PostsList";
import SpinLoader from "@/components/SpinLoader";
import { findAllPublicPostsCached } from "@/lib/post/queries";
import { getPageNumber, POSTS_PER_PAGE } from "@/utils/pagination";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const page = getPageNumber((await searchParams).page);
  return { alternates: { canonical: page === 1 ? "/" : `/?page=${page}` } };
}

async function HomePosts({ page }: { page: number }) {
  const results = await findAllPublicPostsCached(POSTS_PER_PAGE + 1, (page - 1) * POSTS_PER_PAGE);
  const posts = results.slice(0, POSTS_PER_PAGE);
  const hasNextPage = results.length > POSTS_PER_PAGE;

  if (posts.length === 0) {
    return (
      <section className="mb-16 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Nenhuma publicação encontrada</h1>
        <p>{page === 1 ? "Novas publicações aparecerão aqui." : "Não há publicações nesta página."}</p>
        {page > 1 && <Link className="inline-block mt-4 underline" href="/">Voltar ao início</Link>}
      </section>
    );
  }

  return (
    <>
      <h1 className="sr-only">Publicações do The Blog</h1>
      {page === 1 && <PostFeatured post={posts[0]} />}
      <PostsList posts={page === 1 ? posts.slice(1) : posts} />
      <nav aria-label="Paginação de publicações" className="flex justify-between gap-4 mb-16">
        {page > 1 ? (
          <Link rel="prev" href={page === 2 ? "/" : `/?page=${page - 1}`} className="underline">Página anterior</Link>
        ) : <span />}
        <span aria-current="page">Página {page}</span>
        {hasNextPage ? (
          <Link rel="next" href={`/?page=${page + 1}`} className="underline">Próxima página</Link>
        ) : <span />}
      </nav>
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = getPageNumber((await searchParams).page);
  return (
    <Suspense fallback={<SpinLoader className="min-h-20 mb-16" />}>
      <HomePosts page={page} />
    </Suspense>
  );
}

