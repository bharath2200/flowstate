import { Storage } from '../utils/storage.js';

export class PomodoroModule {
    constructor() {
        // Preset lengths in seconds
        this.PRESETS = {
            work: 25 * 60,
            short: 5 * 60,
            long: 15 * 60
        };

        this.currentMode = 'work'; // 'work' | 'short' | 'long'
        this.timeLeft = this.PRESETS[this.currentMode];
        this.timerInterval = null;
        this.isRunning = false;

        // SVG circumference calculations (r=50 -> circum = 2 * PI * 50 = 314.16)
        this.strokeDashArray = 314.16;

        this.timerText = document.getElementById('timer-time-display');
        this.timerLabel = document.getElementById('timer-label-display');
        this.timerProgressCircle = document.getElementById('timer-progress-fill');
        this.playPauseBtn = document.getElementById('timer-play-btn');
        this.playPauseIcon = document.getElementById('timer-play-icon');
        this.resetBtn = document.getElementById('timer-reset-btn');
        this.presetButtons = {
            work: document.getElementById('preset-work-btn'),
            short: document.getElementById('preset-short-btn'),
            long: document.getElementById('preset-long-btn')
        };

        this.init();
    }

    init() {
        if (!this.timerText) return;

        // Bind preset buttons
        Object.entries(this.presetButtons).forEach(([mode, btn]) => {
            if (btn) {
                btn.addEventListener('click', () => this.switchMode(mode));
            }
        });

        // Bind controls
        this.playPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        this.updateDisplay();
    }

    switchMode(mode) {
        this.pauseTimer();
        this.currentMode = mode;
        this.timeLeft = this.PRESETS[mode];
        
        // Active visual classes for mode buttons
        Object.entries(this.presetButtons).forEach(([m, btn]) => {
            if (btn) {
                if (m === mode) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        // Label update
        if (mode === 'work') this.timerLabel.innerText = 'Productive Session';
        else if (mode === 'short') this.timerLabel.innerText = 'Short Relax Break';
        else this.timerLabel.innerText = 'Extended Chill Break';

        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.playPauseIcon.className = 'fa-solid fa-pause';
        this.playPauseBtn.classList.add('running');

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.completeTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.playPauseIcon.className = 'fa-solid fa-play';
        this.playPauseBtn.classList.remove('running');
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.PRESETS[this.currentMode];
        this.updateDisplay();
    }

    completeTimer() {
        this.pauseTimer();
        this.playBellSound();
        
        // Auto-switch mode logic
        if (this.currentMode === 'work') {
            document.dispatchEvent(new CustomEvent('focusSessionCompleted'));
            alert('Great session! Time to take a break.');
            this.switchMode('short');
        } else {
            alert('Break over! Let\'s get back to writing code.');
            this.switchMode('work');
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        // Text timer format
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerText.innerText = formattedTime;
        document.title = `(${formattedTime}) FlowState`;

        // SVG progress offset calculation
        const totalDuration = this.PRESETS[this.currentMode];
        const progressPercent = this.timeLeft / totalDuration;
        const dashOffset = this.strokeDashArray * (1 - progressPercent);
        
        if (this.timerProgressCircle) {
            this.timerProgressCircle.style.strokeDashoffset = dashOffset;
        }
    }

    playBellSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Generate synthetic dual-tone bell chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
            
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            
            osc.start();
            osc.stop(ctx.currentTime + 1.5);
        } catch (e) {
            console.error("Audio Notification failed to compile: ", e);
        }
    }
}
