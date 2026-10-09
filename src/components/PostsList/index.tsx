import type { PostSummaryModel } from "@/models/post/post-model";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";

export default function PostsList({ posts }: { posts: PostSummaryModel[] }) {
  return (
    <div className="grid grid-cols-1 mb-16 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => {
        const postLink = `/post/${post.slug}`;
        return (
          <article className="flex flex-col group gap-4" key={post.id}>
            <PostCoverImage linkProps={{ href: postLink }} imageProps={{
              width: 1200, height: 720, src: post.coverImageUrl, alt: post.title,
              sizes: "(min-width: 1024px) 320px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
            }} />
            <PostSummary postLink={postLink} postHeading="h2" createdAt={post.createdAt}
              title={post.title} excerpt={post.excerpt} />
          </article>
        );
      })}
    </div>
  );
}

