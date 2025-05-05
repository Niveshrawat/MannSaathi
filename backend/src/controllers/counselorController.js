const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get counselor profile
// @route   GET /api/counselor/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Check if user is a counselor
    if (req.user.role !== 'counselor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access counselor profile'
      });
    }

    const counselor = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      counselor: {
        id: counselor._id,
        name: counselor.name,
        email: counselor.email,
        role: counselor.role,
        profilePicture: counselor.profilePicture,
        specialization: counselor.specialization,
        experience: counselor.experience,
        rating: counselor.rating,
        availability: counselor.availability,
        totalAppointments: counselor.totalAppointments || 0,
        activeClients: counselor.activeClients || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update counselor profile
// @route   PUT /api/counselor/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Check if user is a counselor
    if (req.user.role !== 'counselor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update counselor profile'
      });
    }

    const { name, profilePicture, specialization, experience } = req.body;

    const counselor = await User.findById(req.user.id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    // Update fields
    if (name) counselor.name = name;
    if (profilePicture) counselor.profilePicture = profilePicture;
    if (specialization) counselor.specialization = specialization;
    if (experience) counselor.experience = experience;

    await counselor.save();

    res.status(200).json({
      success: true,
      counselor: {
        id: counselor._id,
        name: counselor.name,
        email: counselor.email,
        role: counselor.role,
        profilePicture: counselor.profilePicture,
        specialization: counselor.specialization,
        experience: counselor.experience,
        rating: counselor.rating,
        availability: counselor.availability
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get counselor appointments
// @route   GET /api/counselor/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    // Check if user is a counselor
    if (req.user.role !== 'counselor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access counselor appointments'
      });
    }

    const appointments = await Appointment.find({ counselor: req.user.id })
      .populate('user', 'name profilePicture')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update counselor availability
// @route   PUT /api/counselor/availability
// @access  Private
exports.updateAvailability = async (req, res) => {
  try {
    // Check if user is a counselor
    if (req.user.role !== 'counselor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update counselor availability'
      });
    }

    const { availability } = req.body;

    const counselor = await User.findById(req.user.id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    // Update availability
    counselor.availability = availability;

    await counselor.save();

    res.status(200).json({
      success: true,
      availability: counselor.availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get counselor clients
// @route   GET /api/counselor/clients
// @access  Private
exports.getClients = async (req, res) => {
  try {
    // Check if user is a counselor
    if (req.user.role !== 'counselor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access counselor clients'
      });
    }

    // Get unique clients from appointments
    const appointments = await Appointment.find({ counselor: req.user.id })
      .populate('user', 'name profilePicture email')
      .sort({ date: -1 });

    // Extract unique clients
    const clients = [];
    const clientIds = new Set();

    appointments.forEach(appointment => {
      if (!clientIds.has(appointment.user._id.toString())) {
        clientIds.add(appointment.user._id.toString());
        clients.push({
          id: appointment.user._id,
          name: appointment.user.name,
          profilePicture: appointment.user.profilePicture,
          email: appointment.user.email,
          lastAppointment: appointment.date
        });
      }
    });

    res.status(200).json({
      success: true,
      clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 