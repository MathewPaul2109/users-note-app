const Note = require('../models/Note');

// @desc   Get all notes for logged in user
// @route  GET /api/notes
// @access Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch notes' });
  }
};

// @desc   Create a new note
// @route  POST /api/notes
// @access Private
const createNote = async (req, res) => {
  const { title, content, color } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      color: color || '#6c63ff',
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create note' });
  }
};

// @desc   Update a note
// @route  PUT /api/notes/:id
// @access Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure note belongs to the logged-in user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update note' });
  }
};

// @desc   Delete a note
// @route  DELETE /api/notes/:id
// @access Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure note belongs to the logged-in user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete note' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
