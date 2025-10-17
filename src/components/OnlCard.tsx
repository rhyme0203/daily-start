import React from 'react'
import { useWeatherData } from '../hooks/useWeatherData'
import { useFortuneRecommendation } from '../hooks/useFortuneRecommendation'
import { useNewsData } from '../hooks/useNewsData'
import { useCommunityData } from '../hooks/useCommunityData'
import { useUserProfile } from '../contexts/UserProfileContext'
import './Card.css'

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

  // 오늘의 일정 데이터 (예시)
  const todaySchedule = [
    { time: "09:00", task: "아침 운동", completed: true },
    { time: "10:00", task: "업무 미팅", completed: false },
    { time: "14:00", task: "점심 약속", completed: false },
    { time: "16:00", task: "프로젝트 검토", completed: false },
    { time: "19:00", task: "저녁 식사", completed: false }
  ]

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
      <div className="summary-section">
        <div className="summary-header">📊 오늘의 요약</div>
        <div className="summary-grid">
          <div className="summary-item weather-summary">
            <div className="summary-icon">🌤️</div>
            <div className="summary-content">
              <div className="summary-label">날씨</div>
              <div className="summary-value">{getWeatherSummary()}</div>
            </div>
          </div>
          
          <div className="summary-item fortune-summary">
            <div className="summary-icon">🔮</div>
            <div className="summary-content">
              <div className="summary-label">운세</div>
              <div className="summary-value">{getFortuneSummary()}</div>
            </div>
          </div>
          
          <div className="summary-item news-summary">
            <div className="summary-icon">📰</div>
            <div className="summary-content">
              <div className="summary-label">뉴스</div>
              <div className="summary-value">{getNewsSummary()}</div>
            </div>
          </div>
          
          <div className="summary-item community-summary">
            <div className="summary-icon">💬</div>
            <div className="summary-content">
              <div className="summary-label">커뮤니티</div>
              <div className="summary-value">{getCommunitySummary()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 오늘의 명언 */}
      <div className="quote-section">
        <div className="quote-header">💭 오늘의 명언</div>
        <div className="quote-content">
          <div className="quote-text">"{selectedQuote}"</div>
          <div className="quote-author">- 오늘의 지혜</div>
        </div>
      </div>

      {/* 영어 한마디 */}
      <div className="english-section">
        <div className="english-header">🌍 영어 한마디</div>
        <div className="english-content">
          <div className="english-korean">{selectedEnglish.korean}</div>
          <div className="english-english">{selectedEnglish.english}</div>
          <div className="english-pronunciation">[{selectedEnglish.pronunciation}]</div>
        </div>
      </div>

      {/* 오늘의 일정 */}
      <div className="schedule-section">
        <div className="schedule-header">📅 오늘의 일정</div>
        <div className="schedule-list">
          {todaySchedule.map((item, index) => (
            <div key={index} className={`schedule-item ${item.completed ? 'completed' : ''}`}>
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-task">
                {item.completed && <span className="completed-icon">✓</span>}
                {item.task}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OnlCard
