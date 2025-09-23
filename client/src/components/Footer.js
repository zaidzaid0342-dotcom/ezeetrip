// client/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="logo-container me-2">
                <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#0d6efd" />
                  <path d="M30 50 L45 35 L55 45 L70 30 L70 70 L55 55 L45 65 L30 50 Z" fill="white" />
                  <circle cx="50" cy="50" r="8" fill="white" />
                </svg>
              </div>
              <h4 className="mb-0">Ezee<span className="text-primary">Trip</span></h4>
            </div>
            <p className="mb-3">Your trusted travel partner for exploring the breathtaking beauty of Chikkamagaluru and beyond.</p>
            <div className="social-links d-flex gap-3 mt-4">
              <a href="https://wa.me/9845212525" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/packages" className="footer-link">Packages</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Contact Us</h5>
            <ul className="list-unstyled footer-contact">
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-map-marker-alt me-3 mt-1"></i>
                <span>123 Coffee Estate Road, Chikkamagaluru, Karnataka 577101</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fas fa-phone-alt me-3"></i>
                <span>+91 9845212525</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fas fa-envelope me-3"></i>
                <span>info@ezeetrip.com</span>
              </li>
              
            </ul>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 copyright">© 2025 Ezee Trip. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 footer-legal">
              <Link to="/privacy" className="footer-legal-link me-3">Privacy Policy</Link>
              <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom CSS */}
      <style jsx>{`
        footer {
          background-color: #121212 !important;
          border-top: 3px solid #0d6efd;
        }
        
        .logo-container {
          width: 50px;
          height: 50px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .logo-container:hover {
          transform: scale(1.05);
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        h4 {
          font-weight: 700;
          font-size: 1.5rem;
        }
        
        .text-primary {
          color: #4d94ff !important;
        }
        
        p {
          color: #adb5bd;
          line-height: 1.6;
        }
        
        h5 {
          font-size: 1rem;
          letter-spacing: 1px;
          position: relative;
          padding-bottom: 10px;
        }
        
        h5:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: #0d6efd;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: white;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: #0d6efd;
          transform: translateY(-3px);
        }
        
        .footer-links li {
          margin-bottom: 10px;
        }
        
        .footer-link {
          color: #adb5bd;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: all 0.3s ease;
        }
        
        .footer-link:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: #0d6efd;
          transition: width 0.3s ease;
        }
        
        .footer-link:hover {
          color: white;
        }
        
        .footer-link:hover:after {
          width: 100%;
        }
        
        .footer-contact li {
          margin-bottom: 15px;
        }
        
        .footer-contact i {
          color: #0d6efd;
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
        }
        
        .footer-contact span {
          color: #adb5bd;
        }
        
        hr {
          opacity: 0.2;
        }
        
        .copyright {
          color: #adb5bd;
          font-size: 0.9rem;
        }
        
        .footer-legal {
          font-size: 0.9rem;
        }
        
        .footer-legal-link {
          color: #adb5bd;
          text-decoration: none;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .footer-legal-link:hover {
          color: white;
        }
        
        @media (max-width: 768px) {
          footer {
            padding-top: 3rem;
            padding-bottom: 2rem;
          }
          
          .logo-container {
            width: 40px;
            height: 40px;
          }
          
          h4 {
            font-size: 1.3rem;
          }
          
          h5 {
            margin-bottom: 1rem;
          }
          
          .social-icon {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;