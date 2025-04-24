import { CommentService } from '../../../services/comment.service';
import { CommentModel } from '../../../models/comment.model';

// Mock the CommentModel
jest.mock('../../../models/comment.model');

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsByPostId', () => {
    it('should get all comments for a post successfully', async () => {
      // Mock data
      const mockComments = [
        { id: 1, content: 'Comment 1', postId: 1 },
        { id: 2, content: 'Comment 2', postId: 1 },
      ];

      // Mock return value
      (CommentModel.findByPostId as jest.Mock).mockResolvedValue(mockComments);

      // Call the service
      const result = await CommentService.getCommentsByPostId(1);

      // Assertions
      expect(CommentModel.findByPostId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockComments);
    });
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      // Mock data
      const mockComment = {
        id: 1,
        content: 'New Comment',
        postId: 1,
        authorId: 1,
      };

      // Mock return value
      (CommentModel.create as jest.Mock).mockResolvedValue(mockComment);

      // Call the service
      const result = await CommentService.createComment({
        content: 'New Comment',
        postId: 1,
        authorId: 1,
      });

      // Assertions
      expect(CommentModel.create).toHaveBeenCalledWith({
        content: 'New Comment',
        postId: 1,
        authorId: 1,
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      // Mock return value
      (CommentModel.delete as jest.Mock).mockResolvedValue(true);

      // Call the service
      const result = await CommentService.deleteComment(1);

      // Assertions
      expect(CommentModel.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });

  describe('canModifyComment', () => {
    it('should return allowed:true if user is the author', async () => {
      // Mock data
      const mockComment = {
        id: 1,
        content: 'Comment',
        postId: 1,
        author: {
          id: 1,
          name: 'User',
        },
      };

      // Mock return value
      (CommentModel.findById as jest.Mock).mockResolvedValue(mockComment);

      // Call the service
      const result = await CommentService.canModifyComment(1, 1);

      // Assertions
      expect(CommentModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ allowed: true });
    });

    it('should return allowed:false if comment not found', async () => {
      // Mock return value
      (CommentModel.findById as jest.Mock).mockResolvedValue(null);

      // Call the service
      const result = await CommentService.canModifyComment(1, 1);

      // Assertions
      expect(CommentModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ allowed: false, reason: 'Comment not found' });
    });

    it('should return allowed:false if user is not the author', async () => {
      // Mock data
      const mockComment = {
        id: 1,
        content: 'Comment',
        postId: 1,
        author: {
          id: 2, // Different user ID
          name: 'Other User',
        },
      };

      // Mock return value
      (CommentModel.findById as jest.Mock).mockResolvedValue(mockComment);

      // Call the service
      const result = await CommentService.canModifyComment(1, 1);

      // Assertions
      expect(CommentModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ allowed: false, reason: 'Not authorized to modify this comment' });
    });
  });
}); 