// client/src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm" ref={navbarRef}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="logo-container me-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100" className="logo">
              {/* Outer circle */}
              <circle cx="50" cy="50" r="45" fill="#0d6efd" />
              
              {/* Inner circle - lighter shade */}
              <circle cx="50" cy="50" r="38" fill="#4d94ff" />
              
              {/* Mountain silhouette */}
              <path d="M25 65 L40 45 L50 55 L60 40 L75 65 Z" fill="white" opacity="0.9" />
              
              {/* Sun */}
              <circle cx="70" cy="30" r="8" fill="#FFD700" />
              
              {/* Road/path */}
              <path d="M20 70 Q50 80 80 70" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Location pin */}
              <path d="M50 35 C45 35 40 40 40 45 C40 50 50 65 50 65 C50 65 60 50 60 45 C60 40 55 35 50 35 Z" fill="white" />
              <circle cx="50" cy="45" r="3" fill="#0d6efd" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">Ezee</span>
            <span className="brand-suffix">Trip</span>
          </div>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/packages" onClick={() => setIsMenuOpen(false)}>Packages</Link>
            </li>
           
          </ul>
          
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {/* Combined Admin/User Dropdown */}
                <li className="nav-item dropdown">
                  <Link 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    to="#" 
                    id="userDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <div className="user-avatar me-2">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <span>{user ? user.name : 'User'}</span>
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="userDropdown">
                    {/* Admin Links - Only visible to admin users */}
                    {isAuthenticated && user && user.role === 'admin' && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/admin" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/packages" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-box-seam me-2"></i> Manage Packages
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/bookings" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-calendar-check me-2"></i> Manage Bookings
                          </Link>
                        </li>
                       
                       
                        <li><hr className="dropdown-divider" /></li>
                      </>
                    )}
                    
                    {/* User Links - Visible to all authenticated users */}
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-person me-2"></i> Profile
                      </Link>
                    </li>
                    
                    {/* Only show My Bookings for non-admin users */}
                    {user && user.role !== 'admin' && (
                      <li>
                        <Link className="dropdown-item" to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                          <i className="bi bi-calendar-check me-2"></i> My Bookings
                        </Link>
                      </li>
                    )}
                    
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        .navbar {
          background-color: #0d6efd !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
        }
        
        .navbar-brand {
          font-weight: 700;
          font-size: 1.5rem;
          padding: 0;
        }
        
        .logo-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }
        
        .logo-container:hover {
          transform: scale(1.05);
        }
        
        .logo {
          width: 100%;
          height: 100%;
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        
        .brand-name {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .brand-suffix {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
          font-size: 0.9rem;
        }
        
        .nav-link {
          font-weight: 500;
          margin: 0 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .dropdown-menu {
          border-radius: 8px;
          margin-top: 0.5rem;
        }
        
        .dropdown-item {
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          padding-left: 1.25rem;
        }
        
        .dropdown-item i {
          width: 16px;
          text-align: center;
        }
        
        .dropdown-divider {
          margin: 0.5rem 0;
        }
        
        @media (max-width: 991px) {
          .navbar-nav {
            padding-top: 1rem;
          }
          
          .nav-link {
            padding: 0.5rem 0;
          }
          
          .user-avatar {
            margin-right: 0.5rem !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;