/**
 * FlowState — Master Coordinator Script
 */

import { TodoModule } from './modules/todo.js';
import { NotesModule } from './modules/notes.js';
import { PomodoroModule } from './modules/pomodoro.js';
import { WeatherModule } from './modules/weather.js';
import { QuotesModule } from './modules/quotes.js';
import { HabitsModule } from './modules/habits.js';
import { AnalyticsModule } from './modules/analytics.js';
import { CommandPaletteModule } from './modules/palette.js';
import { Storage } from './utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GitHub-style Theme Selector
    initTheme();

    // 2. Initialize Sidebar Navigation Panel Switches
    initSidebarNavigation();

    // 3. Initialize Dashboard Widgets
    new TodoModule();
    new NotesModule();
    new PomodoroModule();
    new WeatherModule();
    new QuotesModule();
    new HabitsModule();
    new AnalyticsModule();
    new CommandPaletteModule();

    // 4. Update Time-of-Day Greetings & Date Counters
    updateTimeGreeting();
    updateDateDisplay();
    updateOverviewStats();

    // Re-verify numbers on backlog/habits update triggers
    document.addEventListener('habitsUpdated', () => updateOverviewStats());
    document.addEventListener('taskCompleted', () => updateOverviewStats());
    document.addEventListener('focusSessionCompleted', () => updateOverviewStats());
});

/**
 * Manages GitHub-style Dark/Light theme switching
 */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-toggle-icon');
    
    if (!themeBtn) return;

    // Load saved preference or fallback to system dark preference
    const savedTheme = Storage.get('theme', 'github-dark');
    setTheme(savedTheme, themeIcon);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'github-dark' ? 'github-light' : 'github-dark';
        setTheme(targetTheme, themeIcon);
    });
}

/**
 * Apply theme to document
 * @param {string} theme - 'github-dark' | 'github-light'
 * @param {HTMLElement} iconElement 
 */
function setTheme(theme, iconElement) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('theme', theme);

    if (iconElement) {
        if (theme === 'github-dark') {
            iconElement.className = 'fa-solid fa-sun';
        } else {
            iconElement.className = 'fa-solid fa-moon';
        }
    }

    // Trigger chart colors re-render on theme switch!
    document.dispatchEvent(new CustomEvent('themeChanged'));
}

/**
 * Handles sidebar view panel switches
 */
function initSidebarNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    const panels = document.querySelectorAll('.dashboard-panel');
    const sidebarToggle = document.getElementById('sidebar-collapse-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');

    if (menuItems.length === 0) return;

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            // Toggle active classes on sidebar menu items
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            // Switch panel panels visibility
            panels.forEach(p => {
                const panelId = p.getAttribute('id');
                if (panelId === `panel-${targetTab}`) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        });
    });

    // Mobile sidebar toggle trigger
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

/**
 * Displays greeting based on time of day
 */
function updateTimeGreeting() {
    const greetingText = document.getElementById('dashboard-greeting');
    if (!greetingText) return;

    const hours = new Date().getHours();
    let msg = 'Good morning, Developer! 🌅';

    if (hours >= 12 && hours < 17) {
        msg = 'Good afternoon, Builder! ☀️';
    } else if (hours >= 17 && hours < 22) {
        msg = 'Good evening, Coder! 🌌';
    } else if (hours >= 22 || hours < 5) {
        msg = 'Happy Night-hacking! 💻';
    }

    greetingText.innerText = msg;
}

/**
 * Displays active calendar date in top dashboard pane
 */
function updateDateDisplay() {
    const dateSpan = document.getElementById('dashboard-active-date');
    if (!dateSpan) return;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateSpan.innerText = today.toLocaleDateString('en-US', options);
}

/**
 * Calculates current active streak numbers for Dashboard Home
 */
function updateOverviewStats() {
    const focusDisplay = document.getElementById('home-focus-sessions');
    const streakDisplay = document.getElementById('home-max-streak');
    const backlogDisplay = document.getElementById('home-backlog-tasks');

    if (!focusDisplay) return;

    // Focus Sessions completed today
    const focusSessions = Storage.get('analytics_focus', [0, 0, 0, 0, 0, 0, 0]);
    const todayIndex = new Date().getDay();
    const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    // Calculate sessions completed based on hours (1 session = 25m = 0.41 hours)
    const todaySessions = Math.round(focusSessions[adjustedIndex] / 0.41);
    focusDisplay.innerText = `${todaySessions} completed`;

    // Max habit streak calculated
    const habits = Storage.get('habits', {});
    let maxStreakVal = 0;
    Object.values(habits).forEach(h => {
        if (h.streak > maxStreakVal) {
            maxStreakVal = h.streak;
        }
    });
    streakDisplay.innerText = `${maxStreakVal} days`;

    // Active Backlog Tasks remaining
    const tasks = Storage.get('tasks', []);
    const remainingTasks = tasks.filter(t => !t.completed).length;
    backlogDisplay.innerText = `${remainingTasks} remaining`;
}
