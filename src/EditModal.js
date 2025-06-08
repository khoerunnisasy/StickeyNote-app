class EditModal extends HTMLElement {
  constructor() {
    super();
    this.currentNoteId = null;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <h2 class="modal-title">Edit Catatan</h2>
          <form id="editForm">
            <input type="text" id="editTitle" placeholder="Judul Catatan" required>
            <textarea id="editBody" placeholder="Isi Catatan" required></textarea>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button type="submit" class="submit">Simpan Perubahan</button>
              <button type="button" class="cancel-btn" style="background: #6c757d;">Batal</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const overlay = this.querySelector('.modal-overlay');
    const closeBtn = this.querySelector('.modal-close');
    const cancelBtn = this.querySelector('.cancel-btn');
    const form = this.querySelector('#editForm');

    // Close modal events
    closeBtn.addEventListener('click', () => this.hide());
    cancelBtn.addEventListener('click', () => this.hide());
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide();
      }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  }

  show(noteData) {
    this.currentNoteId = noteData.id;
    
    const titleInput = this.querySelector('#editTitle');
    const bodyInput = this.querySelector('#editBody');
    
    titleInput.value = noteData.title;
    bodyInput.value = noteData.body;
    
    const overlay = this.querySelector('.modal-overlay');
    overlay.style.display = 'flex';
    
    // Focus on title input
    setTimeout(() => titleInput.focus(), 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hide() {
    const overlay = this.querySelector('.modal-overlay');
    overlay.style.display = 'none';
    
    // Reset form
    this.querySelector('#editForm').reset();
    this.currentNoteId = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  isVisible() {
    const overlay = this.querySelector('.modal-overlay');
    return overlay.style.display === 'flex';
  }

  handleSubmit() {
    const title = this.querySelector('#editTitle').value.trim();
    const body = this.querySelector('#editBody').value.trim();

    if (!title || !body) {
      // Could use SweetAlert here, but keeping it simple
      alert('Judul dan isi catatan tidak boleh kosong!');
      return;
    }

    // Dispatch custom event with edit data
    const event = new CustomEvent('note-edit-submit', {
      detail: {
        id: this.currentNoteId,
        title: title,
        body: body
      },
      bubbles: true
    });
    
    this.dispatchEvent(event);
    this.hide();
  }
}

if (!customElements.get("edit-modal")) {
  customElements.define("edit-modal", EditModal);
}