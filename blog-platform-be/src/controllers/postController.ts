import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PostService } from '../services/post.service';
import { AppError } from '../utils/AppError';

// Get all posts
export const getPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const userId = req.user?.id;

    const result = await PostService.getAllPosts(page, limit, search, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw new AppError('Failed to fetch posts', 500);
  }
});

// Get post by ID
export const getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.id);
    const post = await PostService.getPostById(postId);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    throw new AppError('Post not found', 404);
  }
});

// Create new post
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const { title, content, published, categoryIds } = req.body;

    const post = await PostService.createPost({
      title,
      content,
      published,
      authorId: req.user.id,
      categoryIds,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    throw new AppError('Failed to create post', 400);
  }
});

// Update post
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const postId = Number(req.params.id);
    const { title, content, published, categoryIds } = req.body;

    const updatedPost = await PostService.updatePost(postId, req.user.id, {
      title,
      content,
      published,
      categoryIds,
    });

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    throw new AppError('Post not found or you are not authorized to update this post', 404);
  }
});

// Delete post
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const postId = Number(req.params.id);
    await PostService.deletePost(postId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    throw new AppError('Post not found or you are not authorized to delete this post', 404);
  }
});
