const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Session = require('../models/Session');
const asyncHandler = require('express-async-handler');

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.id })
    .populate('counselor', 'name profilePicture specialization rating')
    .sort({ date: 1 });
  res.json(appointments);
});

// @desc    Get all appointments for a counselor
// @route   GET /api/appointments/counselor
// @access  Private
const getCounselorAppointments = asyncHandler(async (req, res) => {
  if (req.user.role !== 'counselor') {
    res.status(403);
    throw new Error('Not authorized as a counselor');
  }

  const appointments = await Appointment.find({ counselor: req.user.id })
    .populate('user', 'name profilePicture')
    .sort({ date: 1 });
  res.json(appointments);
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { counselorId, date, time, type, notes } = req.body;

  // Check if counselor exists and is available
  const counselor = await User.findById(counselorId);
  if (!counselor || counselor.role !== 'counselor') {
    res.status(400);
    throw new Error('Invalid counselor');
  }

  // Check if time slot is available
  const existingAppointment = await Appointment.findOne({
    counselor: counselorId,
    date,
    time,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('Time slot already booked');
  }

  const appointment = await Appointment.create({
    user: req.user.id,
    counselor: counselorId,
    date,
    time,
    type,
    notes
  });

  // Create a session for the appointment
  await Session.create({
    appointment: appointment._id,
    user: req.user.id,
    counselor: counselorId,
    type,
    status: 'scheduled'
  });

  res.status(201).json(appointment);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if user is authorized
  if (appointment.user.toString() !== req.user.id && 
      appointment.counselor.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  appointment.status = status;
  await appointment.save();

  // Update corresponding session status
  if (status === 'completed' || status === 'cancelled') {
    await Session.findOneAndUpdate(
      { appointment: appointment._id },
      { status: status === 'completed' ? 'completed' : 'cancelled' }
    );
  }

  res.json(appointment);
});

// @desc    Add rating and feedback
// @route   PUT /api/appointments/:id/feedback
// @access  Private
const addFeedback = asyncHandler(async (req, res) => {
  const { rating, feedback } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only user can add feedback
  if (appointment.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  appointment.rating = rating;
  appointment.feedback = feedback;
  await appointment.save();

  // Update counselor's average rating
  const counselor = await User.findById(appointment.counselor);
  const appointments = await Appointment.find({
    counselor: appointment.counselor,
    rating: { $exists: true }
  });
  
  const avgRating = appointments.reduce((acc, curr) => acc + curr.rating, 0) / appointments.length;
  counselor.rating = avgRating;
  await counselor.save();

  res.json(appointment);
});

module.exports = {
  getAppointments,
  getCounselorAppointments,
  createAppointment,
  updateAppointmentStatus,
  addFeedback
}; 