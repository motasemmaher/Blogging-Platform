import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';

// Get comments for a post
export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await CommentService.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = parseInt(req.params.postId);
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const comment = await CommentService.createComment({
      content,
      postId,
      authorId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = parseInt(req.params.commentId);

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if user can modify the comment
    const permission = await CommentService.canModifyComment(commentId, req.user.id);

    if (!permission.allowed) {
      if (permission.reason === 'Comment not found') {
        res.status(404).json({ message: permission.reason });
      } else {
        res.status(403).json({ message: permission.reason || 'Not authorized' });
      }
      return;
    }

    await CommentService.deleteComment(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
