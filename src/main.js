import "../public/styles/styles.css";
import "./AppBar.js";
import "./NoteItem.js";
import "./NoteInput.js";
import Swal from "sweetalert2";
import { getNotes, addNote, deleteNote } from "./notesApi.js";

const notesContainer = document.getElementById("notesContainer");
const noteForm = document.getElementById("noteForm");

async function loadNotes() {
  if (notesContainer) {
    notesContainer.innerHTML = "<p>Loading...</p>";
  }
  try {
    const notes = await getNotes();
    notesContainer.innerHTML = "";

    notes.forEach(({ id, title, body }) => {
      const note = document.createElement("note-item");
      note.setAttribute("id", id);
      note.setAttribute("title", title);
      note.setAttribute("body", body);
      notesContainer.appendChild(note);
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Memuat Catatan!",
      text: error.message || "Terjadi kesalahan pada server.",
    });
  }
}

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
    });
    await loadNotes();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Menghapus Catatan!",
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
    await addNote(title, body);
    noteForm.reset();
    await loadNotes();
    Swal.fire({
      icon: "success",
      title: "Catatan Berhasil Ditambahkan!",
      text: `Catatan "${title}" telah ditambahkan.`,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Menambahkan Catatan!",
      text: error.message || "Silakan coba lagi.",
    });
  }
});

loadNotes();
