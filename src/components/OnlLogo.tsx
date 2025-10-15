import React from 'react'
import './OnlLogo.css'

interface OnlLogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

const OnlLogo: React.FC<OnlLogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium', 
    large: 'logo-large'
  }

  return (
    <div className={`onl-logo ${sizeClasses[size]}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" className="logo-svg">
          {/* O - 원형 */}
          <circle 
            cx="25" 
            cy="50" 
            r="20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="6"
            className="logo-o"
          />
          
          {/* N - N자 */}
          <path 
            d="M45 30 L45 70 L65 30 L65 70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="6"
            strokeLinecap="round"
            className="logo-n"
          />
          
          {/* L - L자 */}
          <path 
            d="M75 30 L75 70 L95 70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="6"
            strokeLinecap="round"
            className="logo-l"
          />
          
          {/* 큐레이션을 나타내는 작은 점들 */}
          <circle cx="15" cy="35" r="2" fill="currentColor" className="dot-1" />
          <circle cx="35" cy="65" r="2" fill="currentColor" className="dot-2" />
          <circle cx="55" cy="40" r="2" fill="currentColor" className="dot-3" />
          <circle cx="85" cy="45" r="2" fill="currentColor" className="dot-4" />
        </svg>
      </div>
      
      {showText && (
        <div className="logo-text">
          <span className="brand-name">Onl</span>
          <span className="tagline">오늘 하루 나를 큐레이팅</span>
        </div>
      )}
    </div>
  )
}

export default OnlLogo

