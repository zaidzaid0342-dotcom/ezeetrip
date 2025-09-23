// client/src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ component: Component, roles = [], ...rest }) => {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <Spinner />;
        }

        if (!isAuthenticated) {
          // Save the attempted URL for redirect after login
          sessionStorage.setItem('redirectPath', props.location.pathname); // Changed to sessionStorage
          return <Redirect to="/login" />;
        }

        // Check if user has required role
        if (roles.length > 0 && (!user || !roles.includes(user.role))) {
          return <Redirect to="/unauthorized" />;
        }

        // User is authenticated and authorized
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;