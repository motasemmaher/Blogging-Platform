import { Post } from '@/lib/types/post';
import apiClient from './client';
import {
  AvertraMutationResponse,
  AvertraResponseList,
  AvertraResponseListResponse,
} from '../types/api';
import ssrAxiosInstance from './ssrAPI';

export const postsApi = {
  // Get all posts with pagination
  getPosts: async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<AvertraResponseList<Post[], 'posts'>> => {
    const response = await ssrAxiosInstance.get<AvertraResponseListResponse<Post[], 'posts'>>(
      '/posts',
      {
        params: {
          page,
          limit,
          search,
        },
      }
    );
    return response.data.data;
  },

  // Get post by ID
  getPostById: async (id: number): Promise<Post> => {
    const response = await ssrAxiosInstance.get<AvertraMutationResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },

  // Create new post
  createPost: async (data: Post) => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  // Update post
  updatePost: async (id: number, data: Post) => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};
