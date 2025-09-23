// client/src/pages/AdminPackageManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

const AdminPackageManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    if (!isAuthenticated || user.role !== 'admin') return;
    
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages');
        console.log('Packages data:', res.data);
        
        // Check if the response has the expected structure
        if (res.data && res.data.data) {
          setPackages(res.data.data);
        } else {
          console.error('Unexpected API response structure:', res.data);
          setError('Failed to load packages: Invalid response structure');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(err.response?.data?.message || 'Failed to fetch packages');
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, [isAuthenticated, user]);
  
  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await api.delete(`/packages/${id}`);
        // Refresh the packages list
        const res = await api.get('/packages');
        setPackages(res.data.data || []);
      } catch (err) {
        console.error('Error deleting package:', err);
        setError(err.response?.data?.message || 'Failed to delete package');
      }
    }
  };

  // Filter packages based on search term and filters
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (pkg.location && pkg.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || pkg.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && pkg.available) || 
                         (filterStatus === 'unavailable' && !pkg.available);
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="admin-package-management">
      <div className="container my-5">
        <div className="page-header mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h1 className="page-title mb-1">Package Management</h1>
              <p className="page-subtitle text-muted">Manage all travel packages and offerings</p>
            </div>
            <div className="mt-3 mt-md-0 d-flex gap-2">
              <Link to="/admin/packages/add" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i> Add New Package
              </Link>
              <Link to="/admin" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        
        <div className="stats-cards mb-4">
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <div className="stat-card bg-white rounded shadow-sm p-3">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-box-seam text-primary fs-4"></i>
                  </div>
                  <div>
                    <div className="stat-value">{packages.length}</div>
                    <div className="stat-label text-muted small">Total Packages</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card bg-white rounded shadow-sm p-3">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-success bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-check-circle text-success fs-4"></i>
                  </div>
                  <div>
                    <div className="stat-value">{packages.filter(p => p.available).length}</div>
                    <div className="stat-label text-muted small">Available</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card bg-white rounded shadow-sm p-3">
                <div className="d-flex align-items-center">
                  <div className="stat-icon bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-x-circle text-danger fs-4"></i>
                  </div>
                  <div>
                    <div className="stat-value">{packages.filter(p => !p.available).length}</div>
                    <div className="stat-label text-muted small">Unavailable</div>
                  </div>
                </div>
              </div>
            </div>
           
              
          
          </div>
        </div>
        
        {packages.length === 0 ? (
          <div className="empty-state">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <div className="empty-state-icon mb-4">
                  <div className="empty-state-illustration">
                    <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                </div>
                <h3 className="empty-state-title mb-2">No Packages Available</h3>
                <p className="empty-state-text text-muted mb-4">
                  You haven't created any packages yet. Start by adding your first package to showcase your travel offerings.
                </p>
                <Link to="/admin/packages/add" className="btn btn-primary px-4 py-2">
                  <i className="bi bi-plus-circle me-2"></i> Add Your First Package
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="packages-table-container">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <h5 className="mb-2 mb-md-0">All Packages ({filteredPackages.length} of {packages.length})</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="search-box">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search"></i>
                        </span>
                        <input 
                          type="text" 
                          className="form-control form-control-sm border-start-0 ps-0" 
                          placeholder="Search packages..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="filter-dropdown">
                      <select 
                        className="form-select form-select-sm" 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">Package Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Price</th>
                        <th scope="col">Location</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-center pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map(pkg => (
                          <tr key={pkg._id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div className="package-icon me-3">
                                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className={`bi ${
                                      pkg.type === 'travel' ? 'bi-geo-alt' : 
                                      pkg.type === 'food' ? 'bi-cup-hot' : 
                                      'bi-building'
                                    } text-primary`}></i>
                                  </div>
                                </div>
                                <div>
                                  <div className="fw-bold">{pkg.name}</div>
                                  <div className="text-muted small">
                                    {pkg.description && pkg.description.length > 50 ? `${pkg.description.substring(0, 50)}...` : pkg.description || 'No description'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${
                                pkg.type === 'travel' ? 'primary' : 
                                pkg.type === 'food' ? 'success' : 'info'
                              }`}>
                                {pkg.type}
                              </span>
                            </td>
                            <td>
                              <div className="fw-bold">₹{pkg.price}</div>
                              <div className="text-muted small">per person</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt text-muted me-1"></i>
                                <span>{pkg.location || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-clock text-muted me-1"></i>
                                <span>{pkg.duration || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${pkg.available ? 'success' : 'danger'} d-flex align-items-center`}>
                                <i className={`bi ${pkg.available ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                {pkg.available ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="text-center pe-4">
                              <div className="btn-group btn-group-sm" role="group">
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
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <div className="text-muted">
                              <i className="bi bi-search fs-4 d-block mb-2"></i>
                              No packages match your search criteria
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css');
        
        .admin-package-management {
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .page-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #212529;
        }
        
        .page-subtitle {
          font-size: 1rem;
        }
        
        .stats-cards {
          margin-bottom: 1.5rem;
        }
        
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .stat-icon {
          transition: transform 0.2s ease;
        }
        
        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 0.875rem;
        }
        
        .empty-state {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .empty-state-icon {
          opacity: 0.7;
        }
        
        .empty-state-title {
          font-weight: 600;
          color: #495057;
        }
        
        .empty-state-text {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .packages-table-container .card {
          border: none;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }
        
        .packages-table-container .card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
        }
        
        .packages-table-container .card-header {
          border-bottom: 1px solid rgba(0,0,0,.125);
        }
        
        .packages-table-container .table {
          margin-bottom: 0;
        }
        
        .packages-table-container .table thead th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }
        
        .packages-table-container .table tbody tr {
          transition: background-color 0.2s ease;
        }
        
        .packages-table-container .table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .packages-table-container .table tbody td {
          vertical-align: middle;
          border-top: 1px solid #f1f3f5;
        }
        
        .package-icon .icon-wrapper {
          transition: all 0.2s ease;
        }
        
        .package-icon .icon-wrapper:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn-group .btn {
          border-radius: 0.25rem;
          margin: 0 1px;
        }
        
        .btn-group .btn:first-child {
          margin-left: 0;
        }
        
        .btn-group .btn:last-child {
          margin-right: 0;
        }
        
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
          font-size: 0.75em;
        }
        
        .search-box .input-group {
          border-radius: 0.25rem;
          overflow: hidden;
        }
        
        .search-box .input-group-text {
          background-color: white;
          border-right: none;
        }
        
        .search-box .form-control {
          border-left: none;
        }
        
        .search-box .form-control:focus {
          box-shadow: none;
          border-color: #ced4da;
        }
        
        .filter-dropdown .form-select {
          border-radius: 0.25rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .page-header {
            text-align: center;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .stats-cards .stat-card {
            margin-bottom: 0.75rem;
          }
          
          .packages-table-container .table thead {
            display: none;
          }
          
          .packages-table-container .table, 
          .packages-table-container .table tbody, 
          .packages-table-container .table tr, 
          .packages-table-container .table td {
            display: block;
            width: 100% !important;
          }
          
          .packages-table-container .table tr {
            margin-bottom: 1rem;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
            padding: 0.75rem;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .packages-table-container .table td {
            text-align: right !important;
            padding-left: 50%;
            position: relative;
            border: none;
            border-bottom: 1px solid #f1f3f5;
          }
          
          .packages-table-container .table td:last-child {
            border-bottom: none;
          }
          
          .packages-table-container .table td::before {
            content: attr(data-label);
            position: absolute;
            left: 1rem;
            width: calc(50% - 2rem);
            padding-right: 1rem;
            text-align: left;
            font-weight: 600;
            color: #495057;
          }
          
          .packages-table-container .table td:first-child::before {
            content: "Package";
          }
          
          .packages-table-container .table td:nth-child(2)::before {
            content: "Type";
          }
          
          .packages-table-container .table td:nth-child(3)::before {
            content: "Price";
          }
          
          .packages-table-container .table td:nth-child(4)::before {
            content: "Location";
          }
          
          .packages-table-container .table td:nth-child(5)::before {
            content: "Duration";
          }
          
          .packages-table-container .table td:nth-child(6)::before {
            content: "Status";
          }
          
          .packages-table-container .table td:nth-child(7)::before {
            content: "Actions";
          }
          
          .packages-table-container .table td .btn-group {
            display: flex;
            justify-content: flex-end;
          }
          
          .packages-table-container .table td .package-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPackageManagement;