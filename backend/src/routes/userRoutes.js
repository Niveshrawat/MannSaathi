const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placeholder routes - implement as needed
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

module.exports = router; 