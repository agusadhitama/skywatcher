import { motion } from 'framer-motion'
import { convertTemp, getWeatherEmoji, formatHour } from '../utils/weather'

function HourlyCard({ item, index, unit, tzOffset }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex-shrink-0 glass rounded-[16px] px-3 py-3 text-center min-w-[58px]"
    >
      <p className="text-white/40 text-[10px] mb-1.5">{formatHour(item.dt, tzOffset)}</p>
      <div className="text-lg mb-1">{getWeatherEmoji(item.weather[0].description)}</div>
      <p className="font-syne font-bold text-white text-xs">
        {convertTemp(item.main.temp, unit)}°
      </p>
    </motion.div>
  )
}

function DailyCard({ day, index, unit, isToday }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex-shrink-0 text-center min-w-[68px] rounded-[16px] px-3.5 py-3 cursor-default transition-all duration-200 hover:-translate-y-1"
      style={{
        background: isToday ? 'rgba(125,211,252,0.12)' : 'rgba(255,255,255,0.07)',
        border: isToday ? '1px solid rgba(125,211,252,0.35)' : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1.5">
        {isToday ? 'Today' : day.day}
      </p>
      <div className="text-[22px] mb-1.5">{getWeatherEmoji(day.description)}</div>
      <p className="font-syne font-bold text-white text-sm">{convertTemp(day.maxTemp, unit)}°</p>
      <p className="text-white/30 text-[11px] mt-0.5">{convertTemp(day.minTemp, unit)}°</p>
    </motion.div>
  )
}

export default function ForecastList({ forecast, hourly, unit, tzOffset }) {
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="space-y-1">
      {/* Hourly */}
      <p className="font-syne text-[11px] font-bold uppercase tracking-[2px] text-white/30 px-1 mb-2">
        Hourly
      </p>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {hourly.map((h, i) => (
          <HourlyCard key={h.dt} item={h} index={i} unit={unit} tzOffset={tzOffset} />
        ))}
      </div>

      {/* 7-day */}
      <p className="font-syne text-[11px] font-bold uppercase tracking-[2px] text-white/30 px-1 mt-4 mb-2">
        7-Day Forecast
      </p>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {forecast.map((day, i) => (
          <DailyCard
            key={day.dt}
            day={day}
            index={i}
            unit={unit}
            isToday={day.day === todayDay && i === 0}
          />
        ))}
      </div>
    </div>
  )
}
