import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  emoji: string;
}

interface NewsDataHook {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
  categories: NewsCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  fetchNews: () => void;
}

const ALL_CATEGORIES: NewsCategory[] = [
  { id: 'all', name: '전체', emoji: '🌐' },
  { id: 'politics', name: '정치', emoji: '🏛️' },
  { id: 'economy', name: '경제', emoji: '💰' },
  { id: 'society', name: '사회', emoji: '👥' },
  { id: 'international', name: '국제', emoji: '🌍' },
  { id: 'sports', name: '스포츠', emoji: '🏅' },
  { id: 'entertainment', name: '연예', emoji: '🎬' },
  { id: 'technology', name: '기술', emoji: '💻' },
  { id: 'health', name: '건강', emoji: '❤️' },
];

// 서버리스 함수를 통한 네이버 뉴스 API 호출
const fetchKoreanNews = async (category: string): Promise<NewsItem[]> => {
  try {
    console.log(`Fetching Naver news for category: ${category}`);
    
    // 카테고리별 검색어 매핑
    const searchKeywords = {
      'all': ['뉴스', '정치', '경제'],
      'politics': ['정치', '국정감사'],
      'economy': ['경제', '주식'],
      'sports': ['스포츠', '야구'],
      'technology': ['기술', 'IT'],
      'society': ['사회', '사건'],
      'international': ['국제', '미국'],
      'entertainment': ['연예', '드라마'],
      'health': ['건강', '의료']
    };

    const keywords = searchKeywords[category as keyof typeof searchKeywords] || searchKeywords['all'];
    const allNews: NewsItem[] = [];
    
    // 첫 번째 키워드로 네이버 API 호출
    const keyword = keywords[0];
    try {
      console.log(`Searching Naver news for: ${keyword}`);
      
      // 서버리스 함수 호출 (개발환경에서는 로컬, 프로덕션에서는 Netlify)
      const functionUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/naver-news'
        : '/.netlify/functions/naver-news';
      
      const response = await fetch(`${functionUrl}?keyword=${encodeURIComponent(keyword)}&display=10`);

      if (!response.ok) {
        console.error(`Serverless function error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log('Naver news data received:', data);

      if (data.items && data.items.length > 0) {
        const newsItems = data.items.map((item: any, index: number) => ({
          id: `naver_${category}_${keyword}_${index}_${Date.now()}`,
          category: category,
          title: item.title ? item.title.replace(/<[^>]*>/g, '') : '제목 없음',
          summary: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '내용 없음',
          source: item.originallink ? new URL(item.originallink).hostname : '네이버 뉴스',
          publishedAt: item.pubDate || new Date().toISOString(),
          url: item.originallink || item.link
        }));
        
        allNews.push(...newsItems);
        console.log(`Added ${newsItems.length} news items for keyword: ${keyword}`);
      } else {
        console.log(`No items found for keyword: ${keyword}`);
      }
    } catch (error) {
      console.error(`Failed to fetch Naver news for keyword ${keyword}:`, error);
      return [];
    }

    // 중복 제거 (제목 기준)
    const uniqueNews = allNews.filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title)
    );

    console.log(`Total unique news items fetched: ${uniqueNews.length}`);
    return uniqueNews.slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch Naver news:', error);
    return [];
  }
};

export const useNewsData = (initialCategoryId: string = 'all'): NewsDataHook => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 한국 뉴스만 가져오기 (캐시가 있으면 즉시 로딩 해제)
      const koreanNews = await fetchKoreanNews(selectedCategory);
      
      if (koreanNews.length > 0) {
        setNews(koreanNews);
        setLastUpdated(new Date());
      } else {
        setError('뉴스를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        setNews([]);
      }
    } catch (err) {
      console.error('한국 뉴스 가져오기 실패:', err);
      setError('뉴스를 불러오는 중 오류가 발생했습니다.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60 * 60 * 1000); // 1시간마다 업데이트
    return () => clearInterval(interval);
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    lastUpdated,
    categories: ALL_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    fetchNews,
  };
};