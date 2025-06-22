"use client";

import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function AuthProvider({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
    }
  }, []);

  return <>{children}</>;
} 