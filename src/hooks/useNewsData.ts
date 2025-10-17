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

// RSS를 통한 실제 뉴스 가져오기 (GitHub Pages용)
const fetchKoreanNews = async (category: string): Promise<NewsItem[]> => {
  try {
    console.log(`Fetching real Korean news for category: ${category}`);
    
    // 한국 주요 뉴스 RSS 피드들
    const rssFeeds = {
      'all': [
        'https://rss.cnn.com/rss/edition.rss',
        'https://feeds.bbci.co.uk/news/rss.xml',
        'https://rss.donga.com/total.xml',
        'https://rss.joins.com/joins_news_list.xml'
      ],
      'politics': [
        'https://rss.donga.com/politics.xml',
        'https://rss.joins.com/joins_politics_list.xml'
      ],
      'economy': [
        'https://rss.donga.com/economy.xml',
        'https://rss.joins.com/joins_economy_list.xml'
      ],
      'sports': [
        'https://rss.donga.com/sports.xml',
        'https://rss.joins.com/joins_sports_list.xml'
      ],
      'technology': [
        'https://rss.donga.com/tech.xml'
      ],
      'society': [
        'https://rss.donga.com/society.xml',
        'https://rss.joins.com/joins_society_list.xml'
      ],
      'international': [
        'https://rss.cnn.com/rss/edition_world.rss',
        'https://feeds.bbci.co.uk/news/world/rss.xml'
      ],
      'entertainment': [
        'https://rss.donga.com/culture.xml',
        'https://rss.joins.com/joins_culture_list.xml'
      ],
      'health': [
        'https://rss.donga.com/life.xml'
      ]
    };

    const feeds = rssFeeds[category as keyof typeof rssFeeds] || rssFeeds['all'];
    const allNews: NewsItem[] = [];
    
    // RSS 피드들을 병렬로 가져오기
    const promises = feeds.map(async (feedUrl, index) => {
      try {
        console.log(`Fetching RSS feed: ${feedUrl}`);
        
        // CORS 프록시를 통한 RSS 가져오기
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          console.error(`Failed to fetch RSS feed: ${feedUrl}`);
          return [];
        }
        
        const proxyData = await response.json();
        const xmlText = proxyData.contents;
        
        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        const newsItems: NewsItem[] = [];
        items.forEach((item, itemIndex) => {
          if (itemIndex >= 3) return; // 피드당 최대 3개
          
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          
          if (title && description) {
            newsItems.push({
              id: `rss_${category}_${index}_${itemIndex}_${Date.now()}`,
              category: category,
              title: title.replace(/<[^>]*>/g, ''),
              summary: description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
              source: new URL(link).hostname || 'RSS 뉴스',
              publishedAt: pubDate || new Date().toISOString(),
              url: link
            });
          }
        });
        
        console.log(`Added ${newsItems.length} news items from ${feedUrl}`);
        return newsItems;
      } catch (error) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, error);
        return [];
      }
    });
    
    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    });
    
    // 중복 제거 및 정렬
    const uniqueNews = allNews.filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title)
    );
    
    // 최신순 정렬
    uniqueNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    console.log(`Total unique news items fetched: ${uniqueNews.length}`);
    return uniqueNews.slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch Korean news:', error);
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