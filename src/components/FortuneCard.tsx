import React from 'react'
import './Card.css'

const FortuneCard: React.FC = () => {
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
        <span className="pill">양자리</span>
      </div>
      
      <div className="row">총운: 작은 용기가 큰 기회를 부릅니다.</div>
      <div className="row">연애운: 솔직한 표현이 호감을 높여요.</div>
      <div className="row">금전운: 지출을 한 번 더 점검하세요.</div>
      
      {/* 개인화된 운세 영향 섹션 */}
      <div className="weather-impact">
        <div className="impact-header">오늘 운세가 나에게 미치는 영향</div>
        <div className="impact-recommendations">
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">🚀</span>
            새로운 도전 추천
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">💬</span>
            솔직한 소통
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">💰</span>
            가계부 점검
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">😊</span>
            긍정적 마인드
          </div>
        </div>
        <div className="impact-disclaimer">
          * 운세 기반 자동 추천. 개인화 규칙은 설정에서 조정할 수 있어요.
        </div>
      </div>
    </div>
  )
}

export default FortuneCard
