import { PostModel } from '@/models/post/post-models';

export interface PostRepository {
  findAll(): Promise<PostModel[]>;
}