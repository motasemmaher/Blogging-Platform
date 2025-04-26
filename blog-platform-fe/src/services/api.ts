import axios from 'axios';
import { API, AUTH } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API.URL,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (reqConfig) => {
    // Get token from localStorage (if in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH.TOKEN_KEY);
      
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = localStorage.getItem(AUTH.REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to get a new token
        const response = await axios.post(`${API.URL}/auth/refresh`, {
          refreshToken,
        });
        
        // If successful, update the token and retry
        if (response.data && response.data.data.accessToken) {
          localStorage.setItem(AUTH.TOKEN_KEY, response.data.data.accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem(AUTH.TOKEN_KEY);
        localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH.USER_KEY);
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: (data: { email: string; password: string }) => 
      api.post('/auth/login', data),
    register: (data: { name: string; email: string; password: string }) => 
      api.post('/auth/register', data),
    refresh: (refreshToken: string) => 
      api.post('/auth/refresh', { refreshToken }),
    logout: (refreshToken: string) => 
      api.post('/auth/logout', { refreshToken }),
  },
  
  // Posts endpoints
  posts: {
    getAll: (page = 1, limit = 10, search = '') => 
      api.get('/posts', { params: { page, limit, search } }),
    getById: (id: number) => 
      api.get(`/posts/${id}`),
    create: (data: { title: string; content: string; published?: boolean; categoryIds?: number[] }) => 
      api.post('/posts', data),
    update: (id: number, data: { title?: string; content?: string; published?: boolean; categoryIds?: number[] }) => 
      api.put(`/posts/${id}`, data),
    delete: (id: number) => 
      api.delete(`/posts/${id}`),
  },
  
  // Comments endpoints
  comments: {
    getByPostId: (postId: number, page = 1, limit = 10) => 
      api.get(`/posts/${postId}/comments`, { params: { page, limit } }),
    create: (postId: number, content: string) => 
      api.post(`/posts/${postId}/comments`, { content }),
    update: (postId: number, commentId: number, content: string) => 
      api.put(`/posts/${postId}/comments/${commentId}`, { content }),
    delete: (postId: number, commentId: number) => 
      api.delete(`/posts/${postId}/comments/${commentId}`),
  },
};

export default api; 