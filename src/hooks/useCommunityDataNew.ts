import { useState, useEffect, useCallback } from 'react'
import { communityCrawler } from '../services/crawler'

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

export const useCommunityDataNew = () => {
  const [data, setData] = useState<CommunityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommunityData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 캐시된 데이터가 있으면 먼저 사용
      const cachedData = communityCrawler.getCachedData()
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        console.log('캐시된 데이터 사용')
      }

      // 백그라운드에서 최신 데이터 크롤링
      const crawledData = await communityCrawler.crawlAllSites()
      setData(crawledData)
      setLoading(false)
      console.log('새로운 데이터 크롤링 완료')
    } catch (error) {
      console.error('Error fetching community data:', error)
      setError('커뮤니티 데이터를 불러오는 중 오류가 발생했습니다.')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    communityCrawler.clearCache()
    fetchCommunityData()
  }, [fetchCommunityData])

  const fetchPostContent = useCallback(async (postUrl: string): Promise<string> => {
    try {
      // URL에서 사이트 코드 추출
      let siteCode = ''
      if (postUrl.includes('clien.net')) {
        siteCode = 'clien'
      } else if (postUrl.includes('82cook.com')) {
        siteCode = 'cook82'
      } else if (postUrl.includes('mlbpark.donga.com')) {
        siteCode = 'empak'
      } else if (postUrl.includes('dogdrip.net')) {
        siteCode = 'ddanzi'
      } else {
        throw new Error('Unknown site')
      }

      return await communityCrawler.crawlPostContent(siteCode, postUrl)
    } catch (error) {
      console.error('Error fetching post content:', error)
      return '본문 내용을 가져오는 중 오류가 발생했습니다.'
    }
  }, [])

  // 초기 데이터 로드
  useEffect(() => {
    fetchCommunityData()
  }, [fetchCommunityData])

  return {
    data,
    loading,
    error,
    refresh,
    fetchPostContent
  }
}
