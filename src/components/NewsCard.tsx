import React from 'react'
import './Card.css'

const NewsCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="14" rx="2"></rect>
              <path d="M7 8h10M7 12h10M7 16h6"></path>
            </svg>
          </span>
          주요 뉴스 헤드라인
        </div>
        <span className="pill">오늘</span>
      </div>
      
      <div className="row">[사회] 헤드라인 1 — 간단 요약 텍스트</div>
      <div className="row">[경제] 헤드라인 2 — 간단 요약 텍스트</div>
      <div className="row">[IT] 헤드라인 3 — 간단 요약 텍스트</div>
      
      {/* 개인화된 뉴스 영향 섹션 */}
      <div className="weather-impact">
        <div className="impact-header">오늘 뉴스가 나에게 미치는 영향</div>
        <div className="impact-recommendations">
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">📈</span>
            투자 관심 분야
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">🌍</span>
            사회 이슈 파악
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">💻</span>
            기술 트렌드 학습
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">📚</span>
            정보 업데이트
          </div>
        </div>
        <div className="impact-disclaimer">
          * 뉴스 기반 자동 추천. 개인화 규칙은 설정에서 조정할 수 있어요.
        </div>
      </div>
    </div>
  )
}

export default NewsCard
