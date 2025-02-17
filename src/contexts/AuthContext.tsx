import React, { createContext, useContext, useState } from 'react';
import { auth } from '../services/auth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSubscribed: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuthenticated'));
  const [user, setUser] = useState<User | null>(auth.getUser());

  const login = (token: string) => {
    auth.setSession(token);
    setIsAuthenticated(true);
    setUser(auth.getUser());
  };

  const logout = async () => {
    await auth.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 