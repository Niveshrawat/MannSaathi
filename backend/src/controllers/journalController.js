const Journal = require('../models/Journal');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

// @desc    Create a new journal entry
// @route   POST /api/journals
// @access  Private
exports.createJournal = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const journal = await Journal.create(req.body);
  res.status(201).json({
    success: true,
    data: journal
  });
});

// @desc    Get all journal entries for a user
// @route   GET /api/journals
// @access  Private
exports.getJournals = asyncHandler(async (req, res, next) => {
  const journals = await Journal.find({ user: req.user.id })
    .sort('-createdAt');
  
  res.status(200).json({ 
    success: true, 
    count: journals.length,
    data: journals 
  });
});

// @desc    Get single journal entry
// @route   GET /api/journals/:id
// @access  Private
exports.getJournal = asyncHandler(async (req, res, next) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    return next(new ErrorResponse(`Journal entry not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is journal owner
  if (journal.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this journal entry`, 401));
  }

  res.status(200).json({
    success: true,
    data: journal
  });
});

// @desc    Update journal entry
// @route   PUT /api/journals/:id
// @access  Private
exports.updateJournal = asyncHandler(async (req, res, next) => {
  let journal = await Journal.findById(req.params.id);

  if (!journal) {
    return next(new ErrorResponse(`Journal entry not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is journal owner
  if (journal.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this journal entry`, 401));
  }

  journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: journal
  });
});

// @desc    Delete journal entry
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteJournal = asyncHandler(async (req, res, next) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    return next(new ErrorResponse(`Journal entry not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is journal owner
  if (journal.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this journal entry`, 401));
  }

  await journal.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 