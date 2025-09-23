// client/src/pages/AdminEditPackage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

const AdminEditPackage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'travel',
    price: '',
    duration: '',
    location: '',
    meals: '',
    available: true,
    images: [] // Array to store image URLs
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(''); // Temporary URL input
  
  const { name, description, type, price, duration, location, meals, available, images } = formData;
  
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${id}`);
        const pkg = res.data.data;
        
        setFormData({
          name: pkg.name,
          description: pkg.description,
          type: pkg.type,
          price: pkg.price,
          duration: pkg.duration || '',
          location: pkg.location || '',
          meals: pkg.meals || '',
          available: pkg.available,
          images: pkg.images || []
        });
        
        setFetchLoading(false);
      } catch (err) {
        setError(err.response.data.message);
        setFetchLoading(false);
      }
    };
    
    fetchPackage();
  }, [id]);
  
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onCheck = e => setFormData({ ...formData, [e.target.name]: e.target.checked });
  
  const addImage = () => {
    if (imageUrl.trim() !== '') {
      setFormData({
        ...formData,
        images: [...images, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/packages/${id}`, formData);
      
      setLoading(false);
      history.push('/admin/packages');
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };
  
  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }
  
  if (fetchLoading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Edit Package</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Package Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    id="description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Package Type</label>
                  <select 
                    className="form-select" 
                    id="type"
                    name="type"
                    value={type}
                    onChange={onChange}
                    required
                  >
                    <option value="travel">Travel</option>
                    <option value="food">Food</option>
                    <option value="resort">Resort</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="price"
                    name="price"
                    value={price}
                    onChange={onChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                {(type === 'travel' || type === 'resort') && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="location"
                        name="location"
                        value={location}
                        onChange={onChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="duration" className="form-label">Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="duration"
                        name="duration"
                        value={duration}
                        onChange={onChange}
                        placeholder="e.g., 3 days, 1 week"
                        required
                      />
                    </div>
                  </>
                )}
                
                {(type === 'food' || type === 'resort') && (
                  <div className="mb-3">
                    <label htmlFor="meals" className="form-label">Meals</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="meals"
                      name="meals"
                      value={meals}
                      onChange={onChange}
                      placeholder="e.g., Breakfast, Lunch, Dinner"
                      required
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <div className="input-group mb-2">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={addImage}
                    >
                      Add
                    </button>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="mt-2">
                      <label className="form-label">Current Images:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="position-relative">
                            <img 
                              src={image} 
                              alt={`Preview ${index}`} 
                              style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                              className="rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100x80?text=Image+Not+Available';
                              }}
                            />
                            <button 
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {images.length === 0 && (
                    <div className="alert alert-warning mt-2">
                      No images added. This package will display "No Image Available" placeholder.
                    </div>
                  )}
                </div>
                
                <div className="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="available"
                    name="available"
                    checked={available}
                    onChange={onCheck}
                  />
                  <label className="form-check-label" htmlFor="available">
                    Available for booking
                  </label>
                </div>
                
                <div className="d-grid gap-2 d-md-flex">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Package'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => history.push('/admin/packages')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPackage;