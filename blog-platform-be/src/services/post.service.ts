import { PostModel } from '../models/post.model';
import { AppError } from '../utils/AppError';

interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
  authorId: number;
  categoryIds?: number[];
}

interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
  categoryIds?: number[];
}

export class PostService {
  // Get all posts
  static async getAllPosts(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    userId?: number
  ) {
    return PostModel.findAll(page, limit, search, userId);
  }

  // Get post by ID
  static async getPostById(postId: number) {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  }

  // Create new post
  static async createPost(postData: CreatePostData) {
    // Create the post
    const post = await PostModel.create({
      title: postData.title,
      content: postData.content,
      published: postData.published || false,
      authorId: postData.authorId,
    });

    if (!post) {
      throw new AppError('Failed to create post', 400);
    }

    return post;
  }

  // Update post
  static async updatePost(postId: number, userId: number, updateData: UpdatePostData) {
    // Update post
    const updatedPost = await PostModel.update(postId, userId, updateData);

    if (!updatedPost) {
      throw new AppError('Post not found or you are not authorized to update this post', 404);
    }

    return updatedPost;
  }

  // Delete post
  static async deletePost(postId: number, userId: number) {
    const deleted = await PostModel.delete(postId, userId);

    if (!deleted) {
      throw new AppError('Post not found or you are not authorized to delete this post', 404);
    }

    return true;
  }
}
