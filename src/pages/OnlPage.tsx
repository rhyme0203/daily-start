import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import OnlCard from '../components/OnlCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileModal from '../components/ProfileModal'
import { UserProfileProvider } from '../contexts/UserProfileContext'

const OnlPage: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const navigate = useNavigate()
  const viewportRef = useRef<HTMLDivElement>(null)

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  // 모바일 스크롤 영역 조정
  useEffect(() => {
    const adjustForMobile = () => {
      if (viewportRef.current) {
        const viewport = viewportRef.current
        const contentHeight = viewport.scrollHeight
        const viewportHeight = viewport.clientHeight
        
        // 모바일에서 충분한 스크롤 공간 확보
        if (contentHeight > viewportHeight) {
          // 모바일 주소창 변화를 고려한 추가 패딩
          viewport.style.paddingBottom = '300px'
        }
      }
    }

    // 초기 조정
    const timer1 = setTimeout(adjustForMobile, 500)
    
    // 콘텐츠 로딩 완료 후 재조정
    const timer2 = setTimeout(adjustForMobile, 2000)
    
    // 모바일 브라우저 주소창 변화 감지
    const handleResize = () => {
      setTimeout(adjustForMobile, 100)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // 스와이프 핸들러
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') {
      navigate('/weather')
    }
    // right는 첫 번째 탭이므로 이동할 곳이 없음
  }, [navigate])

  return (
    <UserProfileProvider>
      <div className="app">
        <Header onProfileClick={handleProfileClick} />
        <div ref={viewportRef} className="viewport" onTouchStart={(e) => {
          const startX = e.touches[0].clientX
          const startY = e.touches[0].clientY
          
          const handleTouchEnd = (e: TouchEvent) => {
            const endX = e.changedTouches[0].clientX
            const endY = e.changedTouches[0].clientY
            const diffX = startX - endX
            const diffY = startY - endY
            
            // 수평 스와이프가 수직 스와이프보다 클 때만 처리
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
              if (diffX > 0) {
                handleSwipe('left')
              } else {
                handleSwipe('right')
              }
            }
            
            document.removeEventListener('touchend', handleTouchEnd)
          }
          
          document.addEventListener('touchend', handleTouchEnd)
        }}>
          <div className="track">
            <div className="slide">
              <OnlCard onProfileClick={handleProfileClick} />
            </div>
          </div>
        </div>
        <Footer />
        {isProfileModalOpen && (
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        )}
      </div>
    </UserProfileProvider>
  )
}

export default OnlPage
