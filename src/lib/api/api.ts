import axios, { AxiosError } from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse['data']> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    throw err.response?.data?.message || err.response?.data?.error || 'Login failed';
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse['data']> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    throw err.response?.data?.message || err.response?.data?.error || 'Registration failed';
  }
};

// Add explicit get function
export const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    throw err.response?.data?.message || err.response?.data?.error || 'Request failed';
  }
};

export default api;