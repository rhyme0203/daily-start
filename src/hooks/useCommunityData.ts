import { useState, useEffect, useCallback } from 'react';

export interface CommunityPost {
  id: string;
  community: string;
  title: string;
  content: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
}

export interface Community {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface CommunityDataHook {
  posts: CommunityPost[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
  communities: Community[];
  selectedCommunity: string;
  setSelectedCommunity: (communityId: string) => void;
  fetchCommunityPosts: () => void;
}

const ALL_COMMUNITIES: Community[] = [
  { id: 'all', name: '전체', emoji: '🌐', color: '#667eea' },
  { id: 'fmkorea', name: '에펨코리아', emoji: '⚽', color: '#1e40af' },
  { id: 'instiz', name: '인스티즈', emoji: '🌟', color: '#9333ea' },
  { id: 'arcalive', name: '아카라이브', emoji: '📚', color: '#dc2626' },
  { id: 'mlbpark', name: '엠엘비파크', emoji: '⚾', color: '#ef4444' },
  { id: 'todayhumor', name: '오늘의유머', emoji: '😂', color: '#f59e0b' },
  { id: 'inven', name: '인벤', emoji: '🎮', color: '#10b981' },
  { id: 'humoruniv', name: '웃긴대학', emoji: '🤣', color: '#3b82f6' },
  { id: 'orbi', name: '오르비', emoji: '🎓', color: '#8b5cf6' },
];

const generateMockCommunityPosts = (communityId: string): CommunityPost[] => {
  const now = new Date();
  const mockPosts: CommunityPost[] = [
    // 에펨코리아 10개
    { id: 'f1', community: 'fmkorea', title: '손흥민, 리그 10호골 달성! 챔스 진출 청신호', content: '오늘 경기에서 손흥민 선수가 멋진 골을 터뜨리며 팀 승리에 기여했습니다.', author: '축구사랑', views: 12345, likes: 1234, comments: 123, publishedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString() },
    { id: 'f2', community: 'fmkorea', title: 'EPL 이적시장 루머 총정리 (feat. 김민재)', content: '이번 여름 이적시장 주요 루머들과 김민재 선수의 이적 가능성을 분석합니다.', author: '이적시장전문가', views: 10000, likes: 1000, comments: 100, publishedAt: new Date(now.getTime() - 35 * 60 * 1000).toISOString() },
    { id: 'f3', community: 'fmkorea', title: '토트넘 vs 맨시티 경기 분석', content: '오늘 밤 토트넘과 맨시티의 경기를 분석해봤습니다.', author: '축구분석가', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 55 * 60 * 1000).toISOString() },
    { id: 'f4', community: 'fmkorea', title: '한국 축구 국가대표 소집명단 발표', content: '다음 월드컵 예선을 위한 국가대표 소집명단이 발표되었습니다.', author: '국대팬', views: 15000, likes: 1500, comments: 150, publishedAt: new Date(now.getTime() - 75 * 60 * 1000).toISOString() },
    { id: 'f5', community: 'fmkorea', title: 'K리그 1 라운드 하이라이트', content: '이번 라운드 K리그 1 경기들의 하이라이트를 정리했습니다.', author: 'K리그매니아', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 95 * 60 * 1000).toISOString() },
    { id: 'f6', community: 'fmkorea', title: '유럽축구 챔피언스리그 조별리그', content: '챔피언스리그 조별리그 결과와 다음 경기 전망을 분석했습니다.', author: '챔스팬', views: 9876, likes: 987, comments: 98, publishedAt: new Date(now.getTime() - 115 * 60 * 1000).toISOString() },
    { id: 'f7', community: 'fmkorea', title: '세리에A 이적시장 동향', content: '이탈리아 세리에A의 이적시장 동향을 정리했습니다.', author: '세리에팬', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 135 * 60 * 1000).toISOString() },
    { id: 'f8', community: 'fmkorea', title: '분데스리가 신예 스카우팅', content: '독일 분데스리가의 유망한 신예 선수들을 소개합니다.', author: '분데스매니아', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 155 * 60 * 1000).toISOString() },
    { id: 'f9', community: 'fmkorea', title: '프리미어리그 라이벌 매치', content: '영국 프리미어리그의 전통적인 라이벌 매치들을 소개합니다.', author: 'EPL매니아', views: 11223, likes: 1122, comments: 112, publishedAt: new Date(now.getTime() - 175 * 60 * 1000).toISOString() },
    { id: 'f10', community: 'fmkorea', title: '축구 영상 분석 기술 발전', content: '최신 축구 영상 분석 기술과 그 활용에 대해 알아봅니다.', author: '축구테크', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 195 * 60 * 1000).toISOString() },
    
    // 인스티즈 10개
    { id: 'i1', community: 'instiz', title: '요즘 유행하는 MBTI 유형별 특징 정리', content: 'MBTI별 특징을 정리해봤어요! 여러분은 어떤 유형이신가요?', author: 'MBTI과몰입러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString() },
    { id: 'i2', community: 'instiz', title: '아이돌 팬덤 문화의 변화와 미래', content: '최근 아이돌 팬덤 문화의 변화 양상과 앞으로의 전망에 대해 이야기해봅시다.', author: '케이팝덕후', views: 7000, likes: 700, comments: 70, publishedAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString() },
    { id: 'i3', community: 'instiz', title: '2024년 아이돌 컴백 일정 정리', content: '올해 컴백 예정인 아이돌 그룹들의 일정을 정리해봤습니다.', author: '컴백기대러', views: 12345, likes: 1234, comments: 123, publishedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString() },
    { id: 'i4', community: 'instiz', title: 'K팝 해외 진출 성공 사례 분석', content: '해외에서 성공한 K팝 그룹들의 전략을 분석해봤습니다.', author: '글로벌팬', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 80 * 60 * 1000).toISOString() },
    { id: 'i5', community: 'instiz', title: '아이돌 스타일링 트렌드', content: '최근 아이돌들의 스타일링 트렌드를 분석해봤습니다.', author: '스타일링매니아', views: 9876, likes: 987, comments: 98, publishedAt: new Date(now.getTime() - 100 * 60 * 1000).toISOString() },
    { id: 'i6', community: 'instiz', title: '음악 프로그램 순위 변동', content: '이번 주 음악 프로그램 순위 변동을 정리했습니다.', author: '차트매니아', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 120 * 60 * 1000).toISOString() },
    { id: 'i7', community: 'instiz', title: '아이돌 댄스 챌린지 유행', content: '요즘 유행하는 아이돌 댄스 챌린지를 소개합니다.', author: '댄스매니아', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 140 * 60 * 1000).toISOString() },
    { id: 'i8', community: 'instiz', title: '팬사인회 후기 모음', content: '최근 팬사인회 참가 후기들을 모아봤습니다.', author: '팬사인러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 160 * 60 * 1000).toISOString() },
    { id: 'i9', community: 'instiz', title: '아이돌 소속사 분석', content: '각 아이돌 소속사들의 특징과 전략을 분석해봤습니다.', author: '기획사분석가', views: 11223, likes: 1122, comments: 112, publishedAt: new Date(now.getTime() - 180 * 60 * 1000).toISOString() },
    { id: 'i10', community: 'instiz', title: 'K팝 콘서트 티켓팅 팁', content: 'K팝 콘서트 티켓팅을 위한 유용한 팁들을 공유합니다.', author: '티켓팅고수', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 200 * 60 * 1000).toISOString() },
    
    // 아카라이브 10개
    { id: 'a1', community: 'arcalive', title: '새로운 웹소설 추천 받습니다 (장르 무관)', content: '요즘 볼만한 웹소설이 없네요. 재미있는 작품 추천해주세요!', author: '독서광', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString() },
    { id: 'a2', community: 'arcalive', title: '웹툰 결말에 대한 의견', content: '인기 웹툰의 결말에 대해 여러분의 의견을 들어보고 싶어요.', author: '웹툰독자', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString() },
    { id: 'a3', community: 'arcalive', title: '소설 속 주인공과 나', content: '소설 속 주인공과 자신을 비교해보는 시간을 가져봅시다.', author: '소설러버', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 65 * 60 * 1000).toISOString() },
    { id: 'a4', community: 'arcalive', title: '추천 도서 리스트', content: '이번 달 읽어볼 만한 도서들을 추천해드립니다.', author: '책벌레', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 85 * 60 * 1000).toISOString() },
    { id: 'a5', community: 'arcalive', title: '작가 인터뷰 모음', content: '인기 작가들의 인터뷰를 모아봤습니다.', author: '작가팬', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 105 * 60 * 1000).toISOString() },
    { id: 'a6', community: 'arcalive', title: '독서 모임 후기', content: '지역 독서 모임 참가 후기를 공유합니다.', author: '독서모임원', views: 3210, likes: 321, comments: 32, publishedAt: new Date(now.getTime() - 125 * 60 * 1000).toISOString() },
    { id: 'a7', community: 'arcalive', title: '문학 작품 해석', content: '고전 문학 작품의 해석에 대해 이야기해봅시다.', author: '문학청년', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 145 * 60 * 1000).toISOString() },
    { id: 'a8', community: 'arcalive', title: '책 표지 디자인', content: '마음에 드는 책 표지 디자인을 공유해주세요.', author: '디자인매니아', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 165 * 60 * 1000).toISOString() },
    { id: 'a9', community: 'arcalive', title: '독서 습관 만들기', content: '독서 습관을 만드는 방법에 대해 조언해주세요.', author: '습관만들기', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 185 * 60 * 1000).toISOString() },
    { id: 'a10', community: 'arcalive', title: '문학상 수상작 소개', content: '최근 문학상 수상작들을 소개해드립니다.', author: '문학상팬', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 205 * 60 * 1000).toISOString() },
    
    // 엠엘비파크 10개
    { id: 'm1', community: 'mlbpark', title: '류현진, 복귀전 호투! 한화 이글스 연승 가도', content: '류현진 선수가 성공적인 복귀전을 치르며 팀의 연승을 이끌었습니다.', author: '야구팬1', views: 15000, likes: 1500, comments: 150, publishedAt: new Date(now.getTime() - 12 * 60 * 1000).toISOString() },
    { id: 'm2', community: 'mlbpark', title: 'MLB 월드시리즈 경기 분석', content: '올해 MLB 월드시리즈 경기를 상세히 분석해봤습니다.', author: 'MLB매니아', views: 12345, likes: 1234, comments: 123, publishedAt: new Date(now.getTime() - 32 * 60 * 1000).toISOString() },
    { id: 'm3', community: 'mlbpark', title: 'KBO 리그 신인왕 후보', content: '올해 KBO 리그 신인왕 후보들을 분석해봤습니다.', author: '신인왕팬', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 52 * 60 * 1000).toISOString() },
    { id: 'm4', community: 'mlbpark', title: '야구장 음식 맛집', content: '전국 야구장 맛집들을 소개해드립니다.', author: '야구장맛집러', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 72 * 60 * 1000).toISOString() },
    { id: 'm5', community: 'mlbpark', title: '야구 용어 정리', content: '초보자를 위한 야구 용어를 정리해봤습니다.', author: '야구초보', views: 9876, likes: 987, comments: 98, publishedAt: new Date(now.getTime() - 92 * 60 * 1000).toISOString() },
    { id: 'm6', community: 'mlbpark', title: '야구 선수 인터뷰', content: '인기 야구 선수들의 인터뷰를 모아봤습니다.', author: '인터뷰러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 112 * 60 * 1000).toISOString() },
    { id: 'm7', community: 'mlbpark', title: '야구 통계 분석', content: '흥미로운 야구 통계들을 분석해봤습니다.', author: '통계매니아', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 132 * 60 * 1000).toISOString() },
    { id: 'm8', community: 'mlbpark', title: '야구장 투어 후기', content: '전국 야구장 투어 후기를 공유합니다.', author: '야구장투어러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 152 * 60 * 1000).toISOString() },
    { id: 'm9', community: 'mlbpark', title: '야구 역사 이야기', content: '야구 역사의 재미있는 이야기들을 소개합니다.', author: '야구역사팬', views: 11223, likes: 1122, comments: 112, publishedAt: new Date(now.getTime() - 172 * 60 * 1000).toISOString() },
    { id: 'm10', community: 'mlbpark', title: '야구 영상 모음', content: '인상적인 야구 영상들을 모아봤습니다.', author: '야구영상러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 192 * 60 * 1000).toISOString() },
    
    // 오늘의유머 10개
    { id: 't1', community: 'todayhumor', title: '직장인 공감 짤 모음.jpg', content: '월요일 아침부터 빵 터지는 직장인 공감 짤들 보고 가세요!', author: '유머1번지', views: 9876, likes: 987, comments: 98, publishedAt: new Date(now.getTime() - 18 * 60 * 1000).toISOString() },
    { id: 't2', community: 'todayhumor', title: '일상생활 웃긴 일화', content: '일상생활에서 겪은 웃긴 일화를 공유합니다.', author: '일상유머러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 38 * 60 * 1000).toISOString() },
    { id: 't3', community: 'todayhumor', title: '동물 유머 모음', content: '귀여운 동물들의 유머 영상을 모아봤습니다.', author: '동물사랑러', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 58 * 60 * 1000).toISOString() },
    { id: 't4', community: 'todayhumor', title: '아이 유머 영상', content: '아이들의 순수한 유머 영상들을 소개합니다.', author: '아이사랑러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 78 * 60 * 1000).toISOString() },
    { id: 't5', community: 'todayhumor', title: '직장인 짤방 모음', content: '직장인들이 공감할 만한 짤방들을 모아봤습니다.', author: '직장인짤러', views: 12345, likes: 1234, comments: 123, publishedAt: new Date(now.getTime() - 98 * 60 * 1000).toISOString() },
    { id: 't6', community: 'todayhumor', title: '요리 실패담', content: '요리 실패담을 공유해주세요.', author: '요리실패러', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 118 * 60 * 1000).toISOString() },
    { id: 't7', community: 'todayhumor', title: '운전 유머', content: '운전 중 겪은 유머러스한 상황을 공유합니다.', author: '운전유머러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 138 * 60 * 1000).toISOString() },
    { id: 't8', community: 'todayhumor', title: '학교 생활 유머', content: '학교 생활 중 겪은 재미있는 일들을 소개합니다.', author: '학교유머러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 158 * 60 * 1000).toISOString() },
    { id: 't9', community: 'todayhumor', title: '가족 유머', content: '가족과 함께한 유머러스한 순간들을 공유합니다.', author: '가족유머러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 178 * 60 * 1000).toISOString() },
    { id: 't10', community: 'todayhumor', title: '여행 유머', content: '여행 중 겪은 재미있는 상황들을 소개합니다.', author: '여행유머러', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 198 * 60 * 1000).toISOString() },
    
    // 인벤 10개
    { id: 'in1', community: 'inven', title: '롤 시즌14 정글 메타 분석 및 챔피언 티어 정리', content: '이번 시즌 정글 메타와 OP 챔피언들을 자세히 분석해봤습니다.', author: '게임고수', views: 11223, likes: 1122, comments: 112, publishedAt: new Date(now.getTime() - 22 * 60 * 1000).toISOString() },
    { id: 'in2', community: 'inven', title: '게임 그래픽 비교', content: '최신 게임들의 그래픽을 비교 분석해봤습니다.', author: '그래픽매니아', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 42 * 60 * 1000).toISOString() },
    { id: 'in3', community: 'inven', title: '게임 리뷰 모음', content: '최신 게임들의 리뷰를 모아봤습니다.', author: '게임리뷰어', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 62 * 60 * 1000).toISOString() },
    { id: 'in4', community: 'inven', title: '게임 하드웨어 추천', content: '게임에 최적화된 하드웨어를 추천해드립니다.', author: '하드웨어매니아', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 82 * 60 * 1000).toISOString() },
    { id: 'in5', community: 'inven', title: '게임 공략 가이드', content: '인기 게임들의 공략 가이드를 제공합니다.', author: '공략왕', views: 9876, likes: 987, comments: 98, publishedAt: new Date(now.getTime() - 102 * 60 * 1000).toISOString() },
    { id: 'in6', community: 'inven', title: '게임 소식 정리', content: '이번 주 게임 소식들을 정리해봤습니다.', author: '게임소식러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 122 * 60 * 1000).toISOString() },
    { id: 'in7', community: 'inven', title: '게임 커뮤니티 활동', content: '게임 커뮤니티 활동 후기를 공유합니다.', author: '커뮤니티러', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 142 * 60 * 1000).toISOString() },
    { id: 'in8', community: 'inven', title: '게임 이벤트 참여', content: '게임 이벤트 참여 후기를 공유합니다.', author: '이벤트러', views: 3210, likes: 321, comments: 32, publishedAt: new Date(now.getTime() - 162 * 60 * 1000).toISOString() },
    { id: 'in9', community: 'inven', title: '게임 개발 이야기', content: '게임 개발 과정에 대한 이야기를 나눕니다.', author: '개발자', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 182 * 60 * 1000).toISOString() },
    { id: 'in10', community: 'inven', title: '게임 문화 분석', content: '게임 문화의 변화와 트렌드를 분석해봤습니다.', author: '게임문화러', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 202 * 60 * 1000).toISOString() },
    
    // 웃긴대학 10개
    { id: 'h1', community: 'humoruniv', title: '레전드 썰) 소개팅에서 생긴 일', content: '친구의 소개팅 썰인데 진짜 웃겨서 가져왔어요 ㅋㅋㅋ', author: '웃대인', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 28 * 60 * 1000).toISOString() },
    { id: 'h2', community: 'humoruniv', title: '일상생활 웃긴 에피소드', content: '일상생활에서 겪은 웃긴 에피소드를 공유합니다.', author: '일상웃음러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 48 * 60 * 1000).toISOString() },
    { id: 'h3', community: 'humoruniv', title: '직장생활 유머', content: '직장생활에서 겪은 유머러스한 상황들을 소개합니다.', author: '직장유머러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 68 * 60 * 1000).toISOString() },
    { id: 'h4', community: 'humoruniv', title: '학교생활 웃긴 일화', content: '학교생활 중 겪은 웃긴 일화를 공유해주세요.', author: '학교웃음러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 88 * 60 * 1000).toISOString() },
    { id: 'h5', community: 'humoruniv', title: '가족과의 유머', content: '가족과 함께한 유머러스한 순간들을 소개합니다.', author: '가족웃음러', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 108 * 60 * 1000).toISOString() },
    { id: 'h6', community: 'humoruniv', title: '친구들과의 웃긴 추억', content: '친구들과 함께한 웃긴 추억을 공유합니다.', author: '친구웃음러', views: 3210, likes: 321, comments: 32, publishedAt: new Date(now.getTime() - 128 * 60 * 1000).toISOString() },
    { id: 'h7', community: 'humoruniv', title: '여행 중 웃긴 일', content: '여행 중 겪은 웃긴 일들을 소개합니다.', author: '여행웃음러', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 148 * 60 * 1000).toISOString() },
    { id: 'h8', community: 'humoruniv', title: '운동할 때 웃긴 상황', content: '운동할 때 겪은 웃긴 상황을 공유해주세요.', author: '운동웃음러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 168 * 60 * 1000).toISOString() },
    { id: 'h9', community: 'humoruniv', title: '요리하면서 생긴 웃긴 일', content: '요리하면서 생긴 웃긴 일들을 소개합니다.', author: '요리웃음러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 188 * 60 * 1000).toISOString() },
    { id: 'h10', community: 'humoruniv', title: '공부할 때 웃긴 에피소드', content: '공부할 때 겪은 웃긴 에피소드를 공유합니다.', author: '공부웃음러', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 208 * 60 * 1000).toISOString() },
    
    // 오르비 10개
    { id: 'o1', community: 'orbi', title: '수능 D-100, 효율적인 마무리 학습 전략', content: '수능 100일 남은 시점에서 가장 중요한 학습 전략을 공유합니다.', author: '공부의신', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString() },
    { id: 'o2', community: 'orbi', title: '대학 입시 정보 정리', content: '최신 대학 입시 정보를 정리해봤습니다.', author: '입시정보러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 50 * 60 * 1000).toISOString() },
    { id: 'o3', community: 'orbi', title: '학습 방법 공유', content: '효과적인 학습 방법을 공유해주세요.', author: '학습법매니아', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 70 * 60 * 1000).toISOString() },
    { id: 'o4', community: 'orbi', title: '시험 후기 모음', content: '최근 시험 후기들을 모아봤습니다.', author: '시험후기러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString() },
    { id: 'o5', community: 'orbi', title: '공부 동기부여', content: '공부 동기부여가 되는 이야기를 공유해주세요.', author: '동기부여러', views: 7654, likes: 765, comments: 76, publishedAt: new Date(now.getTime() - 110 * 60 * 1000).toISOString() },
    { id: 'o6', community: 'orbi', title: '시간 관리 팁', content: '효율적인 시간 관리 팁을 공유합니다.', author: '시간관리러', views: 6543, likes: 654, comments: 65, publishedAt: new Date(now.getTime() - 130 * 60 * 1000).toISOString() },
    { id: 'o7', community: 'orbi', title: '과목별 공부법', content: '각 과목별 공부법을 소개합니다.', author: '과목전문가', views: 5432, likes: 543, comments: 54, publishedAt: new Date(now.getTime() - 150 * 60 * 1000).toISOString() },
    { id: 'o8', community: 'orbi', title: '시험 스트레스 해소', content: '시험 스트레스를 해소하는 방법을 공유해주세요.', author: '스트레스해소러', views: 3210, likes: 321, comments: 32, publishedAt: new Date(now.getTime() - 170 * 60 * 1000).toISOString() },
    { id: 'o9', community: 'orbi', title: '대학 생활 정보', content: '대학 생활에 대한 유용한 정보를 공유합니다.', author: '대학생활러', views: 8765, likes: 876, comments: 87, publishedAt: new Date(now.getTime() - 190 * 60 * 1000).toISOString() },
    { id: 'o10', community: 'orbi', title: '진로 상담 후기', content: '진로 상담 후기를 공유해주세요.', author: '진로상담러', views: 4321, likes: 432, comments: 43, publishedAt: new Date(now.getTime() - 210 * 60 * 1000).toISOString() },
  ];

  if (communityId === 'all') {
    return mockPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 50);
  }
  return mockPosts
    .filter(post => post.community === communityId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);
};

export const useCommunityData = (initialCommunityId: string = 'all'): CommunityDataHook => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedCommunity, setSelectedCommunity] = useState<string>(initialCommunityId);

  const fetchCommunityPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 실제 API 호출 대신 모의 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      const fetchedPosts = generateMockCommunityPosts(selectedCommunity);
      setPosts(fetchedPosts);
      setLastUpdated(new Date());
    } catch (err) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCommunity]);

  useEffect(() => {
    fetchCommunityPosts();
    const interval = setInterval(fetchCommunityPosts, 60 * 60 * 1000); // 1시간마다 업데이트
    return () => clearInterval(interval);
  }, [fetchCommunityPosts]);

  return {
    posts,
    loading,
    error,
    lastUpdated,
    communities: ALL_COMMUNITIES,
    selectedCommunity,
    setSelectedCommunity,
    fetchCommunityPosts,
  };
};