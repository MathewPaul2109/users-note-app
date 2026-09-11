const NOTE_COLORS = [
  { value: 'linear-gradient(135deg, #7c3aed, #4f46e5)', label: 'Purple' },
  { value: 'linear-gradient(135deg, #2563eb, #0ea5e9)', label: 'Blue' },
  { value: 'linear-gradient(135deg, #059669, #10b981)', label: 'Green' },
  { value: 'linear-gradient(135deg, #d97706, #f59e0b)', label: 'Amber' },
  { value: 'linear-gradient(135deg, #dc2626, #f43f5e)', label: 'Red' },
  { value: 'linear-gradient(135deg, #db2777, #a855f7)', label: 'Pink' },
  { value: 'linear-gradient(135deg, #0d9488, #06b6d4)', label: 'Teal' },
  { value: 'linear-gradient(135deg, #ea580c, #f97316)', label: 'Orange' },
];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const NoteCard = ({ note, onEdit, onDelete }) => {
  const colorStyle = NOTE_COLORS.find((c) => c.value === note.color)?.value || NOTE_COLORS[0].value;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${note.title}"?`)) {
      onDelete(note._id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  return (
    <div
      className="note-card"
      style={{ '--note-color': colorStyle }}
      role="article"
      aria-label={`Note: ${note.title}`}
      onClick={() => onEdit(note)}
    >
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-content">{note.content}</p>
      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.updatedAt)}</span>
        <div className="note-card-actions">
          <button
            id={`edit-note-${note._id}`}
            className="btn-icon"
            onClick={handleEditClick}
            title="Edit note"
            aria-label={`Edit note: ${note.title}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            id={`delete-note-${note._id}`}
            className="btn-icon"
            onClick={handleDeleteClick}
            title="Delete note"
            aria-label={`Delete note: ${note.title}`}
            style={{ color: 'var(--error)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export { NOTE_COLORS };
export default NoteCard;
