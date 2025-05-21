const Slot = require('../models/Slot');

// Create a new slot (Counselor only)
exports.createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, sessionType, price, extensionOptions } = req.body;
    const slot = await Slot.create({
      counselor: req.user.id,
      date,
      startTime,
      endTime,
      sessionType,
      price,
      extensionOptions: extensionOptions && Array.isArray(extensionOptions) ? extensionOptions : []
    });
    res.status(201).json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all slots for the logged-in counselor
exports.getMySlots = async (req, res) => {
  try {
    const slots = await Slot.find({ counselor: req.user.id }).sort({ date: 1, startTime: 1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a slot (Counselor only)
exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndUpdate(
      { _id: req.params.id, counselor: req.user.id, isBooked: false },
      req.body,
      { new: true }
    );
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found or already booked' });
    res.json({ success: true, slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a slot (Counselor only)
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndDelete({ _id: req.params.id, counselor: req.user.id, isBooked: false });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found or already booked' });
    res.json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available slots for a counselor (public)
exports.getAvailableSlots = async (req, res) => {
  try {
    const { counselorId } = req.params;
    console.log('Fetching slots for counselorId:', counselorId);
    const slots = await Slot.find({ counselor: counselorId, isBooked: false, date: { $gte: new Date().toISOString().slice(0, 10) } })
      .sort({ date: 1, startTime: 1 });
    console.log('Found slots:', slots);
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 