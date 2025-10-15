import React from 'react'
import './Card.css'

const CommunityCard: React.FC = () => {
  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
            </svg>
          </span>
          커뮤니티 클리핑
        </div>
        <span className="pill">Top</span>
      </div>
      
      <div className="row">인기글: 출근길 하늘이 예뻐요 ☁️</div>
      <div className="row">추천글: 업무 루틴 만드는 법</div>
      <div className="row">토픽: 사이드 프로젝트 아이디어 모음</div>
      
      {/* 개인화된 커뮤니티 영향 섹션 */}
      <div className="weather-impact">
        <div className="impact-header">오늘 커뮤니티가 나에게 미치는 영향</div>
        <div className="impact-recommendations">
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">💡</span>
            영감 얻기
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">⚡</span>
            업무 효율성
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">🎯</span>
            프로젝트 아이디어
          </div>
          <div className="recommendation-chip">
            <div className="chip-dot"></div>
            <span className="chip-emoji">🤝</span>
            네트워킹 기회
          </div>
        </div>
        <div className="impact-disclaimer">
          * 커뮤니티 기반 자동 추천. 개인화 규칙은 설정에서 조정할 수 있어요.
        </div>
      </div>
    </div>
  )
}

export default CommunityCard
