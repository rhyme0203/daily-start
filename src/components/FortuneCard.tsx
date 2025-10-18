import React from 'react'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useFortuneRecommendation } from '../hooks/useFortuneRecommendation'
import FortuneChart from './FortuneChart'
import './Card.css'

const FortuneCard: React.FC = () => {
  const { userProfile } = useUserProfile()
  const { fortune, loading, error, generateFortune, isNewDay } = useFortuneRecommendation(userProfile)
  const [timeUntilMidnight, setTimeUntilMidnight] = React.useState<string>('')
  const [drawnCards, setDrawnCards] = React.useState<number[]>([])
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [imageLoadingStates, setImageLoadingStates] = React.useState<{[key: number]: boolean}>({})

  // 타로카드 데이터 (유니버셜 덱 이미지 포함)
  const tarotCards = [
    { id: 0, name: "바보", meaning: "새로운 시작, 순수함, 모험", description: "새로운 여정이 시작됩니다. 두려워하지 말고 도전해보세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/RWS_Tarot_00_Fool.jpg/200px-RWS_Tarot_00_Fool.jpg" },
    { id: 1, name: "마법사", meaning: "의지력, 창조력, 능력", description: "당신의 능력을 믿고 목표를 향해 나아가세요. 성공할 수 있습니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/RWS_Tarot_01_Magician.jpg/200px-RWS_Tarot_01_Magician.jpg" },
    { id: 2, name: "여교황", meaning: "직감, 지혜, 신비로운 지식", description: "내면의 목소리에 귀 기울이세요. 직감이 당신을 인도할 것입니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/200px-RWS_Tarot_02_High_Priestess.jpg" },
    { id: 3, name: "여황제", meaning: "풍요, 자연, 창조", description: "풍요로운 시기가 찾아옵니다. 자연과 조화를 이루며 성장하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/RWS_Tarot_03_Empress.jpg/200px-RWS_Tarot_03_Empress.jpg" },
    { id: 4, name: "황제", meaning: "권위, 질서, 리더십", description: "강한 의지와 리더십이 필요한 시기입니다. 체계적으로 접근하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/RWS_Tarot_04_Emperor.jpg/200px-RWS_Tarot_04_Emperor.jpg" },
    { id: 5, name: "교황", meaning: "전통, 교육, 영성", description: "전통적인 방법과 지혜가 도움이 될 것입니다. 배움에 열린 마음을 가지세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RWS_Tarot_05_Hierophant.jpg/200px-RWS_Tarot_05_Hierophant.jpg" },
    { id: 6, name: "연인들", meaning: "사랑, 선택, 조화", description: "중요한 선택의 기로에 서 있습니다. 마음의 소리를 따라 결정하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RWS_Tarot_06_Lovers.jpg/200px-RWS_Tarot_06_Lovers.jpg" },
    { id: 7, name: "전차", meaning: "의지력, 승리, 통제", description: "강한 의지로 목표를 달성할 수 있습니다. 포기하지 마세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/RWS_Tarot_07_Chariot.jpg/200px-RWS_Tarot_07_Chariot.jpg" },
    { id: 8, name: "힘", meaning: "내적 힘, 용기, 인내", description: "내면의 힘을 믿으세요. 부드러운 힘이 강함보다 효과적입니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/RWS_Tarot_08_Strength.jpg/200px-RWS_Tarot_08_Strength.jpg" },
    { id: 9, name: "은둔자", meaning: "성찰, 지혜, 내적 탐구", description: "혼자만의 시간이 필요합니다. 내면을 탐구하며 지혜를 얻으세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/RWS_Tarot_09_Hermit.jpg/200px-RWS_Tarot_09_Hermit.jpg" },
    { id: 10, name: "운명의 바퀴", meaning: "운명, 변화, 순환", description: "인생의 전환점이 찾아옵니다. 변화를 받아들이고 적응하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg/200px-RWS_Tarot_10_Wheel_of_Fortune.jpg" },
    { id: 11, name: "정의", meaning: "균형, 공정함, 진실", description: "공정한 판단이 필요합니다. 진실을 추구하고 균형을 유지하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/RWS_Tarot_11_Justice.jpg/200px-RWS_Tarot_11_Justice.jpg" },
    { id: 12, name: "매달린 사람", meaning: "희생, 기다림, 새로운 관점", description: "인내가 필요한 시기입니다. 새로운 관점에서 상황을 바라보세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/RWS_Tarot_12_Hanged_Man.jpg/200px-RWS_Tarot_12_Hanged_Man.jpg" },
    { id: 13, name: "죽음", meaning: "끝과 시작, 변화, 재생", description: "끝은 새로운 시작입니다. 과거를 놓고 새로운 길을 걷으세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/RWS_Tarot_13_Death.jpg/200px-RWS_Tarot_13_Death.jpg" },
    { id: 14, name: "절제", meaning: "균형, 조화, 인내", description: "균형과 조화가 중요합니다. 서두르지 말고 차근차근 진행하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/RWS_Tarot_14_Temperance.jpg/200px-RWS_Tarot_14_Temperance.jpg" },
    { id: 15, name: "악마", meaning: "유혹, 속박, 물질주의", description: "물질적 욕망에 주의하세요. 진정한 자유를 찾아야 합니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/RWS_Tarot_15_Devil.jpg/200px-RWS_Tarot_15_Devil.jpg" },
    { id: 16, name: "탑", meaning: "파괴, 깨달음, 급작스러운 변화", description: "급작스러운 변화가 올 것입니다. 기존의 틀을 깨고 새로 시작하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/RWS_Tarot_16_Tower.jpg/200px-RWS_Tarot_16_Tower.jpg" },
    { id: 17, name: "별", meaning: "희망, 영감, 치유", description: "희망의 빛이 비춥니다. 어려움이 지나가고 새로운 기회가 찾아옵니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RWS_Tarot_17_Star.jpg/200px-RWS_Tarot_17_Star.jpg" },
    { id: 18, name: "달", meaning: "환상, 불안, 직감", description: "현실과 환상 사이에서 헤매고 있습니다. 직감을 믿고 조심스럽게 나아가세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/RWS_Tarot_18_Moon.jpg/200px-RWS_Tarot_18_Moon.jpg" },
    { id: 19, name: "태양", meaning: "성공, 기쁨, 활력", description: "성공과 기쁨의 시기가 찾아옵니다. 자신감을 가지고 목표를 향해 나아가세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/RWS_Tarot_19_Sun.jpg/200px-RWS_Tarot_19_Sun.jpg" },
    { id: 20, name: "심판", meaning: "재생, 용서, 새로운 시작", description: "과거를 정리하고 새로운 시작을 준비하세요. 용서와 치유가 필요합니다.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/RWS_Tarot_20_Judgement.jpg/200px-RWS_Tarot_20_Judgement.jpg" },
    { id: 21, name: "세계", meaning: "완성, 성취, 만족", description: "목표를 달성하고 완성의 기쁨을 누릴 시기입니다. 성과를 축하하세요.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/RWS_Tarot_21_World.jpg/200px-RWS_Tarot_21_World.jpg" }
  ]

  // 자정까지 남은 시간 계산 및 업데이트
  React.useEffect(() => {
    const updateTimeUntilMidnight = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0) // 다음날 자정
      const diff = midnight.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeUntilMidnight(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimeUntilMidnight()
    const interval = setInterval(updateTimeUntilMidnight, 1000)

    return () => clearInterval(interval)
  }, [])

  // 타로카드 뽑기 함수
  const drawTarotCards = async () => {
    if (isDrawing) return
    
    setIsDrawing(true)
    
    // 3장의 카드를 뽑기 (중복 없이)
    const drawn = []
    const used = new Set()
    
    for (let i = 0; i < 3; i++) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * tarotCards.length)
      } while (used.has(randomIndex))
      
      used.add(randomIndex)
      drawn.push(randomIndex)
    }
    
    // 애니메이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500))
    setDrawnCards(drawn)
    setIsDrawing(false)
  }

  // 타로카드 초기화
  const resetTarotCards = () => {
    setDrawnCards([])
    setImageLoadingStates({})
  }

  // 이미지 로딩 시작
  const handleImageLoadStart = (cardId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [cardId]: true }))
  }

  // 이미지 로딩 완료
  const handleImageLoad = (cardId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [cardId]: false }))
  }

  // 이미지 로딩 실패
  const handleImageError = (cardId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [cardId]: false }))
  }

  // 디버깅 로그 제거 (성능 최적화)

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
        <div className="fortune-no-profile">
          <div className="no-profile-icon">🔮</div>
          <div className="no-profile-title">프로필 등록 후 이용 가능합니다</div>
          <div className="no-profile-description">
            개인화된 운세를 받으려면<br/>
            생년월일, 직업, 성별 정보가 필요해요.
          </div>
          <div className="no-profile-instruction">
            👤 버튼을 눌러 프로필을 설정해주세요
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
        {fortune && (
          <div className="fortune-header-info">
            <span className="pill">{fortune.zodiacSign}</span>
            <div className="midnight-countdown">
              <span className="countdown-label">다음 운세까지</span>
              <span className="countdown-time">{timeUntilMidnight}</span>
            </div>
          </div>
        )}
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

      {/* 타로카드 섹션 - 항상 표시 */}
      <div className="tarot-section">
        <div className="tarot-header">
          <div className="tarot-title">🔮 타로카드 뽑기</div>
          <div className="tarot-subtitle">마음의 질문을 담고 카드를 뽑아보세요</div>
        </div>
        
        {drawnCards.length === 0 ? (
          <div className="tarot-draw-area">
            <div className="tarot-deck">
              <div className="tarot-deck-card">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/RWS_Tarot_Back.jpg/200px-RWS_Tarot_Back.jpg" 
                  alt="타로카드 뒷면"
                  className="tarot-deck-back-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="tarot-deck-back" style={{display: 'none'}}>🃏</div>
              </div>
              <div className="tarot-deck-card">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/RWS_Tarot_Back.jpg/200px-RWS_Tarot_Back.jpg" 
                  alt="타로카드 뒷면"
                  className="tarot-deck-back-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="tarot-deck-back" style={{display: 'none'}}>🃏</div>
              </div>
              <div className="tarot-deck-card">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/RWS_Tarot_Back.jpg/200px-RWS_Tarot_Back.jpg" 
                  alt="타로카드 뒷면"
                  className="tarot-deck-back-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="tarot-deck-back" style={{display: 'none'}}>🃏</div>
              </div>
            </div>
            <button 
              className={`tarot-draw-btn ${isDrawing ? 'drawing' : ''}`}
              onClick={drawTarotCards}
              disabled={isDrawing}
            >
              {isDrawing ? (
                <>
                  <span className="drawing-spinner">⟳</span>
                  카드를 뽑는 중...
                </>
              ) : (
                <>
                  <span className="draw-icon">✨</span>
                  카드 뽑기
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="tarot-result">
            <div className="tarot-cards">
              {drawnCards.map((cardId, index) => {
                const card = tarotCards[cardId]
                const position = ['과거', '현재', '미래'][index]
                return (
                  <div key={cardId} className={`tarot-card ${isDrawing ? 'drawing' : 'drawn'}`}>
                    <div className="tarot-card-inner">
                      <div className="tarot-card-image">
                        {imageLoadingStates[cardId] && (
                          <div className="tarot-card-loading">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">카드 로딩중...</div>
                          </div>
                        )}
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="tarot-card-img"
                          style={{ display: imageLoadingStates[cardId] ? 'none' : 'block' }}
                          onLoadStart={() => handleImageLoadStart(cardId)}
                          onLoad={() => handleImageLoad(cardId)}
                          onError={() => handleImageError(cardId)}
                        />
                        {!imageLoadingStates[cardId] && (
                          <div className="tarot-card-fallback" style={{ display: 'none' }}>
                            <div className="fallback-card">
                              <div className="fallback-symbol">🃏</div>
                              <div className="fallback-text">{card.name}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="tarot-card-position">{position}</div>
                      <div className="tarot-card-name">{card.name}</div>
                      <div className="tarot-card-meaning">{card.meaning}</div>
                      <div className="tarot-card-description">{card.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <button 
              className="tarot-reset-btn"
              onClick={resetTarotCards}
            >
              <span className="reset-icon">🔄</span>
              다시 뽑기
            </button>
          </div>
        )}
      </div>
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