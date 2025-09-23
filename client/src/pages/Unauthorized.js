// client/src/pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container my-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-shield-lock text-danger fs-1 mb-3"></i>
          <h1 className="mb-3">Unauthorized Access</h1>
          <p className="text-muted mb-4">You don't have permission to access this page.</p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;