import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PostService } from '../services/post.service';

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
    res.status(500);
    throw error;
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
    res.status(404);
    throw error;
  }
});

// Create new post
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
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
    res.status(400);
    throw error;
  }
});

// Update post
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
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
    res.status(404);
    throw error;
  }
});

// Delete post
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  try {
    const postId = Number(req.params.id);
    await PostService.deletePost(postId, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(404);
    throw error;
  }
}); 