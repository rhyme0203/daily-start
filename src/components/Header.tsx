import React, { useState } from 'react'
import OnlLogo from './OnlLogo'
import RewardBadge from './RewardBadge'
import { useUserProfile } from '../contexts/UserProfileContext'
import { UserProfile } from '../types/user'
import './Header.css'

const Header: React.FC = () => {
  const [rewardPoints, setRewardPoints] = useState(150) // 초기 포인트
  const { userProfile, setUserProfile } = useUserProfile()
  
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  // 테스트용 프로필 설정 함수
  const setTestProfile = () => {
    const testProfile: UserProfile = {
      birthDate: '1995-06-15',
      birthTime: '14:30',
      occupation: '프론트엔드 개발자',
      gender: 'male',
      name: '테스트 사용자'
    }
    setUserProfile(testProfile)
  }

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
            {!userProfile && (
              <button 
                onClick={setTestProfile}
                className="test-profile-btn"
                title="테스트 프로필 설정"
              >
                👤
              </button>
            )}
            <div className="ico" aria-label="알림">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>
    </header>
  )
}

export default Header