// client/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form with user info
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [isAuthenticated, user]);

  const { name, email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify(formData);

      await axios.put('/api/users/profile', body, config);

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">My Profile</h1>

      {/* Alerts */}
      {success && (
        <div className="alert alert-success">Profile updated successfully!</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
      
        
            
         

        {/* Account Info */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex align-items-center">
              <i className="bi bi-person-circle me-2"></i>
              <h5 className="mb-0">Account Information</h5>
            </div>
            <div className="card-body">
              {/* Avatar */}
              <div className="d-flex align-items-center mb-4">
                <div className="avatar-circle me-3">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h6 className="mb-1">{user?.name || 'Unnamed User'}</h6>
                  <p className="mb-0 text-muted small">{user?.email}</p>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Member Since</label>
                <p className="form-control-plaintext">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              <div className="mb-0">
                <label className="form-label fw-semibold">Account Type</label>
                <p className="form-control-plaintext">
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
