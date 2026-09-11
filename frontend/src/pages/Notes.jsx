import { useState, useEffect, useCallback } from 'react';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { useAuth } from '../context/AuthContext';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNotes(notes);
    } else {
      const q = search.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      );
    }
  }, [search, notes]);

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleSave = async (noteData) => {
    setSaving(true);
    try {
      if (editingNote?._id) {
        const updated = await updateNote(editingNote._id, noteData);
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
      } else {
        const created = await createNote(noteData);
        setNotes((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <main className="notes-page">
        <div className="container">
          {/* Header */}
          <div className="notes-header">
            <div className="notes-title-group">
              <h1>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
              <p>
                {notes.length === 0
                  ? 'Start capturing your thoughts'
                  : `You have ${notes.length} note${notes.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              id="create-note-btn"
              className="btn btn-primary"
              onClick={openCreateModal}
              aria-label="Create new note"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Note
            </button>
          </div>

          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="stats-bar">
              <div className="stat-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <strong>{notes.length}</strong> Total Notes
              </div>
              {search && (
                <div className="stat-chip">
                  <strong>{filteredNotes.length}</strong> Results
                </div>
              )}
            </div>

            
            <div className="search-bar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="notes-search"
                className="search-input"
                type="search"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search notes"
              />
            </div>
          </div>

          
          {error && (
            <div className="alert alert-error" role="alert" aria-live="polite" style={{ marginBottom: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          
          {loading ? (
            <div className="page-loading" style={{ minHeight: '40vh' }}>
              <div className="spinner-page" />
              <p>Loading your notes...</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon" aria-hidden="true">
                    {search ? '🔍' : '📓'}
                  </div>
                  <h3>
                    {search ? 'No notes found' : 'No notes yet'}
                  </h3>
                  <p>
                    {search
                      ? `No results for "${search}"`
                      : 'Create your first note to get started!'}
                  </p>
                  {!search && (
                    <button
                      id="empty-create-note-btn"
                      className="btn btn-primary"
                      onClick={openCreateModal}
                    >
                      ✨ Create your first note
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      
      {modalOpen && (
        <NoteModal
          note={editingNote}
          onSave={handleSave}
          onClose={closeModal}
          loading={saving}
        />
      )}
    </>
  );
};

export default Notes;
