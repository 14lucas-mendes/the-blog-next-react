import { postRepository } from "@/repositories/post";

export default async function PostsList() {
  const post = await postRepository.findAll();

  return (
    <div>
    {post.map(post => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
}