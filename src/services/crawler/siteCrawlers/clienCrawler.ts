import { BaseCrawler } from '../baseCrawler'
import { CrawledPost, CrawlerConfig } from '../types'

export class ClienCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      siteName: '클리앙',
      siteCode: 'clien',
      baseUrl: 'https://www.clien.net',
      listUrl: 'https://www.clien.net/service/board/park',
      contentSelectors: [
        '.post_view',
        '.post_content',
        '.view_content',
        '.content',
        'article',
        '.article-content'
      ],
      unwantedElements: [
        'script', 'style', 'nav', 'header', 'footer', '.ad', '.advertisement', 
        '.banner', '.sidebar', '.comment', '.reply', '.related', '.recommend',
        '.menu', '.navigation', '.aside', '.widget', '.popup', '.ads',
        '.ad-banner', '.sponsor', 'label', 'input', 'button', 'form',
        '.login', '.signup', '.auth', '.user', '.member', '.profile',
        '.account', '.settings', '.config', '.option', '.checkbox', '.radio',
        '.select', '.keepid', '.login-optn', '.signup-optn', '.favorite-text',
        '.favorite', '.bookmark', '.like', '.share', '.social', '.toolbar',
        '.action', '.btn', '.button', '.comment-list', '.comment-item',
        '.reply-list', '.reply-item', '.comment-area', '.reply-area',
        '.comment-box', '.reply-box', '.comment-section', '.reply-section',
        '.comment-container', '.reply-container'
      ],
      unwantedTexts: [
        '즐겨찾기', '로그인 상태 유지', '로그인', '회원가입', '로그아웃',
        '검색', '메뉴', '네비게이션', '사이드바', '광고', '추천',
        '댓글', '답글', '공유', '좋아요', '북마크', '팔로우',
        '설정', '계정', '프로필', '마이페이지', '관리자',
        '최근 전체', '최근 방문', '게시판', '글번호', 'IP'
      ],
      updateInterval: 60 // 1시간
    }
    super(config)
  }

  async crawlPosts(): Promise<CrawledPost[]> {
    try {
      const html = await this.fetchWithProxy(this.config.listUrl)
      const doc = this.parseHtml(html)
      
      const posts: CrawledPost[] = []
      
      // 클리앙 게시글 목록 파싱
      const postElements = doc.querySelectorAll('.list_row, .list_item, .board_list tr')
      
      postElements.forEach((element, index) => {
        if (index >= 10) return // 최대 10개만
        
        try {
          const titleElement = element.querySelector('a[href*="/service/board/park/"]')
          const title = titleElement?.textContent?.trim() || ''
          const url = titleElement?.getAttribute('href') || ''
          const viewsElement = element.querySelector('.list_count, .hit, .view_count')
          const views = viewsElement?.textContent?.trim() || '0'
          const timeElement = element.querySelector('.list_time, .time, .date')
          const time = timeElement?.textContent?.trim() || new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          
          if (title && url) {
            const fullUrl = url.startsWith('http') ? url : this.config.baseUrl + url
            const postId = this.generatePostId(this.config.siteCode, title, time)
            
            posts.push({
              id: postId,
              site: this.config.siteName,
              siteCode: this.config.siteCode,
              title,
              url: fullUrl,
              views,
              time,
              timestamp: Date.now()
            })
          }
        } catch (error) {
          console.warn('Error parsing post element:', error)
        }
      })
      
      return posts
    } catch (error) {
      console.error('Error crawling Clien posts:', error)
      return []
    }
  }

  async crawlPostContent(postUrl: string): Promise<string> {
    try {
      const html = await this.fetchWithProxy(postUrl)
      const doc = this.parseHtml(html)
      
      let contentElement: Element | null = null
      
      // 클리앙 본문 선택자로 찾기
      for (const selector of this.config.contentSelectors) {
        const element = doc.querySelector(selector)
        if (element) {
          const textLength = element.textContent?.length || 0
          if (textLength > 100) {
            contentElement = element
            break
          }
        }
      }
      
      if (!contentElement) {
        return '본문 내용을 찾을 수 없습니다.'
      }
      
      return this.cleanContent(contentElement)
    } catch (error) {
      console.error('Error crawling Clien post content:', error)
      return '본문 내용을 가져오는 중 오류가 발생했습니다.'
    }
  }
}
