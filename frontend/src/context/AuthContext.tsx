import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configuración de la URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  theme?: {
    mode: 'light' | 'dark';
    color: 'blue' | 'green' | 'red' | 'violet' | 'yellow';
  };
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    if (token) {
      // Configure axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user data
      fetchUserData();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<User>(`${API_URL}/api/users/me`);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
        identifier,
        password,
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message === 'Network Error') {
        throw new Error('Error de conexión. ¿Está el servidor ejecutándose en ' + API_URL + '?');
      }
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, name: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
        name,
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message === 'Network Error') {
        throw new Error('Error de conexión. ¿Está el servidor ejecutándose en ' + API_URL + '?');
      }
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await axios.put<User>(`${API_URL}/api/users/profile`, userData);
      setUser(response.data);
    } catch (error: any) {
      console.error('Update user error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 