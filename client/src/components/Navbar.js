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
      // Check if the click is outside the navbar (and not the toggler button, which is handled by Bootstrap/React state)
      // Note: For Bootstrap dropdowns, the click is often handled by Bootstrap's JS, but this addresses the collapse menu for mobile.
      const toggler = document.querySelector('.navbar-toggler');
      if (navbarRef.current && !navbarRef.current.contains(event.target) && !toggler.contains(event.target)) {
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
            <img 
                src="https://t4.ftcdn.net/jpg/06/69/59/39/240_F_669593927_gN5dR3fy1IQP5yvAq0YTb8OdMZfq6A38.jpg" 
                alt="Ezee Trip Logo" 
                className="rounded-circle img-fluid"
              />
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
          aria-expanded={isMenuOpen ? 'true' : 'false'} 
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
                    className="nav-link dropdown-toggle user-dropdown-link d-flex align-items-center" 
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
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="userDropdown">
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
                      <button className="dropdown-item logout-button" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
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
                  <Link className="nav-link register-btn" to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        /* --- General Navbar Styling --- */
        .navbar {
          /* Using a slightly darker/deeper primary blue for a richer feel */
          background-color: #0c5cb2 !important; /* Slightly darker than default #0d6efd */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow */
          padding: 0.75rem 0;
          transition: background-color 0.3s ease;
        }

        .navbar-brand {
          font-weight: 700;
          font-size: 1.5rem;
          padding: 0;
        }

        /* --- Logo Styling --- */
        .logo-container {
          width: 45px; /* Slightly larger logo */
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3); /* White border and stronger shadow */
          transition: transform 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.1); /* More pronounced hover effect */
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        
        .brand-name {
          color: white;
          font-weight: 800; /* Bolder font weight */
          font-size: 1.35rem; /* Slightly larger brand name */
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .brand-suffix {
          color: rgba(255, 255, 255, 0.9); /* Brighter suffix */
          font-weight: 500;
          font-size: 0.8rem; /* Slightly smaller suffix */
          letter-spacing: 1px;
        }

        /* --- Nav Links Styling --- */
        .nav-link {
          font-weight: 600; /* Bolder font weight for links */
          margin: 0 0.5rem; /* Increased margin */
          padding: 0.5rem 0.75rem !important; /* Custom padding for better click area */
          border-radius: 8px; /* Rounded corners for links */
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.2); /* More visible hover background */
          color: white;
        }

        /* --- User Dropdown Styling (Authenticated) --- */
        .user-dropdown-link {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px; /* Pill-shaped button */
          padding-right: 1.2rem !important;
        }

        .user-dropdown-link:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background-color: white; /* White background for icon */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0c5cb2; /* Icon color matching navbar background */
          font-size: 1.2rem;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        
        .dropdown-menu {
          border-radius: 10px; /* Softer rounded corners */
          margin-top: 0.5rem;
          min-width: 200px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* Deeper shadow */
        }
        
        .dropdown-item {
          font-weight: 500;
          padding: 0.6rem 1rem; /* Increased padding */
          transition: all 0.2s ease;
          color: #333; /* Darker text */
        }
        
        .dropdown-item:hover {
          background-color: #e9ecef; /* Lighter hover background */
          color: #0c5cb2; /* Primary color text on hover */
          padding-left: 1.5rem; /* Larger indent on hover */
        }
        
        .dropdown-item i {
          width: 20px; /* Slightly wider icon area */
          text-align: center;
          margin-right: 0.75rem !important;
          color: #6c757d; /* Muted icon color */
        }

        .dropdown-item:hover i {
          color: #0c5cb2; /* Icon primary color on hover */
        }

        .logout-button {
            color: #dc3545; /* Danger color for logout button text */
        }
        
        .logout-button:hover {
            background-color: #f8d7da; /* Light red background on hover */
            color: #dc3545; /* Keep text red */
        }
        
        .dropdown-divider {
          margin: 0.5rem 0;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        /* --- Unauthenticated Buttons --- */
        .register-btn {
          /* Highlight the register button */
          background-color: #ffc107; /* Warning yellow */
          color: #212529 !important; /* Dark text */
          font-weight: 700;
        }

        .register-btn:hover {
          background-color: #e0a800; /* Darker yellow on hover */
          color: #212529 !important;
          transform: translateY(-1px); /* Slight lift */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        /* --- Mobile Responsiveness --- */
        @media (max-width: 991px) {
          .navbar-nav {
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1); /* Separator line in mobile menu */
          }
          
          .nav-link {
            padding: 0.75rem 0.5rem !important;
            margin: 0.25rem 0;
          }
          
          .user-dropdown-link {
            padding-right: 0.75rem !important;
            margin-bottom: 0.5rem;
          }

          .user-avatar {
            margin-right: 0.5rem !important;
          }

          /* Ensure dropdown menu is full width on mobile */
          .dropdown-menu {
            position: static;
            float: none;
            width: 100%;
            margin-top: 0;
            border: none;
            box-shadow: none;
          }

          .dropdown-item {
            padding-left: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;