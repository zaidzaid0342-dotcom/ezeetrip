// client/src/pages/Login.js
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const history = useHistory();
  const isMounted = useRef(true);
  const redirectHandled = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle redirect after login
  useEffect(() => {
    console.log('Login useEffect - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
    
    if (isAuthenticated && !authLoading && !redirectHandled.current) {
      redirectHandled.current = true;
      
      // Check if user is admin and redirect accordingly
      if (user && user.role === 'admin') {
        //console.log('Redirecting admin to dashboard');
        history.push('/admin');
      } else {
        const redirectPath = sessionStorage.getItem('redirectPath') || '/'; // Changed to sessionStorage
       // console.log('Redirecting regular user to:', redirectPath);
        sessionStorage.removeItem('redirectPath'); // Changed to sessionStorage
        history.push(redirectPath);
      }
    }
  }, [isAuthenticated, authLoading, history, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      //console.log('Attempting login with:', email);
      const result = await login(email, password);
     // console.log('Login result:', result);
      
      // The redirect will be handled by the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      if (isMounted.current) {
        setError(err.response?.data?.message || 'Login failed');
      }
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Login</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : 'Login'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p>Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;