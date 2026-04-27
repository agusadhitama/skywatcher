import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X } from 'lucide-react'
import { POPULAR_CITIES } from '../utils/weather'

export default function SearchBar({ onSearch, onLocate, loading }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (val.trim().length >= 1) {
      const matches = POPULAR_CITIES.filter(c =>
        c.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 6)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (city) => {
    setValue(city)
    setSuggestions([])
    setFocused(false)
    onSearch(city)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      setSuggestions([])
      setFocused(false)
      onSearch(value.trim())
    }
  }

  const handleClear = () => {
    setValue('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div ref={wrapRef} className="relative z-50 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            placeholder="Search city..."
            className="w-full glass rounded-2xl py-3.5 pl-10 pr-10 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 focus:bg-white/10"
          />
          <AnimatePresence>
            {value && (
              <motion.button
                type="button"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={onLocate}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass rounded-2xl px-4 text-white/60 hover:text-white transition-colors disabled:opacity-50"
          title="Use my location"
        >
          <MapPin size={16} />
        </motion.button>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl overflow-hidden"
          >
            {suggestions.map((city, i) => (
              <motion.button
                key={city}
                type="button"
                onClick={() => handleSelect(city)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left border-b border-white/5 last:border-0"
              >
                <MapPin size={12} className="text-white/30 flex-shrink-0" />
                {city}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
