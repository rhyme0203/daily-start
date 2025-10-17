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
    
    // 안정적인 한국 뉴스 RSS 피드들
    const rssFeeds = {
      'all': [
        'https://rss.donga.com/total.xml',
        'https://rss.hankookilbo.com/News.xml',
        'https://rss.chosun.com/rss/news.xml',
        'https://rss.mk.co.kr/rss/30000001.xml'
      ],
      'politics': [
        'https://rss.donga.com/politics.xml',
        'https://rss.hankookilbo.com/Politics.xml',
        'https://rss.chosun.com/rss/politics.xml'
      ],
      'economy': [
        'https://rss.donga.com/economy.xml',
        'https://rss.hankookilbo.com/Economy.xml',
        'https://rss.chosun.com/rss/economy.xml'
      ],
      'sports': [
        'https://rss.donga.com/sports.xml',
        'https://rss.hankookilbo.com/Sports.xml',
        'https://rss.chosun.com/rss/sports.xml'
      ],
      'technology': [
        'https://rss.donga.com/tech.xml',
        'https://rss.mk.co.kr/rss/30000004.xml'
      ],
      'society': [
        'https://rss.donga.com/society.xml',
        'https://rss.hankookilbo.com/Society.xml',
        'https://rss.chosun.com/rss/society.xml'
      ],
      'international': [
        'https://rss.donga.com/international.xml',
        'https://rss.hankookilbo.com/World.xml',
        'https://rss.chosun.com/rss/international.xml'
      ],
      'entertainment': [
        'https://rss.donga.com/culture.xml',
        'https://rss.hankookilbo.com/Culture.xml',
        'https://rss.chosun.com/rss/entertainment.xml'
      ],
      'health': [
        'https://rss.donga.com/life.xml',
        'https://rss.mk.co.kr/rss/30000005.xml'
      ]
    };

    const feeds = rssFeeds[category as keyof typeof rssFeeds] || rssFeeds['all'];
    const allNews: NewsItem[] = [];
    
    // RSS 피드들을 병렬로 가져오기
    const promises = feeds.map(async (feedUrl, index) => {
      try {
        console.log(`Fetching RSS feed: ${feedUrl}`);
        
        // CORS 프록시를 통한 RSS 가져오기 (여러 프록시 시도)
        const proxies = [
          `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
          `https://cors-anywhere.herokuapp.com/${feedUrl}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`
        ];
        
        let xmlText = '';
        let success = false;
        
        for (const proxyUrl of proxies) {
          try {
            console.log(`Trying proxy: ${proxyUrl}`);
            const response = await fetch(proxyUrl);
            
            if (response.ok) {
              if (proxyUrl.includes('allorigins.win')) {
                const proxyData = await response.json();
                xmlText = proxyData.contents;
              } else {
                xmlText = await response.text();
              }
              success = true;
              console.log(`Success with proxy: ${proxyUrl}`);
              break;
            }
          } catch (error) {
            console.log(`Proxy failed: ${proxyUrl}`, error);
            continue;
          }
        }
        
        if (!success) {
          console.error(`All proxies failed for RSS feed: ${feedUrl}`);
          return [];
        }
        
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