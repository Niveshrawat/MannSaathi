const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAppointments,
  updateAvailability,
  getClients,
} = require('../controllers/counselorController');

// All routes are protected and require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Appointment routes
router.get('/appointments', getAppointments);

// Availability routes
router.put('/availability', updateAvailability);

// Client routes
router.get('/clients', getClients);

module.exports = router; 