'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

// サインイン状態。会員登録・サインインはこのサイトの /api/auth/*（lib/auth.ts）で行い、セッションは httpOnly の Cookie に入る
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
};

export type SignupData = { email: string; password: string; nickname: string };

const AuthContext = createContext<AuthContextType | null>(null);

async function post(path: string, body?: object) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || 'うまくいきませんでした。時間をおいてお試しください。');
  return j as { user?: User };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j: { user: User | null }) => setUser(j.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setUser((await post('/api/auth/login', { email, password })).user ?? null);
  };

  const signup = async (data: SignupData) => {
    setUser((await post('/api/auth/signup', data)).user ?? null);
  };

  const logout = async () => {
    await post('/api/auth/logout');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
