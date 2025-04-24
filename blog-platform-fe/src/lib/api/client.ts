import axios from 'axios';
import { getCookie } from '../utils/cookies';

const getAxiosInstance = () => {

  // Create an axios instance
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Get the token from local storage if it exists
      if (typeof window !== 'undefined') {
        const accessToken = getCookie('token');
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return apiClient;
};

const apiClient = getAxiosInstance();

export default apiClient;