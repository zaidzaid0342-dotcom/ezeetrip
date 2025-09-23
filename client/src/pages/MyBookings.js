// client/src/pages/MyBookings.js
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Helper function to format date without timezone conversion
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Handle different date formats
    let date;
    
    // If it's in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)
    if (dateString.includes('T')) {
      // Extract just the date part (YYYY-MM-DD)
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      date = new Date(year, month - 1, day);
    } 
    // If it's in YYYY-MM-DD format
    else if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      date = new Date(year, month - 1, day);
    }
    // Try parsing as a regular date string
    else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    // Format the date as a string in the local timezone
    return date.toLocaleDateString();
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      // Check if response and response.data exist before accessing data
      if (res && res.data) {
        setBookings(res.data.data || []);
        setLastUpdated(new Date());
        setError('');
      } else {
        setBookings([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial fetch
    fetchBookings();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchBookings();
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [isAuthenticated]);

  const cancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
        // Immediately refresh to get the latest data
        fetchBookings();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    setLoading(true);
    fetchBookings();
  };

  if (!isAuthenticated) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          Please log in to view your bookings.
        </div>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Bookings</h1>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </div>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleManualRefresh}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
            <h4 className="mb-3">No Bookings Found</h4>
            <p className="text-muted mb-4">You haven't made any bookings yet.</p>
            <a href="/packages" className="btn btn-primary">
              Browse Packages
            </a>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Package</th>
                    <th>Booking Date</th>
                    <th>Travel Date</th>
                    <th>Guests</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold">{booking.orderId || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{booking.package?.name || 'Unknown Package'}</div>
                        <div className="text-muted small">
                          {booking.package?.type ? booking.package.type.charAt(0).toUpperCase() + booking.package.type.slice(1) : ''}
                        </div>
                      </td>
                      <td>{booking.bookingDate ? formatDate(booking.bookingDate) : '-'}</td>
                      <td>
                        {booking.startDate ? (
                          <div>
                            <div className="fw-bold">{formatDate(booking.startDate)}</div>
                            {booking.endDate && (
                              <div className="text-muted small">
                                to {formatDate(booking.endDate)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <div>
                          <i className="bi bi-person me-1"></i> {booking.adults || 0} adults
                          {booking.children > 0 && (
                            <div className="text-muted small">
                              <i className="bi bi-person me-1"></i> {booking.children} children
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold">₹{booking.totalPrice || 0}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${
                          booking.status === 'pending' ? 'warning' : 
                          booking.status === 'confirmed' ? 'success' : 
                          booking.status === 'paid' ? 'info' : 
                          'danger'
                        }`}>
                          {booking.status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        {/* Show cancel button only for pending bookings */}
                        {booking.status === 'pending' && (
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelBooking(booking._id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </button>
                        )}
                        
                        {/* Show payment status for confirmed and paid bookings */}
                        {booking.status === 'confirmed' && (
                          <span className="text-warning">
                            <i className="bi bi-clock-history me-1"></i>
                            Awaiting Payment
                          </span>
                        )}
                        
                        {booking.status === 'paid' && (
                          <span className="text-success">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Advance Paid
                          </span>
                        )}
                        
                        {/* Show message for cancelled bookings */}
                        {booking.status === 'cancelled' && (
                          <span className="text-muted">
                            <i className="bi bi-x-circle me-1"></i>
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS */}
      <style jsx>{`
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
};

export default MyBookings;