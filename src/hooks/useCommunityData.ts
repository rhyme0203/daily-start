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
      // Vercel Functions API 호출
      const response = await fetch('https://vercel-crawler-lovat.vercel.app/api/community')
      
      if (response.ok) {
        const data = await response.json()
        setData({
          posts: data.posts,
          siteStats: data.siteStats,
          totalCount: data.posts.length,
          lastUpdated: data.lastUpdated
        })
        console.log('서버에서 커뮤니티 데이터 로드 완료')
      } else {
        throw new Error('서버에서 데이터를 가져올 수 없습니다.')
      }
    } catch (err) {
      setError('서버 연결 실패')
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
      // Vercel Functions API를 사용하여 게시글 본문 가져오기
      const response = await fetch(`https://vercel-crawler-lovat.vercel.app/api/post-content?url=${encodeURIComponent(postUrl)}`)
      
      if (response.ok) {
        const { content } = await response.json()
        setPostContent(prev => ({ ...prev, [postId]: content }))
        return content
      } else {
        throw new Error('Failed to fetch post content from server')
      }
    } catch (err) {
      console.error('Error fetching post content:', err)
      return '본문 내용을 가져오는 중 오류가 발생했습니다.'
    }
  }, [postContent])

  useEffect(() => {
    fetchCommunityData()
    const interval = setInterval(fetchCommunityData, 3600000) // 1시간마다 업데이트
    return () => clearInterval(interval)
  }, [fetchCommunityData])

  return { data, loading, error, refresh: fetchCommunityData, fetchPostContent }
}