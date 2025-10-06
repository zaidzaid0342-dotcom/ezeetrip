// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Footer from '../components/Footer';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section position-relative">
        <div className="hero-overlay"></div>
        <div className="hero-image"></div>
        <div className="hero-content container position-relative">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-7">
              <div className="hero-badge mb-3">
                <span className="badge bg-light text-dark px-3 py-2">Premium Travel Experience</span>
              </div>
              <h1 className="display-3 fw-bold text-white mb-4 animate-fade-in">
                Discover Chikkamagaluru
              </h1>
              <p className="lead text-white mb-4 animate-fade-in-delay">
                Experience the breathtaking beauty of Karnataka's coffee land with misty hills, cascading waterfalls, and serene landscapes.
              </p>
              <div className="d-flex flex-wrap gap-3 animate-fade-in-delay-2">
                <Link to="/packages" className="btn btn-light btn-lg px-4 py-3">
                  Explore Our Tours
                </Link>
                <a href="#about" className="btn btn-outline-light btn-lg px-4 py-3">
                  Learn More
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-5 d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-white me-2"></i>
                  <span className="text-white">Best Price Guarantee</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-white me-2"></i>
                  <span className="text-white">Expert Local Guides</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-check-circle text-white me-2"></i>
                  <span className="text-white">Flexible Cancellation</span>
                </div>
              </div>
            </div>
            
            {/* Weather Widget */}
            
            
          </div>
        </div>
        
        {/* Scroll Indicator */}
        
      </section>

      {/* About Section */}
      <section id="about" className="container my-5 py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="section-header mb-4">
              <h6 className="text-primary text-uppercase fw-bold mb-2">About Chikkamagaluru</h6>
              <h2 className="display-5 fw-bold mb-4">The Coffee Land of Karnataka</h2>
            </div>
            <p className="lead mb-4">
              Nestled in the foothills of the Mullayanagiri range, Chikkamagaluru is a pristine hill station renowned for its coffee plantations, serene environment, and captivating natural beauty.
            </p>
            <p className="mb-4">
              The region offers a perfect blend of adventure and tranquility with its rolling hills, lush green forests, sparkling streams, and majestic waterfalls. From trekking to the highest peak in Karnataka to relaxing in aromatic coffee estates, Chikkamagaluru provides unforgettable experiences for every traveler.
            </p>
            <div className="row mt-4">
              <div className="col-6">
                <div className="d-flex align-items-center mb-3 feature-item">
                  <div className="feature-icon me-3">
                    <i className="fas fa-mountain text-primary fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">Mullayanagiri Peak</h5>
                    <p className="text-muted mb-0">Highest peak in Karnataka</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center mb-3 feature-item">
                  <div className="feature-icon me-3">
                    <i className="fas fa-coffee text-primary fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">Coffee Plantations</h5>
                    <p className="text-muted mb-0">Aromatic coffee estates</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center mb-3 feature-item">
                  <div className="feature-icon me-3">
                    <i className="fas fa-water text-primary fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">Waterfalls</h5>
                    <p className="text-muted mb-0">Hebbe, Kalhatti, and more</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center mb-3 feature-item">
                  <div className="feature-icon me-3">
                    <i className="fas fa-tree text-primary fs-3"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">Wildlife</h5>
                    <p className="text-muted mb-0">Bhadra Wildlife Sanctuary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="image-gallery">
              <div className="row g-3">
                <div className="col-6">
                  <div className="gallery-item h-200 rounded overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1516655543747-2973ac03d580?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhpbGxzfGVufDB8fDB8fHww"
                      className="img-fluid h-100 w-100 object-fit-cover"
                      alt="Chikkamagaluru hills"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="gallery-item h-200 rounded overflow-hidden shadow-sm">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1675314768463-d152edc1e432?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdhdGVyJTIwZmFsbHN8ZW58MHx8MHx8fDA%3D"
                      className="img-fluid h-100 w-100 object-fit-cover"
                      alt="Coffee plantation"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="gallery-item h-300 rounded overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1515085014016-7ddbcc53a348?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhpbGxzfGVufDB8fDB8fHww"
                      className="img-fluid h-100 w-100 object-fit-cover"
                      alt="Mullayanagiri peak"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="section-header mb-4">
              <h6 className="text-primary text-uppercase fw-bold mb-2">Experiences</h6>
              <h2 className="display-5 fw-bold mb-3">Unforgettable Experiences</h2>
            </div>
            <p className="lead text-muted max-w-2xl mx-auto">
              Discover the magic of Chikkamagaluru through our curated experiences designed to create lasting memories.
            </p>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden experience-card">
                <div className="experience-img h-200">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=1125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Trekking"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="experience-icon mb-3">
                    <i className="fas fa-hiking text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Trekking Adventures</h5>
                  <p className="card-text">
                    Challenge yourself with treks to Mullayanagiri, Kemmangundi, and Baba Budangiri peaks.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden experience-card">
                <div className="experience-img h-200">
                  <img
                    src="https://images.unsplash.com/photo-1713323738324-e945c6ad3d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHJlY2tpbmd8ZW58MHx8MHx8fDA%3D"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Coffee tours"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="experience-icon mb-3">
                    <i className="fas fa-mug-hot text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Coffee Estate Tours</h5>
                  <p className="card-text">
                    Walk through aromatic coffee plantations and learn about the coffee-making process.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden experience-card">
                <div className="experience-img h-200">
                  <img
                    src="https://images.unsplash.com/photo-1710255076009-7a20ef532303?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhdGVyJTIwZmFsbHN8ZW58MHx8MHx8fDA%3D"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Waterfalls"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="experience-icon mb-3">
                    <i className="fas fa-water text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Waterfall Visits</h5>
                  <p className="card-text">
                    Witness the beauty of Hebbe, Kalhatti, and Manikyadhara waterfalls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/packages" className="btn btn-primary btn-lg px-4">
              Discover All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Ezee Trip Features Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <div className="section-header mb-4">
              <h6 className="text-primary text-uppercase fw-bold mb-2">Ezee Trip Difference</h6>
              <h2 className="display-5 fw-bold mb-3">Travel in Comfort & Style</h2>
            </div>
            <p className="lead text-muted max-w-2xl mx-auto">
              At Ezee Trip, we believe your journey should be as enjoyable as the destination. We provide premium amenities to ensure your travel experience is exceptional.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden feature-card">
                <div className="feature-img h-250">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1698072483523-e422f0618c9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amVlcCUyMGRyaXZ3fGVufDB8fDB8fHww"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Premium comfort"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-couch text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Premium Comfort</h5>
                  <p className="card-text">
                    Travel in our luxury vehicles with spacious seating, climate control, and panoramic windows to enjoy the scenic beauty in comfort.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden feature-card">
                <div className="feature-img h-250">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1671394138163-ba8be139614b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGN1aXNpbmV8ZW58MHx8MHx8fDA%3D"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Delicious food"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-utensils text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Delicious Cuisine</h5>
                  <p className="card-text">
                    Savor authentic local flavors and multi-cuisine delicacies prepared by expert chefs using fresh, locally-sourced ingredients.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden feature-card">
                <div className="feature-img h-250">
                  <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    className="img-fluid h-100 w-100 object-fit-cover"
                    alt="Hygienic stay"
                  />
                </div>
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-bed text-primary fs-2"></i>
                  </div>
                  <h5 className="card-title fw-bold">Hygienic Stays</h5>
                  <p className="card-text">
                    Rest well in our carefully selected accommodations that meet the highest standards of cleanliness, comfort, and safety.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Special Section */}
      <section className="py-5 bg-gradient-student">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="student-content">
                <div className="section-header mb-4">
                  <h6 className="text-uppercase fw-bold mb-2 student-badge">Student Special</h6>
                  <h2 className="display-5 fw-bold mb-4 text-white">Adventure Awaits, Students!</h2>
                </div>
                <p className="lead text-white mb-4">
                  We believe education extends beyond the classroom. That's why we've crafted special packages exclusively for students at unbeatable prices.
                </p>
                <div className="student-features mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="student-feature-icon me-3">
                      <i className="fas fa-percentage text-white fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 text-white">Special Student Discounts</h5>
                      <p className="text-white-70 mb-0">Save up to 25% on all packages</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="student-feature-icon me-3">
                      <i className="fas fa-users text-white fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 text-white">Group Booking Benefits</h5>
                      <p className="text-white-70 mb-0">Extra perks for groups of 10+</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="student-feature-icon me-3">
                      <i className="fas fa-certificate text-white fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 text-white">Educational Value</h5>
                      <p className="text-white-70 mb-0">Learn about ecology, history, and culture</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="student-feature-icon me-3">
                      <i className="fas fa-camera text-white fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 text-white">Photo Documentation</h5>
                      <p className="text-white-70 mb-0">Professional photos for your projects</p>
                    </div>
                  </div>
                </div>
                <div className="student-cta">
                  <Link to="/packages" className="btn btn-light btn-lg px-4 me-3">
                    Explore Student Packages
                  </Link>
                 
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="student-image-container">
                <div className="student-image-main rounded overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN0dWRlbnR8ZW58MHx8MHx8fDA%3D"
                    className="img-fluid w-100"
                    alt="Students enjoying nature trip"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
   

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">Ready for Your Chikkamagaluru Adventure?</h2>
              <p className="lead mb-0">
                Join us for an unforgettable journey through the coffee land of Karnataka. Book your tour today!
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link to="/packages" className="btn btn-light btn-lg px-4">
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer/>

      {/* Custom CSS */}
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        
        body {
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        }
        
        .section-header h6 {
          letter-spacing: 1px;
          font-size: 0.875rem;
        }
        
        .hero-section {
          height: 100vh;
          min-height: 600px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1463090066105-c6437f8687f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGhpbGxzfGVufDB8fDB8fHww');
          background-size: cover;
          background-position: center;
          z-index: 1;
          transition: transform 8s ease;
        }
        
        .hero-section:hover .hero-image {
          transform: scale(1.05);
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
          z-index: 2;
        }
        
        .hero-content {
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: center;
        }
        
        .hero-badge {
          animation: fadeIn 1s ease forwards;
        }
        
        .btn {
          border-radius: 50px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        
        .btn-primary:hover {
          background-color: #0b5ed7;
          border-color: #0a58ca;
          transform: translateY(-2px);
        }
        
        .btn-light {
          color: #0d6efd;
        }
        
        .btn-light:hover {
          color: #0b5ed7;
          transform: translateY(-2px);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(13, 110, 253, 0.1);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .feature-item:hover .feature-icon {
          background-color: rgba(13, 110, 253, 0.2);
          transform: translateY(-5px);
        }
        
        .gallery-item img,
        .experience-img img,
        .feature-img img {
          transition: transform 0.5s ease;
        }
        
        .gallery-item:hover img,
        .experience-img:hover img,
        .feature-img:hover img {
          transform: scale(1.08);
        }
        
        .experience-card,
        .feature-card {
          transition: all 0.3s ease;
        }
        
        .experience-card:hover,
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        
        .experience-icon,
        .feature-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(13, 110, 253, 0.1);
          border-radius: 50%;
        }
        
        .h-200 {
          height: 200px;
        }
        
        .h-250 {
          height: 250px;
        }
        
        .h-300 {
          height: 300px;
        }
        
        .max-w-2xl {
          max-width: 700px;
        }
        
        .avatar img {
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
        
        .stat-item h3 {
          font-size: 3rem;
        }
        
        @media (max-width: 768px) {
          .stat-item h3 {
            font-size: 2rem;
          }
        }
        
        /* Scroll Indicator */
        .scroll-indicator {
          z-index: 4;
        }
        
        .mouse-icon {
          position: relative;
          border: 2px solid #fff;
          border-radius: 16px;
          height: 40px;
          width: 24px;
          margin: 10px auto;
          opacity: 0.7;
        }
        
        .wheel {
          position: absolute;
          display: block;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          top: 8px;
          animation: scroll 2s infinite;
        }
        
        @keyframes scroll {
          0% {
            opacity: 1;
            top: 8px;
          }
          100% {
            opacity: 0;
            top: 24px;
          }
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 1s ease 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease 0.6s forwards;
          opacity: 0;
        }
        
        /* Student Special Section */
        .bg-gradient-student {
          background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
          position: relative;
        }
        
        .student-badge {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          display: inline-block;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .student-feature-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .student-features .d-flex:hover .student-feature-icon {
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-5px);
        }
        
        .text-white-70 {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .student-image-container {
          position: relative;
        }
        
        .student-image-main {
          margin-bottom: 30px;
          transition: transform 0.5s ease;
        }
        
        .student-image-main:hover {
          transform: scale(1.02);
        }
        
        .student-testimonial {
          position: absolute;
          bottom: -20px;
          right: 20px;
          width: calc(100% - 40px);
          max-width: 400px;
          z-index: 2;
          transition: transform 0.3s ease;
        }
        
        .student-testimonial:hover {
          transform: translateY(-5px);
        }
        
        .student-cta .btn {
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .student-cta .btn-light:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .student-cta .btn-outline-light:hover {
          transform: translateY(-3px);
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 992px) {
          .student-testimonial {
            position: relative;
            bottom: auto;
            right: auto;
            width: 100%;
            max-width: 100%;
            margin-top: 20px;
          }
        }
        
        /* Weather Widget */
        .weather-widget {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        }
        
        .weather-icon {
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
      `}</style>
    </div>
  );
};

export default Home;
