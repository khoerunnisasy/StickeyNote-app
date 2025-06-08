class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "body", "archived", "created-at"];
  }

  attributeChangedCallback() {
    this.render();
  }

  async render() {
    const response = await fetch("styles/note-item-style.css");
    const css = await response.text();

    const isArchived = this.getAttribute("archived") === "true";
    const createdAt = this.getAttribute("created-at");
    const title = this.getAttribute("title") || "";
    const body = this.getAttribute("body") || "";

    const formattedDate = createdAt ? 
      new Date(createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }) : '';

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="note ${isArchived ? 'archived' : ''}">
        <h3>${this.escapeHtml(title)}</h3>
        <p>${this.escapeHtml(body)}</p>
        <div class="note-actions">
          <button class="action-btn edit-btn" title="Edit">✏️</button>
          ${isArchived ? 
            '<button class="action-btn unarchive-btn" title="Unarchive">📤</button>' : 
            '<button class="action-btn archive-btn" title="Archive">📁</button>'
          }
          <button class="action-btn delete-btn" title="Hapus">🗑️</button>
        </div>
        ${formattedDate ? `<div class="note-date">${formattedDate}</div>` : ''}
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const editBtn = this.shadowRoot.querySelector('.edit-btn');
    const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
    const unarchiveBtn = this.shadowRoot.querySelector('.unarchive-btn');
    const deleteBtn = this.shadowRoot.querySelector('.delete-btn');

    editBtn?.addEventListener('click', () => {
      const event = new CustomEvent('edit-note', {
        detail: { 
          id: this.getAttribute('id'),
          title: this.getAttribute('title'),
          body: this.getAttribute('body')
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });

    archiveBtn?.addEventListener('click', () => {
      const event = new CustomEvent('archive-note', {
        detail: { id: this.getAttribute('id') },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });

    unarchiveBtn?.addEventListener('click', () => {
      const event = new CustomEvent('unarchive-note', {
        detail: { id: this.getAttribute('id') },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });

    deleteBtn?.addEventListener('click', () => {
      const event = new CustomEvent('delete-note', {
        detail: { id: this.getAttribute('id') },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  matchesSearch(searchTerm) {
    if (!searchTerm) return true;
    
    const title = (this.getAttribute('title') || '').toLowerCase();
    const body = (this.getAttribute('body') || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return title.includes(term) || body.includes(term);
  }

  isArchived() {
    return this.getAttribute('archived') === 'true';
  }
}

if (!customElements.get("note-item")) {
  customElements.define("note-item", NoteItem);
}
