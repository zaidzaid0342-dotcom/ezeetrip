// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // Store token in storage & set API headers
  const storeToken = useCallback((token, remember = false) => {
    try {
      if (remember) localStorage.setItem('token', token);
      else sessionStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error('Error storing token:', err);
    }
  }, []);

  // Update auth state and store user
  const updateAuthState = useCallback((user, remember = false) => {
    setCurrentUser(user);
    setLoading(false);
    if (user) {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      if (remember) localStorage.setItem('user', JSON.stringify(userData));
      else sessionStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Check auth status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/auth/me'); // backend must return { user: {...} }
        updateAuthState(res.data.user);
      } else {
        updateAuthState(null);
      }
    } catch (err) {
      updateAuthState(null);
    }
  }, [updateAuthState]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback(async (email, password, remember = false) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      storeToken(token, remember);
      updateAuthState(user, remember);
      if (user.role === 'admin') history.push('/admin');
      else history.push('/');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  }, [storeToken, updateAuthState, history]);

  // Register function
  const register = useCallback(async (userData, remember = false) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user } = res.data;
      storeToken(token, remember);
      updateAuthState(user, remember);
      if (user.role === 'admin') history.push('/admin');
      else history.push('/');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  }, [storeToken, updateAuthState, history]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout'); // optional backend logout
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      updateAuthState(null);
      history.push('/login');
    }
  }, [updateAuthState, history]);

  const value = {
    currentUser,
    user: currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
