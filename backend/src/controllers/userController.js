const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        ...(user.role === 'counselor' && {
          specialization: user.specialization,
          experience: user.experience,
          rating: user.rating,
          availability: user.availability,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        ...(user.role === 'counselor' && {
          specialization: user.specialization,
          experience: user.experience,
          rating: user.rating,
          availability: user.availability,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user appointments
// @route   GET /api/users/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('counselor', 'name profilePicture specialization experience rating')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Book an appointment
// @route   POST /api/users/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
  try {
    const { counselorId, date, time, type, notes } = req.body;

    // Check if counselor exists
    const counselor = await User.findOne({ _id: counselorId, role: 'counselor' });
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user.id,
      counselor: counselorId,
      date,
      time,
      type,
      notes,
    });

    // Add appointment to user's appointments
    const user = await User.findById(req.user.id);
    user.appointments.push({
      id: appointment._id,
      userId: counselorId,
      userName: counselor.name,
      date,
      time,
      status: 'upcoming',
    });
    await user.save();

    // Add appointment to counselor's appointments
    counselor.appointments.push({
      id: appointment._id,
      userId: req.user.id,
      userName: user.name,
      date,
      time,
      status: 'upcoming',
    });
    await counselor.save();

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel an appointment
// @route   DELETE /api/users/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if user is the owner of the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this appointment',
      });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    await appointment.save();

    // Update user's appointments
    const user = await User.findById(req.user.id);
    const userAppointment = user.appointments.find(
      (apt) => apt.id.toString() === req.params.id
    );
    if (userAppointment) {
      userAppointment.status = 'cancelled';
      await user.save();
    }

    // Update counselor's appointments
    const counselor = await User.findById(appointment.counselor);
    const counselorAppointment = counselor.appointments.find(
      (apt) => apt.id.toString() === req.params.id
    );
    if (counselorAppointment) {
      counselorAppointment.status = 'cancelled';
      await counselor.save();
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 