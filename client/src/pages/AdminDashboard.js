// client/src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    paidBookings: 0,
    totalRevenue: 0
  });
  const [recentPackages, setRecentPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Delete package function
  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await api.delete(`/packages/${id}`);
        // Refresh the recent packages list
        const packagesRes = await api.get('/packages');
        const packages = packagesRes.data.data || [];
        setRecentPackages(packages.slice(0, 5));
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          totalPackages: packages.length
        }));
      } catch (err) {
        console.error('Error deleting package:', err);
        setError('Failed to delete package. Please try again later.');
      }
    }
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || user.role !== 'admin') return;
      
      try {
        // Get packages count and recent packages
        const packagesRes = await api.get('/packages');
        const packages = packagesRes.data.data || [];
        const totalPackages = packages.length;
        
        // Get recent packages (last 5)
        setRecentPackages(packages.slice(0, 5));
        
        // Get bookings
        const bookingsRes = await api.get('/bookings');
        const bookings = bookingsRes.data.data || [];
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
        const paidBookings = bookings.filter(b => b.status === 'paid').length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        
        setStats({
          totalPackages,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          paidBookings,
          totalRevenue
        });
        
        setLastUpdated(new Date());
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <div className="container my-5">
        <div className="alert alert-danger shadow-sm border-0">
          <i className="bi bi-shield-lock me-2"></i>
          You don't have permission to access this page.
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <Spinner />;
  }
  
  // Calculate percentages for status overview
  const totalStatusCount = stats.confirmedBookings + stats.pendingBookings + stats.cancelledBookings + stats.paidBookings;
  const confirmedPercentage = totalStatusCount ? Math.round((stats.confirmedBookings / totalStatusCount) * 100) : 0;
  const pendingPercentage = totalStatusCount ? Math.round((stats.pendingBookings / totalStatusCount) * 100) : 0;
  const cancelledPercentage = totalStatusCount ? Math.round((stats.cancelledBookings / totalStatusCount) * 100) : 0;
  const paidPercentage = totalStatusCount ? Math.round((stats.paidBookings / totalStatusCount) * 100) : 0;
  
  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="fw-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted mb-0">
            Welcome back, <span className="fw-semibold">{user?.name || 'Admin'}</span>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">
            <i className="bi bi-clock me-1"></i>
            Last updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger shadow-sm mb-4">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-6 col-md-4 col-lg-3 mb-3">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="text-muted mb-1">Total Packages</h5>
                  <p className="card-text display-6 fw-bold">{stats.totalPackages}</p>
                </div>
                <div className="stats-icon bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-box-seam text-primary fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/packages" className="btn btn-sm btn-outline-primary">
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-4 col-lg-3 mb-3">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="text-muted mb-1">Total Bookings</h5>
                  <p className="card-text display-6 fw-bold">{stats.totalBookings}</p>
                </div>
                <div className="stats-icon bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-calendar-check text-success fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/bookings" className="btn btn-sm btn-outline-success">
                  View Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-4 col-lg-3 mb-3">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="text-muted mb-1">Pending Bookings</h5>
                  <p className="card-text display-6 fw-bold">{stats.pendingBookings}</p>
                </div>
                <div className="stats-icon bg-warning bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-clock-history text-warning fs-4"></i>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/admin/bookings?status=pending" className="btn btn-sm btn-outline-warning">
                  Review Pending
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-4 col-lg-3 mb-3">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="text-muted mb-1">Total Revenue</h5>
                  <p className="card-text display-6 fw-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="stats-icon bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="bi bi-currency-rupee text-info fs-4">₹</i>
                </div>
              </div>
              <div className="mt-3">
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and Tables */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Booking Status Overview</h5>
                <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary">View All Bookings</Link>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row mb-4">
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 bg-success bg-opacity-10 rounded">
                    <div className="text-success fs-3 fw-bold">{stats.confirmedBookings}</div>
                    <div className="text-muted">Confirmed</div>
                    <div className="text-muted small mt-1">{confirmedPercentage}%</div>
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                    <div className="text-warning fs-3 fw-bold">{stats.pendingBookings}</div>
                    <div className="text-muted">Pending</div>
                    <div className="text-muted small mt-1">{pendingPercentage}%</div>
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                    <div className="text-info fs-3 fw-bold">{stats.paidBookings}</div>
                    <div className="text-muted">Paid</div>
                    <div className="text-muted small mt-1">{paidPercentage}%</div>
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
                    <div className="text-danger fs-3 fw-bold">{stats.cancelledBookings}</div>
                    <div className="text-muted">Cancelled</div>
                    <div className="text-muted small mt-1">{cancelledPercentage}%</div>
                  </div>
                </div>
              </div>
              
              {/* Visual representation of booking status */}
              <div className="mb-3">
                <div className="d-flex align-items-center mb-1">
                  <div className="text-muted small me-2">Confirmed</div>
                  <div className="flex-grow-1 bg-light rounded" style={{ height: '8px' }}>
                    <div 
                      className="bg-success rounded" 
                      style={{ width: `${confirmedPercentage}%`, height: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <div className="text-muted small me-2">Pending</div>
                  <div className="flex-grow-1 bg-light rounded" style={{ height: '8px' }}>
                    <div 
                      className="bg-warning rounded" 
                      style={{ width: `${pendingPercentage}%`, height: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <div className="text-muted small me-2">Paid</div>
                  <div className="flex-grow-1 bg-light rounded" style={{ height: '8px' }}>
                    <div 
                      className="bg-info rounded" 
                      style={{ width: `${paidPercentage}%`, height: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="text-muted small me-2">Cancelled</div>
                  <div className="flex-grow-1 bg-light rounded" style={{ height: '8px' }}>
                    <div 
                      className="bg-danger rounded" 
                      style={{ width: `${cancelledPercentage}%`, height: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Recent Packages</h5>
                <Link to="/admin/packages" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
            </div>
            <div className="card-body p-0">
              {recentPackages.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  No packages available.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPackages.map(pkg => (
                        <tr key={pkg._id}>
                          <td className="fw-semibold">{pkg.name}</td>
                          <td>
                            <span className={`badge bg-${
                              pkg.type === 'travel' ? 'primary' : 
                              pkg.type === 'food' ? 'success' : 'info'
                            }`}>
                              {pkg.type}
                            </span>
                          </td>
                          <td className="fw-semibold">₹{pkg.price.toLocaleString()}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/packages/${pkg._id}`} 
                                  className="btn btn-outline-primary"
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <Link 
                                  to={`/admin/packages/edit/${pkg._id}`} 
                                  className="btn btn-outline-warning"
                                  title="Edit Package"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => deletePackage(pkg._id)}
                                  title="Delete Package"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light border-0 py-3">
          <h5 className="mb-0 fw-semibold">Quick Actions</h5>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <Link to="/admin/packages/add" className="btn btn-primary w-100 d-flex align-items-center justify-content-center p-3">
                <i className="bi bi-plus-circle me-2 fs-5"></i> 
                <span>Add New Package</span>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <Link to="/admin/bookings" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center p-3">
                <i className="bi bi-calendar-event me-2 fs-5"></i> 
                <span>Manage Bookings</span>
              </Link>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <Link to="/admin/packages" className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center p-3">
                <i className="bi bi-box-seam me-2 fs-5"></i> 
                <span>Manage Packages</span>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .stats-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .btn {
          border-radius: 8px;
          font-weight: 500;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .display-6 {
            font-size: 2rem;
          }
          .stats-icon {
            width: 50px;
            height: 50px;
          }
        }
        
        @media (max-width: 576px) {
          .display-6 {
            font-size: 1.75rem;
          }
          .stats-icon {
            width: 40px;
            height: 40px;
          }
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;