import { Storage } from '../utils/storage.js';

// Map WMO weather codes to descriptive text and beautiful Font Awesome icons
const WMO_METADATA = {
    0: { text: 'Clear Skies', icon: 'fa-sun', color: '#ffbd2e' },
    1: { text: 'Mostly Clear', icon: 'fa-cloud-sun', color: '#ffd073' },
    2: { text: 'Partly Cloudy', icon: 'fa-cloud-sun', color: '#cbd5e1' },
    3: { text: 'Overcast Cloud', icon: 'fa-cloud', color: '#94a3b8' },
    45: { text: 'Foggy Mist', icon: 'fa-smog', color: '#cbd5e1' },
    48: { text: 'Rime Fog', icon: 'fa-smog', color: '#94a3b8' },
    51: { text: 'Light Drizzle', icon: 'fa-cloud-rain', color: '#60a5fa' },
    53: { text: 'Moderate Drizzle', icon: 'fa-cloud-rain', color: '#3b82f6' },
    55: { text: 'Dense Drizzle', icon: 'fa-cloud-showers-heavy', color: '#2563eb' },
    61: { text: 'Slight Rain', icon: 'fa-cloud-rain', color: '#60a5fa' },
    63: { text: 'Moderate Rain', icon: 'fa-cloud-rain', color: '#3b82f6' },
    65: { text: 'Heavy Showers', icon: 'fa-cloud-showers-heavy', color: '#1d4ed8' },
    71: { text: 'Slight Snow', icon: 'fa-snowflake', color: '#93c5fd' },
    73: { text: 'Moderate Snow', icon: 'fa-snowflake', color: '#60a5fa' },
    75: { text: 'Heavy Snowfall', icon: 'fa-snowflake', color: '#38bdf8' },
    80: { text: 'Light Rain Showers', icon: 'fa-cloud-sun-rain', color: '#60a5fa' },
    81: { text: 'Moderate Showers', icon: 'fa-cloud-showers-heavy', color: '#3b82f6' },
    82: { text: 'Violent Torrential Rain', icon: 'fa-cloud-showers-water', color: '#1d4ed8' },
    95: { text: 'Thunderstorms', icon: 'fa-cloud-bolt', color: '#a855f7' },
    96: { text: 'Severe Thunderstorms', icon: 'fa-cloud-bolt', color: '#7c3aed' },
    99: { text: 'Severe Thunderstorms with Hail', icon: 'fa-cloud-bolt', color: '#6d28d9' }
};

export class WeatherModule {
    constructor() {
        this.lastCity = Storage.get('weather_city', 'San Francisco');
        
        this.tempDisplay = document.getElementById('weather-temp');
        this.statusDisplay = document.getElementById('weather-status');
        this.cityDisplay = document.getElementById('weather-city-name');
        this.iconDisplay = document.getElementById('weather-icon');
        this.searchInput = document.getElementById('weather-search-input');
        this.searchBtn = document.getElementById('weather-search-btn');

        this.init();
    }

    async init() {
        if (!this.tempDisplay) return;

        // Bind events
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });

        // Load weather by geolocation or fall back to last city
        this.loadInitialWeather();
    }

    loadInitialWeather() {
        if (navigator.geolocation) {
            this.statusDisplay.innerText = 'Requesting Geolocation...';
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.cityDisplay.innerText = 'My Location';
                    await this.fetchWeather(lat, lon);
                },
                async (error) => {
                    console.log('Geolocation declined/errored. Loading fallback city...', error);
                    this.fetchCityCoords(this.lastCity);
                }
            );
        } else {
            this.fetchCityCoords(this.lastCity);
        }
    }

    async searchCity() {
        const city = this.searchInput.value.trim();
        if (!city) return;

        this.statusDisplay.innerText = 'Searching city...';
        await this.fetchCityCoords(city);
        this.searchInput.value = '';
    }

    async fetchCityCoords(cityName) {
        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const cityData = data.results[0];
                const displayName = `${cityData.name}, ${cityData.country_code.toUpperCase()}`;
                this.cityDisplay.innerText = displayName;
                this.lastCity = displayName;
                Storage.set('weather_city', displayName);

                await this.fetchWeather(cityData.latitude, cityData.longitude);
            } else {
                this.statusDisplay.innerText = 'City Not Found';
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            this.statusDisplay.innerText = 'API Search Error';
        }
    }

    async fetchWeather(latitude, longitude) {
        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
            const response = await fetch(weatherUrl);
            const data = await response.json();

            if (data.current_weather) {
                this.renderWeather(data.current_weather);
            } else {
                this.statusDisplay.innerText = 'Forecast Error';
            }
        } catch (error) {
            console.error('Weather forecast fetch error:', error);
            this.statusDisplay.innerText = 'Weather API Error';
        }
    }

    renderWeather(current) {
        const temp = Math.round(current.temperature);
        this.tempDisplay.innerHTML = `${temp}<span style="font-size: 1.5rem; vertical-align: top;">°C</span>`;

        const code = current.weathercode;
        const meta = WMO_METADATA[code] || { text: 'Unknown Weather', icon: 'fa-circle-question', color: 'var(--text-secondary)' };

        this.statusDisplay.innerText = meta.text;
        this.iconDisplay.className = `fa-solid ${meta.icon}`;
        this.iconDisplay.style.color = meta.color;
    }
}
