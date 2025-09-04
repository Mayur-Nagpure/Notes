import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial load, check localStorage for an existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser: { sub: string } = jwtDecode(storedToken);
        setUser({ username: decodedUser.sub });
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to decode token from storage, logging out.", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function that calls the real API
  const login = async (credentials: any) => {
    // We are now calling the imported apiLogin function
    const receivedToken = await apiLogin(credentials);
    const decodedUser: { sub: string } = jwtDecode(receivedToken);

    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser({ username: decodedUser.sub });
  };

  // Register function that calls the real API
  const register = async (userData: any) => {
    // We are now calling the imported apiRegister function
    await apiRegister(userData);
    // Automatically log in the user after successful registration
    await login({ username: userData.username, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, register, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
