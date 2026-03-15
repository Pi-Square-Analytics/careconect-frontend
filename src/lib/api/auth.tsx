'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../../types/auth';
import { safeLocalStorage } from '../storage';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  doctorId: string | null;
  patientId: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Derived state for easy access to IDs
  const userId = user?.userId || null;
  const doctorId = user?.doctorId || null;
  const patientId = user?.patientId || null;

  // Check for existing tokens and user data on mount
  useEffect(() => {
    const accessToken = safeLocalStorage.getItem('accessToken');
    const refreshToken = safeLocalStorage.getItem('refreshToken');
    const storedUser = safeLocalStorage.getItem('user');

    if (accessToken && refreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation: must have userId at minimum
        if (parsedUser && parsedUser.userId) {
          // Ensure profile exists to avoid crashes
          if (!parsedUser.profile) {
            parsedUser.profile = { firstName: '', lastName: '' };
          }
          setUserState(parsedUser);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        logout();
      }
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      // Ensure profile exists before storing
      if (!user.profile) {
        user.profile = { firstName: '', lastName: '' };
      }
      // Store user data for persistence
      safeLocalStorage.setItem('user', JSON.stringify(user));
    } else {
      safeLocalStorage.removeItem('user');
    }
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    safeLocalStorage.setItem('accessToken', accessToken);
    safeLocalStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    safeLocalStorage.removeItem('accessToken');
    safeLocalStorage.removeItem('refreshToken');
    safeLocalStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userId,
      doctorId,
      patientId,
      setUser,
      setTokens,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}