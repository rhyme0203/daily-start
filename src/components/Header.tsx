import React, { useState } from 'react'
import OnlLogo from './OnlLogo'
import RewardBadge from './RewardBadge'
import ProfileModal from './ProfileModal'
import { useUserProfile } from '../contexts/UserProfileContext'
import './Header.css'

const Header: React.FC = () => {
  const [rewardPoints, setRewardPoints] = useState(150) // 초기 포인트
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { userProfile } = useUserProfile()
  
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })


  return (
    <header className="header">
      <div className="brand">
        <OnlLogo size="medium" showText={false} />
        <div className="brand-info">
          <div className="brand-name">Onl</div>
          <div className="date">{currentDate}</div>
        </div>
      </div>
          <div className="header-actions">
            <RewardBadge 
              points={rewardPoints} 
              onPointsUpdate={setRewardPoints}
            />
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="profile-btn"
              title={userProfile ? "프로필 수정" : "개인화 설정"}
            >
              {userProfile ? "👤" : "👤"}
              {userProfile && <span className="profile-indicator">●</span>}
            </button>
            <div className="ico" aria-label="알림">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  )
}

export default Header