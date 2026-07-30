import { useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../services/auth';

export default function useAuthProvider() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const { access, refresh } = res.data;
      localStorage.setItem('nf_tokens', JSON.stringify({ access, refresh }));
      const profileRes = await getProfile();
      localStorage.setItem('nf_user', JSON.stringify(profileRes.data));
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      const { access, refresh } = res.data;
      localStorage.setItem('nf_tokens', JSON.stringify({ access, refresh }));
      const profileRes = await getProfile();
      localStorage.setItem('nf_user', JSON.stringify(profileRes.data));
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      const errors = err.response?.data;
      let msg = 'Registration failed';
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        msg = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey] || msg;
      }
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('nf_tokens');
      localStorage.removeItem('nf_user');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('nf_tokens') || 'null');
    if (tokens?.access && !user) {
      setLoading(true);
      getProfile()
        .then((res) => {
          localStorage.setItem('nf_user', JSON.stringify(res.data));
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('nf_tokens');
          localStorage.removeItem('nf_user');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return { user, loading, login, register, logout, setUser };
}
