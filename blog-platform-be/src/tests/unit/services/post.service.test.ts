import { PostService } from '../../../services/post.service';
import { PostModel } from '../../../models/post.model';

// Mock the PostModel
jest.mock('../../../models/post.model');

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should get all posts successfully', async () => {
      // Mock data
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
      ];

      // Mock return value
      (PostModel.findAll as jest.Mock).mockResolvedValue(mockPosts);

      // Call the service
      const result = await PostService.getAllPosts(1, 10, '');

      // Assertions
      expect(PostModel.findAll).toHaveBeenCalledWith(1, 10, '', undefined);
      expect(result).toEqual(mockPosts);
    });

    it('should filter posts by user ID', async () => {
      // Mock data
      const mockPosts = [{ id: 1, title: 'Post 1', content: 'Content 1' }];

      // Mock return value
      (PostModel.findAll as jest.Mock).mockResolvedValue(mockPosts);

      // Call the service
      const result = await PostService.getAllPosts(1, 10, '', 1);

      // Assertions
      expect(PostModel.findAll).toHaveBeenCalledWith(1, 10, '', 1);
      expect(result).toEqual(mockPosts);
    });
  });

  describe('getPostById', () => {
    it('should get a post by ID successfully', async () => {
      // Mock data
      const mockPost = { id: 1, title: 'Post 1', content: 'Content 1' };

      // Mock return value
      (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);

      // Call the service
      const result = await PostService.getPostById(1);

      // Assertions
      expect(PostModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if post not found', async () => {
      // Mock return value
      (PostModel.findById as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(PostService.getPostById(999)).rejects.toThrow('Post not found');
    });
  });

  describe('createPost', () => {
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

      // Call the service
      const result = await PostService.createPost({
        title: 'New Post',
        content: 'New Content',
        authorId: 1,
      });

      // Assertions
      expect(PostModel.create).toHaveBeenCalledWith({
        title: 'New Post',
        content: 'New Content',
        published: false,
        authorId: 1,
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if post creation fails', async () => {
      // Mock return value
      (PostModel.create as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(
        PostService.createPost({
          title: 'New Post',
          content: 'New Content',
          authorId: 1,
        })
      ).rejects.toThrow('Failed to create post');
    });
  });

  describe('updatePost', () => {
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

      // Call the service
      const result = await PostService.updatePost(1, 1, {
        title: 'Updated Post',
        content: 'Updated Content',
        published: true,
      });

      // Assertions
      expect(PostModel.update).toHaveBeenCalledWith(1, 1, {
        title: 'Updated Post',
        content: 'Updated Content',
        published: true,
      });
      expect(result).toEqual(mockUpdatedPost);
    });

    it('should throw an error if update fails', async () => {
      // Mock return value
      (PostModel.update as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(
        PostService.updatePost(1, 1, {
          title: 'Updated Post',
        })
      ).rejects.toThrow('Post not found or you are not authorized to update this post');
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Mock return value
      (PostModel.delete as jest.Mock).mockResolvedValue(true);

      // Call the service
      const result = await PostService.deletePost(1, 1);

      // Assertions
      expect(PostModel.delete).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(true);
    });

    it('should throw an error if delete fails', async () => {
      // Mock return value
      (PostModel.delete as jest.Mock).mockResolvedValue(false);

      // Assertions
      await expect(PostService.deletePost(1, 1)).rejects.toThrow(
        'Post not found or you are not authorized to delete this post'
      );
    });
  });
}); 