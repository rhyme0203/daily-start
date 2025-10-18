const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // 모아봐 사이트에서 데이터 가져오기
    const response = await axios.get('http://www.moabbs.com/board/cboard', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const posts = [];

    // 게시글 파싱
    $('table tr').each((index, element) => {
      if (index === 0) return; // 헤더 행 스킵

      const $row = $(element);
      const siteLink = $row.find('td:first-child a').attr('href');
      const titleLink = $row.find('td:nth-child(2) a').attr('href');
      const title = $row.find('td:nth-child(2) a').text().trim();
      const views = $row.find('td:nth-child(3)').text().trim();
      const time = $row.find('td:nth-child(4)').text().trim();

      if (title && titleLink) {
        // 사이트명 추출
        let siteName = '전체';
        if (siteLink) {
          const siteMatch = siteLink.match(/(?:www\.)?(\w+)\./);
          if (siteMatch) {
            siteName = siteMatch[1];
          }
        }

        // 사이트별 한글명 매핑
        const siteNames = {
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
        };

        const koreanSiteName = siteNames[siteName] || siteName;

        posts.push({
          id: `${siteName}_${index}`,
          site: koreanSiteName,
          siteCode: siteName,
          title: title,
          url: titleLink.startsWith('http') ? titleLink : `http://www.moabbs.com${titleLink}`,
          views: views,
          time: time,
          timestamp: new Date().getTime() - (index * 60000) // 최신순으로 정렬을 위한 타임스탬프
        });
      }
    });

    // 최신 50개만 반환
    const latestPosts = posts.slice(0, 50);

    // 사이트별 통계
    const siteStats = {};
    latestPosts.forEach(post => {
      if (!siteStats[post.site]) {
        siteStats[post.site] = 0;
      }
      siteStats[post.site]++;
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        posts: latestPosts,
        siteStats: siteStats,
        totalCount: latestPosts.length,
        lastUpdated: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error fetching community data:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch community data',
        message: error.message
      }),
    };
  }
};
