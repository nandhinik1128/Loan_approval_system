import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('loan-token');
    if (!token) {
      setLoading(false);
      return;
    }

    client
      .get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('loan-token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (values) => {
    const response = await client.post('/auth/login', values);
    localStorage.setItem('loan-token', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const signUp = async (values) => {
    const response = await client.post('/auth/register', values);
    localStorage.setItem('loan-token', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const signOut = async () => {
    try {
      await client.post('/auth/logout');
    } finally {
      localStorage.removeItem('loan-token');
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
