import React, { useState } from 'react';
import { useCommunityData, CommunityPost, Community } from '../hooks/useCommunityData';
import DetailModal from './DetailModal';
import './Card.css';

const CommunityCard: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | undefined>();
  const { posts, loading, error, lastUpdated, communities, selectedCommunity, setSelectedCommunity, fetchCommunityPosts } = useCommunityData();

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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${Math.floor(num / 1000)}만`;
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };

  const handlePostClick = (post: CommunityPost, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  if (error) {
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
          <span className="pill">오류</span>
        </div>
        <div className="ai-placeholder">
          <div className="ai-icon">⚠️</div>
          <div className="ai-text">{error}</div>
          <button onClick={fetchCommunityPosts} className="retry-btn">다시 시도</button>
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
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
            </svg>
          </span>
          커뮤니티 클리핑
        </div>
        <span className="pill">
          {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 커뮤니티 선택 */}
      <div className="news-categories">
        <div className="category-tabs">
          {communities.map((community: Community) => (
            <button
              key={community.id}
              className={`category-tab ${selectedCommunity === community.id ? 'active' : ''}`}
              onClick={() => setSelectedCommunity(community.id)}
              style={{ 
                borderColor: selectedCommunity === community.id ? community.color : '#e2e8f0',
                backgroundColor: selectedCommunity === community.id ? community.color : '#f8fafc'
              }}
            >
              <span className="category-emoji">{community.emoji}</span>
              <span className="category-name">{community.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="news-list">
        {loading ? (
          <div className="news-loading">
            <div className="loading-spinner"></div>
            <span>게시글을 불러오는 중...</span>
          </div>
        ) : (
          posts.map((post: CommunityPost, index: number) => (
            <div key={post.id} className="news-item" onClick={(e) => handlePostClick(post, e)}>
              <div className="news-header">
                <div className="news-category-badge" style={{ 
                  backgroundColor: communities.find(c => c.id === post.community)?.color + '20',
                  color: communities.find(c => c.id === post.community)?.color
                }}>
                  {communities.find(c => c.id === post.community)?.emoji} 
                  {communities.find(c => c.id === post.community)?.name}
                </div>
                <div className="news-time">{formatTime(post.publishedAt)}</div>
              </div>
              
              <div className="news-content">
                <h3 className="news-title">{post.title}</h3>
                <p className="news-summary">{post.content}</p>
                <div className="community-stats">
                  <span className="stat-item">👀 {formatNumber(post.views)}</span>
                  <span className="stat-item">👍 {formatNumber(post.likes)}</span>
                  <span className="stat-item">💬 {formatNumber(post.comments)}</span>
                  <span className="stat-item">by {post.author}</span>
                </div>
              </div>
              
              {index < posts.length - 1 && <div className="news-divider"></div>}
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
        <button onClick={fetchCommunityPosts} className="refresh-btn" disabled={loading}>
          {loading ? '업데이트 중...' : '새로고침'}
        </button>
      </div>

      {/* 커뮤니티 게시글 상세 모달 */}
      {selectedPost && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedPost.title}
          content={selectedPost.content}
          author={selectedPost.author}
          publishedAt={selectedPost.publishedAt}
          category={communities.find(comm => comm.id === selectedPost.community)?.name}
          categoryEmoji={communities.find(comm => comm.id === selectedPost.community)?.emoji}
          stats={{
            views: selectedPost.views,
            likes: selectedPost.likes,
            comments: selectedPost.comments
          }}
          type="community"
          clickPosition={clickPosition}
        />
      )}
    </div>
  );
};

export default CommunityCard;
