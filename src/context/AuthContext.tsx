'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { LoginData, LoginResponse } from '@/types/auth';
import { login, otpVerifyApi, register } from '@/lib/auth';

// Define the type for user authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginData | null;
  loginUser: (email: string, password: string) => Promise<LoginResponse>;
  logoutUser: () => Promise<void>;
  signupUser: (email: string, password: string) => Promise<LoginResponse>;
  otpVerify: (email: string, otp: string) => Promise<LoginResponse>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LoginData | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      const token = document.cookie.includes('token');
      setIsAuthenticated(token);
    };

    checkAuthStatus();
  }, []);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await login({ email, password });
      localStorage.setItem('userDetails', JSON.stringify(response.data));
      setIsAuthenticated(true);
      setUser(response.data);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      // Clear local storage
      localStorage.removeItem('userDetails');

      // Clear authentication state
      setIsAuthenticated(false);
      setUser(null);

      // Clear token cookie via API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for sending cookies
      });
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  };

  const signupUser = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await register({ email, password });
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const otpVerify = async (
    email: string,
    otp: string
  ): Promise<LoginResponse> => {
    try {
      const response = await otpVerifyApi({ email, otp });
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginUser,
        logoutUser,
        signupUser,
        otpVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
