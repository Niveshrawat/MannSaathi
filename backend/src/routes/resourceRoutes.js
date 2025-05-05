const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    getMyResources
} = require('../controllers/resourceController');

// Public routes
router.get('/', getResources);

// Protected routes (counselor only)
router.use(protect);
router.use(authorize('counselor'));

// Put specific routes before parameter routes
router.get('/my-resources', getMyResources);
router.post('/', createResource);

// Parameter routes should come last
router.get('/:id', getResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router; 