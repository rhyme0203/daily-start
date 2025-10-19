import React from 'react'
import { useCommunityData } from '../hooks/useCommunityData'
import { usePointSystem } from '../contexts/PointSystemContext'
import DetailModal from './DetailModal'
import './Card.css'

const CommunityCard: React.FC = () => {
  const { data, loading, error, refresh, fetchPostContent } = useCommunityData()
  const { addPoints, canPerformAction, pointMessage } = usePointSystem()
  const [selectedSite, setSelectedSite] = React.useState('전체')
  const [selectedPost, setSelectedPost] = React.useState<any>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [clickPosition, setClickPosition] = React.useState<{ x: number; y: number } | undefined>()
  const [postContent, setPostContent] = React.useState<string>('')
  const [isLoadingContent, setIsLoadingContent] = React.useState(false)

  const formatTime = (time: string) => {
    // 시간 포맷팅 (예: "14:58" -> "14:58")
    return time
  }

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (canPerformAction('community_like')) {
      addPoints('community_like', 1)
    }
  }

  const handlePostClick = async (post: any, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setClickPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
    setSelectedPost(post)
    setIsLoadingContent(true)
    setIsModalOpen(true)
    
    // 실제 게시글 본문 가져오기
    try {
      const content = await fetchPostContent(post.url, post.id)
      setPostContent(content)
    } catch (error) {
      console.error('Error fetching post content:', error)
      setPostContent('본문 내용을 가져오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const getSiteIcon = (site: string) => {
    const icons: { [key: string]: string } = {
      '전체': '🌐',
      '개드립': '🐕',
      '엠팍': '⚾',
      '뽐뿌': '💰',
      'etoland': '🎭',
      '웃대': '😂',
      '82cook': '🍳',
      '루리웹': '🎮',
      '클리앙': '💻',
      '오유': '💬',
      '보배': '🚗',
      '딴지': '🎪',
      '가생이': '🌱'
    }
    return icons[site] || '📝'
  }

  const getSiteColor = (site: string) => {
    const colors: { [key: string]: string } = {
      '전체': '#10b981',
      '개드립': '#f59e0b',
      '엠팍': '#3b82f6',
      '뽐뿌': '#ef4444',
      'etoland': '#8b5cf6',
      '웃대': '#06b6d4',
      '82cook': '#84cc16',
      '루리웹': '#f97316',
      '클리앙': '#6366f1',
      '오유': '#ec4899',
      '보배': '#14b8a6',
      '딴지': '#a855f7',
      '가생이': '#22c55e'
    }
    return colors[site] || '#6b7280'
  }

  // 필터링된 게시글
  const filteredPosts = React.useMemo(() => {
    if (!data?.posts) return []
    if (selectedSite === '전체') return data.posts
    return data.posts.filter(post => post.site === selectedSite)
  }, [data?.posts, selectedSite])

  // 사용 가능한 사이트 목록
  const availableSites = React.useMemo(() => {
    if (!data?.siteStats) return ['전체']
    return ['전체', ...Object.keys(data.siteStats).sort()]
  }, [data?.siteStats])

  if (loading) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            커뮤니티 글
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">커뮤니티 글을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="title">
            <span className="ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            커뮤니티 글
          </div>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">커뮤니티 글을 불러올 수 없습니다</div>
          <button className="retry-btn" onClick={refresh}>
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="title">
          <span className="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </span>
          커뮤니티 글
        </div>
        <span className="pill">
          {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </span>
      </div>

      {/* 사이트 필터 칩 */}
      <div className="filter-chips">
        {availableSites.map((site) => (
          <button
            key={site}
            className={`chip ${selectedSite === site ? 'active' : ''}`}
            onClick={() => setSelectedSite(site)}
            style={{
              backgroundColor: selectedSite === site ? getSiteColor(site) : '#f3f4f6',
              color: selectedSite === site ? 'white' : '#374151'
            }}
          >
            <span className="chip-icon">{getSiteIcon(site)}</span>
            {site}
            {site !== '전체' && data?.siteStats?.[site] && (
              <span className="chip-count">({data.siteStats[site]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="news-list">
        {filteredPosts.slice(0, 10).map((post, index) => (
          <div 
            key={index} 
            className="news-item"
            onClick={(e) => handlePostClick(post, e)}
            style={{ cursor: 'pointer' }}
          >
            <div className="news-header">
              <div className="news-category-badge" style={{ backgroundColor: getSiteColor(post.site) + '20', color: getSiteColor(post.site) }}>
                <span className="site-icon">{getSiteIcon(post.site)}</span>
                {post.site}
              </div>
              <div className="news-time">{formatTime(post.time)}</div>
            </div>
            
            <div className="news-content">
              <h3 className="news-title">{post.title}</h3>
              <div className="news-meta">
                <div className="news-stats">
                  <span className="news-views">👁️ {post.views}</span>
                  <button 
                    className="like-button"
                    onClick={handleLikeClick}
                    disabled={!canPerformAction('community_like')}
                    title={canPerformAction('community_like') ? '좋아요 (+1P)' : '오늘 좋아요 한도 초과'}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            </div>
            
            {index < filteredPosts.slice(0, 10).length - 1 && <div className="news-divider"></div>}
          </div>
        ))}
      </div>

      {/* 업데이트 정보 */}
      <div className="news-footer">
        <div className="update-info">
          <span className="update-icon">🔄</span>
          <span className="update-text">1시간마다 자동 업데이트</span>
        </div>
        <button onClick={refresh} className="refresh-btn" disabled={loading}>
          {loading ? '업데이트 중...' : '새로고침'}
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedPost && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          clickPosition={clickPosition}
          title={selectedPost.title}
          content={isLoadingContent ? '본문을 불러오는 중...' : postContent}
          source={selectedPost.site}
          author={selectedPost.site}
          publishedAt={selectedPost.time}
          type="community"
          stats={{
            views: parseInt(selectedPost.views.replace(/,/g, '')) || 0
          }}
        />
      )}

      {/* 포인트 메시지 */}
      {pointMessage && (
        <div className="point-message">
          {pointMessage}
        </div>
      )}
    </div>
  )
}

export default CommunityCard