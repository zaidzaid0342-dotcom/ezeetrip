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
        // Use a more generic message for a professional touch, but allow specific error if available
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    // Centering the card vertically and horizontally in the viewport for a professional look
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="row w-100">
        <div className="col-sm-10 col-md-8 col-lg-5 mx-auto"> 
          {/* Increased shadow and slightly rounded corners for a modern card */}
          <div className="card shadow-lg border-0 rounded-3"> 
            
            {/* Minimalist header - using an icon and clean padding */}
            <div className="card-header bg-white text-center py-4 border-bottom-0"> 
              <h2 className="fw-bold text-dark mb-0">
                <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
                Welcome Back
              </h2>
              <p className="text-muted mb-0 mt-1">Sign in to continue to your account.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              
              {/* Error Alert with a clean, dismissible style */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label visually-hidden">Email</label>
                  <input
                    type="email"
                    // Added a placeholder and removed the visual label
                    className="form-control form-control-lg" 
                    id="email"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label visually-hidden">Password</label>
                  <input
                    type="password"
                    // Added a placeholder and removed the visual label
                    className="form-control form-control-lg" 
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Login Button */}
                <div className="d-grid mb-4">
                  <button 
                    type="submit" 
                    // Using a larger, bold button that stands out
                    className="btn btn-primary btn-lg fw-bold" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : 'Login'}
                  </button>
                </div>
              </form>
              
              {/* Footer Links - kept consistent but styled cleaner */}
              <div className="text-center">
                <p className="mb-0 text-muted">
                  Don't have an account? 
                  <Link to="/register" className="text-decoration-none fw-bold ms-1">
                    Register Now
                  </Link>
                </p>
                {/* Optional: Add a "Forgot Password" link for professionalism */}
                {/* <p className="mt-2"><Link to="/forgot-password" className="text-decoration-none text-secondary">Forgot Password?</Link></p> */}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;