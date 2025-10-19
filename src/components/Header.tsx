import React, { useState } from 'react'
import OnlLogo from './OnlLogo'
import RewardBadge from './RewardBadge'
import { useUserProfile } from '../contexts/UserProfileContext'
import './Header.css'

interface HeaderProps {
  onProfileClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const [rewardPoints, setRewardPoints] = useState(0) // 초기 포인트 0으로 설정
  const { userProfile } = useUserProfile()
  
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })


  return (
    <header className="header">
      <div className="header-content">
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
            onClick={onProfileClick}
            className="profile-btn"
            title={userProfile ? "프로필 수정" : "개인화 설정"}
          >
            {userProfile ? "👤" : "👤"}
            {userProfile && <span className="profile-indicator">●</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header