import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { 
  getCommentsByPost,
  createComment,
  deleteComment
} from '../controllers/commentController';
import { validateRequest } from '../middleware/validateRequest';
import { commentIdSchema, createCommentSchema, postIdSchema } from '../validators/commentsValidators';

const router = express.Router();

// @route   GET /api/posts/:postId/comments
// @desc    Get comments for a post
// @access  Public
router.get('/:postId/comments', validateRequest(postIdSchema, 'params'), getCommentsByPost);

// @route   POST /api/posts/:postId/comments
// @desc    Create a new comment
// @access  Private
router.post('/:postId/comments', authenticate, validateRequest(createCommentSchema, 'body'), createComment);

// @route   DELETE /api/posts/:postId/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:postId/comments/:commentId', authenticate, validateRequest(commentIdSchema, 'params'), deleteComment);

export default router; 