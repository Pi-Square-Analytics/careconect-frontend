/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '../lib/api/api';
import { useAuth } from '../lib/api/auth';
import { LoginCredentials, RegisterCredentials, LoginResponseData, RegisterResponseData } from '../types/auth';

export function useAuthHooks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, setTokens, logout } = useAuth(); // Add user here
  const router = useRouter();

  const handleAuth = async (
    credentials: LoginCredentials | RegisterCredentials,
    endpoint: 'login' | 'register'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await (endpoint === 'login'
        ? login(credentials as LoginCredentials)
        : register(credentials as RegisterCredentials));

      if (endpoint === 'login') {
        const { accessToken, refreshToken, user } = response as LoginResponseData;
        setUser(user);
        setTokens(accessToken, refreshToken);

        // Role-based redirection for login
        switch (user.userType) {
          case 'patient':
            router.push('/patient');
            break;
          case 'admin':
            router.push('/admin');
            break;
          case 'doctor':
            router.push('/doctor');
            break;
          default:
            setError('Invalid user type');
        }
      } else {
        const user = response as RegisterResponseData;
        setUser(user);
        router.push('/profile');
      }
    } catch (err) {
      // Handle complex error objects
      const errorMessage =
        (err as any)?.response?.data?.message ||
        (err as any)?.error ||
        'An error occurred during authentication';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return { user, handleAuth, handleLogout, loading, error }; // Include user in return
}