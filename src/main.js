import "../public/styles/styles.css";
import "./AppBar.js";
import "./NoteItem.js";
import "./NoteInput.js";
import "./AdvancedSearch.js";
import "./EditModal.js";
import Swal from "sweetalert2";
import { 
  getAllNotes, 
  getNotes, 
  getArchivedNotes,
  addNote, 
  deleteNote, 
  archiveNote, 
  unarchiveNote,
  editNote 
} from "./notesApi.js";

const notesContainer = document.getElementById("notesContainer");
const noteForm = document.getElementById("noteForm");

// Store all notes for filtering
let allNotes = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Create search and edit components
const advancedSearch = document.createElement('advanced-search');
const editModal = document.createElement('edit-modal');

// Insert search component after app-bar
const appBar = document.querySelector('app-bar');
appBar.insertAdjacentElement('afterend', advancedSearch);

// Insert edit modal at the end of body
document.body.appendChild(editModal);

async function loadNotes(filter = 'all', searchTerm = '') {
  if (notesContainer) {
    notesContainer.innerHTML = '<div class="loading-spinner"></div>';
  }
  
  try {
    // Get notes based on filter
    let notes;
    switch (filter) {
      case 'active':
        notes = await getNotes();
        notes = notes.map(note => ({ ...note, archived: false }));
        break;
      case 'archived':
        notes = await getArchivedNotes();
        notes = notes.map(note => ({ ...note, archived: true }));
        break;
      default:
        notes = await getAllNotes();
        break;
    }

    // Store all notes for filtering
    allNotes = notes;
    
    // Apply search filter
    let filteredNotes = notes;
    if (searchTerm) {
      filteredNotes = notes.filter(note => {
        const title = (note.title || '').toLowerCase();
        const body = (note.body || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return title.includes(term) || body.includes(term);
      });
    }

    // Clear container
    notesContainer.innerHTML = "";

    // Show empty state if no notes
    if (filteredNotes.length === 0) {
      const emptyState = getEmptyStateHTML(filter, searchTerm);
      notesContainer.innerHTML = emptyState;
      return;
    }

    // Render notes
    filteredNotes.forEach(({ id, title, body, archived, createdAt }) => {
      const note = document.createElement("note-item");
      note.setAttribute("id", id);
      note.setAttribute("title", title);
      note.setAttribute("body", body);
      note.setAttribute("archived", archived ? "true" : "false");
      if (createdAt) {
        note.setAttribute("created-at", createdAt);
      }
      note.classList.add('note-animate');
      notesContainer.appendChild(note);
    });

  } catch (error) {
    console.error('Error loading notes:', error);
    Swal.fire({
      icon: "error",
      title: "Gagal Memuat Catatan!",
      text: error.message || "Terjadi kesalahan pada server.",
    });
  }
}

function getEmptyStateHTML(filter, searchTerm) {
  if (searchTerm) {
    return `
      <div class="empty-state">
        <h3>🔍 Tidak Ada Hasil</h3>
        <p>Tidak ditemukan catatan yang sesuai dengan pencarian "<strong>${searchTerm}</strong>"</p>
        <p>Coba gunakan kata kunci yang berbeda</p>
      </div>
    `;
  }
  
  switch (filter) {
    case 'active':
      return `
        <div class="empty-state">
          <h3>📝 Belum Ada Catatan Aktif</h3>
          <p>Mulai buat catatan pertama Anda!</p>
        </div>
      `;
    case 'archived':
      return `
        <div class="empty-state">
          <h3>📁 Belum Ada Catatan Arsip</h3>
          <p>Catatan yang diarsipkan akan muncul di sini</p>
        </div>
      `;
    default:
      return `
        <div class="empty-state">
          <h3>📝 Belum Ada Catatan</h3>
          <p>Mulai buat catatan pertama Anda!</p>
        </div>
      `;
  }
}

// Event Listeners

// Search and filter changes
document.addEventListener('search-filter-change', async (event) => {
  const { searchTerm, filter } = event.detail;
  currentFilter = filter;
  currentSearchTerm = searchTerm;
  await loadNotes(filter, searchTerm);
});

// Delete note
document.addEventListener("delete-note", async (event) => {
  const noteId = event.detail.id;

  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "Hapus Catatan?",
    text: "Catatan akan terhapus secara permanen.",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (!isConfirmed) return;

  try {
    await deleteNote(noteId);
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Dihapus!",
      timer: 2000,
      showConfirmButton: false
    });
    await loadNotes(currentFilter, currentSearchTerm);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Menghapus Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

// Archive note
document.addEventListener("archive-note", async (event) => {
  const noteId = event.detail.id;

  try {
    await archiveNote(noteId);
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Diarsipkan!",
      timer: 2000,
      showConfirmButton: false
    });
    await loadNotes(currentFilter, currentSearchTerm);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Mengarsipkan Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

// Unarchive note
document.addEventListener("unarchive-note", async (event) => {
  const noteId = event.detail.id;

  try {
    await unarchiveNote(noteId);
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Dikembalikan!",
      timer: 2000,
      showConfirmButton: false
    });
    await loadNotes(currentFilter, currentSearchTerm);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Mengembalikan Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

// Edit note
document.addEventListener("edit-note", (event) => {
  const { id, title, body } = event.detail;
  editModal.show({ id, title, body });
});

// Handle edit form submission
document.addEventListener("note-edit-submit", async (event) => {
  const { id, title, body } = event.detail;

  try {
    // Show loading
    Swal.fire({
      title: 'Menyimpan...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false
    });

    await editNote(id, title, body);
    
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Diperbarui!",
      timer: 2000,
      showConfirmButton: false
    });
    
    await loadNotes(currentFilter, currentSearchTerm);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Memperbarui Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

// Add new note
noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();

  if (!title || !body) {
    return Swal.fire({
      icon: "warning",
      title: "Judul & Isi Kosong!",
      text: "Mohon isi judul dan isi catatan.",
    });
  }

  try {
    // Show loading
    Swal.fire({
      title: 'Menambahkan...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false
    });

    await addNote(title, body);
    noteForm.reset();
    
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Ditambahkan!",
      text: `Catatan "${title}" telah ditambahkan.`,
      timer: 2000,
      showConfirmButton: false
    });
    
    // If we're viewing archived notes, switch to active notes
    if (currentFilter === 'archived') {
      advancedSearch.setFilter('active');
    } else {
      await loadNotes(currentFilter, currentSearchTerm);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Menambahkan Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + F for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  
  // Ctrl/Cmd + N for new note
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    const titleInput = document.querySelector('#title');
    if (titleInput) {
      titleInput.focus();
    }
  }
});

// Initialize
loadNotes();