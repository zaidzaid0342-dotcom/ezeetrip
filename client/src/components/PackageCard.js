// client/src/components/PackageCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  // Add debug logging to see what's being passed
  console.log('PackageCard received data:', pkg);
  
  // Check if pkg is undefined or null
  if (!pkg) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <p className="card-text">Package data is not available.</p>
        </div>
      </div>
    );
  }
  
  // Safely destructure properties
  const { _id = '', name = 'Unknown Package', description = '', type = 'unknown', price = 0, images = [], location = '', duration = '' } = pkg;
  
  // Add debug logging for images specifically
  //console.log(`PackageCard for ${name}: Images =`, images);
  
  // Function to handle image loading errors
  const handleImageError = (e) => {
    console.error(`Failed to load image for package ${name}:`, e.target.src);
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  };
  
  // Determine badge color based on package type
  const getBadgeColor = () => {
    switch(type) {
      case 'travel': return 'primary';
      case 'resort': return 'info';
      default: return 'secondary';
    }
  };
  
  return (
    <div className="card package-card h-100 border-0 shadow-sm overflow-hidden">
      <div className="position-relative">
        {images && images.length > 0 ? (
          <img 
            src={images[0]} 
            className="card-img-top package-image" 
            alt={name} 
            onError={handleImageError}
          />
        ) : (
          <div className="card-img-top bg-light d-flex align-items-center justify-content-center">
            <i className="bi bi-image text-muted fs-1"></i>
          </div>
        )}
        
        {/* Package type badge */}
        <div className="position-absolute top-0 end-0 m-3">
          <span className={`badge bg-${getBadgeColor()} bg-opacity-75 text-white`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        
        {/* Availability badge */}
        {!pkg.available && (
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-danger bg-opacity-75 text-white">
              Not Available
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="mb-3">
          <h5 className="card-title fw-bold">{name}</h5>
          <div className="d-flex align-items-center text-muted small mb-2">
            {location && (
              <>
                <i className="bi bi-geo-alt me-1"></i>
                <span className="me-3">{location}</span>
              </>
            )}
            {duration && (
              <>
                <i className="bi bi-clock me-1"></i>
                <span>{duration}</span>
              </>
            )}
          </div>
        </div>
        
        <p className="card-text text-muted flex-grow-1">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="h5 text-primary mb-0">₹{price}</span>
            <span className="text-muted small"> / person</span>
          </div>
          <Link 
            to={`/packages/${_id}`} 
            className={`btn ${pkg.available ? 'btn-primary' : 'btn-secondary disabled'} btn-sm`}
          >
            {pkg.available ? 'View Details' : 'Unavailable'}
          </Link>
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        .package-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .package-image {
          height: 200px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .package-card:hover .package-image {
          transform: scale(1.05);
        }
        
        .card-img-top {
          height: 200px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PackageCard;