// client/src/components/AdminRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user.role !== 'admin') {
    // Save the attempted URL for redirect after login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectPath', currentPath);
    return <Redirect to="/login" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default AdminRoute;