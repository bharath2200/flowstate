export class CommandPaletteModule {
    constructor() {
        this.commands = [
            { text: 'Go to Dashboard Home', category: 'navigation', cmd: 'go home', action: () => this.switchPanel('home') },
            { text: 'Go to Sprint Backlog', category: 'navigation', cmd: 'go backlog', action: () => this.switchPanel('todo') },
            { text: 'Go to Habit Tracker', category: 'navigation', cmd: 'go habits', action: () => this.switchPanel('habits') },
            { text: 'Go to Productivity Analytics', category: 'navigation', cmd: 'go analytics', action: () => this.switchPanel('analytics') },
            { text: 'Go to Pomodoro Clock', category: 'navigation', cmd: 'go timer', action: () => this.switchPanel('pomodoro') },
            
            { text: 'Start Focus Timer', category: 'timer', cmd: 'pomodoro start', action: () => this.triggerTimer('start') },
            { text: 'Pause Focus Timer', category: 'timer', cmd: 'pomodoro pause', action: () => this.triggerTimer('pause') },
            { text: 'Reset Focus Timer', category: 'timer', cmd: 'pomodoro reset', action: () => this.triggerTimer('reset') },
            
            { text: 'Create Sticky Scratch Note', category: 'actions', cmd: 'new note', action: () => this.triggerAction('newNote') },
            { text: 'Focus Sprint Task Input', category: 'actions', cmd: 'new task', action: () => this.triggerAction('newTask') },
            
            { text: 'Toggle GitHub Light/Dark Theme', category: 'system', cmd: 'toggle theme', action: () => this.triggerSystem('theme') },
            { text: 'Clear All Backlog Tasks', category: 'system', cmd: 'clear tasks', action: () => this.triggerSystem('clearTasks') }
        ];

        this.isOpen = false;
        this.selectedIdx = 0;

        // Elements
        this.overlay = document.getElementById('palette-overlay');
        this.input = document.getElementById('palette-input');
        this.resultsBox = document.getElementById('palette-results');
        
        this.init();
    }

    init() {
        if (!this.overlay) return;

        // 1. Listen for global hotkey Ctrl + K
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Click overlay background to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // 2. Autocomplete search logic
        this.input.addEventListener('input', () => this.filterCommands());
        
        // 3. Arrow navigations and Enter select
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.input.value = '';
        this.selectedIdx = 0;
        this.filterCommands();
        setTimeout(() => this.input.focus(), 50);
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.input.blur();
    }

    filterCommands() {
        const query = this.input.value.trim().toLowerCase();
        const filtered = this.commands.filter(c => 
            c.text.toLowerCase().includes(query) || 
            c.cmd.toLowerCase().includes(query)
        );

        this.renderResults(filtered);
    }

    renderResults(filtered) {
        this.resultsBox.innerHTML = '';
        
        if (filtered.length === 0) {
            this.resultsBox.innerHTML = `
                <div class="palette-empty">No commands match your query.</div>
            `;
            return;
        }

        filtered.forEach((cmd, idx) => {
            const div = document.createElement('div');
            div.className = `palette-item ${idx === this.selectedIdx ? 'active' : ''}`;
            
            // Icon mapping by category
            let icon = 'fa-terminal';
            if (cmd.category === 'navigation') icon = 'fa-arrow-turn-up';
            else if (cmd.category === 'timer') icon = 'fa-clock';
            else if (cmd.category === 'actions') icon = 'fa-bolt';
            else if (cmd.category === 'system') icon = 'fa-gear';

            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fa-solid ${icon}"></i>
                    <span>${cmd.text}</span>
                </div>
                <span class="palette-cmd-shortcut">${cmd.cmd}</span>
            `;

            // Click listener
            div.addEventListener('click', () => {
                cmd.action();
                this.close();
            });

            this.resultsBox.appendChild(div);
        });

        // Cache filtered list on object for index keydown tracking
        this.filteredCache = filtered;
    }

    handleKeydown(e) {
        if (!this.filteredCache || this.filteredCache.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIdx = (this.selectedIdx + 1) % this.filteredCache.length;
            this.renderResults(this.filteredCache);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIdx = (this.selectedIdx - 1 + this.filteredCache.length) % this.filteredCache.length;
            this.renderResults(this.filteredCache);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedCmd = this.filteredCache[this.selectedIdx];
            if (selectedCmd) {
                selectedCmd.action();
                this.close();
            }
        }
    }

    /* Core Action Executors */
    switchPanel(tabName) {
        // Find sidebar menu item and trigger switch
        const menuBtn = document.querySelector(`.sidebar-menu-item[data-tab="${tabName}"]`);
        if (menuBtn) menuBtn.click();
    }

    triggerTimer(action) {
        // Toggle Pomodoro timer
        const timerPlayBtn = document.getElementById('timer-play-btn');
        const timerResetBtn = document.getElementById('timer-reset-btn');
        const timerPlayIcon = document.getElementById('timer-play-icon');

        if (action === 'start') {
            if (timerPlayIcon.className.includes('fa-play')) timerPlayBtn.click();
        } else if (action === 'pause') {
            if (timerPlayIcon.className.includes('fa-pause')) timerPlayBtn.click();
        } else if (action === 'reset') {
            timerResetBtn.click();
        }
    }

    triggerAction(type) {
        if (type === 'newNote') {
            this.switchPanel('todo');
            const addNoteBtn = document.getElementById('notes-add-btn');
            if (addNoteBtn) setTimeout(() => addNoteBtn.click(), 100);
        } else if (type === 'newTask') {
            this.switchPanel('todo');
            const taskInput = document.getElementById('todo-input');
            if (taskInput) setTimeout(() => taskInput.focus(), 150);
        }
    }

    triggerSystem(type) {
        if (type === 'theme') {
            const themeToggleBtn = document.getElementById('theme-toggle-btn');
            if (themeToggleBtn) themeToggleBtn.click();
        } else if (type === 'clearTasks') {
            if (confirm('Are you sure you want to clear all backlog tasks?')) {
                localStorage.removeItem('flowstate_tasks');
                location.reload();
            }
        }
    }
}
