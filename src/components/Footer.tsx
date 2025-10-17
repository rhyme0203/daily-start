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
  const slideLabels = ['날씨', '운세', '뉴스', '커뮤니티']
  
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 이전 버튼 */}
        <button 
          className="nav-btn prev-btn"
          onClick={onPrev}
          aria-label="이전"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        {/* 도트 네비게이션 */}
        <div className="dots-container">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => onDotClick(index)}
              aria-label={`${slideLabels[index]}로 이동`}
            >
              <span className="dot-label">{slideLabels[index]}</span>
            </button>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button 
          className="nav-btn next-btn"
          onClick={onNext}
          aria-label="다음"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
      
      {/* 버전 정보 */}
      <div className="version-info">
        <span className="version-text">ver0.47</span>
      </div>
    </footer>
  )
}

export default Footer
