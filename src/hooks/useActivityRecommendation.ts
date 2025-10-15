import { useState, useEffect } from 'react'
import { UserProfile, ActivityRecommendation } from '../types/user'
import { WeatherData } from './useWeatherData'

interface ActivityRecommendationHook {
  recommendation: string | null
  loading: boolean
  error: string | null
}

export const useActivityRecommendation = (
  userProfile: UserProfile | null,
  weatherData: WeatherData | null
): ActivityRecommendationHook => {
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userProfile || !weatherData) {
      setRecommendation(null)
      return
    }

    const generateRecommendation = async () => {
      setLoading(true)
      setError(null)

      try {
        // 간단한 규칙 기반 추천 (나중에 실제 AI API로 교체)
        const age = new Date().getFullYear() - parseInt(userProfile.birthDate.split('-')[0])
        const currentHour = new Date().getHours()
        
        let recommendation = ''

        // 시간대별 기본 추천
        if (currentHour < 9) {
          recommendation = '아침 시간대 활동 추천:\n'
        } else if (currentHour < 12) {
          recommendation = '오전 시간대 활동 추천:\n'
        } else if (currentHour < 18) {
          recommendation = '오후 시간대 활동 추천:\n'
        } else {
          recommendation = '저녁 시간대 활동 추천:\n'
        }

        // 날씨 기반 추천
        if (weatherData.condition.includes('맑음') || weatherData.condition.includes('Clear')) {
          if (userProfile.occupation.includes('개발자') || userProfile.occupation.includes('프로그래머')) {
            recommendation += '☀️ 맑은 날씨에 코딩하기 좋은 환경이에요. 창가에서 자연광을 받으며 작업해보세요.'
          } else if (userProfile.occupation.includes('디자이너')) {
            recommendation += '☀️ 밝은 날씨에 색감 영감을 받아보세요. 야외에서 색상 관찰을 해보는 것도 좋아요.'
          } else if (age < 30) {
            recommendation += '☀️ 젊은 에너지로 야외 활동을 즐겨보세요. 공원 산책이나 운동을 추천해요.'
          } else {
            recommendation += '☀️ 따뜻한 날씨에 가벼운 산책이나 실외 카페에서 여유를 즐겨보세요.'
          }
        } else if (weatherData.condition.includes('비') || weatherData.condition.includes('Rain')) {
          if (userProfile.occupation.includes('개발자') || userProfile.occupation.includes('프로그래머')) {
            recommendation += '🌧️ 비오는 날은 집중하기 좋은 환경이에요. 깊이 있는 코딩이나 학습을 해보세요.'
          } else if (userProfile.occupation.includes('디자이너')) {
            recommendation += '🌧️ 비 오는 날의 감성적인 분위기를 활용한 디자인 작업을 해보세요.'
          } else {
            recommendation += '🌧️ 실내에서 온라인 강의나 독서 등 자기계발 활동을 추천해요.'
          }
        } else {
          recommendation += '🌤️ 날씨가 변화무쌍해요. 실내외 활동을 적절히 조화시켜 보세요.'
        }

        // 온도 기반 추가 추천
        if (weatherData.temperature > 25) {
          recommendation += '\n\n🌡️ 날씨가 따뜻해서 수분 섭취를 자주 하시고, 가벼운 옷차림을 하세요.'
        } else if (weatherData.temperature < 10) {
          recommendation += '\n\n🧥 날씨가 쌀쌀해서 따뜻한 옷을 입고 활동하세요.'
        }

        setRecommendation(recommendation)
      } catch (err) {
        setError('추천을 생성하는데 실패했습니다.')
        console.error('Activity recommendation error:', err)
      } finally {
        setLoading(false)
      }
    }

    generateRecommendation()
  }, [userProfile, weatherData])

  return { recommendation, loading, error }
}
