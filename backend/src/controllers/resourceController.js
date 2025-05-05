const Resource = require('../models/Resource');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private (Counselor only)
exports.createResource = asyncHandler(async (req, res, next) => {
  req.body.counselor = req.user.id;
  const resource = await Resource.create(req.body);
  res.status(201).json({
    success: true,
    data: resource
  });
});

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = asyncHandler(async (req, res, next) => {
  try {
    console.log('Fetching resources...');
    
    // Fetch all resources with counselor information
    const resources = await Resource.find()
      .populate({
        path: 'counselor',
        select: 'name profilePicture'
      })
      .sort('-createdAt');
    
    console.log(`Found ${resources.length} resources`);
    console.log('Published resources:', resources.filter(r => r.isPublished).length);
    console.log('Unpublished resources:', resources.filter(r => !r.isPublished).length);

    res.status(200).json({ 
      success: true, 
      count: resources.length,
      data: resources 
    });
  } catch (error) {
    console.error('Error in getResources:', error);
    next(error);
  }
});

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
exports.getResource = asyncHandler(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id)
    .populate({
      path: 'counselor',
      select: 'name profilePicture'
    });

  if (!resource) {
    return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
  }

  // If resource is not published and viewer is not the owner, don't show it
  if (!resource.isPublished && (!req.user || resource.counselor._id.toString() !== req.user.id)) {
    return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: resource
  });
});

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Counselor only)
exports.updateResource = asyncHandler(async (req, res, next) => {
  let resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is resource owner
  if (resource.counselor.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this resource`, 401));
  }

  resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate({
    path: 'counselor',
    select: 'name profilePicture'
  });

  res.status(200).json({
    success: true,
    data: resource
  });
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Counselor only)
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is resource owner
  if (resource.counselor.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this resource`, 401));
  }

  await resource.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get counselor's own resources (both published and drafts)
// @route   GET /api/resources/my-resources
// @access  Private/Counselor
exports.getMyResources = asyncHandler(async (req, res, next) => {
  const resources = await Resource.find({ counselor: req.user.id })
    .populate({
      path: 'counselor',
      select: 'name profilePicture'
    })
    .sort('-createdAt');

  res.status(200).json({ 
    success: true, 
    count: resources.length,
    data: resources 
  });
}); 