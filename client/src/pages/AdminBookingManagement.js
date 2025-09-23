// client/src/pages/AdminBookingManagement.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Spinner from "../components/Spinner";

const AdminBookingManagement = () => {
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Fetch all bookings
  const fetchBookings = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get("/bookings");
      if (res.data && res.data.data) {
        setBookings(res.data.data);
        setFilteredBookings(res.data.data);
        setLastUpdated(new Date());
        setError("");
      } else {
        setError("Failed to load bookings: Invalid response structure");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isAuthenticated || user.role !== "admin") return;
    fetchBookings();
  }, [isAuthenticated, user]);

  // Handle search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = bookings.filter((booking) => {
      if (!booking) return false;

      const orderId = booking.orderId || "";
      const mongoId = booking._id || "";
      const userName = booking.user?.name || "";
      const userEmail = booking.user?.email || "";
      const phone = booking.phone || booking.user?.phone || "";
      const packageName = booking.package?.name || "";
      const packageType = booking.package?.type || "";
      const status = booking.status || "";

      return (
        orderId.toLowerCase().includes(term) ||
        mongoId.toLowerCase().includes(term) ||
        userName.toLowerCase().includes(term) ||
        userEmail.toLowerCase().includes(term) ||
        phone.toLowerCase().includes(term) ||
        packageName.toLowerCase().includes(term) ||
        packageType.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term)
      );
    });

    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
      // Immediately refresh to get the latest data
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking status");
    }
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchBookings();
  };

  // Restrict access
  if (!isAuthenticated || user.role !== "admin") {
    return (
      <div className="container my-5">
        <div className="alert alert-danger shadow-sm border-0">
          <i className="bi bi-shield-lock me-2"></i>
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) return <Spinner />;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <div className="header-icon bg-primary bg-gradient rounded-3 me-3 d-flex align-items-center justify-content-center">
            <i className="bi bi-calendar-check text-white fs-4"></i>
          </div>
          <div>
            <h2 className="fw-bold mb-0">Booking Management</h2>
            <p className="text-muted mb-0">Manage and track all customer bookings</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <button 
            className="btn btn-sm btn-primary d-flex align-items-center"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-calendar-range text-primary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Bookings</h6>
                  <h3 className="fw-bold mb-0">{bookings.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-hourglass-split text-warning fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Pending</h6>
                  <h3 className="fw-bold mb-0">
                    {bookings.filter(b => b.status === 'pending').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-check-circle text-success fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Confirmed</h6>
                  <h3 className="fw-bold mb-0">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-cash text-info fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Paid</h6>
                  <h3 className="fw-bold mb-0">
                    {bookings.filter(b => b.status === 'paid').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Order ID, customer name, email, phone, or package..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 d-flex align-items-center justify-content-between">
              <span className="text-muted small">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Table */}
      {filteredBookings.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          {searchTerm
            ? "No bookings match your search criteria."
            : "No bookings available."}
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Package</th>
                    <th>Booking Date</th>
                    <th>Travel Date</th>
                    <th>Guests</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th className="text-center" style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      {/* Order ID */}
                      <td className="fw-bold">
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2 d-none d-md-inline">
                            {booking.orderId || booking._id.substring(0, 8)}
                          </span>
                          <span className="d-md-none">
                            {booking.orderId || booking._id.substring(0, 6)}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-3 d-none d-md-flex">
                            {booking.user?.name
                              ? booking.user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <div className="fw-bold">
                              {booking.user?.name || "Unknown Customer"}
                            </div>
                            <div className="text-muted small d-none d-md-block">
                              {booking.user?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        {booking.phone || booking.user?.phone ? (
                          <div className="d-flex align-items-center">
                            <div className="phone-icon bg-primary bg-opacity-10 rounded-circle p-2 me-2 d-none d-md-flex">
                              <i className="bi bi-telephone text-primary"></i>
                            </div>
                            <span>{booking.phone || booking.user?.phone}</span>
                          </div>
                        ) : (
                          <span className="text-muted">Not provided</span>
                        )}
                      </td>

                      {/* Package */}
                      <td>
                        <div className="fw-bold">
                          {booking.package?.name || "Unknown Package"}
                        </div>
                        <div className="text-muted small d-none d-md-block">
                          {booking.package?.type
                            ? booking.package.type.charAt(0).toUpperCase() +
                              booking.package.type.slice(1)
                            : ""}
                        </div>
                      </td>

                      {/* Booking Date */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="date-icon bg-light rounded-circle p-2 me-2 d-none d-md-flex">
                            <i className="bi bi-calendar text-muted"></i>
                          </div>
                          <span>
                            {booking.bookingDate
                              ? formatDate(booking.bookingDate)
                              : "-"}
                          </span>
                        </div>
                      </td>

                      {/* Travel Date */}
                      <td>
                        {booking.startDate ? (
                          <div>
                            <div className="fw-bold">{formatDate(booking.startDate)}</div>
                            {booking.endDate && (
                              <div className="text-muted small d-none d-md-block">
                                to {formatDate(booking.endDate)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>

                      {/* Guests */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="guests-icon bg-light rounded-circle p-2 me-2 d-none d-md-flex">
                            <i className="bi bi-people text-muted"></i>
                          </div>
                          <div>
                            <div>{booking.adults || 0} adults</div>
                            {booking.children > 0 && (
                              <div className="text-muted small">
                                {booking.children} children
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="fw-bold">
                        <div className="d-flex align-items-center">
                          <div className="price-icon bg-success bg-opacity-10 rounded-circle p-2 me-2 d-none d-md-flex">
                            <i className="bi bi-currency-rupee fs-5 text-success">₹</i>
                          </div>
                          <span>
                            {booking.totalPrice ? booking.totalPrice.toLocaleString() : "0"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge rounded-pill d-flex align-items-center ${
                            booking.status === "pending"
                              ? "bg-warning text-dark"
                              : booking.status === "confirmed"
                              ? "bg-success"
                              : booking.status === "paid"
                              ? "bg-info"
                              : "bg-danger"
                          }`}
                        >
                          {booking.status === "pending" && (
                            <i className="bi bi-hourglass-split me-1"></i>
                          )}
                          {booking.status === "confirmed" && (
                            <i className="bi bi-check-circle me-1"></i>
                          )}
                          {booking.status === "paid" && (
                            <i className="bi bi-cash me-1"></i>
                          )}
                          {booking.status === "cancelled" && (
                            <i className="bi bi-x-circle me-1"></i>
                          )}
                          {booking.status || "Unknown"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-center">
                        {booking.status === "pending" && (
                          <div className="btn-group-vertical btn-group-sm">
                            <button
                              className="btn btn-success d-flex align-items-center justify-content-center"
                              onClick={() =>
                                updateBookingStatus(booking._id, "confirmed")
                              }
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Confirm
                            </button>
                            <button
                              className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                              onClick={() =>
                                updateBookingStatus(booking._id, "cancelled")
                              }
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel
                            </button>
                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <div className="btn-group-vertical btn-group-sm">
                            <button
                              className="btn btn-info d-flex align-items-center justify-content-center"
                              onClick={() =>
                                updateBookingStatus(booking._id, "paid")
                              }
                            >
                              <i className="bi bi-cash me-1"></i>
                              Mark as Paid
                            </button>
                            <button
                              className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                              onClick={() =>
                                updateBookingStatus(booking._id, "cancelled")
                              }
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel
                            </button>
                          </div>
                        )}

                        {booking.status === "paid" && (
                          <span className="badge bg-success d-flex align-items-center justify-content-center">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Advance Paid
                          </span>
                        )}

                        {booking.status === "cancelled" && (
                          <span className="badge bg-secondary d-flex align-items-center justify-content-center">
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

      {/* Custom Styles */}
      <style jsx>{`
        .header-icon {
          width: 60px;
          height: 60px;
        }
        .stats-icon {
          width: 50px;
          height: 50px;
        }
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d6efd, #6610f2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
        }
        .phone-icon, .date-icon, .guests-icon, .price-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .btn-group-vertical {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .btn-group-vertical .btn {
          border-radius: 6px;
          font-weight: 500;
        }
        .badge {
          padding: 0.5em 0.75em;
          font-weight: 500;
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
        .input-group-text {
          border-radius: 8px 0 0 8px;
        }
        .form-control {
          border-radius: 0 8px 8px 0;
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.9rem;
          }
          .btn-group-vertical .btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
          }
          .stats-icon {
            width: 40px;
            height: 40px;
          }
          h3 {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .table-responsive {
            font-size: 0.8rem;
          }
          .badge {
            font-size: 0.7rem;
            padding: 0.35em 0.65em;
          }
          .stats-icon {
            width: 35px;
            height: 35px;
          }
          h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBookingManagement;