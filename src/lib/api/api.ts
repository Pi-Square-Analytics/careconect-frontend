import axios, { AxiosError } from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

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