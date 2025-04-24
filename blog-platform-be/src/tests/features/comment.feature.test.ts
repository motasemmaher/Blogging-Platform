import request from 'supertest';
import express from 'express';
import { CommentModel } from '../../models/comment.model';
import { UserModel } from '../../models/user.model';
import * as authUtils from '../../utils/auth';
import { createTestApp } from '../mocks/app.mock';

// Mock the models and auth utilities
jest.mock('../../models/comment.model');
jest.mock('../../models/user.model');
jest.mock('../../utils/auth');

// Import the app
let app: express.Application;
let authToken: string;

describe('Comment API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Use our test app instead of the real one
    app = createTestApp();

    // Setup mock auth token
    authToken = 'Bearer test_token';
    (authUtils.verifyToken as jest.Mock).mockReturnValue({
      userId: 1,
      id: 1,
      email: 'test@example.com',
      role: 'user',
    });
    (UserModel.findById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('should get all comments for a post successfully', async () => {
      // Mock data
      const mockComments = [
        { id: 1, content: 'Comment 1', postId: 1, authorId: 1 },
        { id: 2, content: 'Comment 2', postId: 1, authorId: 2 },
      ];

      // Mock return value
      (CommentModel.findByPostId as jest.Mock).mockResolvedValue(mockComments);

      // Make API request
      const response = await request(app).get('/posts/1/comments');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(CommentModel.findByPostId).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /posts/:postId/comments', () => {
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

      // Make API request
      const response = await request(app)
        .post('/posts/1/comments')
        .set('Authorization', authToken)
        .send({
          content: 'New Comment',
          postId: 1
        });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockComment);
      expect(CommentModel.create).toHaveBeenCalledWith({
        content: 'New Comment',
        postId: 1,
        authorId: 1,
      });
    });

    it('should return 401 if not authenticated', async () => {
      // Make API request without auth token
      const response = await request(app)
        .post('/posts/1/comments')
        .send({
          content: 'New Comment',
        });

      // Assertions
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /posts/:postId/comments/:commentId', () => {
    it('should delete a comment successfully', async () => {
      // Mock data for permission check
      (CommentModel.findById as jest.Mock).mockResolvedValue({
        id: 1,
        content: 'Comment',
        postId: 1,
        author: {
          id: 1,
          name: 'User',
        },
      });

      // Mock return value
      (CommentModel.delete as jest.Mock).mockResolvedValue(true);

      // Make API request
      const response = await request(app)
        .delete('/posts/1/comments/1')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
    });

    it('should return 404 if comment not found', async () => {
      // Mock return value for permission check
      (CommentModel.findById as jest.Mock).mockResolvedValue(null);

      // Make API request
      const response = await request(app)
        .delete('/posts/1/comments/999')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Comment not found');
    });

    it('should return 403 if user is not authorized to delete', async () => {
      // Mock data for permission check - different user
      (CommentModel.findById as jest.Mock).mockResolvedValue({
        id: 1,
        content: 'Comment',
        postId: 1,
        author: {
          id: 2, // Different user
          name: 'Other User',
        },
      });

      // Make API request
      const response = await request(app)
        .delete('/posts/1/comments/1')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Not authorized to modify this comment');
    });
  });
}); 