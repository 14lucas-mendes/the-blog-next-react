import type { PostSummaryModel } from "@/models/post/post-model";
import { PostCoverImage } from "../PostCoverImage";
import { PostSummary } from "../PostSummary";

export function PostFeatured({ post }: { post?: PostSummaryModel }) {
  if (!post) return null;
  const postLink = `/post/${post.slug}`;
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 group">
      <PostCoverImage
        linkProps={{ href: postLink }}
        imageProps={{
          width: 1200, height: 720, src: post.coverImageUrl, alt: post.title,
          priority: true,
          sizes: "(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw",
        }}
      />
      <PostSummary postLink={postLink} postHeading="h2" createdAt={post.createdAt}
        title={post.title} excerpt={post.excerpt} />
    </section>
  );
}

