const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controller/noteController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').get(getNotes).post(createNote);
router.route('/:id').put(updateNote).delete(deleteNote);

module.exports = router;
