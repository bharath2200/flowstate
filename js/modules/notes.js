import { Storage } from '../utils/storage.js';

export class NotesModule {
    constructor() {
        this.notes = Storage.get('notes', [
            { id: 1, content: '📌 Useful Docker commands:\n• build: docker build -t app .\n• run: docker run -p 3000:3000 app\n• prune: docker system prune -a', color: 'note-blue', date: '5/18/2026' },
            { id: 2, content: '💡 NextJS API routes must have proper security middleware. Check CORS issues client side.', color: 'note-purple', date: '5/18/2026' }
        ]);

        this.notesAddBtn = document.getElementById('notes-add-btn');
        this.notesContainer = document.getElementById('notes-grid');

        this.init();
    }

    init() {
        if (!this.notesContainer) return;

        // Render initially
        this.render();

        // Listen for new notes
        this.notesAddBtn.addEventListener('click', () => this.addNote());
    }

    addNote() {
        const colors = ['note-blue', 'note-purple', 'note-green', 'note-yellow', 'note-red'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newNote = {
            id: Date.now(),
            content: 'Click here to write notes...',
            color: randomColor,
            date: new Date().toLocaleDateString()
        };

        this.notes.push(newNote);
        Storage.set('notes', this.notes);

        this.render();
    }

    updateNote(id, content) {
        this.notes = this.notes.map(note => {
            if (note.id === id) {
                return { ...note, content };
            }
            return note;
        });
        Storage.set('notes', this.notes);
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        Storage.set('notes', this.notes);
        this.render();
    }

    changeNoteColor(id, colorClass) {
        this.notes = this.notes.map(note => {
            if (note.id === id) {
                return { ...note, color: colorClass };
            }
            return note;
        });
        Storage.set('notes', this.notes);
        this.render();
    }

    render() {
        this.notesContainer.innerHTML = '';

        if (this.notes.length === 0) {
            this.notesContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">
                    <i class="fa-solid fa-note-sticky" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
                    <p>No sticky notes found. Create one!</p>
                </div>
            `;
            return;
        }

        this.notes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${note.color}`;
            card.innerHTML = `
                <textarea class="note-textarea" aria-label="Note content">${note.content}</textarea>
                <div class="note-footer">
                    <span class="note-date">${note.date}</span>
                    <div style="display: flex; gap: 0.35rem; align-items: center;">
                        <div class="color-dot note-blue" data-color="note-blue"></div>
                        <div class="color-dot note-purple" data-color="note-purple"></div>
                        <div class="color-dot note-green" data-color="note-green"></div>
                        <div class="color-dot note-yellow" data-color="note-yellow"></div>
                        <div class="color-dot note-red" data-color="note-red"></div>
                        <button class="note-delete" aria-label="Delete note">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;

            // Bind text editing
            const textarea = card.querySelector('.note-textarea');
            textarea.addEventListener('input', (e) => {
                this.updateNote(note.id, e.target.value);
            });

            // Bind color switcher
            const dots = card.querySelectorAll('.color-dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const selectedColor = dot.getAttribute('data-color');
                    this.changeNoteColor(note.id, selectedColor);
                });
            });

            // Bind delete button
            const deleteBtn = card.querySelector('.note-delete');
            deleteBtn.addEventListener('click', () => this.deleteNote(note.id));

            this.notesContainer.appendChild(card);
        });
    }
}
