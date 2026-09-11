import { useState, useEffect } from 'react';
import { NOTE_COLORS } from './NoteCard';

const NoteModal = ({ note, onSave, onClose, loading }) => {
  const isEditing = Boolean(note?._id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setColor(note.color || NOTE_COLORS[0].value);
    }
  }, [note]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSave({ title: title.trim(), content: content.trim(), color });
  };

  
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? 'Edit Note' : 'New Note'}
          </h2>
          <button
            id="modal-close-btn"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="note-title">Title</label>
              <input
                id="note-title"
                className="form-input"
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                maxLength={100}
              />
              {errors.title && (
                <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.title}</span>
              )}
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label" htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                className="form-textarea"
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
              {errors.content && (
                <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.content}</span>
              )}
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker" role="radiogroup" aria-label="Note color">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={color === c.value}
                    aria-label={c.label}
                    className={`color-swatch${color === c.value ? ' selected' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="modal-cancel-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="modal-save-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
