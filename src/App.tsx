import { useState, useEffect, useCallback } from 'react'
import WeatherCard from './components/WeatherCard'
import FortuneCard from './components/FortuneCard'
import NewsCard from './components/NewsCard'
import CommunityCard from './components/CommunityCard'
import Header from './components/Header'
import Footer from './components/Footer'
import { UserProfileProvider } from './contexts/UserProfileContext'
import './App.css'

type SlideType = 'weather' | 'fortune' | 'news' | 'community'

const slides: SlideType[] = ['weather', 'fortune', 'news', 'community']

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const updateSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

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

  const renderSlide = (slideType: SlideType) => {
    switch (slideType) {
      case 'weather':
        return <WeatherCard />
      case 'fortune':
        return <FortuneCard />
      case 'news':
        return <NewsCard />
      case 'community':
        return <CommunityCard />
      default:
        return <WeatherCard />
    }
  }

  return (
    <UserProfileProvider>
      <main className="app">
        <Header />
        
        <section 
          className="viewport" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slideType, index) => (
              <div key={slideType} className="slide">
                {renderSlide(slideType)}
              </div>
            ))}
          </div>

          <Footer 
            currentIndex={currentIndex}
            totalSlides={slides.length}
            onNext={nextSlide}
            onPrev={prevSlide}
            onDotClick={updateSlide}
          />
        </section>
      </main>
    </UserProfileProvider>
  )
}

export default App