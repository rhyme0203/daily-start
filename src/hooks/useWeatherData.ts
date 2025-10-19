import { useState, useEffect } from 'react'

export interface WeatherData {
  temperature: number
  condition: string
  feelsLike: number
  humidity: number
  windSpeed: number
  location: string
  icon: string
  pressure?: number
  visibility?: number
  uvIndex?: number
}

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          })
        })

        const { latitude, longitude } = position.coords

        // Fetch weather data from wttr.in (no API key required)
        const response = await fetch(`https://wttr.in/${latitude},${longitude}?format=j1`)
        
        if (!response.ok) {
          throw new Error('Weather API request failed')
        }

        const data = await response.json()

        // Get weather icon from wttr.in emoji format
        const iconResponse = await fetch(`https://wttr.in/${latitude},${longitude}?format=3`)
        const iconText = await iconResponse.text()
        const weatherIcon = iconText.split(' ')[1] || '🌤️' // Extract emoji from format

        const weather: WeatherData = {
          temperature: Math.round(parseInt(data.current_condition[0].temp_C)),
          condition: data.current_condition[0].weatherDesc[0].value,
          feelsLike: Math.round(parseInt(data.current_condition[0].FeelsLikeC)),
          humidity: parseInt(data.current_condition[0].humidity),
          windSpeed: parseInt(data.current_condition[0].windspeedKmph),
          location: data.nearest_area[0].areaName[0].value,
          icon: weatherIcon
        }

        setWeatherData(weather)
      } catch (err) {
        console.error('날씨 데이터 가져오기 실패:', err)
        
        // Set default data on error
        setWeatherData({
          temperature: 23,
          condition: '맑음',
          feelsLike: 24,
          humidity: 60,
          windSpeed: 10,
          location: '서울',
          icon: '☀️'
        })
        
        if (err instanceof GeolocationPositionError) {
          setError('위치 정보를 허용해주세요')
        } else {
          setError('날씨 정보를 불러올 수 없습니다')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [])

  return { weatherData, loading, error }
}
