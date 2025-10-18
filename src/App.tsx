import { useState, useEffect, useCallback } from 'react'
import WeatherCard from './components/WeatherCard'
import FortuneCard from './components/FortuneCard'
import NewsCard from './components/NewsCard'
import CommunityCard from './components/CommunityCard'
import OnlCard from './components/OnlCard'
import Header from './components/Header'
import Footer from './components/Footer'
import ProfileModal from './components/ProfileModal'
import { UserProfileProvider } from './contexts/UserProfileContext'
import './App.css'

type SlideType = 'onl' | 'weather' | 'fortune' | 'news' | 'community'

const slides: SlideType[] = ['onl', 'weather', 'fortune', 'news', 'community']

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [, setIsScrolled] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // 스크롤 이벤트 핸들러 - iPhone Chrome 주소 입력창 축소를 위한 스크롤 감지
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    setIsScrolled(scrollTop > 50)
    
    // iPhone Chrome에서 주소 입력창 축소를 위한 추가 스크롤 (무한 루프 방지)
    if (scrollTop > 0 && scrollTop < 1) {
      // 스크롤이 0과 1 사이일 때만 주소 입력창 축소를 위한 추가 스크롤
      requestAnimationFrame(() => {
        window.scrollTo({ top: 1, behavior: 'auto' })
      })
    }
  }, [])

  // iPhone Chrome 주소 입력창 축소를 위한 추가 스크롤 함수
  const forceAddressBarHide = useCallback(() => {
    // 페이지 로드 후 주소 입력창 축소를 위한 스크롤
    setTimeout(() => {
      window.scrollTo({ top: 1, behavior: 'auto' })
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }, 100)
    }, 500)
  }, [])

  // 1초 후 최상단으로 스크롤하는 함수
  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      const viewport = document.querySelector('.viewport')
      if (viewport) {
        viewport.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }, 1000)
  }, [])

  const updateSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    scrollToTop()
  }, [scrollToTop])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    scrollToTop()
  }, [scrollToTop])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    scrollToTop()
  }, [scrollToTop])

  const handleProfileClick = useCallback(() => {
    setIsProfileModalOpen(true)
  }, [])

  // 모바일 최적화
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // 뷰포트 높이 설정
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }

      setViewportHeight()
      window.addEventListener('resize', setViewportHeight)
      window.addEventListener('orientationchange', setViewportHeight)
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // iPhone Chrome 주소 입력창 축소를 위한 초기 스크롤
      forceAddressBarHide()
      
      return () => {
        window.removeEventListener('resize', setViewportHeight)
        window.removeEventListener('orientationchange', setViewportHeight)
        window.removeEventListener('scroll', handleScroll)
      }
    }
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
      case 'onl':
        return <OnlCard onProfileClick={handleProfileClick} />
      case 'weather':
        return <WeatherCard onProfileClick={handleProfileClick} />
      case 'fortune':
        return <FortuneCard />
      case 'news':
        return <NewsCard />
      case 'community':
        return <CommunityCard />
      default:
        return <OnlCard onProfileClick={handleProfileClick} />
    }
  }

  return (
    <UserProfileProvider>
      <main className="app">
        <Header onProfileClick={handleProfileClick} />
        
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
            {slides.map((slideType) => (
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
      
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </UserProfileProvider>
  )
}

export default App