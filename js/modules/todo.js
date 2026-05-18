import { Storage } from '../utils/storage.js';

export class TodoModule {
    constructor() {
        this.tasks = Storage.get('tasks', [
            { id: 1, text: 'Review pull requests and merge developer branches', completed: false, category: 'work' },
            { id: 2, text: 'Schedule weekly sprints and team demo sessions', completed: true, category: 'work' },
            { id: 3, text: 'Hydrate and stretch (20/20/20 eye rule)', completed: false, category: 'personal' },
            { id: 4, text: 'Fix container hot-reloading issue on localhost', completed: false, category: 'urgent' }
        ]);

        this.todoInput = document.getElementById('todo-input');
        this.todoCategory = document.getElementById('todo-cat-select');
        this.todoAddBtn = document.getElementById('todo-add-btn');
        this.todoListContainer = document.getElementById('todo-list-box');
        this.todoStatsText = document.getElementById('todo-stats-text');

        this.init();
    }

    init() {
        if (!this.todoListContainer) return;

        // Render initially
        this.render();

        // Listen for additions
        this.todoAddBtn.addEventListener('click', () => this.addTask());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const category = this.todoCategory.value || 'personal';
        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            category
        };

        this.tasks.push(newTask);
        Storage.set('tasks', this.tasks);

        this.todoInput.value = '';
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                const newCompletedState = !task.completed;
                if (newCompletedState) {
                    document.dispatchEvent(new CustomEvent('taskCompleted'));
                }
                return { ...task, completed: newCompletedState };
            }
            return task;
        });

        Storage.set('tasks', this.tasks);
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        Storage.set('tasks', this.tasks);
        this.render();
    }

    render() {
        this.todoListContainer.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.todoListContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    <i class="fa-solid fa-list-check" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p>No tasks left! Rest up.</p>
                </div>
            `;
            this.updateStats();
            return;
        }

        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-content-wrapper">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="todo-item-text">${task.text}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="todo-tag tag-${task.category}">${task.category}</span>
                    <button class="todo-delete-btn" aria-label="Delete task">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            // Bind check box change
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            // Bind delete button
            const deleteBtn = li.querySelector('.todo-delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            this.todoListContainer.appendChild(li);
        });

        this.updateStats();
    }

    updateStats() {
        if (!this.todoStatsText) return;
        const activeCount = this.tasks.filter(t => !t.completed).length;
        const totalCount = this.tasks.length;
        
        if (totalCount === 0) {
            this.todoStatsText.innerText = '0 tasks remaining';
        } else {
            this.todoStatsText.innerText = `${activeCount} active task${activeCount === 1 ? '' : 's'} remaining (${totalCount} total)`;
        }
    }
}
