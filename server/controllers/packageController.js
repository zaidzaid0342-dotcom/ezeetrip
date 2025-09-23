// server/controllers/packageController.js
const Package = require('../models/Package');
const extractImageUrls = require('../middleware/upload');

// Utility function to clean up image logs
const formatImagesForLog = (images = []) => {
  return images.map((img, i) => {
    if (typeof img === "string" && img.startsWith("data:image")) {
      return `[BASE64 image, length: ${img.length}]`;
    }
    return img;
  });
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find();
    
    //console.log('Packages fetched from database:');
    packages.forEach((pkg, index) => {
      console.log(`Package ${index + 1}:`, {
        name: pkg.name,
        images: formatImagesForLog(pkg.images),
        imagesCount: pkg.images ? pkg.images.length : 0
      });
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({ success: false, message: `Package not found with id of ${req.params.id}` });
    }

    console.log('Fetched single package:', {
      id: pkg._id,
      name: pkg.name,
      images: formatImagesForLog(pkg.images),
      imagesCount: pkg.images ? pkg.images.length : 0
    });

    res.status(200).json({
      success: true,
      data: pkg
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = [
  extractImageUrls,
  async (req, res, next) => {
    try {
      console.log('Final request body before creating package:', {
        ...req.body,
        images: formatImagesForLog(req.body.images)
      });
      
      const pkg = await Package.create(req.body);
      
      console.log('Created package:', {
        id: pkg._id,
        name: pkg.name,
        images: formatImagesForLog(pkg.images),
        imagesCount: pkg.images ? pkg.images.length : 0
      });

      res.status(201).json({
        success: true,
        data: pkg
      });
    } catch (err) {
      console.error('Error creating package:', err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
];

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = [
  extractImageUrls,
  async (req, res, next) => {
    try {
      let pkg = await Package.findById(req.params.id);

      if (!pkg) {
        return res.status(404).json({ success: false, message: `Package not found with id of ${req.params.id}` });
      }

      pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      console.log('Updated package:', {
        id: pkg._id,
        name: pkg.name,
        images: formatImagesForLog(pkg.images),
        imagesCount: pkg.images ? pkg.images.length : 0
      });

      res.status(200).json({
        success: true,
        data: pkg
      });
    } catch (err) {
      console.error('Error updating package:', err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
];

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res, next) => {
  try {
    console.log('Delete request for package ID:', req.params.id);
    console.log('User making request:', req.user);

    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      console.log('Package not found');
      return res.status(404).json({ success: false, message: `Package not found with id of ${req.params.id}` });
    }

    await pkg.remove();
    console.log('Package deleted successfully:', {
      id: pkg._id,
      name: pkg.name
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete package error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};
