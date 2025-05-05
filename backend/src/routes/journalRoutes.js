const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal
} = require('../controllers/journalController');

// All routes are protected
router.use(protect);

// Journal routes
router.route('/')
  .get(getJournals)
  .post(createJournal);

router.route('/:id')
  .get(getJournal)
  .put(updateJournal)
  .delete(deleteJournal);

module.exports = router; 