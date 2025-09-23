// server/middleware/upload.js
const path = require('path');

// Function to extract image URLs from request body
function extractImageUrls(req, res, next) {
  try {
    console.log('Raw request body:', req.body);
    
    // Get images array from request body
    let { images } = req.body;
    
    console.log('Raw images from request body:', images, typeof images);
    
    // If images is a string (comma-separated), convert to array
    if (typeof images === 'string') {
      images = images.split(',').map(url => url.trim());
      console.log('Images after string split:', images);
    }
    
    // If images is not an array, create empty array
    if (!Array.isArray(images)) {
      images = [];
      console.log('Images is not an array, setting to empty array');
    }
    
    // Filter out empty strings
    const filteredImages = images.filter(url => url.trim() !== '');
    
    console.log('Filtered images:', filteredImages);
    
    // Replace the images in request body with validated URLs
    req.body.images = filteredImages;
    
    console.log('Final images in request body:', req.body.images);
    
    next();
  } catch (err) {
    console.error('Error processing image URLs:', err);
    res.status(400).json({
      success: false,
      message: 'Invalid image URLs provided'
    });
  }
}

module.exports = extractImageUrls;