# 🌤️ Skywatcher

A sleek, production-grade weather app built with React, Tailwind CSS, and Framer Motion.

**Live Demo:** https://agussatria.github.io/skywatcher

---

## ✨ Features

- 📍 Auto-detect location via Geolocation API
- 🔍 City search with autocomplete
- 🌡️ Toggle between °C and °F
- ⛅ Real-time weather with animated icons
- 📅 7-day daily forecast
- ⏰ 8-hour hourly forecast
- 🌅 Sunrise, sunset & pressure info
- 🎨 Dynamic background theme based on weather condition
- ✨ Particle animation & smooth transitions (Framer Motion)
- 📱 Fully responsive — mobile first

---

## 🛠️ Tech Stack

| Layer       | Tools                            |
|-------------|----------------------------------|
| UI          | React 18 + Tailwind CSS          |
| Animation   | Framer Motion                    |
| Icons       | Lucide React                     |
| Data        | OpenWeatherMap API (free tier)   |
| Build       | Vite                             |
| Deploy      | GitHub Pages + gh-pages          |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/agussatria/skywatcher.git
cd skywatcher
npm install
```

### 2. Setup API key

Get a free API key at [openweathermap.org](https://openweathermap.org/api), then:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deploy to GitHub Pages

```bash
npm run deploy
```

This will build the project and push to the `gh-pages` branch automatically.

> Make sure your `vite.config.js` has `base: '/skywatcher/'` set to your repo name.

---

## 📁 Project Structure

```
skywatcher/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       ← Search with autocomplete & geolocation btn
│   │   ├── WeatherCard.jsx     ← Main current weather card
│   │   ├── ForecastList.jsx    ← Hourly + 7-day forecast rows
│   │   └── WeatherIcon.jsx     ← Animated weather emoji icons
│   ├── hooks/
│   │   └── useWeather.js       ← Custom hook for all API fetching & state
│   ├── utils/
│   │   └── weather.js          ← API calls, formatters, converters
│   ├── App.jsx                 ← Root component, layout, theming
│   ├── main.jsx                ← React entry point
│   └── index.css               ← Tailwind + custom utilities
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📄 License

MIT © Agus Satria Adhitama
