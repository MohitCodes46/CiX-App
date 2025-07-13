const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadUserAvatar, uploadTryOnImage } = require('../middleware/upload');
const sharp = require('sharp');

// Upload user avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Process image
    const processedImageBuffer = await sharp(req.file.path)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.status(200).json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: {
        filename: req.file.filename,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Remove the duplicate uploadTryOnImage function here

router.post('/avatar', auth, uploadUserAvatar, uploadAvatar);
router.post('/try-on', auth, uploadTryOnImage, (req, res) => {
  // You can optionally add a response here or just return success
  res.status(200).json({
    status: 'success',
    message: 'Try-on image uploaded (mock mode)',
    data: {
      filename: req.file ? req.file.filename : null,
      path: req.file ? req.file.path : null
    }
  });
});

module.exports = router;
