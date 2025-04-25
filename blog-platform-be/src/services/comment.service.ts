import { CommentModel } from '../models/comment.model';

export class CommentService {
  // Get all comments for a post
  static async getCommentsByPostId(postId: number) {
    return CommentModel.findByPostId(postId);
  }

  // Create a new comment
  static async createComment(data: { content: string; postId: number; authorId: number }) {
    return CommentModel.create(data);
  }

  // Delete a comment
  static async deleteComment(commentId: number) {
    return CommentModel.delete(commentId);
  }

  // Check if user is allowed to modify comment
  static async canModifyComment(commentId: number, userId: number) {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return { allowed: false, reason: 'Comment not found' };
    }

    // Regular users can only modify their own comments
    if (comment.author?.id !== userId) {
      return { allowed: false, reason: 'Not authorized to modify this comment' };
    }

    return { allowed: true };
  }
}
