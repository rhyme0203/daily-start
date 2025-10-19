import { CrawledPost, CrawlerConfig, SiteCrawler } from './types'

export abstract class BaseCrawler implements SiteCrawler {
  protected config: CrawlerConfig

  constructor(config: CrawlerConfig) {
    this.config = config
  }

  abstract crawlPosts(): Promise<CrawledPost[]>
  abstract crawlPostContent(postUrl: string): Promise<string>

  getConfig(): CrawlerConfig {
    return this.config
  }

  protected async fetchWithProxy(url: string): Promise<string> {
    const proxies = [
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/',
      'https://corsproxy.io/?'
    ]

    for (const proxy of proxies) {
      try {
        const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.contents || data
        }
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error)
        continue
      }
    }
    
    throw new Error('All proxies failed')
  }

  protected parseHtml(html: string): Document {
    const parser = new DOMParser()
    return parser.parseFromString(html, 'text/html')
  }

  protected cleanContent(contentElement: Element): string {
    // 사이트별 불필요한 요소 제거
    const unwantedElements = contentElement.querySelectorAll(this.config.unwantedElements.join(', '))
    unwantedElements.forEach(el => el.remove())

    // 불필요한 텍스트 제거
    const allElements = contentElement.querySelectorAll('*')
    allElements.forEach(el => {
      const text = el.textContent?.trim() || ''
      if (this.config.unwantedTexts.some(unwanted => text.includes(unwanted))) {
        if (text.length < 100) {
          el.remove()
        }
      }
    })

    // 이미지 처리
    const images = contentElement.querySelectorAll('img')
    let imageHtml = ''
    images.forEach((img, index) => {
      const src = img.getAttribute('src')
      const alt = img.getAttribute('alt') || ''
      if (src) {
        let absoluteSrc = src
        if (src.startsWith('//')) {
          absoluteSrc = 'https:' + src
        } else if (src.startsWith('/')) {
          absoluteSrc = this.config.baseUrl + src
        } else if (!src.startsWith('http')) {
          absoluteSrc = this.config.baseUrl + '/' + src
        }
        imageHtml += `\n\n[이미지 ${index + 1}]\n${absoluteSrc}\n${alt}\n`
      }
    })

    // 텍스트 추출
    const textContent = contentElement.textContent || ''
    return textContent + imageHtml
  }

  protected generatePostId(siteCode: string, title: string, time: string): string {
    return `${siteCode}_${btoa(title + time).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`
  }
}
