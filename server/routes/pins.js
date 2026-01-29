const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pin = require('../models/Pin');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pin-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image endpoint
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Get all pins (public)
router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    res.json({ pins });
  } catch (error) {
    console.error('Get pins error:', error);
    res.status(500).json({ error: 'Failed to fetch pins' });
  }
});

// Create new pin (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, latitude, longitude, imageUrl } = req.body;

    // Validate input
    if (!title || !description || !latitude || !longitude || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create pin
    const pin = new Pin({
      userId: req.userId,
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl
    });

    await pin.save();

    // Populate user info
    await pin.populate('userId', 'email');

    res.status(201).json({
      message: 'Pin created successfully',
      pin
    });
  } catch (error) {
    console.error('Create pin error:', error);
    res.status(500).json({ error: 'Failed to create pin' });
  }
});

// Update pin (protected, owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const pinId = req.params.id;

    // Find pin
    const pin = await Pin.findById(pinId);

    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    // Check ownership
    if (pin.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own pins' });
    }

    // Update fields
    if (title) pin.title = title;
    if (description) pin.description = description;
    if (imageUrl) {
      // Delete old image if it exists and is different
      if (pin.imageUrl && pin.imageUrl !== imageUrl) {
        const oldImagePath = path.join(__dirname, '..', pin.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      pin.imageUrl = imageUrl;
    }

    await pin.save();
    await pin.populate('userId', 'email');

    res.json({
      message: 'Pin updated successfully',
      pin
    });
  } catch (error) {
    console.error('Update pin error:', error);
    res.status(500).json({ error: 'Failed to update pin' });
  }
});

// Delete pin (protected, owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pinId = req.params.id;

    // Find pin
    const pin = await Pin.findById(pinId);

    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    // Check ownership
    if (pin.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own pins' });
    }

    // Delete image file
    if (pin.imageUrl) {
      const imagePath = path.join(__dirname, '..', pin.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete pin
    await Pin.findByIdAndDelete(pinId);

    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    console.error('Delete pin error:', error);
    res.status(500).json({ error: 'Failed to delete pin' });
  }
});

module.exports = router;
