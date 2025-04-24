import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authenticate, setUser } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  createPostSchema,
  updatePostSchema,
  getPostByIdSchema,
  getPostsQuerySchema,
} from '../validators/postValidators';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', setUser, validateRequest(getPostsQuerySchema, 'query'), getPosts);

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', validateRequest(getPostByIdSchema, 'params'), getPostById);

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, validateRequest(createPostSchema), createPost);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  '/:id',
  authenticate,
  validateRequest(updatePostSchema),
  updatePost
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', validateRequest(getPostByIdSchema, 'params'), authenticate, deletePost);

export default router; 