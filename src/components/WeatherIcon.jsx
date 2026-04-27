import { motion } from 'framer-motion'

const float = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function WeatherIcon({ condition, size = 72, isDay = true }) {
  const c = condition?.toLowerCase() ?? ''
  const px = `${size}px`

  if (c.includes('thunderstorm')) {
    return (
      <motion.div {...float} style={{ fontSize: px, lineHeight: 1 }}>
        ⛈️
      </motion.div>
    )
  }

  if (c.includes('rain') || c.includes('drizzle')) {
    return (
      <motion.div {...float} style={{ fontSize: px, lineHeight: 1 }}>
        🌧️
      </motion.div>
    )
  }

  if (c.includes('snow')) {
    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: px, lineHeight: 1 }}
      >
        ❄️
      </motion.div>
    )
  }

  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
    return (
      <motion.div {...pulse} style={{ fontSize: px, lineHeight: 1 }}>
        🌫️
      </motion.div>
    )
  }

  if (c.includes('clear')) {
    return (
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
        style={{ fontSize: px, lineHeight: 1 }}
      >
        {isDay ? '☀️' : '🌙'}
      </motion.div>
    )
  }

  if (c.includes('few clouds') || c.includes('scattered')) {
    return (
      <motion.div {...float} style={{ fontSize: px, lineHeight: 1 }}>
        {isDay ? '⛅' : '🌤️'}
      </motion.div>
    )
  }

  return (
    <motion.div {...float} style={{ fontSize: px, lineHeight: 1 }}>
      ☁️
    </motion.div>
  )
}
