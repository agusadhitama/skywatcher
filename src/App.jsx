import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeather } from './hooks/useWeather'
import { getThemeByCondition } from './utils/weather'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastList from './components/ForecastList'

// Animated background particles
function Particles({ count = 16 }) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: Math.random() * 14 + 10,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-5%',
          }}
          animate={{ y: [0, -window.innerHeight * 1.1], opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Unit toggle pill
function UnitToggle({ unit, onChange }) {
  return (
    <div
      className="flex gap-0.5 p-1 rounded-full"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {['C', 'F'].map((u) => (
        <button
          key={u}
          onClick={() => onChange(u)}
          className="relative text-xs font-syne font-bold px-3 py-1 rounded-full transition-colors duration-200"
          style={{ color: unit === u ? 'white' : 'rgba(255,255,255,0.35)' }}
        >
          {unit === u && (
            <motion.div
              layoutId="unit-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            />
          )}
          <span className="relative">°{u}</span>
        </button>
      ))}
    </div>
  )
}

// Error message
function ErrorMsg({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl px-4 py-3 text-sm text-center"
      style={{
        background: 'rgba(248,113,113,0.1)',
        border: '1px solid rgba(248,113,113,0.2)',
        color: '#fca5a5',
      }}
    >
      {message === 'City not found' ? '🔍 City not found. Try another name.' : `⚠️ ${message}`}
    </motion.div>
  )
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        className="w-9 h-9 rounded-full"
        style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#7dd3fc' }}
      />
      <p className="text-white/40 text-sm font-dm">Fetching weather data…</p>
    </motion.div>
  )
}

export default function App() {
  const { current, forecast, hourly, loading, error, loadByCity, loadByLocation } = useWeather()
  const [unit, setUnit] = useState('C')
  const [theme, setTheme] = useState({ from: '#0f2b5b', mid: '#1a4a8a', to: '#2d7dd2', accent: '#7dd3fc' })
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadByCity('Malang')
    }
  }, [loadByCity])

  useEffect(() => {
    if (current) {
      setTheme(getThemeByCondition(current.weather[0].main))
    }
  }, [current])

  return (
    <div
      className="min-h-screen transition-all duration-1000"
      style={{ background: `linear-gradient(160deg, ${theme.from} 0%, ${theme.mid} 50%, ${theme.to} 100%)` }}
    >
      <Particles count={18} />

      <div className="relative z-10 max-w-sm mx-auto px-5 py-8 pb-16 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="font-syne font-extrabold text-sm tracking-[3px] uppercase"
              style={{ color: theme.accent }}>
              Skywatcher
            </h1>
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>

        {/* Search */}
        <SearchBar onSearch={loadByCity} onLocate={loadByLocation} loading={loading} />

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton key="loading" />
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorMsg message={error} />
            </motion.div>
          ) : current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <WeatherCard data={current} unit={unit} />
              {forecast && hourly && (
                <ForecastList
                  forecast={forecast}
                  hourly={hourly}
                  unit={unit}
                  tzOffset={current.timezone}
                />
              )}

              {/* Sun times */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-4 flex justify-around"
              >
                {[
                  { label: 'Sunrise', time: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), emoji: '🌅' },
                  { label: 'Sunset', time: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), emoji: '🌇' },
                  { label: 'Pressure', time: `${current.main.pressure} hPa`, emoji: '📊' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-lg mb-1">{item.emoji}</div>
                    <p className="font-syne font-bold text-white text-sm">{item.time}</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wide mt-0.5">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 pt-6 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p
            className="font-syne font-extrabold text-base tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #7dd3fc, #a78bfa, #f9a8d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Agus Satria Adhitama
          </p>
          <p className="text-white/25 text-[10px] tracking-[2px] uppercase mt-1 font-dm">
            crafted with code &amp; curiosity
          </p>
        </motion.div>
      </div>
    </div>
  )
}
