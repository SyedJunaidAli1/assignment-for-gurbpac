'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, AuthState } from '../types/auth';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    setState({ user, token, isLoading: false });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const { user, token } = await authService.login(credentials);
      setState({ user, token, isLoading: false });
      
      // Redirect based on role
      if (user.role === 'teacher') {
        router.push('/teacher');
      } else if (user.role === 'principal') {
        router.push('/principal');
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setState({ user: null, token: null, isLoading: false });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
