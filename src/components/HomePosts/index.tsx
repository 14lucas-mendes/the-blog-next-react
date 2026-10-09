import { PostFeatured } from "@/components/PostFeatured";
import PostsList from "@/components/PostsList";
import type { PostSummaryModel } from "@/models/post/post-model";
import Link from "next/link";

type HomePostsProps = { posts: PostSummaryModel[]; page: number; hasNextPage: boolean };

export function HomePosts({ posts, page, hasNextPage }: HomePostsProps) {

  if (posts.length === 0) {
    return (
      <section className="mb-16 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Nenhuma publicação encontrada</h1>
        <p>Novas publicações aparecerão aqui.</p>
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

