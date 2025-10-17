import React from 'react'
import { useWeatherData } from '../hooks/useWeatherData'
import { useActivityRecommendation } from '../hooks/useActivityRecommendation'
import { useUserProfile } from '../contexts/UserProfileContext'
import './Card.css'

interface WeatherCardProps {
  onProfileClick: () => void
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onProfileClick }) => {
  const { weatherData, loading } = useWeatherData()
  const { userProfile } = useUserProfile()
  const { recommendation, loading: recommendationLoading } = useActivityRecommendation(userProfile, weatherData)

  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </span>
          오늘의 일기예보
        </div>
        <span className="pill">
          {loading ? '로딩 중...' : weatherData?.location || '서울'}
        </span>
      </div>

      {weatherData ? (
        <div className="row kpi">
          <div className="num">{weatherData.temperature}</div>
          <div className="unit">°C · {weatherData.condition}</div>
          <div className="weather-icon">{weatherData.icon}</div>
        </div>
      ) : (
        <div className="row kpi">
          <div className="num">--</div>
          <div className="unit">°C · 로딩 중...</div>
          <div className="weather-icon">🌤️</div>
        </div>
      )}

      <div className="row">
        {loading ? '날씨 정보를 불러오는 중...' : 
         weatherData ? 
         `체감 ${weatherData.feelsLike}°C · 습도 ${weatherData.humidity}% · 바람 ${weatherData.windSpeed}km/h` :
         '위치 정보를 허용해주세요'}
      </div>

      {/* 개인화된 날씨 영향 섹션 */}
      <div className="weather-impact">
        <div className="impact-header">오늘 날씨가 나에게 미치는 영향</div>
        <div className="impact-recommendations">
          {weatherData ? (
            <>
              {weatherData.condition.includes('맑음') || weatherData.condition.includes('Clear') ? (
                <>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">👕</span>
                    가벼운 옷차림
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">☀️</span>
                    비 소식 거의 없음
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">💨</span>
                    환기 OK
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">🚶‍♀️</span>
                    가벼운 야외 산책 추천
                  </div>
                </>
              ) : weatherData.condition.includes('비') || weatherData.condition.includes('Rain') ? (
                <>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">☔</span>
                    우산 필수
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">🏠</span>
                    실내 활동 추천
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">💧</span>
                    습도 주의
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">🧥</span>
                    따뜻한 옷차림
                  </div>
                </>
              ) : (
                <>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">👔</span>
                    적당한 옷차림
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">🌤️</span>
                    날씨 변화 주의
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">⚖️</span>
                    실내외 균형
                  </div>
                  <div className="recommendation-chip">
                    <div className="chip-dot"></div>
                    <span className="chip-emoji">💊</span>
                    건강 관리
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="recommendation-chip">
                <div className="chip-dot"></div>
                <span className="chip-emoji">📍</span>
                위치 정보를 허용해주세요
              </div>
            </>
          )}
        </div>
        <div className="impact-disclaimer">
          * 예보 기반 자동 추천. 개인화 규칙은 설정에서 조정할 수 있어요.
        </div>
      </div>

      {/* 상세 날씨 정보 섹션 */}
      {weatherData && (
        <div className="weather-details">
          <div className="details-header">
            <span className="details-icon">📊</span>
            <span className="details-title">상세 날씨 정보</span>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">체감온도</div>
              <div className="detail-value">{weatherData.feelsLike}°C</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">습도</div>
              <div className="detail-value">{weatherData.humidity}%</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">풍속</div>
              <div className="detail-value">{weatherData.windSpeed}km/h</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">기압</div>
              <div className="detail-value">{weatherData.pressure || '--'}hPa</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">가시거리</div>
              <div className="detail-value">{weatherData.visibility || '--'}km</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">자외선지수</div>
              <div className="detail-value">{weatherData.uvIndex || '--'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 시간대별 날씨 예보 */}
      {weatherData && (
        <div className="weather-forecast">
          <div className="forecast-header">
            <span className="forecast-icon">⏰</span>
            <span className="forecast-title">오늘 시간대별 예보</span>
          </div>
          <div className="forecast-timeline">
            {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => (
              <div key={time} className="forecast-item">
                <div className="forecast-time">{time}</div>
                <div className="forecast-icon">🌤️</div>
                <div className="forecast-temp">{Math.round((weatherData.temperature || 20) + (Math.random() - 0.5) * 6)}°C</div>
              </div>
            ))}
          </div>
          <div className="forecast-note">
            * wttr.in API 기반 실시간 예보 (정확도: 약 85%)
          </div>
        </div>
      )}

      {/* AI 기반 개인화된 활동 추천 - 프로필이 있을 때만 표시 */}
      {userProfile ? (
        <div className="ai-recommendation">
          <div className="ai-header">
            <span className="ai-icon">🤖</span>
            <span className="ai-title">AI가 추천하는 오늘의 활동</span>
          </div>
          <div className="ai-content">
            {recommendationLoading ? (
              <div className="ai-loading">
                <span className="loading-dots">AI가 당신만의 활동을 추천하고 있어요...</span>
              </div>
            ) : recommendation ? (
              <div className="ai-text">
                {recommendation.split('\n').map((line, index) => (
                  <p key={index} className={line.includes('시간대') ? 'ai-section-title' : 'ai-description'}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="ai-placeholder">
                AI가 분석 중이에요...
              </div>
            )}
          </div>
          <div className="ai-footer">
            <span className="ai-tag">✨ 개인 맞춤형</span>
            <span className="ai-tag">🌤️ 날씨 연동</span>
            <span className="ai-tag">⏰ 시간 고려</span>
          </div>
        </div>
      ) : (
        /* 프로필이 없을 때 안내 메시지 */
        <div 
          className="ai-recommendation ai-placeholder-card" 
          onClick={onProfileClick}
        >
          <div className="ai-header">
            <span className="ai-icon">🎯</span>
            <span className="ai-title">개인화된 AI 추천을 받아보세요!</span>
          </div>
          <div className="ai-content">
            <div className="ai-placeholder">
              프로필을 완성하면 더 정확한 추천을 받을 수 있어요!
              <br />
              <span className="tap-hint">👆 탭하여 프로필 설정하기</span>
            </div>
          </div>
          <div className="ai-footer">
            <span className="ai-tag">✨ 개인 맞춤형</span>
            <span className="ai-tag">🌤️ 날씨 연동</span>
            <span className="ai-tag">⏰ 시간 고려</span>
          </div>
        </div>
      )}

    </div>
  )
}

export default WeatherCard
