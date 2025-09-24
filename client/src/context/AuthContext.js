// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // Store token in sessionStorage and set API headers
  const storeToken = useCallback((token) => {
    if (token) {
      sessionStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Update auth state and sessionStorage
  const updateAuthState = useCallback((user) => {
    if (user) {
      setCurrentUser(user);
      setLoading(false);
      sessionStorage.setItem(
        'user',
        JSON.stringify({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );
    } else {
      setCurrentUser(null);
      setLoading(false);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Check if user is logged in
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/api/auth/me'); // must match your backend route
        updateAuthState(res.data.data);
      } else {
        updateAuthState(null);
      }
    } catch (error) {
      updateAuthState(null);
    }
  }, [updateAuthState]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback(
    async (email, password) => {
      try {
        const res = await api.post('/api/auth/login', { email, password });
        const { token, user } = res.data;
        storeToken(token);
        updateAuthState(user);
        if (user.role === 'admin') history.push('/admin');
        else history.push('/');
        return res.data;
      } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
      }
    },
    [storeToken, updateAuthState, history]
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      try {
        const res = await api.post('/api/auth/register', userData);
        const { token, user } = res.data;
        storeToken(token);
        updateAuthState(user);
        if (user.role === 'admin') history.push('/admin');
        else history.push('/');
        return res.data;
      } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
      }
    },
    [storeToken, updateAuthState, history]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.log('Logout error:', error);
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
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
