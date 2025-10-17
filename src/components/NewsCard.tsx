import React, { useState } from 'react';
import { useNewsData, NewsItem, NewsCategory } from '../hooks/useNewsData';
import DetailModal from './DetailModal';
import './Card.css';

const NewsCard: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | undefined>();
  const { news, loading, error, lastUpdated, categories, selectedCategory, setSelectedCategory, fetchNews } = useNewsData();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handleNewsClick = (newsItem: NewsItem, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  if (error) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
            </span>
            오늘의 주요뉴스
          </div>
          <span className="pill">오류</span>
        </div>
        <div className="ai-placeholder">
          <div className="ai-icon">⚠️</div>
          <div className="ai-text">{error}</div>
          <button onClick={fetchNews} className="retry-btn">다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9"></path>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1"></circle>
            </svg>
          </span>
          오늘의 주요뉴스
        </div>
        <span className="pill">
          {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 뉴스 카테고리 선택 */}
      <div className="news-categories">
        <div className="category-tabs">
          {categories.map((category: NewsCategory) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 뉴스 목록 */}
      <div className="news-list">
        {loading ? (
          <div className="news-loading">
            <div className="loading-spinner"></div>
            <span>뉴스를 불러오는 중...</span>
          </div>
        ) : (
          news.map((item: NewsItem, index: number) => (
            <div key={item.id} className="news-item" onClick={(e) => handleNewsClick(item, e)}>
              <div className="news-header">
                <div className="news-category-badge">
                  {categories.find(cat => cat.id === item.category)?.emoji} 
                  {categories.find(cat => cat.id === item.category)?.name}
                </div>
                <div className="news-time">{formatTime(item.publishedAt)}</div>
              </div>
              
              <div className="news-content">
                <h3 className="news-title">
                  {item.id.startsWith('naver_') && <span className="live-indicator">🔴 LIVE</span>}
                  {item.title}
                </h3>
                <p className="news-summary">{item.summary}</p>
                <div className="news-source">
                  {item.source}
                  {item.id.startsWith('naver_') && <span className="real-news-badge">실시간</span>}
                </div>
              </div>
              
              {index < news.length - 1 && <div className="news-divider"></div>}
            </div>
          ))
        )}
      </div>

      {/* 업데이트 정보 */}
      <div className="news-footer">
        <div className="update-info">
          <span className="update-icon">🔄</span>
          <span className="update-text">1시간마다 자동 업데이트</span>
        </div>
        <button onClick={fetchNews} className="refresh-btn" disabled={loading}>
          {loading ? '업데이트 중...' : '새로고침'}
        </button>
      </div>

      {/* 뉴스 상세 모달 */}
      {selectedNews && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedNews.title}
          content={selectedNews.summary}
          source={selectedNews.source}
          publishedAt={selectedNews.publishedAt}
          category={categories.find(cat => cat.id === selectedNews.category)?.name}
          categoryEmoji={categories.find(cat => cat.id === selectedNews.category)?.emoji}
          type="news"
          clickPosition={clickPosition}
        />
      )}
    </div>
  );
};

export default NewsCard;