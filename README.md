# 📝 StickeyNote - Smart Notes Management App

**StickeyNote** adalah aplikasi manajemen catatan modern yang dikembangkan sebagai bagian dari submission Belajar Fundamental Front-End Web Development. Aplikasi ini dibangun dengan fokus pada implementasi RESTful API, Webpack Module Bundler, dan Fetch API untuk menyediakan pengalaman yang intuitif dan responsif dalam mengelola catatan pribadi.

## 🌟 Fitur

- **Create Notes**: Add new notes dengan title dan body
- **Edit Notes**: Update existing notes secara real-time
- **Archive System**: Move notes between active dan archived states
- **Delete Notes**: Remove notes dengan confirmation dialog
- **Local Storage**: Data tersimpan di browser secara otomatis
- **Responsive Design**: Tampilan optimal di berbagai ukuran layar

## 🔍 Advanced Search

- **Real-time Filtering**: Instant search results saat typing
- **Multi-field Search**: Search berdasarkan title dan content
- **Case Insensitive**: Flexible search tanpa case sensitivity

## 🛠️ Teknologi yang Digunakan

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure & Semantics | Latest |
| **CSS3** | Styling & Animations | Latest |
| **JavaScript (ES6+)** | Logic & Interactivity | ES2022+ |
| **Local Storage API** | Data Persistence | Native |
| **Responsive Design** | Cross-device Compatibility | CSS Grid & Flexbox |

## 🚀 Demo

🔗 **Live Demo**: [https://khoerunnisasy.github.io/StickeyNote-app/](https://khoerunnisasy.github.io/StickeyNote-app/)

## 📁 Struktur Project

```
StickeyNote-app/
├── index.html               # Main HTML structure
├── public
│ ├── styles/
│   ├── note-item-style.css  # Note item styles
│   └── style.css            # Primary styles
├── src/
│   ├── main.js              # Main application logic
│   ├── AdvancedSearch.js    # Search logic
│   ├── AppBar.js            # Bar logic
│   ├── NoteInput.js         # Note Input logic
│   ├── NoteItem.js          # Note item logic
│   ├── EditModal.js         # edit logic
│   └── NoteApi.js           # Fetch API
└── README.md                # Documentation
```

### 💻 Cara Menjalankan

1. **Clone Repository**
```bash
git clone https://github.com/khoerunnisasy/StickeyNote-app.git
cd StickeyNote-app
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Development Mode**

```bash
# Start webpack dev server with hot reload
npm run dev

# atau
yarn dev
```

4. **Production Build**

```bash
# Build optimized bundles
npm run build

# Serve production build
npm run serve
```

## 📖 Cara Menggunakan

### 1. Creating Notes
1. Click tombol **"Add New Note"**
2. Fill in **Title** dan **Content**
3. Click **"Save"** untuk menyimpan
4. Note akan muncul di **Active Notes** section

### 2. Managing Notes
- **Delete**: Click delete icon dengan confirmation
- **Archive**: Click archive icon untuk memindahkan ke archived
- **Unarchive**: Click unarchive icon untuk kembali ke active
- **Delete**: Click delete icon dengan confirmation
- **Search**: Use search bar untuk filter notes

### 3. Navigation
- **Active Tab**: Menampilkan notes yang sedang aktif
- **Archived Tab**: Menampilkan notes yang telah diarsipkan
- **Search Bar**: Real-time search across all notes

## 🎯 Konsep yang Dipelajari

Project ini mengimplementasikan konsep-konsep dari kelas Dicoding:
- 🌐 **RESTful API Integration**: Seamless data communication dengan external API
- 📦 **Webpack Module Bundler**: Modern build system dengan optimized bundles
- ⚡ **Fetch API Implementation**: Asynchronous HTTP requests untuk data operations
- ⏳ **Loading Indicators**: Real-time feedback dengan loading states dan spinners
- 📱 **Responsive Design**: Optimized untuk semua device (desktop, tablet, mobile)
- 🔍 **Smart Search**: Real-time search functionality dengan highlighting
- 📂 **Dual Categories**: Organized notes (Active & Archived)
- 🎨 **Modern UI/UX**: Clean, minimalist design dengan smooth animations
- 🔒 **Error Handling**: Robust error management untuk API calls
- 🎯 **Interactive Elements**: Toast notifications, loading states, dan micro-interactions

## 🎨 Design Decisions

- **Mobile-First Approach** - Responsive design starting from mobile
- **Accessibility** - WCAG compliant dengan proper ARIA labels
- **Performance** - Optimized untuk fast loading dan smooth interactions
- **User Experience** - Intuitive navigation dengan clear visual hierarchy
- **Modern Aesthetics** - Clean design dengan consistent color palette

## 📧 Kontak

**GitHub Profile** - [@khoerunnisasy](https://github.com/khoerunnisasy)

Project Link: [https://github.com/khoerunnisasy/StickeyNote-app](https://github.com/khoerunnisay/StickeyNote-app)

## 🙏 Acknowledgments

- **Dicoding Indonesia** untuk materi pembelajaran yang komprehensif
- **MDN Web Docs** untuk referensi JavaScript dan Web APIs
- **Community** yang selalu memberikan feedback dan support

## 📈 Future Improvements

 - [ ] 📤 Export/Import Notes - Backup dan restore data ke file JSON/CSV
 - [ ] 🏷️ Note Categories & Tags - Organize notes berdasarkan kategori dan custom tags
 - [ ] ⭐ Note Rating & Priority - Rating system dan priority levels untuk notes
 - [ ] 🌙 Dark Mode Theme - Toggle antara light/dark theme dengan system preference detection
 - [ ] 🔍 Advanced Search - Full-text search dengan filters, sorting, dan search history
 - [ ] 🔔 Notifications - Reminder system dan deadline notifications
 - [ ] 👥 Collaboration Features - Share notes, collaborative editing, dan team workspaces
- [ ]  📱 Progressive Web App - Offline functionality, push notifications, dan app-like experience
 - [ ] 🔐 Enhanced Security - End-to-end encryption dan secure authentication
 - [ ] 🎨 Customizable UI - Themes, layouts, dan personalization options
 - [ ] 📈 Performance Optimization - Lazy loading, virtual scrolling, dan caching strategies

---

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for learning and growth
