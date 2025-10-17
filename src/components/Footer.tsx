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
  onDotClick 
}) => {
  const tabs = [
    { 
      id: 0,
      label: 'Onl', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M12 7v5l4 2"/>
        </svg>
      ),
      badge: null
    },
    { 
      id: 1,
      label: '날씨', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
      ),
      badge: null
    },
    { 
      id: 2,
      label: '운세', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10,8 16,12 10,16 10,8"/>
        </svg>
      ),
      badge: null
    },
    { 
      id: 3,
      label: '뉴스', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          <path d="M18 14h-8"/>
          <path d="M15 18h-5"/>
          <path d="M10 6h8v4h-8V6z"/>
        </svg>
      ),
      badge: 'LIVE'
    },
    { 
      id: 4,
      label: '커뮤니티', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      badge: 'HOT'
    }
  ]
  
  return (
    <footer className="footer">
      <div className="nav-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${currentIndex === tab.id ? 'active' : ''}`}
            onClick={() => onDotClick(tab.id)}
          >
            <div className="nav-icon">
              {tab.icon}
              {tab.badge && (
                <span className="nav-badge">{tab.badge}</span>
              )}
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* 버전 정보 */}
      <div className="version-info">
        <span className="version-text">ver0.72</span>
      </div>
    </footer>
  )
}

export default Footer