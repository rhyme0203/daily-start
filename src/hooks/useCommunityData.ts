import { useState, useEffect, useCallback } from 'react'

export interface CommunityPost {
  id: string
  site: string
  siteCode: string
  title: string
  url: string
  views: string
  time: string
  timestamp: number
}

export interface CommunityData {
  posts: CommunityPost[]
  siteStats: { [key: string]: number }
  totalCount: number
  lastUpdated: string
}

export const useCommunityData = () => {
  const [data, setData] = useState<CommunityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [postContent, setPostContent] = useState<{ [key: string]: string }>({})

  const fetchCommunityData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 여러 CORS 프록시를 시도
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://thingproxy.freeboard.io/fetch/',
        'https://corsproxy.io/?'
      ]
      
      let result = null
      let success = false
      
      for (const proxy of proxies) {
        try {
          const targetUrl = encodeURIComponent('http://www.moabbs.com/board/cboard')
          const response = await fetch(`${proxy}${targetUrl}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          
          if (response.ok) {
            if (proxy.includes('allorigins.win')) {
              const jsonResult = await response.json()
              result = { contents: jsonResult.contents }
            } else {
              result = { contents: await response.text() }
            }
            success = true
            break
          }
        } catch (err) {
          console.log(`Proxy ${proxy} failed, trying next...`)
          continue
        }
      }
      
      if (!success || !result) {
        throw new Error('All proxies failed')
      }
      
      if (result.contents) {
        // HTML 파싱을 위한 임시 DOM 생성
        const parser = new DOMParser()
        const doc = parser.parseFromString(result.contents, 'text/html')
        
        const posts: CommunityPost[] = []
        const siteStats: { [key: string]: number } = {}
        
        // 사이트별 한글명 매핑
        const siteNames: { [key: string]: string } = {
          'dogdrip': '개드립',
          'mlbpark': '엠팍',
          'ppomppu': '뽐뿌',
          'etoland': 'etoland',
          'humoruniv': '웃대',
          '82cook': '82cook',
          'ruliweb': '루리웹',
          'clien': '클리앙',
          'theqoo': '오유',
          'bobaedream': '보배',
          'dcinside': '딴지',
          'gasengi': '가생이'
        }
        
        // 테이블 행 파싱
        const rows = doc.querySelectorAll('table tr')
        rows.forEach((row, index) => {
          if (index === 0) return // 헤더 행 스킵
          
          const cells = row.querySelectorAll('td')
          if (cells.length >= 4) {
            const siteLink = cells[0]?.querySelector('a')?.getAttribute('href') || ''
            const titleLink = cells[1]?.querySelector('a')?.getAttribute('href') || ''
            const title = cells[1]?.querySelector('a')?.textContent?.trim() || ''
            const views = cells[2]?.textContent?.trim() || '0'
            const time = cells[3]?.textContent?.trim() || ''
            
            if (title && titleLink) {
              // 글번호 추출 (URL에서)
              let postId = ''
              const postIdMatch = titleLink.match(/(\d+)/);
              if (postIdMatch) {
                postId = postIdMatch[1];
              }
              
              // 사이트명 추출
              let siteName = '전체'
              if (siteLink) {
                const siteMatch = siteLink.match(/(?:www\.)?(\w+)\./)
                if (siteMatch) {
                  const siteCode = siteMatch[1]
                  siteName = siteNames[siteCode] || siteCode
                }
              }
              
              const post: CommunityPost = {
                id: postId || `${siteName}_${index}`,
                site: siteName,
                siteCode: siteName,
                title: title,
                url: titleLink.startsWith('http') ? titleLink : `http://www.moabbs.com${titleLink}`,
                views: views,
                time: time,
                timestamp: new Date().getTime() - (index * 60000)
              }
              
              posts.push(post)
              
              // 사이트별 통계
              if (!siteStats[siteName]) {
                siteStats[siteName] = 0
              }
              siteStats[siteName]++
            }
          }
        })
        
        // 최신 50개만 반환
        const latestPosts = posts.slice(0, 50)
        
        setData({
          posts: latestPosts,
          siteStats: siteStats,
          totalCount: latestPosts.length,
          lastUpdated: new Date().toISOString()
        })
      } else {
        setError('Failed to fetch community data')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Community data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPostContent = useCallback(async (postUrl: string, postId: string) => {
    // 이미 가져온 내용이 있으면 캐시에서 반환
    if (postContent[postId]) {
      return postContent[postId]
    }

    try {
      // 여러 CORS 프록시를 시도
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://thingproxy.freeboard.io/fetch/',
        'https://corsproxy.io/?'
      ]
      
      let result = null
      let success = false
      
      for (const proxy of proxies) {
        try {
          const targetUrl = encodeURIComponent(postUrl)
          const response = await fetch(`${proxy}${targetUrl}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          
          if (response.ok) {
            if (proxy.includes('allorigins.win')) {
              const jsonResult = await response.json()
              result = { contents: jsonResult.contents }
            } else {
              result = { contents: await response.text() }
            }
            success = true
            break
          }
        } catch (err) {
          console.log(`Proxy ${proxy} failed for post content, trying next...`)
          continue
        }
      }
      
      if (!success || !result) {
        throw new Error('All proxies failed for post content')
      }
      
      if (result.contents) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(result.contents, 'text/html')
        
        // 게시글 본문 추출 (사이트별로 다른 선택자 사용)
        let content = ''
        let contentElement: Element | null = null
        
        // 일반적인 게시글 본문 선택자들 (우선순위 순)
        const contentSelectors = [
          // 사이트별 특화 선택자들 (최우선)
          // 엠팍 - 정확한 선택자
          'div.ar_txt#contentDetail',
          '.ar_txt#contentDetail',
          'div.ar_txt',
          '#contentDetail',
          '.ar_txt',
          // 더 일반적인 선택자들
          'div[class*="content"]',
          'div[class*="text"]',
          'div[class*="article"]',
          'div[class*="post"]',
          'div[class*="view"]',
          'div[class*="board"]',
          'div[id*="content"]',
          'div[id*="text"]',
          'div[id*="article"]',
          'div[id*="post"]',
          'div[id*="view"]',
          'div[id*="board"]',
          // 더 구체적인 선택자들
          'div[class*="ar_"]',
          'div[class*="view_"]',
          'div[class*="post_"]',
          'div[class*="board_"]',
          'div[class*="article_"]',
          'div[class*="content_"]',
          'div[class*="text_"]',
          // XE 기반 사이트들
          'div[class*="rhymix"]',
          'div[class*="xe_"]',
          'div[class*="document_"]',
          'div[class*="content_"]',
          'div[class*="text_"]',
          // 테이블 셀 기반
          'td[class*="content"]',
          'td[class*="text"]',
          'td[class*="article"]',
          'td[class*="post"]',
          'td[class*="view"]',
          'td[class*="board"]',
          // 스팬 기반
          'span[class*="content"]',
          'span[class*="text"]',
          'span[class*="article"]',
          'span[class*="post"]',
          'span[class*="view"]',
          'span[class*="board"]',
          // 개드립 - 정확한 선택자
          'div[class*="document_"][class*="rhymix_content"][class*="xe_content"]',
          'div.rhymix_content.xe_content',
          '.rhymix_content.xe_content',
          // 개드립 일반 선택자
          '.rhymix_content',
          '.xe_content',
          '.document_664413061_0',
          '.post-content',
          '.post-text',
          '.content-text',
          // 뽐뿌
          '.view_content',
          '.view_text',
          // 클리앙
          '.post_view',
          '.post_content',
          // 오유
          '.article-content',
          '.article-text',
          // 82cook
          '.board-content',
          '.board-text',
          // 루리웹
          '.view-content',
          '.view-text',
          // 보배드림
          '.content',
          '.text',
          // 딴지일보
          '.article',
          '.post',
          // 가생이
          '.board',
          '.view',
          // 기본 본문 선택자들
          '.post-content',
          '.post-body', 
          '.content',
          '.article-content',
          '.board-content',
          '.view-content',
          '.post-view',
          '.article-body',
          '.entry-content',
          '.post-text',
          '.board-view-content',
          '.view_text',
          '.post_content',
          '.article_text',
          '.board_text',
          '.board_view_content',
          '.view_content',
          '.article_text_content',
          '.post_text_content',
          '.board_text_content',
          // 더 구체적인 선택자들
          '.board-view .content',
          '.post-view .content',
          '.article .content',
          '.view .content',
          '.board .content',
          '.post .content',
          // 테이블 기반 게시판
          '.board-view table td',
          '.post-view table td',
          '.view table td',
          // div 기반 게시판
          '.board-view div[class*="content"]',
          '.post-view div[class*="content"]',
          '.view div[class*="content"]',
          // ID 기반 선택자들
          '#content',
          '#post-content',
          '#article-content',
          '#board-content',
          '#view-content',
          // 더 넓은 범위 선택자들
          '.board-view',
          '.post-view',
          '.view',
          '.article',
          '.post',
          '.board'
        ]
        
        for (const selector of contentSelectors) {
          const element = doc.querySelector(selector)
          if (element) {
            const textLength = element.textContent?.length || 0
            const htmlLength = element.innerHTML?.length || 0
            console.log(`Found content with selector: ${selector}, text length: ${textLength}, html length: ${htmlLength}`)
            
            // 텍스트 길이가 충분한 경우만 선택 (조건 강화)
            if (textLength > 100) {
              contentElement = element
              console.log(`Selected content element: ${selector}`)
              console.log(`Content preview: ${element.textContent?.substring(0, 100)}...`)
              break
            }
          }
        }
        
        // 선택자로 찾지 못한 경우 더 넓은 범위에서 찾기
        if (!contentElement) {
          console.log('No content element found with specific selectors, trying fallback...')
          
          const fallbackSelectors = [
            'main',
            '.main-content',
            '.main_content',
            '.container',
            '.wrapper',
            'article',
            '.article',
            '.board-view',
            '.board_view',
            '.post-view',
            '.post_view'
          ]
          
          for (const selector of fallbackSelectors) {
            const element = doc.querySelector(selector)
            if (element) {
              console.log(`Found fallback element: ${selector}`)
              // 이 요소 내에서 본문 관련 하위 요소 찾기
              const subSelectors = [
                '.content', '.post-content', '.article-content', '.view-content', '.board-content',
                '.ar_txt', '#contentDetail', '.post-text', '.article-text', '.view-text',
                'div[class*="content"]', 'div[class*="text"]', 'div[class*="article"]'
              ]
              
              for (const subSelector of subSelectors) {
                const subElement = element.querySelector(subSelector)
                if (subElement) {
                  const textLength = subElement.textContent?.length || 0
                  console.log(`Found sub-element: ${subSelector}, text length: ${textLength}`)
                  if (textLength > 100) {
                    contentElement = subElement
                    console.log(`Selected fallback content element: ${subSelector}`)
                    break
                  }
                }
              }
              if (contentElement) break
            }
          }
        }
        
        // 여전히 찾지 못한 경우 모든 div 요소에서 가장 긴 텍스트 찾기
        if (!contentElement) {
          console.log('Still no content element found, searching all divs...')
          const allDivs = doc.querySelectorAll('div')
          let maxLength = 0
          let bestElement: Element | null = null
          
          allDivs.forEach((div, index) => {
            const textLength = div.textContent?.length || 0
            if (textLength > maxLength && textLength > 50) {
              // 불필요한 요소가 아닌지 확인
              const className = div.className || ''
              const id = div.id || ''
              const isUnwanted = className.includes('ad') || className.includes('banner') || 
                               className.includes('sidebar') || className.includes('menu') ||
                               className.includes('nav') || className.includes('header') ||
                               className.includes('footer') || className.includes('comment')
              
              if (!isUnwanted) {
                maxLength = textLength
                bestElement = div
                console.log(`Found potential content div ${index}: length ${textLength}, class: ${className}, id: ${id}`)
              }
            }
          })
          
          if (bestElement) {
            contentElement = bestElement
            console.log(`Selected best content element with length: ${maxLength}`)
          }
        }
        
        if (contentElement) {
          // 사이트별 필터링 적용
          const isEmpak = postUrl.includes('empak') || postUrl.includes('엠팍')
          
          if (isEmpak) {
            // 엠팍 전용 필터링 (tool_cont 제거 포함)
            const unwantedElements = contentElement.querySelectorAll(
              'script, style, nav, header, footer, .ad, .advertisement, .banner, .sidebar, .comment, .reply, .related, .recommend, .menu, .navigation, .header, .footer, .sidebar, .aside, .widget, .popup, .ads, .ad-banner, .advertisement, .sponsor, label, input, button, form, .login, .signup, .auth, .user, .member, .profile, .account, .settings, .config, .option, .checkbox, .radio, .select, .option, .keepid, .login-optn, .signup-optn, .favorite-text, .favorite, .bookmark, .like, .share, .social, .toolbar, .action, .btn, .button, .comment-list, .comment-item, .reply-list, .reply-item, .comment-area, .reply-area, .comment-box, .reply-box, .comment-section, .reply-section, .comment-container, .reply-container, .thumb, img, .image, .photo, .picture, .media, .gallery, .carousel, .slider, .tool_cont'
            )
            unwantedElements.forEach(el => el.remove())
          } else {
            // 다른 사이트용 필터링 (tool_cont 제외)
            const unwantedElements = contentElement.querySelectorAll(
              'script, style, nav, header, footer, .ad, .advertisement, .banner, .sidebar, .comment, .reply, .related, .recommend, .menu, .navigation, .header, .footer, .sidebar, .aside, .widget, .popup, .ads, .ad-banner, .advertisement, .sponsor, label, input, button, form, .login, .signup, .auth, .user, .member, .profile, .account, .settings, .config, .option, .checkbox, .radio, .select, .option, .keepid, .login-optn, .signup-optn, .favorite-text, .favorite, .bookmark, .like, .share, .social, .toolbar, .action, .btn, .button, .comment-list, .comment-item, .reply-list, .reply-item, .comment-area, .reply-area, .comment-box, .reply-box, .comment-section, .reply-section, .comment-container, .reply-container, .thumb, img, .image, .photo, .picture, .media, .gallery, .carousel, .slider'
            )
            unwantedElements.forEach(el => el.remove())
          }
          
          // 댓글 관련 요소들 추가 제거
          const commentElements = contentElement.querySelectorAll(
            'div[class*="comment"], div[class*="reply"], div[class*="댓글"], div[class*="답글"], div[id*="comment"], div[id*="reply"], div[id*="댓글"], div[id*="답글"]'
          )
          commentElements.forEach(el => el.remove())
          
          // 추가로 특정 텍스트가 포함된 요소들 제거
          const allElements = contentElement.querySelectorAll('*')
          allElements.forEach(el => {
            const text = el.textContent?.trim() || ''
            
            // 기본 불필요한 텍스트 (모든 사이트 공통)
            const commonUnwantedTexts = [
              '즐겨찾기', '로그인 상태 유지', '로그인', '회원가입', '로그아웃',
              '검색', '메뉴', '네비게이션', '사이드바', '광고', '추천',
              '댓글', '답글', '공유', '좋아요', '북마크', '팔로우',
              '설정', '계정', '프로필', '마이페이지', '관리자',
              '최근 전체', '최근 방문', '게시판', '글번호', 'IP',
              '가가 스크랩', '덴트스토리', '남성공업사', '마일레오토서비스',
              '동래부사', '공지', '필독', '담당자', '뉴스 저작물',
              '정치 말머리', '박찬호', '조회', '공지사항',
              '댓글달기', '댓글쓰기', '답글달기', '답글쓰기', '댓글보기',
              '댓글목록', '답글목록', '댓글수', '답글수', '댓글개수'
            ]
            
            // 엠팍 전용 불필요한 텍스트
            const empakUnwantedTexts = [
              ...commonUnwantedTexts,
              // 광고성 텍스트
              '스크랩 AD', '한화생명', 'e정기보험', '보험료', '사망보험',
              '이벤트', '네이버페이', '한화손해보험', '캐롯', '자동차보험',
              '운전자보험', '게임', '배틀넷', '성적', '승률', '홍진호',
              '박정석', '별명', '김서현', '나오나요', '므',
              // 이미지 관련 텍스트
              '박용우', '사망 보험금', '부당 취득', '의혹', '손해사정사',
              '넌센스', 'dimg.donga.com', 'IMAGE', 'SPORTS', 'wps',
              'thumb', 'alt=', 'src=', 'jpg', 'png', 'gif', 'webp',
              // tool_cont 관련 텍스트
              'tool_cont', '== $0', '👀', '조회수', '조회', '공감', '추천', '비추천'
            ]
            
            const unwantedTexts = isEmpak ? empakUnwantedTexts : commonUnwantedTexts
            
            // 광고성 텍스트가 포함된 경우 제거
            if (unwantedTexts.some(unwanted => text.includes(unwanted))) {
              if (isEmpak) {
                // 엠팍은 더 엄격하게 제거
                if (text.length < 200 || text.includes('AD') || text.includes('보험') || text.includes('이벤트') || text.includes('tool_cont')) {
                  el.remove()
                }
              } else {
                // 다른 사이트는 기본 제거
                if (text.length < 100) {
                  el.remove()
                }
              }
            }
          })
          
          // URL만 있는 요소들 제거 (광고 링크)
          const urlElements = contentElement.querySelectorAll('*')
          urlElements.forEach(el => {
            const text = el.textContent?.trim() || ''
            if (text.startsWith('http') && text.length < 200 && !text.includes(' ')) {
              el.remove()
            }
          })
          
          // 이미지 처리
          const images = contentElement.querySelectorAll('img')
          let imageHtml = ''
          images.forEach((img, index) => {
            const src = img.getAttribute('src')
            const alt = img.getAttribute('alt') || ''
            if (src) {
              // 상대 경로를 절대 경로로 변환
              const absoluteSrc = src.startsWith('http') ? src : new URL(src, postUrl).href
              imageHtml += `\n\n[이미지 ${index + 1}]\n${absoluteSrc}\n${alt}\n`
            }
          })
          
          // 텍스트 내용 추출 - 여러 방법 시도
          let textContent = ''
          
          // 1. innerHTML에서 텍스트만 추출
          if (contentElement.innerHTML) {
            const tempDiv = doc.createElement('div')
            tempDiv.innerHTML = contentElement.innerHTML
            textContent = tempDiv.textContent || tempDiv.innerText || ''
          }
          
          // 2. textContent 사용
          if (!textContent) {
            textContent = contentElement.textContent || (contentElement as HTMLElement).innerText || ''
          }
          
          // 3. 모든 하위 요소의 텍스트 수집
          if (!textContent || textContent.length < 50) {
            const allTexts: string[] = []
            const walker = doc.createTreeWalker(
              contentElement,
              NodeFilter.SHOW_TEXT,
              null
            )
            
            let node
            while (node = walker.nextNode()) {
              const text = node.textContent?.trim()
              if (text && text.length > 5) {
                allTexts.push(text)
              }
            }
            textContent = allTexts.join(' ')
          }
          
          content = textContent + imageHtml
          console.log(`Extracted content length: ${content.length}`)
        } else {
          // 마지막 수단: body에서 텍스트 추출
          const body = doc.querySelector('body')
          if (body) {
            // 광고나 불필요한 요소 제거
            const unwantedSelectors = [
              'script', 'style', 'nav', 'header', 'footer', 
              '.ad', '.advertisement', '.banner', '.sidebar',
              '.comment', '.reply', '.related', '.recommend',
              '.menu', '.navigation', '.header', '.footer',
              '.sidebar', '.aside', '.widget', '.popup'
            ]
            
            unwantedSelectors.forEach(selector => {
              const elements = body.querySelectorAll(selector)
              elements.forEach(el => el.remove())
            })
            
            content = body.textContent || (body as HTMLElement).innerText || ''
          }
        }
        
        // 내용 정리
        content = content
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim()
        
        // 캐시에 저장
        setPostContent(prev => ({
          ...prev,
          [postId]: content || '본문 내용을 가져올 수 없습니다.'
        }))
        
        return content || '본문 내용을 가져올 수 없습니다.'
      }
      
      return '본문 내용을 가져올 수 없습니다.'
    } catch (err) {
      console.error('Error fetching post content:', err)
      return '본문 내용을 가져오는 중 오류가 발생했습니다.'
    }
  }, [postContent])

  const refresh = useCallback(() => {
    fetchCommunityData()
  }, [fetchCommunityData])

  useEffect(() => {
    // 초기 로딩 지연
    const timeout = setTimeout(() => {
      fetchCommunityData()
    }, 1000)
    
    // 10분마다 자동 새로고침 (간격 늘림)
    const interval = setInterval(() => {
      setTimeout(fetchCommunityData, 2000) // 2초 지연 추가
    }, 10 * 60 * 1000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [fetchCommunityData])

  return {
    data,
    loading,
    error,
    refresh,
    fetchPostContent
  }
}