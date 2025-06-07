class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<header>Stickey Note</header>`;
  }
}
if (!customElements.get("app-bar")) {
  customElements.define("app-bar", AppBar);
}
