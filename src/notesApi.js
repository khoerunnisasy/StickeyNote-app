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

// Note: The Dicoding API doesn't support editing notes directly
// This is a simulation of what an edit function would look like
async function editNote(id, title, body) {
  // Since the API doesn't support PUT/PATCH for editing,
  // we'll simulate it by deleting and recreating the note
  // In a real application, you'd have a proper edit endpoint
  
  try {
    // Delete the old note
    await deleteNote(id);
    
    // Create a new note with the updated content
    const result = await addNote(title, body);
    
    return result;
  } catch (error) {
    throw new Error('Failed to edit note: ' + error.message);
  }
}

// Helper function to get all notes (active + archived)
async function getAllNotes() {
  try {
    const [activeNotes, archivedNotes] = await Promise.all([
      getNotes(),
      getArchivedNotes()
    ]);
    
    // Mark archived notes
    const markedArchivedNotes = archivedNotes.map(note => ({
      ...note,
      archived: true
    }));
    
    // Mark active notes
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