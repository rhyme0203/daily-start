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
  return (
    <div className="footer">
      <div className="dots" role="tablist">
        {Array.from({ length: totalSlides }, (_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            role="tab"
            aria-selected={index === currentIndex}
            onClick={() => onDotClick(index)}
          />
        ))}
      </div>
      <div className="actions">
        <button 
          className="btn" 
          onClick={onPrev}
          aria-label="이전 카드"
        >
          이전
        </button>
        <button 
          className="btn primary" 
          onClick={onNext}
          aria-label="다음 카드"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default Footer