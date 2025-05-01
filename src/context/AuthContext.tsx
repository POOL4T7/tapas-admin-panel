import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoginData } from '@/types/auth';
// Define the type for user authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginData;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<LoginData | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual backend authentication logic
      if (email === 'admin@example.com' && password === 'adminpassword') {
        setIsAuthenticated(true);
        setUser({ email, password });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual backend signup logic
      setIsAuthenticated(true);
      setUser({ email, password });
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: user!, login, logout, signup }}
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
