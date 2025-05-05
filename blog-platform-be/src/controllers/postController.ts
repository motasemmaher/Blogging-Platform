import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PostService } from '../services/post.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

/**
 * Get all posts with pagination, filtering and search
 */
export const getPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const userId = req.user?.id;

    logger.debug('Getting posts', { page, limit, search, userId });
    const result = await PostService.getAllPosts(page, limit, search, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Failed to fetch posts', { error });
    throw new AppError('Failed to fetch posts', 500);
  }
});

/**
 * Get a single post by ID
 */
export const getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.id);
    logger.debug('Getting post by ID', { postId });
    const post = await PostService.getPostById(postId);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    logger.error('Failed to get post', { error, postId: req.params.id });
    throw new AppError('Post not found', 404);
  }
});

/**
 * Create a new blog post
 */
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const { title, content, published, categoryIds } = req.body;
    logger.debug('Creating post', { title, published, authorId: req.user.id });

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
    logger.error('Failed to create post', { error, body: req.body });
    throw new AppError('Failed to create post', 400);
  }
});

/**
 * Update an existing blog post
 */
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const postId = Number(req.params.id);
    const { title, content, published, categoryIds } = req.body;
    
    logger.debug('Updating post', { postId, userId: req.user.id });

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
    logger.error('Failed to update post', { error, postId: req.params.id });
    throw new AppError('Post not found or you are not authorized to update this post', 404);
  }
});

/**
 * Delete a blog post
 */
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const postId = Number(req.params.id);
    logger.debug('Deleting post', { postId, userId: req.user.id });
    
    await PostService.deletePost(postId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete post', { error, postId: req.params.id });
    throw new AppError('Post not found or you are not authorized to delete this post', 404);
  }
});
