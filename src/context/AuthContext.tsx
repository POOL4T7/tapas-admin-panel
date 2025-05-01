'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { LoginData, LoginResponse } from '@/types/auth';
import { login, logout, register } from '@/lib/auth';

// Define the type for user authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginData | null;
  loginUser: (email: string, password: string) => Promise<LoginResponse>;
  logoutUser: () => Promise<void>;
  signupUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<LoginResponse>;
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
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const signupUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await register({ name, email, password });
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
