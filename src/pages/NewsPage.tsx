import React, { useState } from 'react'
import NewsCard from '../components/NewsCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileModal from '../components/ProfileModal'
import { UserProfileProvider } from '../contexts/UserProfileContext'

const NewsPage: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  return (
    <UserProfileProvider>
      <div className="app">
        <Header onProfileClick={handleProfileClick} />
        <div className="viewport">
          <div className="track">
            <div className="slide">
              <NewsCard />
            </div>
          </div>
        </div>
        <Footer currentIndex={3} totalSlides={5} onNext={() => {}} onPrev={() => {}} onDotClick={() => {}} />
        {isProfileModalOpen && (
          <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        )}
      </div>
    </UserProfileProvider>
  )
}

export default NewsPage
