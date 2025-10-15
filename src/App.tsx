import { useState, useEffect, useCallback } from 'react'
import './App.css'

// 날씨 데이터 타입 정의
interface WeatherData {
  temperature: number
  condition: string
  feelsLike: number
  humidity: number
  windSpeed: number
  location: string
}

// 슬라이드 데이터 타입 정의
interface SlideData {
  id: string
  title: string
  pill: string
  icon: string
  content: string[]
  ariaLabel: string
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // 날씨 데이터 가져오기
  const fetchWeatherData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 사용자 위치 가져오기
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords

      // wttr.in API 사용 (API 키 불필요)
      const response = await fetch(`https://wttr.in/${latitude},${longitude}?format=j1`)
      const data = await response.json()

      const weather: WeatherData = {
        temperature: Math.round(parseInt(data.current_condition[0].temp_C)),
        condition: data.current_condition[0].weatherDesc[0].value,
        feelsLike: Math.round(parseInt(data.current_condition[0].FeelsLikeC)),
        humidity: parseInt(data.current_condition[0].humidity),
        windSpeed: parseInt(data.current_condition[0].windspeedKmph),
        location: data.nearest_area[0].areaName[0].value
      }

      setWeatherData(weather)
    } catch (err) {
      console.error('날씨 데이터 가져오기 실패:', err)
      setError('날씨 정보를 불러올 수 없습니다.')
      
      // 기본값 설정
      setWeatherData({
        temperature: 23,
        condition: '맑음',
        feelsLike: 24,
        humidity: 60,
        windSpeed: 10,
        location: '서울'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // 컴포넌트 마운트 시 날씨 데이터 가져오기
  useEffect(() => {
    fetchWeatherData()
  }, [fetchWeatherData])

  // 슬라이드 데이터
  const slides: SlideData[] = [
    {
      id: 'weather',
      title: '오늘의 일기예보',
      pill: weatherData?.location || '서울',
      icon: 'sun',
      content: weatherData ? [
        `체감 ${weatherData.feelsLike}°C · 습도 ${weatherData.humidity}% · 바람 ${weatherData.windSpeed}km/h`,
        loading ? '날씨 정보를 불러오는 중...' : 
        weatherData.condition.includes('맑음') || weatherData.condition.includes('Clear') ? '우산은 필요 없어요 ☀️' :
        weatherData.condition.includes('비') || weatherData.condition.includes('Rain') ? '우산을 챙기세요 ☔' :
        '적당한 옷차림을 하세요 👕'
      ] : ['날씨 정보를 불러오는 중...'],
      ariaLabel: '1 / 4 — 오늘의 날씨'
    },
    {
      id: 'fortune',
      title: '오늘의 운세',
      pill: '양자리',
      icon: 'user',
      content: [
        '총운: 작은 용기가 큰 기회를 부릅니다.',
        '연애운: 솔직한 표현이 호감을 높여요.',
        '금전운: 지출을 한 번 더 점검하세요.'
      ],
      ariaLabel: '2 / 4 — 오늘의 운세'
    },
    {
      id: 'news',
      title: '주요 뉴스 헤드라인',
      pill: '오늘',
      icon: 'newspaper',
      content: [
        '[사회] 헤드라인 1 — 간단 요약 텍스트',
        '[경제] 헤드라인 2 — 간단 요약 텍스트',
        '[IT] 헤드라인 3 — 간단 요약 텍스트'
      ],
      ariaLabel: '3 / 4 — 주요 뉴스'
    },
    {
      id: 'community',
      title: '커뮤니티 클리핑',
      pill: 'Top',
      icon: 'message',
      content: [
        '인기글: 출근길 하늘이 예뻐요 ☁️',
        '추천글: 업무 루틴 만드는 법',
        '토픽: 사이드 프로젝트 아이디어 모음'
      ],
      ariaLabel: '4 / 4 — 커뮤니티'
    }
  ]

  const total = slides.length

  const updateSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // 터치 스와이프 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // 현재 날짜
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="app" aria-label="Daily Start Mobile">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div aria-hidden="true" className="logo"></div>
          <div>
            <div>Daily Start</div>
            <div className="date">{currentDate}</div>
          </div>
        </div>
        <div className="ico" aria-label="알림">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
      </header>

      {/* Slides Container */}
      <section 
        className="viewport" 
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <article 
              key={slide.id}
              className="slide" 
              role="group" 
              aria-roledescription="slide" 
              aria-label={slide.ariaLabel}
            >
              <div className="card">
                <div className="card-head">
                  <div className="title">
                    <span className="ico" aria-hidden="true">
                      {slide.icon === 'sun' && (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                      )}
                      {slide.icon === 'user' && (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="3"></circle>
                          <path d="M5 20c2-5 12-5 14 0"></path>
                        </svg>
                      )}
                      {slide.icon === 'newspaper' && (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="14" rx="2"></rect>
                          <path d="M7 8h10M7 12h10M7 16h6"></path>
                        </svg>
                      )}
                      {slide.icon === 'message' && (
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                        </svg>
                      )}
                    </span>
                    {slide.title}
                  </div>
                  <span className="pill">{slide.pill}</span>
                </div>
                
                {/* 날씨 카드의 경우 온도 표시 */}
                {slide.id === 'weather' && weatherData && (
                  <div className="row kpi">
                    <div className="num">{weatherData.temperature}</div>
                    <div className="unit">°C · {weatherData.condition}</div>
                  </div>
                )}
                
                {/* 콘텐츠 표시 */}
                {slide.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="row">
                    {content}
                  </div>
                ))}

                {/* 에러 메시지 표시 */}
                {error && slide.id === 'weather' && (
                  <div className="row" style={{ color: '#ff6b6b' }}>
                    {error}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Footer Controls */}
        <div className="footer" aria-label="페이지 전환 버튼">
          <div className="dots" role="tablist" aria-label="페이지 인디케이터">
            {Array.from({ length: total }, (_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-controls={`slide-${index + 1}`}
                onClick={() => updateSlide(index)}
              />
            ))}
          </div>
          <div className="actions">
            <button 
              className="btn" 
              onClick={prevSlide}
              aria-label="이전 카드"
            >
              이전
            </button>
            <button 
              className="btn primary" 
              onClick={nextSlide}
              aria-label="다음 카드"
            >
              다음
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App