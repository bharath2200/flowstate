import { Storage } from '../utils/storage.js';

export class HabitsModule {
    constructor() {
        // Initialize habits with a weekly schedule (7 days)
        const defaultHabits = {
            coding: { name: 'Coding Session', icon: 'fa-code', color: 'blue', days: [false, false, false, false, false, false, false], streak: 0 },
            gym: { name: 'Gym / Fitness', icon: 'fa-dumbbell', color: 'red', days: [false, false, false, false, false, false, false], streak: 0 },
            study: { name: 'Deep Study', icon: 'fa-book-open', color: 'purple', days: [false, false, false, false, false, false, false], streak: 0 },
            reading: { name: 'Tech Reading', icon: 'fa-readme', color: 'green', days: [false, false, false, false, false, false, false], streak: 0 }
        };

        this.habits = Storage.get('habits', defaultHabits);
        this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        this.habitsContainer = document.getElementById('habits-grid-box');
        
        this.init();
    }

    init() {
        if (!this.habitsContainer) return;
        this.render();
    }

    toggleDay(habitKey, dayIndex) {
        this.habits[habitKey].days[dayIndex] = !this.habits[habitKey].days[dayIndex];
        
        // Recalculate streak
        this.calculateStreak(habitKey);

        Storage.set('habits', this.habits);
        this.render();

        // Dispatch a custom event so the Analytics and Home widgets refresh automatically!
        document.dispatchEvent(new CustomEvent('habitsUpdated'));
    }

    calculateStreak(habitKey) {
        const days = this.habits[habitKey].days;
        let currentStreak = 0;
        let maxStreak = 0;

        // Simple count of consecutive checked days
        for (let i = 0; i < days.length; i++) {
            if (days[i]) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        }
        this.habits[habitKey].streak = maxStreak;
    }

    render() {
        this.habitsContainer.innerHTML = '';

        Object.entries(this.habits).forEach(([key, habit]) => {
            const card = document.createElement('div');
            card.className = `habit-card border-${habit.color}`;
            
            // Header
            let daysHtml = '';
            this.daysOfWeek.forEach((day, index) => {
                const checked = habit.days[index] ? 'checked' : '';
                daysHtml += `
                    <div class="habit-day-col">
                        <span class="habit-day-label">${day}</span>
                        <label class="custom-checkbox">
                            <input type="checkbox" ${checked} data-habit="${key}" data-day="${index}">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="habit-header">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="habit-icon-box tag-${key}">
                            <i class="fa-solid ${habit.icon}"></i>
                        </div>
                        <div>
                            <h4 class="habit-title">${habit.name}</h4>
                            <span style="font-size: 0.75rem; color: var(--text-secondary);">Weekly Routine</span>
                        </div>
                    </div>
                    <div class="habit-streak-badge streak-${habit.color}">
                        <i class="fa-solid fa-fire"></i>
                        <span>${habit.streak} Day Streak</span>
                    </div>
                </div>
                <div class="habit-days-row">
                    ${daysHtml}
                </div>
            `;

            // Bind checkbox events
            const checkboxes = card.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(box => {
                box.addEventListener('change', () => {
                    const habitKey = box.getAttribute('data-habit');
                    const dayIndex = parseInt(box.getAttribute('data-day'));
                    this.toggleDay(habitKey, dayIndex);
                });
            });

            this.habitsContainer.appendChild(card);
        });
    }
}
