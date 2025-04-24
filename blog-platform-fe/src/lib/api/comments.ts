import { Comment } from '../types/comments';
import apiClient from './client';

interface CreateCommentData {
  content: string;
  postId: number;
  userId: number;
}

export const commentsApi = {
  // Get all comments
  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  
  // Create new comment
  createComment: async (data: CreateCommentData) => {
    const response = await apiClient.post(`/posts/${data.postId}/comments`, data);
    return response.data;
  },

  
  // Delete comment
  deleteComment: async (postId: number, commentId: number) => {
    const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },
}; 