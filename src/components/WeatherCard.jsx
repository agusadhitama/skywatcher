import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'
import WeatherIcon from './WeatherIcon'
import {
  convertTemp,
  getWindDirection,
  formatFullDate,
} from '../utils/weather'

export default function WeatherCard({ data, unit }) {
  if (!data) return null

  const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset
  const temp = convertTemp(data.main.temp, unit)
  const feelsLike = convertTemp(data.main.feels_like, unit)
  const tempMax = convertTemp(data.main.temp_max, unit)
  const tempMin = convertTemp(data.main.temp_min, unit)
  const unitSym = unit === 'C' ? '°C' : '°F'

  const stats = [
    { icon: <Droplets size={14} />, value: `${data.main.humidity}%`, label: 'Humidity' },
    { icon: <Wind size={14} />, value: `${Math.round(data.wind.speed)} m/s ${getWindDirection(data.wind.deg)}`, label: 'Wind' },
    { icon: <Eye size={14} />, value: `${Math.round((data.visibility ?? 10000) / 1000)} km`, label: 'Visibility' },
    { icon: <Thermometer size={14} />, value: `${feelsLike}${unitSym}`, label: 'Feels like' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.26, 0.64, 1] }}
      className="glass rounded-[28px] p-7 mb-3 relative overflow-hidden"
    >
      {/* Decorative glow blob */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(125,211,252,0.4) 0%, transparent 70%)' }}
      />

      {/* Location + date */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-syne font-bold text-xl text-white">{data.name}</span>
          <span className="text-white/50 text-sm">{data.sys.country}</span>
        </div>
        <p className="text-white/40 text-xs tracking-wide">{formatFullDate(data.dt)}</p>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="font-syne font-extrabold leading-none tracking-tight text-white"
            style={{ fontSize: 'clamp(64px, 18vw, 88px)' }}>
            {temp}
            <sup className="text-2xl font-normal opacity-60 ml-1">{unitSym}</sup>
          </div>
          <p className="text-white/50 text-sm capitalize mt-1">{data.weather[0].description}</p>
          <p className="text-white/30 text-xs mt-0.5">
            H: {tempMax}° &nbsp; L: {tempMin}°
          </p>
        </div>
        <WeatherIcon condition={data.weather[0].description} size={72} isDay={isDay} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3 text-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-white/40 flex justify-center mb-1">{s.icon}</div>
            <p className="font-syne font-bold text-white text-xs leading-tight">{s.value}</p>
            <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
