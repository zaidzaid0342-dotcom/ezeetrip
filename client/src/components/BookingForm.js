// client/src/components/BookingForm.js
import React, { useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingForm = ({ pkg }) => {
  const { user, isAuthenticated } = useAuth();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    package: pkg._id,
    adults: 1,
    children: 0,
    specialRequests: '',
    startDate: '',
    phone: '' // Phone field remains
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adults, children, specialRequests, startDate, phone } = formData;
  
  // Calculate total price
  const adultPrice = pkg.price;
  const childPrice = pkg.price / 2; // Half price for children
  const totalPrice = (adults * adultPrice) + (children * childPrice);
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const bookingData = {
        ...formData,
        totalPrice
      };
      
      const res = await api.post('/bookings', bookingData);
      
      setLoading(false);
      history.push('/my-bookings');
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Login to Book</h5>
        </div>
        <div className="card-body">
          <p className="card-text">Please login to book this package.</p>
          <button 
            className="btn btn-primary w-100 mb-2"
            onClick={() => history.push('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-outline-primary w-100"
            onClick={() => history.push('/register')}
          >
            Register
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <style jsx>{`
        /* Hide arrows on number inputs */
        .no-arrows::-webkit-outer-spin-button,
        .no-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
      
      <div className="card-header">
        <h5 className="mb-0">Book This Package</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Package</label>
            <input 
              type="text" 
              className="form-control" 
              value={pkg.name} 
              disabled 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Adult Price</label>
            <input 
              type="text" 
              className="form-control" 
              value={`₹${pkg.price}`} 
              disabled 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Child Price</label>
            <input 
              type="text" 
              className="form-control" 
              value={`₹${pkg.price / 2}`} 
              disabled 
            />
          </div>
          
          {/* Phone number field */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="adults" className="form-label">Number of Adults</label>
              <input 
                type="number" 
                className="form-control no-arrows" 
                id="adults"
                name="adults"
                value={adults}
                onChange={onChange}
                min="1"
                required
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="children" className="form-label">Number of Children</label>
              <input 
                type="number" 
                className="form-control no-arrows" 
                id="children"
                name="children"
                value={children}
                onChange={onChange}
                min="0"
              />
            </div>
          </div>
          
          {(pkg.type === 'travel' || pkg.type === 'resort') && (
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input 
                type="date" 
                className="form-control" 
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={onChange}
                required
              />
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="specialRequests" className="form-label">Special Requests</label>
            <textarea 
              className="form-control" 
              id="specialRequests"
              name="specialRequests"
              value={specialRequests}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="alert alert-info">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Adults:</strong> {adults} × ₹{pkg.price} = ₹{adults * pkg.price}<br />
                <strong>Children:</strong> {children} × ₹{pkg.price / 2} = ₹{children * (pkg.price / 2)}
              </div>
              <div>
                <strong>Total Price:</strong> ₹{totalPrice}
              </div>
            </div>
            <div className="form-text mt-2">Free Pickup Within Chikkamagaluru</div>
          </div>
          
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;