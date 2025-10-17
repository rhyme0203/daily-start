import React from 'react'
import './Footer.css'

interface FooterProps {
  currentIndex: number
  totalSlides: number
  onNext: () => void
  onPrev: () => void
  onDotClick: (index: number) => void
}

const Footer: React.FC<FooterProps> = ({ 
  currentIndex, 
  totalSlides, 
  onNext, 
  onPrev, 
  onDotClick 
}) => {
  const slideConfigs = [
    { 
      label: '날씨', 
      icon: '🌤️', 
      color: '#4facfe',
      description: '실시간 날씨 정보'
    },
    { 
      label: '운세', 
      icon: '🔮', 
      color: '#a78bfa',
      description: 'AI 맞춤 운세'
    },
    { 
      label: '뉴스', 
      icon: '📰', 
      color: '#f87171',
      description: '실시간 뉴스'
    },
    { 
      label: '커뮤니티', 
      icon: '💬', 
      color: '#34d399',
      description: '인기 게시글'
    }
  ]
  
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 이전 버튼 */}
        <button 
          className="nav-btn prev-btn"
          onClick={onPrev}
          aria-label="이전"
          disabled={currentIndex === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        {/* 향상된 탭 네비게이션 */}
        <div className="tabs-container">
          {Array.from({ length: totalSlides }, (_, index) => {
            const config = slideConfigs[index]
            return (
              <button
                key={index}
                className={`tab ${index === currentIndex ? 'active' : ''}`}
                onClick={() => onDotClick(index)}
                aria-label={`${config.label}로 이동`}
                style={{
                  '--tab-color': config.color
                } as React.CSSProperties}
              >
                <div className="tab-icon">{config.icon}</div>
                <span className="tab-label">{config.label}</span>
                {index === currentIndex && (
                  <div className="tab-indicator"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* 다음 버튼 */}
        <button 
          className="nav-btn next-btn"
          onClick={onNext}
          aria-label="다음"
          disabled={currentIndex === totalSlides - 1}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
      
      {/* 현재 탭 정보 */}
      <div className="current-tab-info">
        <div className="tab-info-content">
          <span className="tab-info-icon">{slideConfigs[currentIndex].icon}</span>
          <div className="tab-info-text">
            <span className="tab-info-title">{slideConfigs[currentIndex].label}</span>
            <span className="tab-info-desc">{slideConfigs[currentIndex].description}</span>
          </div>
        </div>
        
        {/* 버전 정보 */}
        <div className="version-info">
          <span className="version-text">ver0.55</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer