import React from 'react';
import './DetailModal.css';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  source?: string;
  author?: string;
  publishedAt: string;
  category?: string;
  categoryEmoji?: string;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  type: 'news' | 'community';
  clickPosition?: { x: number; y: number };
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  source,
  author,
  publishedAt,
  category,
  categoryEmoji,
  stats,
  type,
  clickPosition
}) => {
  if (!isOpen) return null;

  // 스크롤 위치를 고려한 동적 모달 위치 계산
  const getModalStyle = () => {
    if (!clickPosition) return {};
    
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const clickY = clickPosition.y + scrollY;
    
    // 클릭 위치가 화면 상단 30% 이하에 있으면 상단 30%에서 시작
    // 그렇지 않으면 클릭 위치에서 시작하되 최소 상단 20%는 보장
    const minTop = viewportHeight * 0.2;
    const maxTop = viewportHeight * 0.3;
    
    let topPosition = Math.max(minTop, Math.min(maxTop, clickY - scrollY));
    
    return {
      paddingTop: `${topPosition}px`
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
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

  return (
    <div className="detail-modal-overlay" onClick={onClose} style={getModalStyle()}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <div className="detail-modal-category">
            {categoryEmoji && <span className="category-emoji">{categoryEmoji}</span>}
            {category && <span className="category-name">{category}</span>}
          </div>
          <button className="detail-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="detail-modal-body">
          <h2 className="detail-modal-title">{title}</h2>
          
          <div className="detail-modal-meta">
            <div className="detail-modal-time">{formatTime(publishedAt)}</div>
            {type === 'news' && source && (
              <div className="detail-modal-source">출처: {source}</div>
            )}
            {type === 'community' && author && (
              <div className="detail-modal-author">작성자: {author}</div>
            )}
          </div>

          <div className="detail-modal-text">
            {content.split('\n').map((line, index) => {
              // 동영상 URL 패턴 감지 (YouTube, Vimeo, 일반 동영상)
              if (line.startsWith('http') && (
                line.includes('youtube.com') || 
                line.includes('youtu.be') || 
                line.includes('vimeo.com') || 
                line.includes('.mp4') || 
                line.includes('.webm') || 
                line.includes('.mov') ||
                line.includes('.avi')
              )) {
                return (
                  <div key={index} className="modal-video-container">
                    {line.includes('youtube.com') || line.includes('youtu.be') ? (
                      <iframe
                        src={line.includes('youtu.be') ? 
                          `https://www.youtube.com/embed/${line.split('youtu.be/')[1]?.split('?')[0]}` :
                          `https://www.youtube.com/embed/${line.split('v=')[1]?.split('&')[0]}`
                        }
                        title="YouTube video"
                        className="modal-video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : line.includes('vimeo.com') ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${line.split('vimeo.com/')[1]?.split('?')[0]}`}
                        title="Vimeo video"
                        className="modal-video"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={line.trim()}
                        controls
                        className="modal-video"
                        onError={(e) => {
                          (e.target as HTMLVideoElement).style.display = 'none'
                        }}
                      >
                        <source src={line.trim()} type="video/mp4" />
                        <source src={line.trim()} type="video/webm" />
                        <source src={line.trim()} type="video/quicktime" />
                        브라우저가 동영상을 지원하지 않습니다.
                      </video>
                    )}
                  </div>
                )
              }
              // 이미지 URL 패턴 감지 (http로 시작하는 URL)
              if (line.startsWith('http') && (line.includes('.jpg') || line.includes('.jpeg') || line.includes('.png') || line.includes('.gif') || line.includes('.webp'))) {
                return (
                  <div key={index} className="modal-image-container">
                    <img 
                      src={line.trim()} 
                      alt="게시글 이미지"
                      className="modal-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )
              }
              // [이미지] 태그가 있는 경우 처리 (보배드림 형식: [이미지 1], [이미지 2] 등)
              if (line.startsWith('[이미지')) {
                // 다음 줄에 URL이 있는지 확인
                const nextLine = content.split('\n')[index + 1]
                if (nextLine && nextLine.startsWith('http') && (nextLine.includes('.jpg') || nextLine.includes('.jpeg') || nextLine.includes('.png') || nextLine.includes('.gif') || nextLine.includes('.webp'))) {
                  const imageUrl = nextLine.trim()
                  const imageAlt = content.split('\n')[index + 2] || ''
                  return (
                    <div key={index} className="modal-image-container">
                      <img 
                        src={imageUrl} 
                        alt={imageAlt}
                        className="modal-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      {imageAlt && <div className="modal-image-caption">{imageAlt}</div>}
                    </div>
                  )
                }
              }
              // [동영상] 태그가 있는 경우 처리
              if (line.startsWith('[동영상') && content.split('\n')[index + 1]?.startsWith('http')) {
                const videoUrl = content.split('\n')[index + 1]
                const videoAlt = content.split('\n')[index + 2] || ''
                return (
                  <div key={index} className="modal-video-container">
                    <video
                      src={videoUrl}
                      controls
                      className="modal-video"
                      onError={(e) => {
                        (e.target as HTMLVideoElement).style.display = 'none'
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      <source src={videoUrl} type="video/webm" />
                      <source src={videoUrl} type="video/quicktime" />
                      브라우저가 동영상을 지원하지 않습니다.
                    </video>
                    {videoAlt && <div className="modal-video-caption">{videoAlt}</div>}
                  </div>
                )
              }
              // 일반 텍스트 (빈 줄이 아닌 경우)
              if (line.trim() && !line.startsWith('http')) {
                return <div key={index} className="modal-text-line">{line}</div>
              }
              return null
            })}
          </div>

          {stats && (
            <div className="detail-modal-stats">
              {stats.views && (
                <div className="stat-item">
                  <span className="stat-icon">👀</span>
                  <span className="stat-value">{formatNumber(stats.views)}</span>
                </div>
              )}
              {stats.likes && (
                <div className="stat-item">
                  <span className="stat-icon">👍</span>
                  <span className="stat-value">{formatNumber(stats.likes)}</span>
                </div>
              )}
              {stats.comments && (
                <div className="stat-item">
                  <span className="stat-icon">💬</span>
                  <span className="stat-value">{formatNumber(stats.comments)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-modal-footer">
          <button className="detail-modal-action-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
