import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
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

const generateMockNews = (category: string): NewsItem[] => {
  const now = new Date();
  const mockNewsData: NewsItem[] = [
    // 정치 뉴스 10개
    { id: 'n1', category: 'politics', title: '여야, 총선 앞두고 정책 경쟁 심화', summary: '주요 정당들이 다가오는 총선을 앞두고 민생 정책을 쏟아내고 있습니다.', source: '연합뉴스', publishedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString() },
    { id: 'n2', category: 'politics', title: '정부, 저출산 대책 발표', summary: '정부가 심각한 저출산 문제 해결을 위해 파격적인 지원책을 내놓았습니다.', source: 'KBS뉴스', publishedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString() },
    { id: 'n3', category: 'politics', title: '국정감사 시작, 핵심 쟁점은?', summary: '국정감사가 시작되면서 주요 쟁점들이 부각되고 있습니다.', source: 'MBC뉴스', publishedAt: new Date(now.getTime() - 50 * 60 * 1000).toISOString() },
    { id: 'n4', category: 'politics', title: '여야 대표 회담, 협력 가능성 모색', summary: '여야 대표가 만나 협력 방안을 논의했습니다.', source: 'JTBC', publishedAt: new Date(now.getTime() - 70 * 60 * 1000).toISOString() },
    { id: 'n5', category: 'politics', title: '정치개혁 특별법 추진', summary: '정치개혁을 위한 특별법 제정이 추진되고 있습니다.', source: 'SBS뉴스', publishedAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString() },
    { id: 'n6', category: 'politics', title: '지방선거 준비 본격화', summary: '다음 해 지방선거를 위한 준비가 본격화되고 있습니다.', source: 'YTN', publishedAt: new Date(now.getTime() - 110 * 60 * 1000).toISOString() },
    { id: 'n7', category: 'politics', title: '국정원 개혁 논의', summary: '국정원 개혁에 대한 논의가 진행되고 있습니다.', source: '채널A', publishedAt: new Date(now.getTime() - 130 * 60 * 1000).toISOString() },
    { id: 'n8', category: 'politics', title: '정치자금법 개정 추진', summary: '정치자금법 개정이 추진되고 있습니다.', source: '뉴스1', publishedAt: new Date(now.getTime() - 150 * 60 * 1000).toISOString() },
    { id: 'n9', category: 'politics', title: '여성 정치 참여 확대 방안', summary: '여성의 정치 참여를 확대하기 위한 방안이 논의되고 있습니다.', source: '한겨레', publishedAt: new Date(now.getTime() - 170 * 60 * 1000).toISOString() },
    { id: 'n10', category: 'politics', title: '디지털 민주주의 실험', summary: '디지털 기술을 활용한 민주주의 실험이 진행되고 있습니다.', source: '경향신문', publishedAt: new Date(now.getTime() - 190 * 60 * 1000).toISOString() },
    
    // 경제 뉴스 10개
    { id: 'e1', category: 'economy', title: '기준금리 동결, 시장 영향은?', summary: '한국은행이 기준금리를 동결하면서 부동산 및 주식 시장의 반응에 관심이 쏠리고 있습니다.', source: '한국경제', publishedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString() },
    { id: 'e2', category: 'economy', title: '고유가 지속, 서민 경제 부담 가중', summary: '국제 유가가 고공행진을 이어가면서 서민들의 유류비 부담이 커지고 있습니다.', source: 'SBS뉴스', publishedAt: new Date(now.getTime() - 35 * 60 * 1000).toISOString() },
    { id: 'e3', category: 'economy', title: '주식시장 변동성 증가', summary: '글로벌 경제 불확실성으로 인해 주식시장의 변동성이 커지고 있습니다.', source: '매일경제', publishedAt: new Date(now.getTime() - 55 * 60 * 1000).toISOString() },
    { id: 'e4', category: 'economy', title: '부동산 시장 안정화 조짐', summary: '부동산 시장에 안정화 조짐이 나타나고 있습니다.', source: '부동산경제', publishedAt: new Date(now.getTime() - 75 * 60 * 1000).toISOString() },
    { id: 'e5', category: 'economy', title: '수출 증가세 지속', summary: '국내 수출이 증가세를 이어가고 있습니다.', source: '전자신문', publishedAt: new Date(now.getTime() - 95 * 60 * 1000).toISOString() },
    { id: 'e6', category: 'economy', title: '소비자물가 상승률 둔화', summary: '소비자물가 상승률이 둔화되고 있습니다.', source: '이데일리', publishedAt: new Date(now.getTime() - 115 * 60 * 1000).toISOString() },
    { id: 'e7', category: 'economy', title: '취업시장 개선 조짐', summary: '취업시장에 개선 조짐이 나타나고 있습니다.', source: '아주경제', publishedAt: new Date(now.getTime() - 135 * 60 * 1000).toISOString() },
    { id: 'e8', category: 'economy', title: '디지털 전환 가속화', summary: '기업들의 디지털 전환이 가속화되고 있습니다.', source: '디지털타임스', publishedAt: new Date(now.getTime() - 155 * 60 * 1000).toISOString() },
    { id: 'e9', category: 'economy', title: '친환경 투자 확대', summary: '친환경 투자가 확대되고 있습니다.', source: '환경일보', publishedAt: new Date(now.getTime() - 175 * 60 * 1000).toISOString() },
    { id: 'e10', category: 'economy', title: '스타트업 투자 활발', summary: '스타트업 투자가 활발해지고 있습니다.', source: '스타트업알리미', publishedAt: new Date(now.getTime() - 195 * 60 * 1000).toISOString() },
    
    // 사회 뉴스 10개
    { id: 's1', category: 'society', title: '1인 가구 증가, 사회 변화 가속화', summary: '통계청 발표에 따르면 1인 가구의 비중이 역대 최고치를 기록하며 사회 전반에 걸쳐 변화를 이끌고 있습니다.', source: '조선일보', publishedAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString() },
    { id: 's2', category: 'society', title: '청년 실업률 개선', summary: '청년 실업률이 개선되고 있습니다.', source: '동아일보', publishedAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString() },
    { id: 's3', category: 'society', title: '사회적 거리두기 완화', summary: '사회적 거리두기가 완화되고 있습니다.', source: '중앙일보', publishedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString() },
    { id: 's4', category: 'society', title: '디지털 격차 해소 노력', summary: '디지털 격차 해소를 위한 노력이 진행되고 있습니다.', source: '한국일보', publishedAt: new Date(now.getTime() - 80 * 60 * 1000).toISOString() },
    { id: 's5', category: 'society', title: '노인 복지 확충', summary: '노인 복지가 확충되고 있습니다.', source: '세계일보', publishedAt: new Date(now.getTime() - 100 * 60 * 1000).toISOString() },
    { id: 's6', category: 'society', title: '아동 보호 강화', summary: '아동 보호가 강화되고 있습니다.', source: '서울신문', publishedAt: new Date(now.getTime() - 120 * 60 * 1000).toISOString() },
    { id: 's7', category: 'society', title: '장애인 권리 향상', summary: '장애인의 권리가 향상되고 있습니다.', source: '국민일보', publishedAt: new Date(now.getTime() - 140 * 60 * 1000).toISOString() },
    { id: 's8', category: 'society', title: '다문화 가정 지원', summary: '다문화 가정에 대한 지원이 확대되고 있습니다.', source: '문화일보', publishedAt: new Date(now.getTime() - 160 * 60 * 1000).toISOString() },
    { id: 's9', category: 'society', title: '사회적 기업 성장', summary: '사회적 기업이 성장하고 있습니다.', source: '사회적경제신문', publishedAt: new Date(now.getTime() - 180 * 60 * 1000).toISOString() },
    { id: 's10', category: 'society', title: '지역사회 활성화', summary: '지역사회가 활성화되고 있습니다.', source: '지역신문', publishedAt: new Date(now.getTime() - 200 * 60 * 1000).toISOString() },
    
    // 국제 뉴스 10개
    { id: 'i1', category: 'international', title: '미중 무역 갈등, 새로운 국면 진입', summary: '미국과 중국 간의 무역 협상이 난항을 겪으면서 글로벌 경제 불확실성이 커지고 있습니다.', source: 'CNN', publishedAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString() },
    { id: 'i2', category: 'international', title: '유럽 연합 정책 변화', summary: '유럽 연합의 정책이 변화하고 있습니다.', source: 'BBC', publishedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString() },
    { id: 'i3', category: 'international', title: '일본 경제 회복 조짐', summary: '일본 경제에 회복 조짐이 나타나고 있습니다.', source: 'NHK', publishedAt: new Date(now.getTime() - 65 * 60 * 1000).toISOString() },
    { id: 'i4', category: 'international', title: '중동 정세 변화', summary: '중동 정세가 변화하고 있습니다.', source: '알자지라', publishedAt: new Date(now.getTime() - 85 * 60 * 1000).toISOString() },
    { id: 'i5', category: 'international', title: '아프리카 경제 성장', summary: '아프리카 경제가 성장하고 있습니다.', source: '아프리카뉴스', publishedAt: new Date(now.getTime() - 105 * 60 * 1000).toISOString() },
    { id: 'i6', category: 'international', title: '남미 정치 변화', summary: '남미 정치가 변화하고 있습니다.', source: '남미뉴스', publishedAt: new Date(now.getTime() - 125 * 60 * 1000).toISOString() },
    { id: 'i7', category: 'international', title: '동남아 경제 성장', summary: '동남아 경제가 성장하고 있습니다.', source: '동남아뉴스', publishedAt: new Date(now.getTime() - 145 * 60 * 1000).toISOString() },
    { id: 'i8', category: 'international', title: '북유럽 복지 모델', summary: '북유럽의 복지 모델이 주목받고 있습니다.', source: '북유럽뉴스', publishedAt: new Date(now.getTime() - 165 * 60 * 1000).toISOString() },
    { id: 'i9', category: 'international', title: '호주 자연재해', summary: '호주에서 자연재해가 발생했습니다.', source: '호주뉴스', publishedAt: new Date(now.getTime() - 185 * 60 * 1000).toISOString() },
    { id: 'i10', category: 'international', title: '캐나다 정책 변화', summary: '캐나다의 정책이 변화하고 있습니다.', source: '캐나다뉴스', publishedAt: new Date(now.getTime() - 205 * 60 * 1000).toISOString() },
    
    // 스포츠 뉴스 10개
    { id: 'sp1', category: 'sports', title: '손흥민, 리그 10호골 달성! 팀 승리 견인', summary: '토트넘의 손흥민 선수가 환상적인 골로 팀의 승리를 이끌며 시즌 10호골을 기록했습니다.', source: 'SPOTV', publishedAt: new Date(now.getTime() - 12 * 60 * 1000).toISOString() },
    { id: 'sp2', category: 'sports', title: '김민재, 바이에른 뮌헨 적응', summary: '김민재 선수가 바이에른 뮌헨에 적응하고 있습니다.', source: '스포츠조선', publishedAt: new Date(now.getTime() - 32 * 60 * 1000).toISOString() },
    { id: 'sp3', category: 'sports', title: '류현진, 복귀전 준비', summary: '류현진 선수가 복귀전을 준비하고 있습니다.', source: '스포츠동아', publishedAt: new Date(now.getTime() - 52 * 60 * 1000).toISOString() },
    { id: 'sp4', category: 'sports', title: '이강인, PSG 활약', summary: '이강인 선수가 PSG에서 활약하고 있습니다.', source: '스포츠서울', publishedAt: new Date(now.getTime() - 72 * 60 * 1000).toISOString() },
    { id: 'sp5', category: 'sports', title: 'K리그 챔피언십', summary: 'K리그 챔피언십이 진행되고 있습니다.', source: 'KBS스포츠', publishedAt: new Date(now.getTime() - 92 * 60 * 1000).toISOString() },
    { id: 'sp6', category: 'sports', title: '농구 KBL 리그', summary: '농구 KBL 리그가 진행되고 있습니다.', source: '농구신문', publishedAt: new Date(now.getTime() - 112 * 60 * 1000).toISOString() },
    { id: 'sp7', category: 'sports', title: '배구 V리그', summary: '배구 V리그가 진행되고 있습니다.', source: '배구신문', publishedAt: new Date(now.getTime() - 132 * 60 * 1000).toISOString() },
    { id: 'sp8', category: 'sports', title: '야구 MLB 시즌', summary: '야구 MLB 시즌이 진행되고 있습니다.', source: '야구신문', publishedAt: new Date(now.getTime() - 152 * 60 * 1000).toISOString() },
    { id: 'sp9', category: 'sports', title: '테니스 그랜드슬램', summary: '테니스 그랜드슬램이 진행되고 있습니다.', source: '테니스신문', publishedAt: new Date(now.getTime() - 172 * 60 * 1000).toISOString() },
    { id: 'sp10', category: 'sports', title: '골프 PGA 투어', summary: '골프 PGA 투어가 진행되고 있습니다.', source: '골프신문', publishedAt: new Date(now.getTime() - 192 * 60 * 1000).toISOString() },
    
    // 연예 뉴스 10개
    { id: 'en1', category: 'entertainment', title: '인기 아이돌 그룹, 새 앨범 차트 올킬', summary: '신곡을 발표한 인기 아이돌 그룹이 국내외 음원 차트를 석권하며 뜨거운 인기를 증명했습니다.', source: '디스패치', publishedAt: new Date(now.getTime() - 18 * 60 * 1000).toISOString() },
    { id: 'en2', category: 'entertainment', title: '드라마 시청률 경쟁', summary: '드라마 시청률 경쟁이 치열해지고 있습니다.', source: '텐아시아', publishedAt: new Date(now.getTime() - 38 * 60 * 1000).toISOString() },
    { id: 'en3', category: 'entertainment', title: '영화 박스오피스', summary: '영화 박스오피스가 공개되었습니다.', source: '무비스트', publishedAt: new Date(now.getTime() - 58 * 60 * 1000).toISOString() },
    { id: 'en4', category: 'entertainment', title: '예능 프로그램 인기', summary: '예능 프로그램이 인기를 끌고 있습니다.', source: '스타뉴스', publishedAt: new Date(now.getTime() - 78 * 60 * 1000).toISOString() },
    { id: 'en5', category: 'entertainment', title: 'K팝 해외 진출', summary: 'K팝의 해외 진출이 활발해지고 있습니다.', source: '엔터테인먼트뉴스', publishedAt: new Date(now.getTime() - 98 * 60 * 1000).toISOString() },
    { id: 'en6', category: 'entertainment', title: '연예인 결혼 소식', summary: '연예인의 결혼 소식이 전해졌습니다.', source: '스포츠경향', publishedAt: new Date(now.getTime() - 118 * 60 * 1000).toISOString() },
    { id: 'en7', category: 'entertainment', title: '뮤지컬 공연', summary: '뮤지컬 공연이 성황리에 진행되고 있습니다.', source: '뮤지컬뉴스', publishedAt: new Date(now.getTime() - 138 * 60 * 1000).toISOString() },
    { id: 'en8', category: 'entertainment', title: '방송가 변화', summary: '방송가에 변화가 일어나고 있습니다.', source: '방송신문', publishedAt: new Date(now.getTime() - 158 * 60 * 1000).toISOString() },
    { id: 'en9', category: 'entertainment', title: '웹툰 인기', summary: '웹툰이 인기를 끌고 있습니다.', source: '웹툰뉴스', publishedAt: new Date(now.getTime() - 178 * 60 * 1000).toISOString() },
    { id: 'en10', category: 'entertainment', title: '게임 산업 성장', summary: '게임 산업이 성장하고 있습니다.', source: '게임신문', publishedAt: new Date(now.getTime() - 198 * 60 * 1000).toISOString() },
    
    // 기술 뉴스 10개
    { id: 't1', category: 'technology', title: 'AI 반도체 경쟁 심화, 한국 기업의 전략은?', summary: '글로벌 AI 반도체 시장에서 주도권을 잡기 위한 경쟁이 치열해지면서 국내 기업들의 전략에 이목이 집중됩니다.', source: '전자신문', publishedAt: new Date(now.getTime() - 22 * 60 * 1000).toISOString() },
    { id: 't2', category: 'technology', title: '메타버스 기술 발전', summary: '메타버스 기술이 발전하고 있습니다.', source: 'IT조선', publishedAt: new Date(now.getTime() - 42 * 60 * 1000).toISOString() },
    { id: 't3', category: 'technology', title: '5G 네트워크 확산', summary: '5G 네트워크가 확산되고 있습니다.', source: '통신신문', publishedAt: new Date(now.getTime() - 62 * 60 * 1000).toISOString() },
    { id: 't4', category: 'technology', title: '자율주행 기술', summary: '자율주행 기술이 발전하고 있습니다.', source: '자동차신문', publishedAt: new Date(now.getTime() - 82 * 60 * 1000).toISOString() },
    { id: 't5', category: 'technology', title: '로봇 기술 혁신', summary: '로봇 기술이 혁신되고 있습니다.', source: '로봇신문', publishedAt: new Date(now.getTime() - 102 * 60 * 1000).toISOString() },
    { id: 't6', category: 'technology', title: '블록체인 활용', summary: '블록체인 활용이 확대되고 있습니다.', source: '블록체인뉴스', publishedAt: new Date(now.getTime() - 122 * 60 * 1000).toISOString() },
    { id: 't7', category: 'technology', title: '사이버보안 강화', summary: '사이버보안이 강화되고 있습니다.', source: '보안신문', publishedAt: new Date(now.getTime() - 142 * 60 * 1000).toISOString() },
    { id: 't8', category: 'technology', title: '클라우드 컴퓨팅', summary: '클라우드 컴퓨팅이 확산되고 있습니다.', source: '클라우드뉴스', publishedAt: new Date(now.getTime() - 162 * 60 * 1000).toISOString() },
    { id: 't9', category: 'technology', title: 'IoT 기술 발전', summary: 'IoT 기술이 발전하고 있습니다.', source: 'IoT뉴스', publishedAt: new Date(now.getTime() - 182 * 60 * 1000).toISOString() },
    { id: 't10', category: 'technology', title: '양자컴퓨팅 연구', summary: '양자컴퓨팅 연구가 진행되고 있습니다.', source: '양자뉴스', publishedAt: new Date(now.getTime() - 202 * 60 * 1000).toISOString() },
    
    // 건강 뉴스 10개
    { id: 'h1', category: 'health', title: '환절기 건강 관리, 면역력 강화가 중요', summary: '일교차가 큰 환절기를 맞아 면역력 강화를 위한 건강 관리법에 대한 관심이 높아지고 있습니다.', source: '헬스조선', publishedAt: new Date(now.getTime() - 28 * 60 * 1000).toISOString() },
    { id: 'h2', category: 'health', title: '코로나19 백신 접종', summary: '코로나19 백신 접종이 진행되고 있습니다.', source: '의료신문', publishedAt: new Date(now.getTime() - 48 * 60 * 1000).toISOString() },
    { id: 'h3', category: 'health', title: '정신건강 관리', summary: '정신건강 관리가 중요해지고 있습니다.', source: '정신건강신문', publishedAt: new Date(now.getTime() - 68 * 60 * 1000).toISOString() },
    { id: 'h4', category: 'health', title: '노화 방지 연구', summary: '노화 방지 연구가 진행되고 있습니다.', source: '노화연구소', publishedAt: new Date(now.getTime() - 88 * 60 * 1000).toISOString() },
    { id: 'h5', category: 'health', title: '운동의 중요성', summary: '운동의 중요성이 강조되고 있습니다.', source: '운동신문', publishedAt: new Date(now.getTime() - 108 * 60 * 1000).toISOString() },
    { id: 'h6', category: 'health', title: '영양 관리', summary: '영양 관리가 중요해지고 있습니다.', source: '영양신문', publishedAt: new Date(now.getTime() - 128 * 60 * 1000).toISOString() },
    { id: 'h7', category: 'health', title: '수면 건강', summary: '수면 건강이 중요해지고 있습니다.', source: '수면신문', publishedAt: new Date(now.getTime() - 148 * 60 * 1000).toISOString() },
    { id: 'h8', category: 'health', title: '스트레스 관리', summary: '스트레스 관리가 중요해지고 있습니다.', source: '스트레스신문', publishedAt: new Date(now.getTime() - 168 * 60 * 1000).toISOString() },
    { id: 'h9', category: 'health', title: '예방의학 발전', summary: '예방의학이 발전하고 있습니다.', source: '예방의학신문', publishedAt: new Date(now.getTime() - 188 * 60 * 1000).toISOString() },
    { id: 'h10', category: 'health', title: '디지털 헬스케어', summary: '디지털 헬스케어가 발전하고 있습니다.', source: '디지털헬스뉴스', publishedAt: new Date(now.getTime() - 208 * 60 * 1000).toISOString() },
  ];

  if (category === 'all') {
    return mockNewsData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 50);
  }
  return mockNewsData
    .filter(item => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);
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
      // 실제 API 호출 대신 모의 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      const fetchedNews = generateMockNews(selectedCategory);
      setNews(fetchedNews);
      setLastUpdated(new Date());
    } catch (err) {
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