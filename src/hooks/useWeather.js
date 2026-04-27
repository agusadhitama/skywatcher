import { useState, useCallback, useRef } from 'react'
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  processDailyForecast,
} from '../utils/weather'

export function useWeather() {
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [hourly, setHourly] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cityName, setCityName] = useState('')
  const abortRef = useRef(null)

  const loadByCity = useCallback(async (city) => {
    if (!city.trim()) return
    setLoading(true)
    setError(null)

    try {
      const [cur, fore] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ])
      setCurrent(cur)
      setForecast(processDailyForecast(fore.list))
      setHourly(fore.list.slice(0, 8))
      setCityName(cur.name)
    } catch (err) {
      setError(err.message)
      setCurrent(null)
      setForecast(null)
      setHourly(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { current: cur, forecast: fore } = await fetchWeatherByCoords(
            coords.latitude,
            coords.longitude
          )
          setCurrent(cur)
          setForecast(processDailyForecast(fore.list))
          setHourly(fore.list.slice(0, 8))
          setCityName(cur.name)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location access denied')
        setLoading(false)
      }
    )
  }, [])

  return {
    current,
    forecast,
    hourly,
    loading,
    error,
    cityName,
    loadByCity,
    loadByLocation,
  }
}
