class NoteInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <form id="noteForm">
                <input type="text" id="title" placeholder="Judul Catatan" required>
                <textarea id="body" placeholder="Isi Catatan" required></textarea>
                <button type="submit" class="submit">Tambah Catatan</button>
                <p id="error-message" style="color: red; display: none;">Judul dan isi tidak boleh kosong!</p>
            </form>
        `;

    const form = this.querySelector("#noteForm");
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const errorMessage = this.querySelector("#error-message");

    form.addEventListener("submit", (event) => {
      if (!titleInput.value.trim() || !bodyInput.value.trim()) {
        event.preventDefault();
        errorMessage.style.display = "block";
      } else {
        errorMessage.style.display = "none";
      }
    });
  }
}

if (!customElements.get("note-input")) {
  customElements.define("note-input", NoteInput);
}
