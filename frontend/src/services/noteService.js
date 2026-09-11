import api from './api';

export const getNotes = async () => {
  const { data } = await api.get('/notes');
  return data;
};

export const createNote = async (noteData) => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

export const updateNote = async (id, noteData) => {
  const { data } = await api.put(`/notes/${id}`, noteData);
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};
