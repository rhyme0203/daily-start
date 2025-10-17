import React from 'react'
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

interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
}

interface OnlCardProps {
  onProfileClick: () => void
}

const OnlCard: React.FC<OnlCardProps> = ({ onProfileClick: _onProfileClick }) => {
  const { userProfile } = useUserProfile()
  const { weatherData, loading: weatherLoading } = useWeatherData()
  const { fortune, loading: fortuneLoading } = useFortuneRecommendation(userProfile)
  const { news, loading: newsLoading } = useNewsData()
  const { communities, loading: communityLoading } = useCommunityData()

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
  const [calendarEvents, setCalendarEvents] = React.useState<CalendarEvent[]>([])
  const [calendarLoading, setCalendarLoading] = React.useState(false)
  const [calendarConnected, setCalendarConnected] = React.useState(false)
  const [hotdealLoaded, setHotdealLoaded] = React.useState(false)

  // Google Calendar API 연동 함수
  const connectToGoogleCalendar = async () => {
    try {
      setCalendarLoading(true)
      
      // Google Calendar API 설정
      const CLIENT_ID = 'your-google-client-id' // 실제 구현 시 환경변수로 관리
      const API_KEY = 'your-google-api-key'
      
      // Google API 로드
      await new Promise((resolve) => {
        if (window.gapi) {
          resolve(true)
          return
        }
        
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = resolve
        document.head.appendChild(script)
      })

      // API 초기화
      await new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
          }).then(resolve).catch(reject)
        })
      })

      // 인증 및 이벤트 가져오기
      const authInstance = window.gapi.auth2.getAuthInstance()
      const user = await authInstance.signIn()
      
      if (user.isSignedIn()) {
        setCalendarConnected(true)
        await loadTodayEvents()
      }
      
    } catch (error) {
      console.error('Google Calendar 연동 실패:', error)
      // 연동 실패 시 기본 일정 표시
      setCalendarConnected(false)
    } finally {
      setCalendarLoading(false)
    }
  }

  // 오늘의 이벤트 가져오기
  const loadTodayEvents = async () => {
    try {
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      const events = response.result.items || []
      setCalendarEvents(events)
      
    } catch (error) {
      console.error('이벤트 로드 실패:', error)
    }
  }

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

  // 기본 일정 데이터 (캘린더 연동 실패 시 사용)
  const defaultSchedule = [
    { time: "09:00", task: "아침 운동", completed: true },
    { time: "10:00", task: "업무 미팅", completed: false },
    { time: "14:00", task: "점심 약속", completed: false },
    { time: "16:00", task: "프로젝트 검토", completed: false },
    { time: "19:00", task: "저녁 식사", completed: false }
  ]

  // 실제 표시할 일정 결정
  const todaySchedule = calendarConnected && calendarEvents.length > 0 
    ? calendarEvents.map(event => {
        const startTime = event.start.dateTime || event.start.date
        return {
          time: startTime ? new Date(startTime).toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : '00:00',
          task: event.summary || '일정',
          completed: startTime ? new Date(startTime) < new Date() : false,
          source: 'calendar' as const
        }
      })
    : defaultSchedule.map(item => ({ ...item, source: 'default' as const }))

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
    if (communityLoading || !communities || communities.length === 0) return "커뮤니티 로딩 중..."
    return `${communities.length}개 인기 게시글`
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
          
          <div className="onl-summary-card community-card">
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
                <div className="connect-title">캘린더 연동하기</div>
                <div className="connect-description">
                  Google Calendar와 연동하여<br/>
                  실제 일정을 불러올 수 있습니다
                </div>
              </div>
            </div>
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
                  <span className="connect-icon-btn">🔗</span>
                  캘린더 연동
                </>
              )}
            </button>
          </div>
        )}
        
        <div className="schedule-list">
          {todaySchedule.map((item, index) => (
            <div key={index} className={`schedule-item ${item.completed ? 'completed' : ''} ${item.source === 'calendar' ? 'calendar-event' : ''}`}>
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-task">
                {item.completed && <span className="completed-icon">✓</span>}
                {item.source === 'calendar' && <span className="calendar-icon">📅</span>}
                {item.task}
              </div>
            </div>
          ))}
          
          {calendarConnected && calendarEvents.length === 0 && (
            <div className="no-events-message">
              <div className="no-events-icon">📅</div>
              <div className="no-events-text">오늘 등록된 일정이 없습니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnlCard
