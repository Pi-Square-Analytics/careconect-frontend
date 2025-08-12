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
  const { user, userId, doctorId, patientId, setUser, setTokens, logout, isAuthenticated } = useAuth();
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
        
        // Set user data first (which includes doctorId/patientId)
        setUser(user);
        // Then set tokens
        setTokens(accessToken, refreshToken);

        // Enhanced logging for debugging
        console.log('Login successful:', {
          userId: user.userId,
          userType: user.userType,
          doctorId: user.doctorId,
          patientId: user.patientId
        });

        // Role-based redirection for login
        switch (user.userType) {
          case 'patient':
            if (user.patientId) {
              console.log('Redirecting patient with patientId:', user.patientId);
            }
            router.push('/patient');
            break;
          case 'admin':
            router.push('/admin');
            break;
          case 'doctor':
            if (user.doctorId) {
              console.log('Redirecting doctor with doctorId:', user.doctorId);
            }
            router.push('/doctor');
            break;
          default:
            setError('Invalid user type');
        }
      } else {
        // For registration, we might not get tokens immediately
        const userData = response as RegisterResponseData;
        setUser(userData);
        
        console.log('Registration successful:', {
          userId: userData.userId,
          userType: userData.userType,
          doctorId: userData.doctorId,
          patientId: userData.patientId
        });
        
        // Redirect to login page after successful registration
        router.push('/login');
      }
    } catch (err: any) {
      // Improved error handling
      let errorMessage = 'An error occurred during authentication';

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Helper functions to access IDs easily
  const getCurrentUserId = () => userId;
  const getCurrentDoctorId = () => doctorId;
  const getCurrentPatientId = () => patientId;

  return { 
    user, 
    userId,
    doctorId,
    patientId,
    handleAuth, 
    handleLogout, 
    loading, 
    error, 
    isAuthenticated,
    getCurrentUserId,
    getCurrentDoctorId,
    getCurrentPatientId
  };
}