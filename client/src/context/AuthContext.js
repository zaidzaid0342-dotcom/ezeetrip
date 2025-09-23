// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const isMounted = useRef(true);
  const authCheckComplete = useRef(false);
  const redirectInProgress = useRef(false);
  const tabId = useRef(Date.now().toString()); // Unique ID for this tab

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to store token in sessionStorage and set headers
  const storeToken = useCallback((token) => {
   // console.log('Storing token in sessionStorage:', token);
    try {
      sessionStorage.setItem('token', token); // Changed to sessionStorage
      // Set the token in the API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      //console.log('Token stored successfully');
    } catch (error) {
     // console.error('Error storing token in sessionStorage:', error);
    }
  }, []);

  // Function to update authentication state
  const updateAuthState = useCallback((user) => {
  
    
    if (isMounted.current) {
      setCurrentUser(user);
      setLoading(false);
    }
    
    if (user) {
      try {
        // Store only the necessary user data in sessionStorage
        const userData = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        sessionStorage.setItem('user', JSON.stringify(userData)); // Changed to sessionStorage
        //console.log('User data stored successfully');
      } catch (error) {
       
      }
    } else {
     // console.log('Clearing authentication data');
      sessionStorage.removeItem('user'); // Changed to sessionStorage
      sessionStorage.removeItem('token'); // Changed to sessionStorage
      // Remove the token from the API headers
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token'); // Changed to sessionStorage
      const user = sessionStorage.getItem('user'); // Changed to sessionStorage
      
      
      
      if (token && user) {
        // Set the token in the API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token with backend
        const res = await api.get('/auth/me');
       // console.log('Auth check response:', res.data);
        updateAuthState(res.data.data);
      } else {
        //console.log('No token or user found in sessionStorage');
        updateAuthState(null);
      }
    } catch (error) {
      //console.error('Auth check failed:', error);
      updateAuthState(null);
    } finally {
      authCheckComplete.current = true;
    }
  }, [updateAuthState]);

  // Check authentication status on initial load
  useEffect(() => {
    
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      
      const res = await api.post('/auth/login', { email, password });
      
      
      // Extract token and user data from response
      const { token, user } = res.data;
      
     
      
      // Store the token in sessionStorage and set headers
      storeToken(token);
      
      // Update the authentication state with user data
      updateAuthState(user);
      
      // Redirect based on user role
      if (isMounted.current && !redirectInProgress.current) {
        redirectInProgress.current = true;
        // Use setTimeout to ensure state updates are complete
        setTimeout(() => {
          if (isMounted.current && history) {
            if (user.role === 'admin') {
              history.push('/admin');
            } else {
              history.push('/');
            }
          }
          redirectInProgress.current = false;
        }, 100);
      }
      
      return res.data;
    } catch (error) {
      //console.error('Login error:', error);
      throw error;
    }
  }, [storeToken, updateAuthState, history]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      
      const res = await api.post('/auth/register', userData);
    
      
      // Extract token and user data from response
      const { token, user } = res.data;
      
      // Store the token in sessionStorage and set headers
      storeToken(token);
      
      // Update the authentication state with user data
      updateAuthState(user);
      
      // Redirect based on user role
      if (isMounted.current && !redirectInProgress.current) {
        redirectInProgress.current = true;
        // Use setTimeout to ensure state updates are complete
        setTimeout(() => {
          if (isMounted.current && history) {
            if (user.role === 'admin') {
              history.push('/admin');
            } else {
              history.push('/');
            }
          }
          redirectInProgress.current = false;
        }, 100);
      }
      
      return res.data;
    } catch (error) {
      
      // Extract and return the error message
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }, [storeToken, updateAuthState, history]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      //console.error('Logout error:', error);
    } finally {
      // Clear authentication state
      updateAuthState(null);
      
      // Redirect to login page
      if (isMounted.current && history) {
        history.push('/login');
      }
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}