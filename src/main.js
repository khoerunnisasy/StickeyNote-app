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

let allNotes = [];
let currentFilter = 'all';
let currentSearchTerm = '';

const advancedSearch = document.createElement('advanced-search');
const editModal = document.createElement('edit-modal');
const appBar = document.querySelector('app-bar');

appBar.insertAdjacentElement('afterend', advancedSearch);
document.body.appendChild(editModal);

async function loadNotes(filter = 'all', searchTerm = '') {
  if (notesContainer) {
    notesContainer.innerHTML = '<div class="loading-spinner"></div>';
  }
  
  try {
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

    allNotes = notes;
    
    let filteredNotes = notes;
    if (searchTerm) {
      filteredNotes = notes.filter(note => {
        const title = (note.title || '').toLowerCase();
        const body = (note.body || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return title.includes(term) || body.includes(term);
      });
    }

    notesContainer.innerHTML = "";

    if (filteredNotes.length === 0) {
      const emptyState = getEmptyStateHTML(filter, searchTerm);
      notesContainer.innerHTML = emptyState;
      return;
    }

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

document.addEventListener('search-filter-change', async (event) => {
  const { searchTerm, filter } = event.detail;
  currentFilter = filter;
  currentSearchTerm = searchTerm;
  await loadNotes(filter, searchTerm);
});

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

document.addEventListener("edit-note", (event) => {
  const { id, title, body } = event.detail;
  editModal.show({ id, title, body });
});

document.addEventListener("note-edit-submit", async (event) => {
  const { id, title, body } = event.detail;

  try {
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

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    const titleInput = document.querySelector('#title');
    if (titleInput) {
      titleInput.focus();
    }
  }
});

loadNotes();
