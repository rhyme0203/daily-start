import React from 'react'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useFortuneRecommendation } from '../hooks/useFortuneRecommendation'
import FortuneChart from './FortuneChart'
import './Card.css'

const FortuneCard: React.FC = () => {
  const { userProfile } = useUserProfile()
  const { fortune, loading, error, generateFortune, isNewDay } = useFortuneRecommendation(userProfile)

  // 디버깅을 위한 콘솔 로그
  console.log('🔍 FortuneCard Debug:', {
    userProfile,
    fortune,
    loading,
    error,
    isNewDay,
    localStorage: localStorage.getItem('userProfile')
  })

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
          <span className="pill">로딩 중...</span>
        </div>
        <div className="ai-placeholder">
          <div className="ai-icon">🔮</div>
          <div className="ai-text">AI가 당신의 운세를 분석하고 있어요...</div>
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
          {isNewDay && <span className="new-day-badge">NEW</span>}
        </div>
        {fortune && <span className="pill">{fortune.zodiacSign}</span>}
        {!fortune && !loading && (
          <button 
            onClick={generateFortune} 
            className="generate-fortune-btn"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔮 운세 생성
          </button>
        )}
      </div>
      
      {fortune ? (
        <>
          {/* 총운 점수 - 온도 UI 스타일 */}
          <div className="row kpi">
            <div className="num">{fortune.overallScore}</div>
            <div className="unit">점 · 총운</div>
            <div className="weather-icon">🍀</div>
          </div>
          
          {/* 5각 그래프 차트 */}
          <FortuneChart
            workScore={fortune.workScore}
            healthScore={fortune.healthScore}
            relationshipScore={fortune.relationshipScore}
            luckScore={fortune.luckScore}
            overallScore={fortune.overallScore}
          />
          
          {/* 오늘의 운세 요약 */}
          <div className="fortune-summary">
            <div className="summary-header">📜 오늘의 운세</div>
            <div className="summary-content">{fortune.overall}</div>
          </div>
          
          {/* 상세 운세 정보 */}
          <div className="fortune-details-grid">
            <div className="detail-card work-card">
              <div className="detail-header">
                <span className="detail-emoji">💼</span>
                <span className="detail-title">업무운</span>
                <span className="detail-score">{fortune.workScore}점</span>
              </div>
              <div className="detail-content">{fortune.work}</div>
            </div>
            
            <div className="detail-card health-card">
              <div className="detail-header">
                <span className="detail-emoji">💪</span>
                <span className="detail-title">건강운</span>
                <span className="detail-score">{fortune.healthScore}점</span>
              </div>
              <div className="detail-content">{fortune.health}</div>
            </div>
            
            <div className="detail-card relationship-card">
              <div className="detail-header">
                <span className="detail-emoji">🤝</span>
                <span className="detail-title">인간관계</span>
                <span className="detail-score">{fortune.relationshipScore}점</span>
              </div>
              <div className="detail-content">{fortune.relationship}</div>
            </div>
            
            <div className="detail-card luck-card">
              <div className="detail-header">
                <span className="detail-emoji">🍀</span>
                <span className="detail-title">행운</span>
                <span className="detail-score">{fortune.luckScore}점</span>
              </div>
              <div className="detail-content">{fortune.luck}</div>
            </div>
          </div>
          
          {/* AI 맞춤 운세 분석 */}
          <div className="ai-recommendation">
            <div className="ai-header">
              <div className="ai-icon">🤖</div>
              <div className="ai-title">AI 맞춤 운세 분석</div>
            </div>
            <div className="ai-content">
              <div className="ai-section-title">💡 오늘의 조언</div>
              <div className="ai-description">{fortune.advice}</div>
              
              <div className="ai-section-title">🔮 상세 분석</div>
              <div className="ai-description">{fortune.detailedAnalysis}</div>
              
              <div className="ai-section-title">📅 일일 운세</div>
              <div className="ai-description">{fortune.dailyHoroscope}</div>
            </div>
            <div className="ai-footer">
              <div className="ai-tag">🤖 AI가 {userProfile.occupation} 직업을 고려한 맞춤 운세</div>
            </div>
          </div>
          
          {/* 행운 정보 */}
          <div className="fortune-lucky-info">
            <div className="lucky-header">🍀 오늘의 행운 정보</div>
            <div className="lucky-grid">
              <div className="lucky-item">
                <div className="lucky-label">행운의 숫자</div>
                <div className="lucky-value">{fortune.luckyNumbers.join(', ')}</div>
              </div>
              <div className="lucky-item">
                <div className="lucky-label">행운의 색깔</div>
                <div className="lucky-value" style={{color: getColorHex(fortune.luckyColor)}}>
                  {fortune.luckyColor}
                </div>
              </div>
              <div className="lucky-item">
                <div className="lucky-label">행운의 시간</div>
                <div className="lucky-value">{fortune.luckyTime}</div>
              </div>
              <div className="lucky-item">
                <div className="lucky-label">행운의 방향</div>
                <div className="lucky-value">{fortune.luckyDirection}</div>
              </div>
            </div>
          </div>
          
          {/* 추가 운세 정보 */}
          <div className="additional-fortune">
            <div className="additional-header">✨ 추가 운세 정보</div>
            <div className="additional-grid">
              <div className="additional-item">
                <span className="additional-emoji">💕</span>
                <div className="additional-content">
                  <div className="additional-title">연애운</div>
                  <div className="additional-desc">{fortune.loveLife}</div>
                </div>
              </div>
              <div className="additional-item">
                <span className="additional-emoji">💰</span>
                <div className="additional-content">
                  <div className="additional-title">재물운</div>
                  <div className="additional-desc">{fortune.financialOutlook}</div>
                </div>
              </div>
              <div className="additional-item">
                <span className="additional-emoji">👨‍👩‍👧‍👦</span>
                <div className="additional-content">
                  <div className="additional-title">가족운</div>
                  <div className="additional-desc">{fortune.familyHarmony}</div>
                </div>
              </div>
              <div className="additional-item">
                <span className="additional-emoji">🌱</span>
                <div className="additional-content">
                  <div className="additional-title">성장운</div>
                  <div className="additional-desc">{fortune.personalGrowth}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 조언 섹션 */}
          <div className="fortune-advice">
            <div className="advice-header">🎯 오늘의 행동 가이드</div>
            <div className="advice-content">
              <div className="advice-item positive">
                <span className="advice-emoji">✅</span>
                <span className="advice-text">{fortune.bestActivity}</span>
              </div>
              <div className="advice-item negative">
                <span className="advice-emoji">❌</span>
                <span className="advice-text">{fortune.avoidActivity}</span>
              </div>
            </div>
            <div className="spiritual-guidance">
              <span className="guidance-emoji">🌟</span>
              <span className="guidance-text">{fortune.spiritualGuidance}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="fortune-empty-state">
          <div className="empty-icon">🔮</div>
          <div className="empty-title">운세를 생성해보세요!</div>
          <div className="empty-description">
            프로필이 설정되어 있지만 아직 운세가 생성되지 않았습니다.
          </div>
          <button 
            onClick={generateFortune} 
            className="generate-fortune-btn-main"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '16px',
              width: '100%'
            }}
          >
            🔮 오늘의 운세 생성하기
          </button>
        </div>
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