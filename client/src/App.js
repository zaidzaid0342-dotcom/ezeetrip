// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminPackageManagement from './pages/AdminPackageManagement';
import AdminBookingManagement from './pages/AdminBookingManagement';
import AdminAddPackage from './pages/AdminAddPackage';
import AdminEditPackage from './pages/AdminEditPackage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="container py-4">
            <Switch>
              {/* Public Routes */}
              <Route path="/" exact component={Home} />
              <Route path="/packages" exact component={Packages} />
              <Route path="/packages/:id" component={PackageDetails} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              
              {/* Protected Routes (require authentication) */}
              <ProtectedRoute path="/profile" component={Profile} />
              <ProtectedRoute path="/my-bookings" component={MyBookings} />
              
              {/* Admin Routes (require authentication and admin role) */}
              <ProtectedRoute 
                path="/admin" 
                exact 
                component={AdminDashboard} 
                roles={['admin']} 
              />
              <ProtectedRoute 
                path="/admin/packages" 
                exact 
                component={AdminPackageManagement} 
                roles={['admin']} 
              />
              <ProtectedRoute 
                path="/admin/packages/add" 
                component={AdminAddPackage} 
                roles={['admin']} 
              />
              <ProtectedRoute 
                path="/admin/packages/edit/:id" 
                component={AdminEditPackage} 
                roles={['admin']} 
              />
              <ProtectedRoute 
                path="/admin/bookings" 
                component={AdminBookingManagement} 
                roles={['admin']} 
              />
              
              {/* Unauthorized Page */}
              <Route path="/unauthorized" component={Unauthorized} />
              
              {/* Catch all route */}
              <Route path="*" render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;