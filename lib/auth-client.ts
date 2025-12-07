'use client';
import { useEffect, useState, useCallback } from 'react';

type MeResponse = { user: { id: string; name?: string; email?: string; role?: string; image?: string } | null };

export function useAuthClient() {
  const [user, setUser] = useState<MeResponse['user']>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' });
      const data: MeResponse = await res.json().catch(() => ({ user: null }));
      setUser(data?.user ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // 🔁 Re-fetch when window regains focus or someone broadcasts an auth change
  useEffect(() => {
    const onAuth = () => refresh();
    window.addEventListener('focus', onAuth);
    window.addEventListener('auth:changed', onAuth);
    return () => {
      window.removeEventListener('focus', onAuth);
      window.removeEventListener('auth:changed', onAuth);
    };
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    // tell listeners too
    window.dispatchEvent(new Event('auth:changed'));
  }, []);

  return { user, loading, refresh, logout };
}
