class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "body"];
  }

  attributeChangedCallback() {
    this.render();
  }

  async render() {
    const response = await fetch("styles/note-item-style.css");
    const css = await response.text();

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div class="note">
        <h3>${this.getAttribute("title")}</h3>
        <p>${this.getAttribute("body")}</p>
        <button class="delete-btn">Hapus</button>
      </div>
    `;

    this.shadowRoot.querySelector(".delete-btn").addEventListener("click", () => {
      const event = new CustomEvent("delete-note", {
        detail: { id: this.getAttribute("id") },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    });
  }
}

if (!customElements.get("note-item")) {
  customElements.define("note-item", NoteItem);
}