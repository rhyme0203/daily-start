import { BaseCrawler } from '../baseCrawler'
import { CrawledPost, CrawlerConfig } from '../types'

export class EmpakCrawler extends BaseCrawler {
  constructor() {
    const config: CrawlerConfig = {
      siteName: '엠팍',
      siteCode: 'empak',
      baseUrl: 'https://mlbpark.donga.com',
      listUrl: 'https://mlbpark.donga.com/mp/b.php?b=bullpen',
      contentSelectors: [
        'div.ar_txt#contentDetail',
        '.ar_txt#contentDetail',
        'div.ar_txt',
        '#contentDetail',
        '.ar_txt'
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
        '.comment-container', '.reply-container', '.thumb', 'img', '.image',
        '.photo', '.picture', '.media', '.gallery', '.carousel', '.slider', '.tool_cont'
      ],
      unwantedTexts: [
        '스크랩 AD', '한화생명', 'e정기보험', '보험료', '사망보험',
        '이벤트', '네이버페이', '한화손해보험', '캐롯', '자동차보험',
        '운전자보험', '게임', '배틀넷', '성적', '승률', '홍진호',
        '박정석', '별명', '김서현', '나오나요', '므',
        '박용우', '사망 보험금', '부당 취득', '의혹', '손해사정사',
        '넌센스', 'dimg.donga.com', 'IMAGE', 'SPORTS', 'wps',
        'thumb', 'alt=', 'src=', 'jpg', 'png', 'gif', 'webp',
        'tool_cont', '== $0', '👀', '조회수', '조회', '공감', '추천', '비추천',
        '실시간무료누수상담', '백강누수', '백강누수탐지기술학원', '누수탐지', '무료상담',
        '이벤트법적', '하자보수기간', '인정업체', '연세고운미소치과의원', '분당점',
        '미금역7번출구', '월화수목야간진료', '교정', '임플란트', '사랑니', '예방',
        '일상', '일본 소도시', '외국인', '도와주려는', '일본녀', '안소현',
        '결혼적령기', '한국여자', '갑인거', '불편한팩트', '우정잉', '주식계좌',
        '근황', '공개', '레드제플린', '고민상담', '경희대', '외대', '시립대',
        '교류', '친한가요', '월류봉', '설윤', '한계가 있는', '얼굴이죠',
        '용왕', '축구', '짤방평점', '합리적인 이유', '가 가 스크랩',
        '09:54:', '14775104', '14775103', '14775102', '14775101', '14775100',
        'JPG', 'jpg', 'PNG', 'png', 'GIF', 'gif', 'WEBP', 'webp',
        '이미지', '사진', '그림', '첨부파일', '첨부', '파일'
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
      
      // 엠팍 게시글 목록 파싱
      const postElements = doc.querySelectorAll('.list_row, .list_item, .board_list tr, .list_table tr')
      
      postElements.forEach((element, index) => {
        if (index >= 10) return // 최대 10개만
        
        try {
          const titleElement = element.querySelector('a[href*="/mp/b.php"]')
          const title = titleElement?.textContent?.trim() || ''
          const url = titleElement?.getAttribute('href') || ''
          const viewsElement = element.querySelector('.hit, .view_count, .list_count')
          const views = viewsElement?.textContent?.trim() || '0'
          const timeElement = element.querySelector('.time, .date, .list_time')
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
      console.error('Error crawling Empak posts:', error)
      return []
    }
  }

  async crawlPostContent(postUrl: string): Promise<string> {
    try {
      const html = await this.fetchWithProxy(postUrl)
      const doc = this.parseHtml(html)
      
      let contentElement: Element | null = null
      
      // 엠팍은 div.ar_txt 영역만 선택 (tool_cont 등은 완전히 제외)
      const arTxtElement = doc.querySelector('div.ar_txt#contentDetail') || 
                          doc.querySelector('.ar_txt#contentDetail') || 
                          doc.querySelector('div.ar_txt') || 
                          doc.querySelector('#contentDetail') || 
                          doc.querySelector('.ar_txt')
      
      if (arTxtElement) {
        contentElement = arTxtElement
      }
      
      if (!contentElement) {
        return '본문 내용을 찾을 수 없습니다.'
      }
      
      return this.cleanContent(contentElement)
    } catch (error) {
      console.error('Error crawling Empak post content:', error)
      return '본문 내용을 가져오는 중 오류가 발생했습니다.'
    }
  }
}
