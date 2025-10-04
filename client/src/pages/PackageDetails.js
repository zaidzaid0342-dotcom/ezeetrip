// client/src/pages/PackageDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import BookingForm from '../components/BookingForm';

const PackageDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const history = useHistory();
  
  const [pkg, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // ALL HOOKS MUST BE CALLED HERE (before any conditional returns)
  
  // Memoized fetch function to prevent unnecessary re-fetching
  const fetchPackage = useCallback(async () => {
    try {
      const res = await api.get(`/packages/${id}`);
      setPackage(res.data.data);
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch package details');
      setLoading(false);
    }
  }, [id]);
  
  // Function to refresh package data
  const refreshPackage = useCallback(() => {
    setRefreshing(true);
    fetchPackage().finally(() => setRefreshing(false));
  }, [fetchPackage]);
  
  // Image navigation handlers
  const nextImage = useCallback(() => {
    setImageLoading(true);
    setActiveImageIndex((prevIndex) => 
      prevIndex === (pkg?.images?.length || 0) - 1 ? 0 : prevIndex + 1
    );
  }, [pkg?.images?.length]);
  
  const prevImage = useCallback(() => {
    setImageLoading(true);
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? (pkg?.images?.length || 0) - 1 : prevIndex - 1
    );
  }, [pkg?.images?.length]);
  
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);
  
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);
  
  const handleThumbnailClick = useCallback((index) => {
    setImageLoading(true);
    setActiveImageIndex(index);
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchPackage();
  }, [fetchPackage]);
  
  // NOW WE CAN DO CONDITIONAL RETURNS
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="container my-5">
        <div className="error-container">
          <div className="error-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-primary"
              onClick={refreshPackage}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => history.push('/packages')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Packages
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!pkg) {
    return (
      <div className="container my-5">
        <div className="error-container">
          <div className="error-icon">
            <i className="bi bi-search"></i>
          </div>
          <h3 className="error-title">Package Not Found</h3>
          <p className="error-message">The package you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => history.push('/packages')}
          >
            Browse All Packages
          </button>
        </div>
      </div>
    );
  }
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user && user.role === 'admin';
  
  return (
    <div className="package-details-page">
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/packages">Packages</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{pkg.name}</li>
          </ol>
        </nav>
      </div>
      
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-8">
            {/* Image Gallery */}
            <div className="image-gallery mb-4">
              {pkg.images && pkg.images.length > 0 ? (
                <>
                  <div className="main-image-container">
                    {imageLoading && (
                      <div className="image-loading-overlay">
                        <div className="spinner-container">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    )}
                    
                    {imageError ? (
                      <div className="image-error-placeholder">
                        <div className="error-content">
                          <i className="bi bi-exclamation-triangle"></i>
                          <h4>Image Failed to Load</h4>
                          <p>Please try again later</p>
                          <button 
                            className="btn btn-sm btn-outline-primary mt-2"
                            onClick={() => {
                              setImageLoading(true);
                              setImageError(false);
                            }}
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <img 
                        key={activeImageIndex} // Force re-render when index changes
                        src={pkg.images[activeImageIndex]} 
                        className="main-image" 
                        alt={`${pkg.name} view ${activeImageIndex + 1}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )}
                    
                    <button className="gallery-nav prev" onClick={prevImage}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                  
                  {pkg.images.length > 1 && (
                    <div className="thumbnail-container">
                      {pkg.images.map((image, index) => (
                        <div 
                          key={index}
                          className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img 
                            src={image} 
                            alt={`Thumbnail ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('thumbnail-error');
                            }}
                          />
                          {index === activeImageIndex && (
                            <div className="thumbnail-overlay"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder">
                  <div className="no-image-content">
                    <i className="bi bi-image"></i>
                    <h4>No Images Available</h4>
                    <p>Check back soon for updated photos of this experience</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Package Information */}
            <div className="package-info-card">
              <div className="package-header">
                <div className="package-title-section">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <h1 className="package-title">{pkg.name}</h1>
                    <span className={`package-type-badge ${
                      pkg.type === 'travel' ? 'travel' : 
                      pkg.type === 'food' ? 'food' : 'resort'
                    }`}>
                      {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                    </span>
                  </div>
                  
                  <div className="package-meta">
                    <div className="price-info">
                      <span className="price">₹{pkg.price}</span>
                      <span className="price-unit">per adult</span>
                    </div>
                    <div className="availability-badge">
                      {pkg.available ? 
                        <span className="available">Available</span> : 
                        <span className="unavailable">Not Available</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="package-description">
                <p>{pkg.description}</p>
              </div>
              
              <div className="package-features">
                <div className="features-grid">
                  {pkg.location && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-geo-alt"></i>
                      </div>
                      <div className="feature-content">
                        <h4>Location</h4>
                        <p>{pkg.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {pkg.duration && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-clock"></i>
                      </div>
                      <div className="feature-content">
                        <h4>Duration</h4>
                        <p>{pkg.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {pkg.meals && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-cup-hot">🍽</i>
                      </div>
                      <div className="feature-content">
                        <h4>Meals</h4>
                        <p>{pkg.meals}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="bi bi-currency-rupee">₹</i>
                    </div>
                    <div className="feature-content">
                      <h4>Pricing</h4>
                      <p>Adults: ₹{pkg.price}/Per Person | Children: ₹{pkg.price / 2}/Per Person</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="package-note">
                <div className="note-icon">
                  <i className="bi bi-info-circle"></i>
                </div>
                <div className="note-content">
                  <h4>Important Information</h4>
                  <p>Advance payment is required to secure your booking (not the full amount).<hr></hr>
                    Within One hour You will be Contacted for Payment
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            {/* Booking Card */}
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book This Experience</h3>
                <p>Secure your spot for this amazing journey</p>
              </div>
              
              <div className="booking-body">
                {isAuthenticated && !isAdmin ? (
                  pkg.available ? (
                    <BookingForm pkg={pkg} onBookingSuccess={refreshPackage} />
                  ) : (
                    <div className="booking-unavailable">
                      <div className="unavailable-icon">
                        <i className="bi bi-exclamation-triangle"></i>
                      </div>
                      <h4>Currently Unavailable</h4>
                      <p>This package is not available for booking at the moment. Please check back later.</p>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => history.push('/packages')}
                      >
                        Browse Other Packages
                      </button>
                    </div>
                  )
                ) : isAuthenticated && isAdmin ? (
                  <div className="admin-view">
                    <div className="admin-icon">
                      <i className="bi bi-shield-lock"></i>
                    </div>
                    <h4>Admin Account</h4>
                    <p>As an admin, you can manage this package but cannot book it.</p>
                    <div className="admin-actions">
                      <Link to={`/admin/packages/edit/${pkg._id}`} className="btn btn-warning">
                        <i className="bi bi-pencil-square"></i> Edit Package
                      </Link>
                      <Link to="/admin/bookings" className="btn btn-outline-primary">
                        <i className="bi bi-calendar-check"></i> View All Bookings
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="login-required">
                    <div className="login-icon">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <h4>Login Required</h4>
                    <p>Please log in or create an account to book this package.</p>
                    <div className="login-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => history.push('/login')}
                      >
                        <i className="bi bi-box-arrow-in-right"></i> Login
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => history.push('/register')}
                      >
                        <i className="bi bi-person-plus"></i> Register
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        /* Breadcrumb Styling */
        .breadcrumb {
          background-color: transparent;
          padding: 0;
          margin: 0;
          font-size: 14px;
        }
        
        .breadcrumb-item + .breadcrumb-item::before {
          content: ">";
          color: #6c757d;
        }
        
        .breadcrumb-item a {
          color: #19376D;
          text-decoration: none;
        }
        
        .breadcrumb-item a:hover {
          text-decoration: underline;
        }
        
        .breadcrumb-item.active {
          color: #495057;
        }
        
        /* Error Styling */
        .error-container {
          text-align: center;
          padding: 60px 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .error-icon {
          font-size: 64px;
          color: #dc3545;
          margin-bottom: 20px;
        }
        
        .error-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #212529;
        }
        
        .error-message {
          font-size: 18px;
          color: #6c757d;
          margin-bottom: 30px;
        }
        
        .error-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        /* Image Gallery */
        .image-gallery {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        
        .main-image-container {
          position: relative;
          height: 500px;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s ease;
        }
        
        .image-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .spinner-container {
          width: 50px;
          height: 50px;
        }
        
        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid rgba(25, 55, 109, 0.1);
          border-top: 4px solid #19376D;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .image-error-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }
        
        .error-content {
          text-align: center;
          padding: 20px;
        }
        
        .error-content i {
          font-size: 48px;
          color: #dc3545;
          margin-bottom: 15px;
        }
        
        .error-content h4 {
          font-size: 20px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 10px;
        }
        
        .error-content p {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }
        
        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #19376D;
          cursor: pointer;
          z-index: 2;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .gallery-nav:hover {
          background-color: rgba(255, 255, 255, 0.95);
          transform: translateY(-50%) scale(1.1);
        }
        
        .gallery-nav.prev {
          left: 20px;
        }
        
        .gallery-nav.next {
          right: 20px;
        }
        
        .thumbnail-container {
          display: flex;
          padding: 15px;
          background-color: #f8f9fa;
          overflow-x: auto;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: #19376D;
        }
        
        .thumbnail-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .thumbnail-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .thumbnail-container::-webkit-scrollbar-thumb {
          background: #19376D;
          border-radius: 4px;
        }
        
        .thumbnail {
          flex: 0 0 100px;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
        }
        
        .thumbnail:hover {
          opacity: 0.9;
        }
        
        .thumbnail.active {
          opacity: 1;
          border-color: #19376D;
        }
        
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .thumbnail-error {
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .thumbnail-error::after {
          content: "⚠️";
          font-size: 24px;
        }
        
        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid #19376D;
          border-radius: 6px;
          pointer-events: none;
        }
        
        .no-image-placeholder {
          height: 500px;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .no-image-content {
          text-align: center;
          padding: 20px;
        }
        
        .no-image-content i {
          font-size: 64px;
          color: #adb5bd;
          margin-bottom: 15px;
        }
        
        .no-image-content h4 {
          font-size: 24px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 10px;
        }
        
        .no-image-content p {
          color: #6c757d;
          margin: 0;
        }
        
        /* Package Info Card */
        .package-info-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          padding: 30px;
          margin-bottom: 30px;
        }
        
        .package-header {
          margin-bottom: 25px;
        }
        
        .package-title {
          font-size: 32px;
          font-weight: 700;
          color: #19376D;
          margin: 0;
        }
        
        .package-type-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .package-type-badge.travel {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }
        
        .package-type-badge.food {
          background-color: rgba(25, 135, 84, 0.1);
          color: #198754;
        }
        
        .package-type-badge.resort {
          background-color: rgba(13, 202, 240, 0.1);
          color: #0dcaf0;
        }
        
        .package-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
        }
        
        .price-info {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        
        .price {
          font-size: 28px;
          font-weight: 700;
          color: #19376D;
        }
        
        .price-unit {
          font-size: 16px;
          color: #6c757d;
        }
        
        .availability-badge span {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .availability-badge .available {
          background-color: rgba(25, 135, 84, 0.1);
          color: #198754;
        }
        
        .availability-badge .unavailable {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        .package-description {
          margin-bottom: 30px;
        }
        
        .package-description p {
          font-size: 18px;
          line-height: 1.6;
          color: #495057;
          margin: 0;
        }
        
        .package-features {
          margin-bottom: 30px;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        
        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(25, 55, 109, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .feature-icon i {
          font-size: 24px;
          color: #19376D;
        }
        
        .feature-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #19376D;
          margin: 0 0 5px;
        }
        
        .feature-content p {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }
        
        .package-note {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background-color: rgba(13, 202, 240, 0.1);
          border-radius: 8px;
        }
        
        .note-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(13, 202, 240, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .note-icon i {
          font-size: 20px;
          color: #0dcaf0;
        }
        
        .note-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #0dcaf0;
          margin: 0 0 5px;
        }
        
        .note-content p {
          font-size: 16px;
          color: #495057;
          margin: 0;
        }
        
        /* Booking Card */
        .booking-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: sticky;
          top: 20px;
        }
        
        .booking-header {
          background-color: #19376D;
          color: white;
          padding: 25px;
          text-align: center;
        }
        
        .booking-header h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 10px;
        }
        
        .booking-header p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
        
        .booking-body {
          padding: 25px;
        }
        
        .booking-unavailable,
        .admin-view,
        .login-required {
          text-align: center;
          padding: 20px 0;
        }
        
        .unavailable-icon,
        .admin-icon,
        .login-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .unavailable-icon {
          background-color: rgba(220, 53, 69, 0.1);
        }
        
        .unavailable-icon i {
          font-size: 36px;
          color: #dc3545;
        }
        
        .admin-icon {
          background-color: rgba(25, 55, 109, 0.1);
        }
        
        .admin-icon i {
          font-size: 36px;
          color: #19376D;
        }
        
        .login-icon {
          background-color: rgba(13, 110, 253, 0.1);
        }
        
        .login-icon i {
          font-size: 36px;
          color: #0d6efd;
        }
        
        .booking-unavailable h4,
        .admin-view h4,
        .login-required h4 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 10px;
        }
        
        .booking-unavailable p,
        .admin-view p,
        .login-required p {
          font-size: 16px;
          color: #6c757d;
          margin: 0 0 20px;
        }
        
        .admin-actions,
        .login-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .admin-actions .btn,
        .login-actions .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .booking-card {
            position: relative;
            top: 0;
            margin-top: 30px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 767px) {
          .package-title {
            font-size: 24px;
          }
          
          .main-image-container {
            height: 300px;
          }
          
          .package-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .thumbnail {
            flex: 0 0 80px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageDetails;