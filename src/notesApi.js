const BASE_URL = "https://notes-api.dicoding.dev/v2";

async function getNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  const result = await response.json();
  return result.data;
}

async function getArchivedNotes() {
  const response = await fetch(`${BASE_URL}/notes/archived`);
  const result = await response.json();
  return result.data;
}

async function addNote(title, body) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  return response.json();
}

async function deleteNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

async function archiveNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: "POST",
  });
  return response.json();
}

async function unarchiveNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
    method: "POST",
  });
  return response.json();
}

async function editNote(id, title, body) {
  try {
    await deleteNote(id);
    const result = await addNote(title, body);
    
    return result;
    
  } catch (error) {
    throw new Error('Failed to edit note: ' + error.message);
  }
}

async function getAllNotes() {
  try {
    const [activeNotes, archivedNotes] = await Promise.all([
      getNotes(),
      getArchivedNotes()
    ]);

    const markedArchivedNotes = archivedNotes.map(note => ({
      ...note,
      archived: true
    }));

    const markedActiveNotes = activeNotes.map(note => ({
      ...note,
      archived: false
    }));
    
    return [...markedActiveNotes, ...markedArchivedNotes];
  } catch (error) {
    throw new Error('Failed to fetch notes: ' + error.message);
  }
}

export { 
  getNotes, 
  getArchivedNotes, 
  getAllNotes,
  addNote, 
  deleteNote, 
  archiveNote, 
  unarchiveNote,
  editNote 
};
