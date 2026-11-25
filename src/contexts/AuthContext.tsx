'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'counselor' | 'admin' | 'superadmin';
  university: string;
}

interface Tokens { access: string; refresh: string; user?: User }

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  /** Store tokens + user straight from a register/Google response: no extra round trip. */
  startSession: (data: Tokens) => User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

/** Where each role lands after signing in. */
export function homeFor(role?: string) {
  if (role === 'counselor') return '/counselor';
  return '/dashboard';
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me/');
      setUser(data);
      return data as User;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) fetchMe();
    else setLoading(false);
  }, [fetchMe]);

  const persist = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    document.cookie = 'jalimind_session=1; path=/; SameSite=Lax; max-age=604800';
  };

  const startSession = (data: Tokens) => {
    persist(data.access, data.refresh);
    if (data.user) {
      // Setting the user here (instead of leaving it null until /me returns) is what stops the
      // dashboard guard bouncing a brand-new account back to the login page.
      setUser(data.user);
      setLoading(false);
      return data.user;
    }
    fetchMe();
    return null;
  };

  const login = async (username: string, password: string) => {
    const { data } = await api.post('/api/auth/login/', { username, password });
    persist(data.access, data.refresh);
    return await fetchMe();
  };

  const logout = () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) api.post('/api/auth/logout/', { refresh }).catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'jalimind_session=; path=/; max-age=0';
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, startSession, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
