# 🚀 FlowState — Developer Productivity Cockpit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Theme: GitHub Style](https://img.shields.io/badge/Theme-GitHub--Style-blue)](https://github.com)
[![Logic: Vanilla ES6 Modules](https://img.shields.io/badge/Logic-Vanilla%20ES6%20Modules-brightgreen)](#)

A beautiful, functional, and highly polished developer cockpit inspired by **GitHub's layout aesthetics**. Styled with pure Vanilla CSS, the board contains zero external UI runtime dependencies and uses vanilla JavaScript ES6 modular structures to separate component operations.

---

## 🎨 Design Theme Philosophy
FlowState implements a premium, adaptive grid interface designed specifically for software engineers. It supports:
- **GitHub Dark (`github-dark`)**: Classic deep slate tones (`#0d1117` / `#161b22`) and outlining borders (`#30363d`).
- **GitHub Light (`github-light`)**: High contrast light slate palettes (`#f6f8fa` / `#ffffff`) preserving GitHub's sleek responsive details.
- **Theme Caching**: Active settings automatically persist across page sessions via browser `localStorage`.

---

## ⚡ Core Features

### 1. 📋 Backlog Sprint Planner (To-Do)
- Fast task entries with specific priority categorization labels (`Work`, `Personal`, `Urgent`).
- Status counters calculating active backlog percentages and completed tasks.
- Interactive, responsive checklist ticks utilizing clean CSS transitions.
- Automatic browser state syncs using local data pools.

### 2. ⏱️ Pomodoro Focus Station
- Smooth circular countdown graph built using customizable **SVG circle dashoffset** values.
- Quick mode selectors toggling between `Productive Sessions` (25m), `Short Breaks` (5m), and `Extended Breaks` (15m).
- Bypasses missing local asset audio errors by synthesizing a bell tone on completion using the browser's **Web Audio API**.

### 3. 📝 Scratchpad Sticky Notes
- Multi-colored scratch notes layout modeled after classic developer kanbans.
- Five distinct style classes (`note-blue`, `note-purple`, `note-green`, `note-yellow`, `note-red`) matching dark and light contrast.
- Fully editable text fields dynamically triggering save routines on user input.

### 4. 🌤️ Geolocation Weather Widget
- Connects to **Open-Meteo's Key-less public weather endpoints** to query live meteorological statistics client-side.
- Uses the **HTML5 Geolocation API** to fetch high-precision local coordinates automatically.
- Fallback search box that resolves typed city queries to precise latitudes and longitudes using open geocoding.
- Translates WMO weather condition codes into Font Awesome meteorology symbols.

### 5. 💬 Daily Coding Quotes
- A database of highly engaging developer quotes featuring Linus Torvalds, Martin Fowler, Steve Gates, etc.
- Soft text transitions applying clean fade-outs when clicking refresh actions.

---

## 📂 Project Structure Map
```
FlowState/
│
├── css/
│   ├── components/
│   │   ├── notes.css       # Sticky note pastel colors & dots
│   │   ├── pomodoro.css    # Circular progress SVG & play dials
│   │   ├── todo.css        # Checkbox scales & priority badges
│   │   └── widgets.css     # Weather grids & quote refreshes
│   │
│   ├── layouts/
│   │   └── grid.css        # Multi-column grid & GitHub-style navbar
│   │
│   └── main.css            # Resets, tokens, & sub-import rules
│
├── js/
│   ├── modules/
│   │   ├── notes.js        # Color changers & note arrays
│   │   ├── pomodoro.js     # Web Audio beeper & timer controls
│   │   ├── quotes.js       # Refreshes & database lists
│   │   ├── todo.js         # Checklists & priority filters
│   │   └── weather.js      # Geocoding & Open-Meteo coordinates
│   │
│   ├── utils/
│   │   └── storage.js      # JSON local storage serializers
│   │
│   └── app.js              # Loader & master coordinator
│
├── index.html              # Main HTML entrypoint
├── README.md               # Documentation guide
└── package.json            # npm metadata and live-server settings
```

---

## 🛠️ Quick Setup Guide

### Method A: Zero Install (Direct Launch)
Double-click `index.html` directly to load it inside any modern web browser. **Note**: If you want to use the Geocoding Weather search, standard modern security sandbox protocols may restrict cross-origin requests from `file://` URIs. We highly recommend using a local development server.

### Method B: Development Server (Recommended)
1. Ensure **Node.js** is installed on your local computer.
2. Open your terminal in the `FlowState` folder.
3. Install standard hot-reloading web servers:
   ```bash
   npm install
   ```
4. Start the server using:
   ```bash
   npm run start
   ```
   *(Uses `live-server` to automatically spin up a development host at `http://127.0.0.1:8080` with automatic browser refreshes on file edits!)*

---

## 📄 License
This project is licensed under the MIT License - see the [MIT License](LICENSE) docs for details.
