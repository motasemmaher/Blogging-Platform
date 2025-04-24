import request from 'supertest';
import express from 'express';
import { PostModel } from '../../models/post.model';
import { UserModel } from '../../models/user.model';
import * as authUtils from '../../utils/auth';
import { createTestApp } from '../mocks/app.mock';

// Mock the models and auth utilities
jest.mock('../../models/post.model');
jest.mock('../../models/user.model');
jest.mock('../../utils/auth');

// Import the app
let app: express.Application;
let authToken: string;

describe('Post API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Use our test app instead of the real one
    app = createTestApp();

    // Setup mock auth token
    authToken = 'Bearer test_token';
    (authUtils.verifyToken as jest.Mock).mockReturnValue({
      userId: 1,
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

  describe('GET /posts', () => {
    it('should get all posts successfully', async () => {
      // Mock data
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];

      // Mock return value
      (PostModel.findAll as jest.Mock).mockResolvedValue({
        posts: mockPosts,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      // Make API request
      const response = await request(app).get('/posts');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('posts');
      expect(response.body.data.posts).toHaveLength(2);
      expect(response.body.data).toHaveProperty('page');
      expect(response.body.data).toHaveProperty('limit');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('totalPages');
    });

    it('should filter posts by search query', async () => {
      // Mock data
      const mockPosts = [
        { id: 1, title: 'Matching Post', content: 'Content 1' },
      ];

      // Mock return value
      (PostModel.findAll as jest.Mock).mockResolvedValue({
        posts: mockPosts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      // Make API request
      const response = await request(app).get('/posts?search=Matching');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data.posts).toHaveLength(1);
      expect(PostModel.findAll).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Matching', undefined);
    });
  });

  describe('GET /posts/:id', () => {
    it('should get a post by ID successfully', async () => {
      // Mock data
      const mockPost = { id: 1, title: 'Post 1', content: 'Content 1' };

      // Mock return value
      (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);

      // Make API request
      const response = await request(app).get('/posts/1');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPost);
    });

    it('should return 404 if post not found', async () => {
      // Mock return value
      (PostModel.findById as jest.Mock).mockResolvedValue(null);

      // Make API request
      const response = await request(app).get('/posts/999');

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Post not found');
    });
  });

  describe('POST /posts', () => {
    it('should create a post successfully', async () => {
      // Mock data
      const mockPost = {
        id: 1,
        title: 'New Post',
        content: 'New Content',
        published: false,
        authorId: 1,
      };

      // Mock return value
      (PostModel.create as jest.Mock).mockResolvedValue(mockPost);

      // Make API request
      const response = await request(app)
        .post('/posts')
        .set('Authorization', authToken)
        .send({
          title: 'New Post',
          content: 'New Content',
        });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockPost);
    });

    it('should return 401 if not authenticated', async () => {
      // Make API request without auth token
      const response = await request(app)
        .post('/posts')
        .send({
          title: 'New Post',
          content: 'New Content',
        });

      // Assertions
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update a post successfully', async () => {
      // Mock data
      const mockUpdatedPost = {
        id: 1,
        title: 'Updated Post',
        content: 'Updated Content',
        published: true,
      };

      // Mock return value
      (PostModel.update as jest.Mock).mockResolvedValue(mockUpdatedPost);

      // Make API request
      const response = await request(app)
        .put('/posts/1')
        .set('Authorization', authToken)
        .send({
          title: 'Updated Post',
          content: 'Updated Content',
          published: true,
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedPost);
    });

    it('should return 404 if post not found or user not authorized', async () => {
      // Mock return value
      (PostModel.update as jest.Mock).mockResolvedValue(null);

      // Make API request
      const response = await request(app)
        .put('/posts/999')
        .set('Authorization', authToken)
        .send({
          title: 'Updated Post',
        });

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Post not found or you are not authorized to update this post');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post successfully', async () => {
      // Mock return value
      (PostModel.delete as jest.Mock).mockResolvedValue(true);

      // Make API request
      const response = await request(app)
        .delete('/posts/1')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post deleted successfully');
    });

    it('should return 404 if post not found or user not authorized', async () => {
      // Mock return value
      (PostModel.delete as jest.Mock).mockResolvedValue(false);

      // Make API request
      const response = await request(app)
        .delete('/posts/999')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Post not found or you are not authorized to delete this post');
    });
  });
}); 