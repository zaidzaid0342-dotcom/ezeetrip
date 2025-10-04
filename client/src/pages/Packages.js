// client/src/pages/Packages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import Spinner from '../components/Spinner';
import './Packages.css'; // Import external CSS

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [apiError, setApiError] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    // Check if CSS is loaded
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${process.env.PUBLIC_URL}/css/packages.css`;
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    let source;
    let timeoutId;
    
    const fetchPackages = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL;
        source = axios.CancelToken.source();
        
        // Set a timeout for the request
        timeoutId = setTimeout(() => {
          source.cancel('Request timed out');
        }, 10000); // 10 seconds timeout
        
        const res = await axios.get(`${API_BASE}/packages`, {
          cancelToken: source.token
        });
        
        clearTimeout(timeoutId);
        
        setPackages(res.data.data);
        setFilteredPackages(res.data.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.error('Request canceled:', err.message);
        } else {
          console.error('Error fetching packages:', err);
          setApiError(true);
        }
        setLoading(false);
      }
    };

    fetchPackages();
    
    // Cleanup function
    return () => {
      if (source) {
        source.cancel('Component unmounted');
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    let result = packages;

    // Filter by type
    if (filters.type) {
      result = result.filter(pkg => pkg.type === filters.type);
    }

    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(pkg => pkg.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(pkg => pkg.price <= parseInt(filters.maxPrice));
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm) || 
        pkg.description.toLowerCase().includes(searchTerm) ||
        (pkg.location && pkg.location.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredPackages(result);
  }, [filters, packages]);

  const onChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const retryFetch = () => {
    setLoading(true);
    setApiError(false);
    const fetchPackages = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${API_BASE}/packages`);
        setPackages(res.data.data);
        setFilteredPackages(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setApiError(true);
        setLoading(false);
      }
    };
    fetchPackages();
  };

  // Skeleton loader component
  const PackageCardSkeleton = () => (
    <div className="package-card skeleton">
      <div className="card-image skeleton-image"></div>
      <div className="card-content">
        <div className="card-title skeleton-title"></div>
        <div className="card-description skeleton-description"></div>
        <div className="card-description skeleton-description"></div>
        <div className="card-footer">
          <div className="card-price skeleton-price"></div>
          <div className="card-button skeleton-button"></div>
        </div>
      </div>
    </div>
  );

  // Critical CSS for initial render
  const criticalCSS = `
    .packages-page {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    .packages-hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    
    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://images.unsplash.com/photo-1610028877875-a1810b68db5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fGRhcmslMjB3aWxkfGVufDB8fDB8fHww');
      background-size: cover;
      background-position: center;
      z-index: -2;
      transition: transform 10s ease;
    }
    
    .hero-tag {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .hero-title {
      color: #fff;
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .hero-description {
      color: rgba(255, 255, 255, 0.95);
      font-size: 20px;
      margin-bottom: 32px;
      max-width: 540px;
      line-height: 1.7;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .hero-text {
      max-width: 600px;
      padding: 40px;
      background-color: transparent;
      border-radius: 12px;
    }
    
    .btn-explore {
      display: inline-block;
      background-color: #fff;
      color: #19376D;
      padding: 16px 36px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .btn-explore:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .package-card .skeleton {
      margin-bottom: 10px;
    }
    
    .package-card .card-image.skeleton {
      height: 200px;
      margin-bottom: 0;
    }
    
    .package-card .card-title.skeleton {
      height: 24px;
      width: 80%;
    }
    
    .package-card .card-description.skeleton {
      height: 16px;
      width: 100%;
    }
    
    .package-card .card-description.skeleton:last-of-type {
      width: 60%;
    }
    
    .package-card .card-price.skeleton {
      height: 20px;
      width: 40%;
    }
    
    .package-card .card-button.skeleton {
      height: 36px;
      width: 100px;
    }
    
    /* Responsive styles */
    @media (max-width: 1200px) {
      .hero-title {
        font-size: 48px;
      }
      
      .hero-description {
        font-size: 18px;
      }
    }
    
    @media (max-width: 992px) {
      .hero-title {
        font-size: 42px;
      }
      
      .hero-description {
        font-size: 17px;
      }
      
      .hero-text {
        max-width: 100%;
        padding: 30px;
      }
      
      .btn-explore {
        padding: 14px 30px;
        font-size: 15px;
      }
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 36px;
      }
      
      .hero-description {
        font-size: 16px;
      }
      
      .hero-text {
        padding: 20px;
      }
      
      .btn-explore {
        padding: 12px 24px;
        font-size: 14px;
      }
    }
    
    @media (max-width: 576px) {
      .hero-title {
        font-size: 30px;
      }
      
      .hero-description {
        font-size: 15px;
      }
      
      .hero-text {
        padding: 15px;
      }
      
      .btn-explore {
        padding: 10px 20px;
        font-size: 12px;
        width: 100%;
        text-align: center;
      }
      
      .hero-buttons {
        width: 100%;
      }
    }
  `;

  if (loading) {
    return (
      <div className="packages-page">
        <style>{criticalCSS}</style>
        
        {/* Hero Section */}
        <section className="packages-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="hero-text">
                    <div className="hero-tag">Crafting Memories Since 2000</div>
                    <h1 className="hero-title">Discover Chikkamagaluru</h1>
                    <p className="hero-description">
                      For over two decades, we've been sharing the magic of Karnataka's coffee country with travelers from around the world. What started as a small local operation has blossomed into something special, and now we're bringing our expertise online to make these experiences accessible to everyone.
                    </p>
                    <div className="hero-buttons">
                      <a href="#packages" className="btn-explore">
                        Explore Our Journeys
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div id="packages" className="container packages-container">
          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-header">
              <div className="filter-title-section">
                <h2 className="filter-title">Find Your Perfect Experience</h2>
                <p className="filter-subtitle">Filter packages by your preferences</p>
              </div>
              <button 
                className="reset-filters"
                onClick={clearFilters}
              >
                <i className="reset-icon"></i> Reset Filters
              </button>
            </div>
            <div className="filter-body">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">Package Type</label>
                  <select 
                    className="filter-select" 
                    name="type"
                    value={filters.type}
                    onChange={onChange}
                  >
                    <option value="">All Types</option>
                    <option value="travel">Travel</option>
                    <option value="resort">Resort(stay)</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Search</label>
                  <div className="search-input">
                    <span className="search-icon"></span>
                    <input 
                      type="text" 
                      className="search-field" 
                      name="search"
                      value={filters.search}
                      onChange={onChange}
                      placeholder="Search packages..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="results-header">
            <h2 className="results-title">Available Experiences</h2>
            <div className="results-count">
              Showing <span className="count-number">...</span> of <span className="count-number">...</span> packages
            </div>
          </div>
          
          {/* Skeleton Loading */}
          <div className="packages-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="package-item" key={`skeleton-${index}`}>
                <PackageCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="packages-page">
        <style>{criticalCSS}</style>
        
        {/* Hero Section */}
        <section className="packages-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="hero-text">
                    <div className="hero-tag">Crafting Memories Since 2000</div>
                    <h1 className="hero-title">Discover Chikkamagaluru</h1>
                    <p className="hero-description">
                      For over two decades, we've been sharing the magic of Karnataka's coffee country with travelers from around the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div id="packages" className="container packages-container">
          <div className="error-container">
            <div className="error-icon"></div>
            <h3 className="error-title">Unable to Load Packages</h3>
            <p className="error-message">
              We're having trouble loading our packages right now. Please check your connection and try again.
            </p>
            <button className="btn-retry" onClick={retryFetch}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <style>{criticalCSS}</style>
      
      {/* Hero Section */}
      <section className="packages-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="hero-text">
                  <div className="hero-tag">Crafting Memories Since 2000</div>
                  <h1 className="hero-title">Discover Chikkamagaluru</h1>
                  <p className="hero-description">
                    For over two decades, we've been sharing the magic of Karnataka's coffee country with travelers from around the world. What started as a small local operation has blossomed into something special, and now we're bringing our expertise online to make these experiences accessible to everyone.
                  </p>
                  <div className="hero-buttons">
                    <a href="#packages" className="btn-explore">
                      Explore Our Journeys
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Legacy Section */}
      <section className="legacy-section">
        <div className="container">
          <div className="legacy-content">
            <div className="legacy-image">
              <div className="image-overlay"></div>
            </div>
            <div className="legacy-text">
              <div className="section-tag">Our Story</div>
              <h2 className="legacy-title">From Local Guides to Digital Pioneers</h2>
              <p className="legacy-description">
                Back in 2000, we began as a small team with a big passion for showing people the hidden gems of Chikkamagaluru. We'd take small groups through coffee plantations, introduce them to local families, and share stories that you'd never find in guidebooks.
              </p>
              <p className="legacy-description">
                As word spread, so did our operation. But we never lost that personal touch. Now, we're excited to bring our carefully crafted experiences to the digital world, making it easier for travelers like you to discover the authentic beauty of our home.
              </p>
              <div className="legacy-stats">
                <div className="stat-item">
                  <div className="stat-number">23+</div>
                  <div className="stat-label">Years of Creating Memories</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15K+</div>
                  <div className="stat-label">Happy Travelers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Local Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div id="packages" className="container packages-container">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-header">
            <div className="filter-title-section">
              <h2 className="filter-title">Find Your Perfect Experience</h2>
              <p className="filter-subtitle">Filter packages by your preferences</p>
            </div>
            <button 
              className="reset-filters"
              onClick={clearFilters}
            >
              <i className="reset-icon"></i> Reset Filters
            </button>
          </div>
          <div className="filter-body">
            <div className="filter-row">
              <div className="filter-group">
                <label className="filter-label">Package Type</label>
                <select 
                  className="filter-select" 
                  name="type"
                  value={filters.type}
                  onChange={onChange}
                >
                  <option value="">All Types</option>
                  <option value="travel">Travel</option>
                  <option value="resort">Resort(stay)</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Search</label>
                <div className="search-input">
                  <span className="search-icon"></span>
                  <input 
                    type="text" 
                    className="search-field" 
                    name="search"
                    value={filters.search}
                    onChange={onChange}
                    placeholder="Search packages..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="results-header">
          <h2 className="results-title">Available Experiences</h2>
          <div className="results-count">
            Showing <span className="count-number">{filteredPackages.length}</span> of <span className="count-number">{packages.length}</span> packages
          </div>
        </div>
        
        {/* Results */}
        {filteredPackages.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon"></div>
            <h3 className="no-results-title">No packages match your filters</h3>
            <p className="no-results-text">Try adjusting your search criteria or browse all packages</p>
            <button 
              className="btn-clear"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredPackages.map(pkg => (
              <div className="package-item" key={pkg._id}>
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Can't Find What You're Looking For?</h2>
              <p className="cta-description">
                Our team would love to create a custom journey just for you. Reach out and let's craft something special together.
              </p>
            </div>
            <div className="cta-button">
              <a href="https://wa.me/9845212525" target="_blank" rel="noopener noreferrer" className="btn-contact">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Packages;