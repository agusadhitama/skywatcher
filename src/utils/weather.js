const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export async function fetchCurrentWeather(city) {
  const res = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`)
  if (!res.ok) throw new Error('City not found')
  return res.json()
}

export async function fetchForecast(city) {
  const res = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`)
  if (!res.ok) throw new Error('Forecast not available')
  return res.json()
}

export async function fetchWeatherByCoords(lat, lon) {
  const [curRes, foreRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
  ])
  if (!curRes.ok) throw new Error('Location not available')
  return { current: await curRes.json(), forecast: await foreRes.json() }
}

export function kelvinToCelsius(k) {
  return Math.round(k - 273.15)
}

export function kelvinToFahrenheit(k) {
  return Math.round((k - 273.15) * 9/5 + 32)
}

export function convertTemp(kelvin, unit) {
  return unit === 'C' ? kelvinToCelsius(kelvin) : kelvinToFahrenheit(kelvin)
}

export function getWeatherEmoji(condition, isDay = true) {
  const c = condition.toLowerCase()
  if (c.includes('thunderstorm')) return '⛈️'
  if (c.includes('drizzle')) return '🌦️'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️'
  if (c.includes('smoke') || c.includes('dust') || c.includes('sand')) return '🌫️'
  if (c.includes('tornado')) return '🌪️'
  if (c.includes('clear')) return isDay ? '☀️' : '🌙'
  if (c.includes('few clouds') || c.includes('scattered')) return isDay ? '⛅' : '🌤️'
  if (c.includes('broken') || c.includes('overcast') || c.includes('cloud')) return '☁️'
  return '🌡️'
}

export function getThemeByCondition(condition) {
  const c = condition.toLowerCase()
  if (c.includes('thunderstorm')) return {
    from: '#0a0a1a', mid: '#1a1a2e', to: '#16213e',
    accent: '#a78bfa', label: 'stormy'
  }
  if (c.includes('rain') || c.includes('drizzle')) return {
    from: '#1c1c2e', mid: '#2d2d44', to: '#3a3a5c',
    accent: '#93c5fd', label: 'rainy'
  }
  if (c.includes('snow')) return {
    from: '#cfd8dc', mid: '#b0bec5', to: '#eceff1',
    accent: '#e0f2fe', label: 'snowy'
  }
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return {
    from: '#374151', mid: '#4b5563', to: '#6b7280',
    accent: '#d1d5db', label: 'misty'
  }
  if (c.includes('clear')) return {
    from: '#0d1f6b', mid: '#1565c0', to: '#42a5f5',
    accent: '#7dd3fc', label: 'clear'
  }
  if (c.includes('cloud')) return {
    from: '#1e293b', mid: '#334155', to: '#475569',
    accent: '#94a3b8', label: 'cloudy'
  }
  return {
    from: '#0f2b5b', mid: '#1a4a8a', to: '#2d7dd2',
    accent: '#7dd3fc', label: 'default'
  }
}

export function processDailyForecast(forecastList) {
  const dailyMap = {}
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    if (!dailyMap[key]) {
      dailyMap[key] = {
        dt: item.dt,
        temps: [],
        icons: [],
        descriptions: [],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      }
    }
    dailyMap[key].temps.push(item.main.temp)
    dailyMap[key].icons.push(item.weather[0].description)
    dailyMap[key].descriptions.push(item.weather[0].description)
  })

  return Object.values(dailyMap).slice(0, 7).map(d => ({
    ...d,
    maxTemp: Math.max(...d.temps),
    minTemp: Math.min(...d.temps),
    description: d.descriptions[Math.floor(d.descriptions.length / 2)],
  }))
}

export function formatHour(timestamp, tzOffset) {
  const d = new Date((timestamp + tzOffset) * 1000)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' })
}

export function formatFullDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export function getUVLabel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4ade80' }
  if (uv <= 5) return { label: 'Moderate', color: '#facc15' }
  if (uv <= 7) return { label: 'High', color: '#fb923c' }
  return { label: 'Very High', color: '#f87171' }
}

export function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export const POPULAR_CITIES = [
  'Jakarta', 'Surabaya', 'Bandung', 'Malang', 'Yogyakarta',
  'Semarang', 'Medan', 'Makassar', 'Bali', 'Tokyo',
  'London', 'New York', 'Paris', 'Sydney', 'Singapore',
  'Dubai', 'Seoul', 'Mumbai', 'Beijing', 'Toronto',
]
