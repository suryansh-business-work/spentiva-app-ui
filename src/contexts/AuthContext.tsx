import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRequest } from '../utils/http';
import { endpoints } from '../config/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token from localStorage
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await getRequest(endpoints.auth.me, {}, authToken);
      // The API returns { data: { user: ... } } or similar. 
      // Based on previous api.ts: return response.data.data; which was { user: User }
      // So response.data.data.user is the user object.
      // Let's check the response structure from previous steps.
      // api.ts was: const response = await axios.get(endpoints.auth.me...); return response.data.data;
      // getRequest returns axios response.
      // So we need response.data.data.user
      if (response.data && response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
      } else if (response.data && response.data.user) {
        // Fallback if structure is different
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
    // Token will be automatically added by apiClient interceptor
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    // Token will be automatically removed by apiClient interceptor
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
