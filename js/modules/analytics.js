import { Storage } from '../utils/storage.js';

export class AnalyticsModule {
    constructor() {
        this.tasksChart = null;
        this.hoursChart = null;
        this.habitsChart = null;

        // Initialize focus analytics database in LocalStorage
        const defaultFocusData = [2.0, 3.5, 1.5, 4.0, 2.5, 1.0, 0.5]; // Mon - Sun in hours
        this.focusData = Storage.get('analytics_focus', defaultFocusData);
        
        const defaultTasksData = [3, 5, 2, 6, 4, 1, 2]; // Mon - Sun completed tasks count
        this.tasksData = Storage.get('analytics_tasks', defaultTasksData);

        this.init();
    }

    init() {
        // Listen for updates from other modules
        document.addEventListener('habitsUpdated', () => this.updateHabitsChart());
        document.addEventListener('taskCompleted', () => this.incrementCompletedTasks());
        document.addEventListener('focusSessionCompleted', () => this.incrementFocusHours());

        // Render charts once the panel is active/visible
        this.renderCharts();
    }

    incrementCompletedTasks() {
        const todayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
        // Convert to Mon=0 ... Sun=6
        const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        
        this.tasksData[adjustedIndex]++;
        Storage.set('analytics_tasks', this.tasksData);

        this.updateTasksChart();
    }

    incrementFocusHours() {
        const todayIndex = new Date().getDay();
        const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

        // Add 25 minutes of focus session (0.41 hours)
        this.focusData[adjustedIndex] = parseFloat((this.focusData[adjustedIndex] + 0.41).toFixed(2));
        Storage.set('analytics_focus', this.focusData);

        this.updateHoursChart();
    }

    renderCharts() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js CDN is not loaded.');
            return;
        }

        this.renderTasksChart();
        this.renderHoursChart();
        this.renderHabitsChart();
    }

    renderTasksChart() {
        const ctx = document.getElementById('analytics-tasks-chart');
        if (!ctx) return;

        const isLight = document.documentElement.getAttribute('data-theme') === 'github-light';
        const gridColor = isLight ? '#d0d7de' : '#30363d';
        const textColor = isLight ? '#24292f' : '#c9d1d9';

        this.tasksChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tasks Completed',
                    data: this.tasksData,
                    backgroundColor: 'rgba(46, 164, 79, 0.65)',
                    borderColor: '#2ea44f',
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1 } }
                }
            }
        });
    }

    renderHoursChart() {
        const ctx = document.getElementById('analytics-hours-chart');
        if (!ctx) return;

        const isLight = document.documentElement.getAttribute('data-theme') === 'github-light';
        const gridColor = isLight ? '#d0d7de' : '#30363d';
        const textColor = isLight ? '#24292f' : '#c9d1d9';

        this.hoursChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Focus Time (hrs)',
                    data: this.focusData,
                    backgroundColor: 'rgba(88, 166, 255, 0.15)',
                    borderColor: '#58a6ff',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#58a6ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });
    }

    renderHabitsChart() {
        const ctx = document.getElementById('analytics-habits-chart');
        if (!ctx) return;

        // Calculate checked days out of 7 for each habit
        const habits = Storage.get('habits', {});
        const habitLabels = [];
        const habitCompletionData = [];

        Object.values(habits).forEach(h => {
            habitLabels.push(h.name);
            const completedDaysCount = h.days.filter(Boolean).length;
            const completionPercent = Math.round((completedDaysCount / 7) * 100);
            habitCompletionData.push(completionPercent);
        });

        const isLight = document.documentElement.getAttribute('data-theme') === 'github-light';
        const textColor = isLight ? '#24292f' : '#c9d1d9';

        this.habitsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: habitLabels.length ? habitLabels : ['Coding', 'Gym', 'Study', 'Reading'],
                datasets: [{
                    data: habitCompletionData.length ? habitCompletionData : [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(88, 166, 255, 0.7)',
                        'rgba(248, 81, 73, 0.7)',
                        'rgba(188, 140, 255, 0.7)',
                        'rgba(63, 185, 80, 0.7)'
                    ],
                    borderColor: isLight ? '#ffffff' : '#161b22',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    }
                }
            }
        });
    }

    updateTasksChart() {
        if (!this.tasksChart) return;
        this.tasksChart.data.datasets[0].data = this.tasksData;
        this.tasksChart.update();
    }

    updateHoursChart() {
        if (!this.hoursChart) return;
        this.hoursChart.data.datasets[0].data = this.focusData;
        this.hoursChart.update();
    }

    updateHabitsChart() {
        if (!this.habitsChart) return;
        const habits = Storage.get('habits', {});
        const completionData = [];
        
        Object.values(habits).forEach(h => {
            const completedDaysCount = h.days.filter(Boolean).length;
            completionData.push(Math.round((completedDaysCount / 7) * 100));
        });

        this.habitsChart.data.datasets[0].data = completionData;
        this.habitsChart.update();
    }
}
