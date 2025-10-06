// client/src/pages/Register.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const history = useHistory();

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting registration with:', { name, email, password: '***' });
      await register({ name, email, password });
      console.log('Registration successful, redirecting to login');
      history.push('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    // 'register-page-container' is now set to full viewport height and uses flex for centering
    <div className="container register-page-container">
      <div className="row justify-content-center w-100">
        {/* Enforcing a max-width on the column for large screens (col-lg-5 ensures max-width on lg) */}
        <div className="col-12 col-md-8 col-lg-5 register-col"> 
          <div className="card border-0 shadow-lg register-card">
            <div className="card-header bg-primary text-white text-center p-4">
              <h4 className="mb-0 text-uppercase fw-bold">Sign Up for EzeeTrip</h4>
            </div>
            <div className="card-body p-5">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    placeholder="Min 6 characters"
                  />
                  <div className="form-text text-muted">Choose a strong, unique password.</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password2" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    placeholder="Confirm your password"
                  />
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg register-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : 'Register Account'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-4 pt-2 border-top">
                <p className="mb-0 text-secondary">Already have an account? <Link to="/login" className="fw-bold register-link">Login Here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal CSS Block (Enhanced for Professional and Responsive Look) */}
      <style>
        {`
          /* Professional Centering for Large Screens */
          .register-page-container {
            /* Full viewport height minus typical fixed header/footer (e.g., 60px header + 40px footer) */
            min-height: calc(100vh - 100px); 
            display: flex;
            align-items: center; /* Vertical center */
            justify-content: center; /* Horizontal center */
            padding: 40px 15px; /* Ensure padding on all screen sizes */
            background-color: #f8f9fa; /* Light background for contrast */
          }
          
          /* Card Styling */
          .register-card {
            border-radius: 12px;
            overflow: hidden; 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* Deeper, softer shadow */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 100%;
          }
          
          .register-card:hover {
              transform: translateY(-5px); /* Subtle lift on hover */
              box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          }
          
          /* Header Styling */
          .card-header.bg-primary {
            background-color: #0d6efd !important; /* Primary Blue */
            border-bottom: 4px solid #0a58ca; /* Darker line for definition */
            padding: 1.5rem 1rem !important;
          }
          
          .card-header h4 {
            font-size: 1.75rem;
            letter-spacing: 1px;
            font-weight: 800;
          }

          /* Body Padding refinement */
          .card-body.p-5 {
            padding: 3rem !important;
          }
          
          /* Input Field Styling */
          .form-control {
            border-radius: 8px;
            border: 1px solid #dee2e6;
            padding: 1rem 1.25rem;
            height: auto; /* Allow padding to define height */
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            background-color: #fff;
          }
          
          .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.3);
            background-color: #fff;
          }
          
          .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 0.5rem;
          }

          .form-text.text-muted {
            font-size: 0.85rem;
            color: #6c757d !important;
          }
          
          /* Button Styling */
          .register-btn {
            background-color: #28a745; /* Using a secondary action color (Success green) */
            border-color: #28a745;
            font-weight: 700;
            padding: 0.85rem 1rem;
            border-radius: 8px;
            transition: background-color 0.3s ease, transform 0.1s ease;
          }
          
          .register-btn:hover {
            background-color: #218838;
            border-color: #1e7e34;
            transform: translateY(-2px);
          }
          
          .register-btn:disabled {
            opacity: 0.6;
          }
          
          /* Link Styling */
          .register-link {
            color: #0d6efd !important;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .register-link:hover {
            color: #0a58ca !important;
            text-decoration: underline;
          }

          .text-secondary {
            color: #6c757d !important;
          }

          /* Responsive adjustments */
          @media (max-width: 991.98px) {
            .register-page-container {
              align-items: flex-start; /* Stop vertical centering on tablets/mobiles */
            }
          }

          @media (max-width: 767.98px) {
            .card-body.p-5 {
              padding: 2rem !important;
            }
          }
          
          @media (max-width: 575.98px) {
            .register-page-container {
              padding: 20px 10px;
            }
            .card-header h4 {
              font-size: 1.5rem;
            }
            .card-body.p-5 {
              padding: 1.5rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Register;