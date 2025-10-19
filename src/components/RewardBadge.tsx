import React, { useState, useEffect } from 'react'
import { usePointSystem } from '../contexts/PointSystemContext'
import './RewardBadge.css'

interface RewardBadgeProps {
  points: number
  onPointsUpdate?: (newPoints: number) => void
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ points, onPointsUpdate }) => {
  const [displayPoints, setDisplayPoints] = useState(points)
  const [showEarned, setShowEarned] = useState(false)
  const [checkInMessage, setCheckInMessage] = useState('')
  const { totalPoints, addPoints, canPerformAction, pointMessage } = usePointSystem()

  // 포인트 동기화
  useEffect(() => {
    onPointsUpdate?.(totalPoints)
  }, [totalPoints, onPointsUpdate])

  useEffect(() => {
    // 포인트가 증가할 때 애니메이션 효과
    if (totalPoints > displayPoints) {
      setShowEarned(true)
      setTimeout(() => setShowEarned(false), 2000)
    }
    setDisplayPoints(totalPoints)
  }, [totalPoints, displayPoints])

  const handleClick = () => {
    if (!canPerformAction('daily_checkin')) {
      setCheckInMessage('오늘은 이미 출석체크를 완료했습니다!')
      setTimeout(() => setCheckInMessage(''), 3000)
      return
    }

    // 출석체크 처리
    addPoints('daily_checkin', 10)
  }

  const isCheckedIn = !canPerformAction('daily_checkin')

  return (
    <div className="reward-container">
      <div className={`reward-badge ${showEarned ? 'earned' : ''} ${isCheckedIn ? 'checked-in' : ''}`} onClick={handleClick}>
        <div className="reward-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="reward-info">
          <div className="reward-points">{displayPoints}</div>
          <div className="reward-label">포인트</div>
        </div>
        {showEarned && (
          <div className="earned-animation">+10</div>
        )}
      </div>
            {(checkInMessage || pointMessage) && (
              <div className="check-in-message">
                {checkInMessage || pointMessage}
              </div>
            )}
    </div>
  )
}

export default RewardBadge


