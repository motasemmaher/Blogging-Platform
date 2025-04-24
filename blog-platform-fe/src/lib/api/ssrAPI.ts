"use server";
import axios from 'axios';
import { cookies } from 'next/headers';

const getAxiosInstance = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const this_axios_instance = axios.create({
    baseURL: BASE_URL,
  });

  this_axios_instance.interceptors.request.use(
    async (config) => {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return this_axios_instance;
};

const ssrAxiosInstance = getAxiosInstance();

export default ssrAxiosInstance;
