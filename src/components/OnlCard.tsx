import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeatherData } from '../hooks/useWeatherData'
import { useFortuneRecommendation } from '../hooks/useFortuneRecommendation'
import { useNewsData } from '../hooks/useNewsData'
import { useCommunityData } from '../hooks/useCommunityData'
import { useUserProfile } from '../contexts/UserProfileContext'
import './Card.css'

// Google Calendar API 타입 정의
declare global {
  interface Window {
    gapi: any
    PartnersCoupang: {
      G: (config: {
        id: number
        template: string
        trackingCode: string
        width: string
        height: string
        tsource: string
      }) => void
    }
  }
}

// interface CalendarEvent {
//   // Google Calendar 연동이 비활성화되어 있어서 사용하지 않음
// }

interface OnlCardProps {
  onProfileClick: () => void
}

const OnlCard: React.FC<OnlCardProps> = ({ onProfileClick: _onProfileClick }) => {
  const navigate = useNavigate()
  const { userProfile } = useUserProfile()
  const { weatherData, loading: weatherLoading } = useWeatherData()
  const { fortune, loading: fortuneLoading } = useFortuneRecommendation(userProfile)
  const { news, loading: newsLoading } = useNewsData()
  const { loading: communityLoading } = useCommunityData()

  // 오늘의 명언 데이터
  const dailyQuotes = [
    "성공은 준비된 자에게 찾아오는 기회이다.",
    "꿈을 이루고 싶다면 먼저 깨어나라.",
    "오늘 할 수 있는 일에 최선을 다하라.",
    "변화는 성장의 시작이다.",
    "포기하지 않는 자에게는 길이 있다.",
    "작은 시작이 큰 변화를 만든다.",
    "자신을 믿는 것이 성공의 첫걸음이다.",
    "도전은 삶을 풍요롭게 만든다.",
    "긍정적인 마음가짐이 인생을 바꾼다.",
    "노력은 배신하지 않는다."
  ]

  // 영어 한마디 데이터
  const englishPhrases = [
    { korean: "새로운 시작", english: "A new beginning", pronunciation: "어 뉴 비기닝" },
    { korean: "꿈을 향해", english: "Toward the dream", pronunciation: "토워드 더 드림" },
    { korean: "성공적인 하루", english: "A successful day", pronunciation: "어 석세스풀 데이" },
    { korean: "긍정적인 에너지", english: "Positive energy", pronunciation: "포지티브 에너지" },
    { korean: "새로운 기회", english: "A new opportunity", pronunciation: "어 뉴 오퍼튜니티" },
    { korean: "도전과 성장", english: "Challenge and growth", pronunciation: "챌린지 앤드 그로스" },
    { korean: "목표 달성", english: "Achieve goals", pronunciation: "어치브 골즈" },
    { korean: "자신감", english: "Self-confidence", pronunciation: "셀프 컨피던스" },
    { korean: "성취감", english: "Sense of achievement", pronunciation: "센스 오브 어치브먼트" },
    { korean: "희망찬 미래", english: "Hopeful future", pronunciation: "호프풀 퓨처" }
  ]

  // 캘린더 연동 상태
  const [calendarLoading, setCalendarLoading] = React.useState(false)
  const [calendarConnected, setCalendarConnected] = React.useState(false)
  const [hotdealLoaded, setHotdealLoaded] = React.useState(false)

  // Google Calendar API 연동 함수 (현재 비활성화)
  const connectToGoogleCalendar = async () => {
    try {
      setCalendarLoading(true)
      
      // 현재 Google Calendar 연동이 설정되지 않아 비활성화
      console.log('Google Calendar 연동이 현재 비활성화되어 있습니다.')
      console.log('원인: OAuth 클라이언트에 도메인이 등록되지 않음')
      console.log('해결방법: Google Cloud Console에서 https://rhyme0203.github.io 도메인 등록 필요')
      
      // 대신 Google Calendar를 새 탭에서 열기
      window.open('https://calendar.google.com', '_blank')
      
    } catch (error) {
      console.error('Google Calendar 연동 실패:', error)
      setCalendarConnected(false)
    } finally {
      setCalendarLoading(false)
    }
  }

  // 오늘의 이벤트 가져오기 (현재 비활성화)
  // const loadTodayEvents = async () => {
  //   // Google Calendar 연동이 비활성화되어 있어서 사용하지 않음
  // }

  // 쿠팡 핫딜 위젯 로드
  const loadHotdealWidget = React.useCallback(() => {
    if (hotdealLoaded) return

    try {
      // 먼저 스크립트가 로드되었는지 확인
      if (window.PartnersCoupang && window.PartnersCoupang.G) {
        window.PartnersCoupang.G({
          "id": 933114,
          "template": "carousel",
          "trackingCode": "AF4548739",
          "width": "300",
          "height": "250",
          "tsource": ""
        })
        setHotdealLoaded(true)
      } else {
        // 스크립트가 없으면 iframe으로 대체
        const widgetContainer = document.getElementById('coupang-hotdeal-widget')
        if (widgetContainer) {
          widgetContainer.innerHTML = `
            <iframe 
              src="https://ads-partners.coupang.com/widgets.html?id=933114&template=carousel&trackingCode=AF4548739&subId=&width=300&height=250&tsource=" 
              width="300" 
              height="250" 
              frameborder="0" 
              scrolling="no" 
              referrerpolicy="unsafe-url" 
              browsingtopics>
            </iframe>
          `
          setHotdealLoaded(true)
        }
      }
    } catch (error) {
      console.error('핫딜 위젯 로드 실패:', error)
      // 실패 시 iframe으로 대체
      const widgetContainer = document.getElementById('coupang-hotdeal-widget')
      if (widgetContainer) {
        widgetContainer.innerHTML = `
          <iframe 
            src="https://ads-partners.coupang.com/widgets.html?id=933114&template=carousel&trackingCode=AF4548739&subId=&width=300&height=250&tsource=" 
            width="300" 
            height="250" 
            frameborder="0" 
            scrolling="no" 
            referrerpolicy="unsafe-url" 
            browsingtopics>
          </iframe>
        `
        setHotdealLoaded(true)
      }
    }
  }, [hotdealLoaded])

  // 쿠팡 스크립트 로드
  React.useEffect(() => {
    const loadCoupangScript = () => {
      if (window.PartnersCoupang) return

      const script = document.createElement('script')
      script.src = 'https://ads-partners.coupang.com/g.js'
      script.async = true
      script.onload = () => {
        console.log('쿠팡 스크립트 로드 완료')
        setTimeout(() => {
          loadHotdealWidget()
        }, 500)
      }
      script.onerror = () => {
        console.log('쿠팡 스크립트 로드 실패, iframe으로 대체')
        setTimeout(() => {
          loadHotdealWidget()
        }, 500)
      }
      document.head.appendChild(script)
    }

    loadCoupangScript()
  }, [loadHotdealWidget])

  // 실제 표시할 일정 결정 (캘린더 연동이 비활성화되어 빈 배열)
  const todaySchedule: any[] = []

  // 날짜 기반으로 명언과 영어 한마디 선택
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const selectedQuote = dailyQuotes[dayOfYear % dailyQuotes.length]
  const selectedEnglish = englishPhrases[dayOfYear % englishPhrases.length]

  const getWeatherSummary = () => {
    if (weatherLoading || !weatherData) return "날씨 정보 로딩 중..."
    const temp = weatherData.temperature
    const condition = weatherData.condition
    return `${temp}°C, ${condition}`
  }

  const getFortuneSummary = () => {
    if (fortuneLoading || !fortune) return "운세 정보 로딩 중..."
    return `${fortune.overallScore}점 (${fortune.zodiacSign})`
  }

  const getNewsSummary = () => {
    if (newsLoading || !news || news.length === 0) return "뉴스 로딩 중..."
    return `${news.length}개 주요 뉴스`
  }

  const getCommunitySummary = () => {
    if (communityLoading) return "커뮤니티 로딩 중..."
    return "50개 인기 글"
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M12 7v5l4 2"/>
            </svg>
          </span>
          Onl - 오늘의 대시보드
        </div>
      </div>

      {/* 다른 탭들 요약 */}
      <div className="onl-summary-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">📊</div>
          <div className="onl-section-title">오늘의 요약</div>
        </div>
        <div className="onl-summary-grid">
          <div className="onl-summary-card weather-card">
            <div className="onl-card-icon weather-icon">🌤️</div>
            <div className="onl-card-content">
              <div className="onl-card-label">날씨</div>
              <div className="onl-card-value">{getWeatherSummary()}</div>
            </div>
            <div className="onl-card-indicator weather-indicator"></div>
          </div>
          
          <div className="onl-summary-card fortune-card">
            <div className="onl-card-icon fortune-icon">🔮</div>
            <div className="onl-card-content">
              <div className="onl-card-label">운세</div>
              <div className="onl-card-value">{getFortuneSummary()}</div>
            </div>
            <div className="onl-card-indicator fortune-indicator"></div>
          </div>
          
          <div className="onl-summary-card news-card">
            <div className="onl-card-icon news-icon">📰</div>
            <div className="onl-card-content">
              <div className="onl-card-label">뉴스</div>
              <div className="onl-card-value">{getNewsSummary()}</div>
            </div>
            <div className="onl-card-indicator news-indicator"></div>
          </div>
          
          <div className="onl-summary-card">
            <div className="onl-card-icon community-icon">💬</div>
            <div className="onl-card-content">
              <div className="onl-card-label">커뮤니티</div>
              <div className="onl-card-value">{getCommunitySummary()}</div>
            </div>
            <div className="onl-card-indicator community-indicator"></div>
          </div>
        </div>
      </div>

      {/* 오늘의 명언 */}
      <div className="onl-quote-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">💭</div>
          <div className="onl-section-title">오늘의 명언</div>
        </div>
        <div className="onl-quote-card">
          <div className="onl-quote-content">
            <div className="onl-quote-text">"{selectedQuote}"</div>
            <div className="onl-quote-author">- 오늘의 지혜</div>
          </div>
          <div className="onl-quote-decoration"></div>
        </div>
      </div>

      {/* 영어 한마디 */}
      <div className="onl-english-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">🌍</div>
          <div className="onl-section-title">영어 한마디</div>
        </div>
        <div className="onl-english-card">
          <div className="onl-english-content">
            <div className="onl-english-korean">{selectedEnglish.korean}</div>
            <div className="onl-english-english">{selectedEnglish.english}</div>
            <div className="onl-english-pronunciation">[{selectedEnglish.pronunciation}]</div>
          </div>
          <div className="onl-english-flag">🇺🇸</div>
        </div>
      </div>

      {/* 룰렛 게임 */}
      <div className="onl-roulette-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">🎡</div>
          <div className="onl-section-title">행운의 룰렛</div>
        </div>
        <div className="onl-roulette-card">
          <div className="onl-roulette-content">
            <div className="onl-roulette-preview">
              <div className="roulette-preview-wheel">
                <div className="roulette-preview-pin"></div>
                <div className="roulette-preview-sections">
                  <div className="preview-section" style={{backgroundColor: '#ff6b6b'}}></div>
                  <div className="preview-section" style={{backgroundColor: '#4ecdc4'}}></div>
                  <div className="preview-section" style={{backgroundColor: '#f39c12'}}></div>
                  <div className="preview-section" style={{backgroundColor: '#9b59b6'}}></div>
                  <div className="preview-section" style={{backgroundColor: '#95a5a6'}}></div>
                  <div className="preview-section" style={{backgroundColor: '#e74c3c'}}></div>
                </div>
                <div className="roulette-preview-center">🎁</div>
              </div>
            </div>
            <div className="onl-roulette-info">
              <div className="roulette-title">경품을 받아가세요!</div>
              <div className="roulette-description">
                룰렛을 돌려서 다양한 경품을 받아보세요.<br/>
                하루 3회까지 참여 가능합니다.
              </div>
              <div className="roulette-prizes">
                <div className="prize-item">1등: 스타벅스 기프티콘</div>
                <div className="prize-item">2등: 500 포인트</div>
                <div className="prize-item">3등: 100 포인트</div>
                <div className="prize-item">4등: 쿠폰 5%</div>
              </div>
            </div>
          </div>
          <button 
            className="onl-roulette-button"
            onClick={() => navigate('/roulette')}
          >
            <span className="roulette-button-icon">🎡</span>
            룰렛 돌리기
            <span className="roulette-button-arrow">→</span>
          </button>
        </div>
      </div>

      {/* 오늘의 핫딜 */}
      <div className="onl-hotdeal-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">🔥</div>
          <div className="onl-section-title">오늘의 핫딜</div>
        </div>
        <div className="onl-hotdeal-card">
          <div id="coupang-hotdeal-widget"></div>
        </div>
      </div>

      {/* 오늘의 일정 */}
      <div className="onl-schedule-section">
        <div className="onl-section-header">
          <div className="onl-section-icon">📅</div>
          <div className="onl-section-title">오늘의 일정</div>
          {calendarConnected && (
            <div className="onl-sync-badge">
              <span className="sync-icon">🔄</span>
              <span className="sync-text">연동됨</span>
            </div>
          )}
        </div>
        
        {!calendarConnected && (
          <div className="calendar-connect-section">
            <div className="calendar-connect-info">
              <div className="connect-icon">📱</div>
              <div className="connect-text">
                <div className="connect-title">캘린더 관리하기</div>
                <div className="connect-description">
                  Google Calendar를 열어서<br/>
                  일정을 직접 관리할 수 있습니다
                </div>
              </div>
            </div>
            <div className="calendar-options">
              <button 
                className="calendar-connect-btn"
                onClick={connectToGoogleCalendar}
                disabled={calendarLoading}
              >
                {calendarLoading ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    연동 중...
                  </>
                ) : (
                  <>
                    <span className="connect-icon-btn">📅</span>
                    Google Calendar 열기
                  </>
                )}
              </button>
              <div className="calendar-alternatives">
                <div className="alternative-title">다른 방법으로 일정 추가하기</div>
                <div className="alternative-buttons">
                  <button 
                    className="alternative-btn"
                    onClick={() => window.open('https://calendar.google.com', '_blank')}
                  >
                    <span className="alt-icon">📅</span>
                    Google Calendar 열기
                  </button>
                  <button 
                    className="alternative-btn"
                    onClick={() => {
                      const event = {
                        title: '새로운 일정',
                        start: new Date().toISOString().slice(0, 16),
                        end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
                        description: 'Onl 앱에서 추가한 일정'
                      }
                      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Onl App//EN
BEGIN:VEVENT
UID:${Date.now()}@onl.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.start.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.end.replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`
                      const blob = new Blob([icsContent], { type: 'text/calendar' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'onl-event.ics'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <span className="alt-icon">📥</span>
                    일정 파일 다운로드
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {calendarConnected ? (
          <div className="schedule-list">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((item, index) => (
                <div key={index} className={`schedule-item ${item.completed ? 'completed' : ''} ${item.source === 'calendar' ? 'calendar-event' : ''}`}>
                  <div className="schedule-time">{item.time}</div>
                  <div className="schedule-task">
                    {item.completed && <span className="completed-icon">✓</span>}
                    {item.source === 'calendar' && <span className="calendar-icon">📅</span>}
                    {item.task}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-message">
                <div className="no-events-icon">📅</div>
                <div className="no-events-text">오늘 등록된 일정이 없습니다</div>
                <button 
                  className="add-schedule-btn"
                  onClick={() => window.open('https://calendar.google.com', '_blank')}
                >
                  일정 등록하기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="schedule-list">
            <div className="no-events-message">
              <div className="no-events-icon">📱</div>
              <div className="no-events-text">캘린더 연동 후 일정을 확인할 수 있습니다</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OnlCard
