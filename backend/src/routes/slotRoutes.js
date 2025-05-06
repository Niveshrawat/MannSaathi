const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const slotController = require('../controllers/slotController');

// Public: Get available slots for a counselor
router.get('/available/:counselorId', slotController.getAvailableSlots);

// All below routes require authentication
router.use(protect);

// Counselor: Create a slot
router.post('/', slotController.createSlot);
// Counselor: Get all their slots
router.get('/my', slotController.getMySlots);
// Counselor: Update a slot
router.put('/:id', slotController.updateSlot);
// Counselor: Delete a slot
router.delete('/:id', slotController.deleteSlot);

module.exports = router; 