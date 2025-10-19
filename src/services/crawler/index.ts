import { CrawledContent, CrawledPost, SiteCrawler } from './types'
import { ClienCrawler } from './siteCrawlers/clienCrawler'
import { Cook82Crawler } from './siteCrawlers/cook82Crawler'
import { EmpakCrawler } from './siteCrawlers/empakCrawler'
import { DdanziCrawler } from './siteCrawlers/ddanziCrawler'

export class CommunityCrawler {
  private crawlers: Map<string, SiteCrawler> = new Map()
  private cache: Map<string, { data: CrawledContent; timestamp: number }> = new Map()

  constructor() {
    // 크롤러 등록
    this.crawlers.set('clien', new ClienCrawler())
    this.crawlers.set('cook82', new Cook82Crawler())
    this.crawlers.set('empak', new EmpakCrawler())
    this.crawlers.set('ddanzi', new DdanziCrawler())
    // TODO: 나머지 사이트들 추가
    // this.crawlers.set('todayhumor', new TodayHumorCrawler())
    // this.crawlers.set('bobaedream', new BobaeDreamCrawler())
    // this.crawlers.set('instiz', new InstizCrawler())
  }

  async crawlAllSites(): Promise<CrawledContent> {
    const allPosts: CrawledPost[] = []
    const siteStats: { [key: string]: number } = {}

    const crawlPromises = Array.from(this.crawlers.entries()).map(async ([siteCode, crawler]) => {
      try {
        const posts = await crawler.crawlPosts()
        allPosts.push(...posts)
        siteStats[siteCode] = posts.length
        console.log(`${crawler.getConfig().siteName}: ${posts.length}개 게시글 크롤링 완료`)
      } catch (error) {
        console.error(`${siteCode} 크롤링 실패:`, error)
        siteStats[siteCode] = 0
      }
    })

    await Promise.all(crawlPromises)

    // 시간순으로 정렬 (최신순)
    allPosts.sort((a, b) => b.timestamp - a.timestamp)

    const result: CrawledContent = {
      posts: allPosts,
      siteStats,
      totalCount: allPosts.length,
      lastUpdated: new Date().toISOString()
    }

    // 캐시에 저장
    this.cache.set('all', { data: result, timestamp: Date.now() })

    return result
  }

  async crawlSingleSite(siteCode: string): Promise<CrawledPost[]> {
    const crawler = this.crawlers.get(siteCode)
    if (!crawler) {
      throw new Error(`Unknown site code: ${siteCode}`)
    }

    return await crawler.crawlPosts()
  }

  async crawlPostContent(siteCode: string, postUrl: string): Promise<string> {
    const crawler = this.crawlers.get(siteCode)
    if (!crawler) {
      throw new Error(`Unknown site code: ${siteCode}`)
    }

    return await crawler.crawlPostContent(postUrl)
  }

  getCachedData(): CrawledContent | null {
    const cached = this.cache.get('all')
    if (!cached) return null

    // 1시간(3600000ms) 이내 데이터만 유효
    if (Date.now() - cached.timestamp > 3600000) {
      this.cache.delete('all')
      return null
    }

    return cached.data
  }

  clearCache(): void {
    this.cache.clear()
  }

  getAvailableSites(): string[] {
    return Array.from(this.crawlers.keys())
  }

  getSiteConfig(siteCode: string) {
    const crawler = this.crawlers.get(siteCode)
    return crawler?.getConfig() || null
  }
}

// 싱글톤 인스턴스
export const communityCrawler = new CommunityCrawler()

// 자동 업데이트 (1시간마다)
setInterval(async () => {
  try {
    console.log('자동 크롤링 시작...')
    await communityCrawler.crawlAllSites()
    console.log('자동 크롤링 완료')
  } catch (error) {
    console.error('자동 크롤링 실패:', error)
  }
}, 60 * 60 * 1000) // 1시간

export * from './types'
