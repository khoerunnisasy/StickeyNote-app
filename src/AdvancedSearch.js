class AdvancedSearch extends HTMLElement {
  constructor() {
    super();
    this.currentFilter = 'all'; // all, active, archived
    this.searchTerm = '';
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="search-section">
        <div class="search-controls">
          <input 
            type="text" 
            id="searchInput" 
            class="search-input" 
            placeholder="🔍 Cari catatan berdasarkan judul atau isi..."
          >
          <div class="filter-controls">
            <button class="filter-btn active" data-filter="all">Semua</button>
            <button class="filter-btn" data-filter="active">Aktif</button>
            <button class="filter-btn" data-filter="archived">Arsip</button>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchInput = this.querySelector('#searchInput');
    const filterButtons = this.querySelectorAll('.filter-btn');

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.dispatchSearchEvent();
      }, 300);
    });

    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentFilter = e.target.dataset.filter;
        this.dispatchSearchEvent();
      });
    });
  }

  dispatchSearchEvent() {
    const event = new CustomEvent('search-filter-change', {
      detail: {
        searchTerm: this.searchTerm,
        filter: this.currentFilter
      },
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  setSearchTerm(term) {
    const searchInput = this.querySelector('#searchInput');
    if (searchInput) {
      searchInput.value = term;
      this.searchTerm = term.toLowerCase().trim();
      this.dispatchSearchEvent();
    }
  }

  setFilter(filter) {
    const filterButtons = this.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.currentFilter = filter;
    this.dispatchSearchEvent();
  }
}

if (!customElements.get("advanced-search")) {
  customElements.define("advanced-search", AdvancedSearch);
}
