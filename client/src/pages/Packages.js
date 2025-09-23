// client/src/pages/Packages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import Spinner from '../components/Spinner';

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

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/api/packages');
        setPackages(res.data.data);
        setFilteredPackages(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setLoading(false);
      }
    };

    fetchPackages();
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="packages-page">
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

      {/* Custom CSS */}
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        
        /* Global Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
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
        
        /* Hero Section */
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
          background-image: url('https://images.unsplash.com/photo-1543782248-03e2c5a93e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA0fHx3aWxkbGlmZXxlbnwwfHwwfHx8MA%3D%3D');
          background-size: cover;
          background-position: center;
          z-index: -2;
          transition: transform 10s ease;
        }
        
        .packages-hero:hover .hero-background {
          transform: scale(1.05);
        }
        
        .hero-content {
          width: 100%;
          z-index: 1;
        }
        
        .hero-text {
          max-width: 600px;
          padding: 30px;
          /* Removed background color and blur for transparency */
          background-color: transparent;
          border-radius: 12px;
          
        }
        
        .hero-tag {
          display: inline-block;
          /* Changed to semi-transparent background instead of blur */
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
          color: #19376D;;
          font-size: 52px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
          /* Added text shadow for better readability */
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .hero-description {
          color: rgba(255, 255, 255, 0.95);
          font-size: 20px;
          margin-bottom: 32px;
          max-width: 540px;
          line-height: 1.7;
          /* Added text shadow for better readability */
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .hero-buttons {
          display: flex;
          gap: 16px;
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
        
        /* Legacy Section */
        .legacy-section {
          padding: 100px 0;
          background-color: #f8f9fa;
        }
        
        .legacy-content {
          display: flex;
          align-items: center;
          gap: 60px;
        }
        
        .legacy-image {
          flex: 1;
          height: 500px;
          background-image: url('https://images.unsplash.com/photo-1465205568425-23fdd3805e49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGhpbGxzfGVufDB8fDB8fHww');
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.5s ease;
        }
        
        .legacy-image:hover {
          transform: scale(1.02);
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(25, 55, 109, 0.2) 0%, rgba(25, 55, 109, 0.05) 100%);
        }
        
        .legacy-text {
          flex: 1;
        }
        
        .section-tag {
          display: inline-block;
          background-color: rgba(25, 55, 109, 0.1);
          color: #19376D;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .legacy-title {
          font-size: 36px;
          font-weight: 700;
          color: #19376D;
          margin-bottom: 24px;
          line-height: 1.2;
        }
        
        .legacy-description {
          font-size: 18px;
          color: #495057;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        
        .legacy-stats {
          display: flex;
          gap: 40px;
          margin-top: 40px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 48px;
          font-weight: 700;
          color: #19376D;
          margin-bottom: 8px;
        }
        
        .stat-label {
          font-size: 16px;
          color: #6c757d;
        }
        
        /* Packages Container */
        .packages-container {
          padding: 80px 15px;
        }
        
        /* Filter Section */
        .filter-section {
          background-color: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 40px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .filter-title-section {
          flex: 1;
        }
        
        .filter-title {
          font-size: 22px;
          font-weight: 700;
          color: #19376D;
          margin-bottom: 4px;
        }
        
        .filter-subtitle {
          color: #6c757d;
          font-size: 16px;
        }
        
        .reset-filters {
          display: flex;
          align-items: center;
          background: none;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .reset-filters:hover {
          background-color: #e9ecef;
        }
        
        .reset-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/%3E%3Cpath d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .filter-body {
          padding: 0;
        }
        
        .filter-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
        }
        
        .filter-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 16px;
          background-color: #fff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23495057' viewBox='0 0 16 16'%3E%3Cpath d='M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 12px;
          padding-right: 40px;
          appearance: none;
          transition: border-color 0.2s ease;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #19376D;
          box-shadow: 0 0 0 3px rgba(25, 55, 109, 0.1);
        }
        
        .search-input {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236c757d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .search-field {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        
        .search-field:focus {
          outline: none;
          border-color: #19376D;
          box-shadow: 0 0 0 3px rgba(25, 55, 109, 0.1);
        }
        
        /* Results Header */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .results-title {
          font-size: 28px;
          font-weight: 700;
          color: #19376D;
        }
        
        .results-count {
          color: #6c757d;
          font-size: 16px;
        }
        
        .count-number {
          font-weight: 700;
          color: #19376D;
        }
        
        /* Packages Grid */
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }
        
        .package-item {
          transition: transform 0.3s ease;
        }
        
        .package-item:hover {
          transform: translateY(-5px);
        }
        
        /* No Results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
        }
        
        .no-results-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23adb5bd'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.7;
        }
        
        .no-results-title {
          font-size: 24px;
          font-weight: 600;
          color: #495057;
          margin-bottom: 12px;
        }
        
        .no-results-text {
          color: #6c757d;
          margin-bottom: 24px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .btn-clear {
          display: inline-block;
          background-color: #19376D;
          color: #fff;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .btn-clear:hover {
          background-color: #132954;
        }
        
        /* CTA Section */
        .cta-section {
          background-color: #19376D;
          padding: 80px 0;
          color: #fff;
        }
        
        .cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .cta-text {
          flex: 1;
          min-width: 300px;
        }
        
        .cta-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        
        .cta-description {
          font-size: 18px;
          opacity: 0.9;
          max-width: 500px;
          line-height: 1.6;
        }
        
        .cta-button {
          flex-shrink: 0;
        }
        
        .btn-contact {
          display: inline-block;
          background-color: #fff;
          color: #19376D;
          padding: 16px 32px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .btn-contact:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .legacy-content {
            flex-direction: column;
            gap: 40px;
          }
          
          .legacy-image {
            height: 400px;
            width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }
          
          .hero-description {
            font-size: 18px;
          }
          
          .hero-text {
            padding: 20px;
          }
          
          .filter-row {
            flex-direction: column;
            gap: 16px;
          }
          
          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .packages-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
          
          .cta-content {
            flex-direction: column;
            text-align: center;
          }
          
          .cta-button {
            width: 100%;
          }
          
          .btn-contact {
            display: block;
            text-align: center;
          }
          
          .legacy-stats {
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Packages;