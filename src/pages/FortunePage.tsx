import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FortuneCard from '../components/FortuneCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileModal from '../components/ProfileModal'
import { UserProfileProvider } from '../contexts/UserProfileContext'

const FortunePage: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  // 스와이프 핸들러
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') {
      navigate('/news')
    } else if (direction === 'right') {
      navigate('/weather')
    }
  }, [navigate])

  return (
    <UserProfileProvider>
      <div className="app">
        <Header onProfileClick={handleProfileClick} />
        <div className="viewport" onTouchStart={(e) => {
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
              <FortuneCard />
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

export default FortunePage
