import { AvertraMutationResponse } from '../types/api';
import apiClient from './client';
import { RegisterData, LoginData, LoginResponse } from '../types/auth';
import { getCookie } from '../utils/cookies';

export const authApi = {
  // Register a new user
  register: async (data: RegisterData) => {
    const response = await apiClient.post<AvertraMutationResponse<LoginResponse>>(
      '/auth/register',
      data
    );

    return response.data;
  },

  // Login user
  login: async (data: LoginData) => {
    const response = await apiClient.post<AvertraMutationResponse<LoginResponse>>(
      '/auth/login',
      data
    );

    return response.data;
  },

  // Logout user
  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    if (typeof window === 'undefined') return false;
    return !!getCookie('token');
  },
};
