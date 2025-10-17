import React from 'react'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useFortuneRecommendation } from '../hooks/useFortuneRecommendation'
import './Card.css'

const FortuneCard: React.FC = () => {
  const { userProfile } = useUserProfile()
  const { fortune, loading, error, generateFortune } = useFortuneRecommendation(userProfile)

  const getZodiacSign = () => {
    if (!userProfile?.birthDate) return '양자리'
    
    const birthDate = new Date(userProfile.birthDate)
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    
    const zodiacSigns = [
      { name: '물병자리', start: [1, 20], end: [2, 18] },
      { name: '물고기자리', start: [2, 19], end: [3, 20] },
      { name: '양자리', start: [3, 21], end: [4, 19] },
      { name: '황소자리', start: [4, 20], end: [5, 20] },
      { name: '쌍둥이자리', start: [5, 21], end: [6, 21] },
      { name: '게자리', start: [6, 22], end: [7, 22] },
      { name: '사자자리', start: [7, 23], end: [8, 22] },
      { name: '처녀자리', start: [8, 23], end: [9, 22] },
      { name: '천칭자리', start: [9, 23], end: [10, 23] },
      { name: '전갈자리', start: [10, 24], end: [11, 22] },
      { name: '사수자리', start: [11, 23], end: [12, 21] },
      { name: '염소자리', start: [12, 22], end: [1, 19] }
    ]
    
    for (const sign of zodiacSigns) {
      if ((month === sign.start[0] && day >= sign.start[1]) || 
          (month === sign.end[0] && day <= sign.end[1])) {
        return sign.name
      }
    }
    return '양자리'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M5 20c2-5 12-5 14 0"></path>
              </svg>
            </span>
            오늘의 운세
          </div>
          <span className="pill">{getZodiacSign()}</span>
        </div>
        <div className="ai-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="ai-text">AI가 개인화된 운세를 분석 중이에요...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M5 20c2-5 12-5 14 0"></path>
              </svg>
            </span>
            오늘의 운세
          </div>
          <span className="pill">{getZodiacSign()}</span>
        </div>
        <div className="ai-placeholder">
          <div className="ai-icon">⚠️</div>
          <div className="ai-text">{error}</div>
          <button onClick={generateFortune} className="retry-btn">다시 시도</button>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3"></circle>
                <path d="M5 20c2-5 12-5 14 0"></path>
              </svg>
            </span>
            오늘의 운세
          </div>
          <span className="pill">{getZodiacSign()}</span>
        </div>
        <div className="ai-placeholder">
          <div className="ai-icon">🎯</div>
          <div className="ai-section-title">개인화된 운세를 받아보세요!</div>
          <div className="ai-description">
            생년월일, 직업, 성별을 입력하면 AI가 맞춤형 운세를 제공해드려요.
          </div>
          <div className="ai-footer">
            <div className="ai-tag">👤 버튼을 눌러 프로필을 설정하세요</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card fortune-card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3"></circle>
              <path d="M5 20c2-5 12-5 14 0"></path>
            </svg>
          </span>
          오늘의 운세
        </div>
        {userProfile?.birthDate && <span className="pill">{getZodiacSign()}</span>}
      </div>
      
      {fortune ? (
        <>
          {/* 총운 점수 - 온도 UI 스타일 */}
          <div className="row kpi">
            <div className="num">{fortune.overallScore}</div>
            <div className="unit">점 · 총운</div>
            <div className="weather-icon">🍀</div>
          </div>
          
          {/* 나에게 미치는 영향 섹션 */}
          <div className="weather-impact">
            <div className="impact-header">오늘 운세가 나에게 미치는 영향</div>
            <div className="impact-recommendations">
              <div className="recommendation-chip">
                <div className="chip-dot"></div>
                <span className="chip-emoji">💼</span>
                업무에 집중
              </div>
              <div className="recommendation-chip">
                <div className="chip-dot"></div>
                <span className="chip-emoji">🤝</span>
                인간관계 발전
              </div>
              <div className="recommendation-chip">
                <div className="chip-dot"></div>
                <span className="chip-emoji">💪</span>
                건강 관리
              </div>
              <div className="recommendation-chip">
                <div className="chip-dot"></div>
                <span className="chip-emoji">🎯</span>
                목표 달성
              </div>
            </div>
            <div className="impact-disclaimer">
              * {userProfile.occupation} 직업을 고려한 AI 맞춤 추천이에요.
            </div>
          </div>
          
          <div className="row">💼 업무운: {fortune.work}</div>
          <div className="row">💪 건강운: {fortune.health}</div>
          <div className="row">🤝 인간관계: {fortune.relationship}</div>
          
          {/* 개인화된 운세 상세 정보 */}
          <div className="ai-recommendation">
            <div className="ai-header">
              <div className="ai-icon">🎯</div>
              <div className="ai-title">AI 맞춤 운세 분석</div>
            </div>
            <div className="ai-content">
              <div className="ai-section-title">💡 오늘의 조언</div>
              <div className="ai-description">{fortune.advice}</div>
              
              <div className="ai-section-title">🍀 행운 정보</div>
              <div className="fortune-details">
                <div className="fortune-item">
                  <span className="fortune-label">행운의 숫자:</span>
                  <span className="fortune-value">{fortune.luckyNumbers.join(', ')}</span>
                </div>
                <div className="fortune-item">
                  <span className="fortune-label">행운의 색깔:</span>
                  <span className="fortune-value" style={{color: getColorHex(fortune.luckyColor)}}>
                    {fortune.luckyColor}
                  </span>
                </div>
                <div className="fortune-item">
                  <span className="fortune-label">행운의 시간:</span>
                  <span className="fortune-value">{fortune.luckyTime}</span>
                </div>
              </div>
            </div>
            <div className="ai-footer">
              <div className="ai-tag">🤖 AI가 {userProfile.occupation} 직업을 고려한 맞춤 운세</div>
            </div>
          </div>
        </>
      ) : (
        <div className="row">운세를 불러오는 중...</div>
      )}
    </div>
  )
}

// 색깔 이름을 hex 코드로 변환하는 함수
const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    '빨간색': '#ef4444',
    '파란색': '#3b82f6',
    '초록색': '#10b981',
    '노란색': '#f59e0b',
    '보라색': '#8b5cf6',
    '분홍색': '#ec4899',
    '검은색': '#374151',
    '흰색': '#6b7280',
    '회색': '#6b7280',
    '금색': '#fbbf24',
    '청록색': '#06b6d4',
    '주황색': '#f97316'
  }
  return colorMap[colorName] || '#6b7280'
}

export default FortuneCard
