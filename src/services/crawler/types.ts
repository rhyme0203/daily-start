export interface CrawledPost {
  id: string
  site: string
  siteCode: string
  title: string
  url: string
  views: string
  time: string
  timestamp: number
}

export interface CrawledContent {
  posts: CrawledPost[]
  siteStats: { [key: string]: number }
  totalCount: number
  lastUpdated: string
}

export interface CrawlerConfig {
  siteName: string
  siteCode: string
  baseUrl: string
  listUrl: string
  contentSelectors: string[]
  unwantedElements: string[]
  unwantedTexts: string[]
  updateInterval: number // minutes
}

export interface SiteCrawler {
  crawlPosts(): Promise<CrawledPost[]>
  crawlPostContent(postUrl: string): Promise<string>
  getConfig(): CrawlerConfig
}
