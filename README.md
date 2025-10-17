# Daily Start Mobile

모바일 우선 일일 스타트 페이지 애플리케이션

## 기능

- 🌤️ 날씨 정보 및 AI 활동 추천
- 🔮 개인화된 운세 분석
- 📰 실시간 뉴스 (네이버 API 연동)
- 💬 커뮤니티 게시글 모음
- 🎁 리워드 시스템

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 배포
npm run deploy
```

## 환경변수 설정

네이버 뉴스 API를 사용하려면 Netlify에서 환경변수를 설정해야 합니다:

### Netlify 환경변수 설정

1. Netlify 대시보드에서 프로젝트 선택
2. Site settings > Environment variables
3. 다음 환경변수 추가:

```
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 네이버 API 키 발급 방법

1. [네이버 개발자 센터](https://developers.naver.com) 방문
2. 애플리케이션 등록
3. 검색 API 활성화
4. 클라이언트 ID와 시크릿 발급
5. 웹 서비스 URL: `https://your-site.netlify.app`

### 서버리스 함수

이 프로젝트는 Netlify Functions를 사용하여 네이버 API를 호출합니다:
- `netlify/functions/naver-news.js`: 네이버 뉴스 API 프록시 함수
- CORS 문제 해결
- API 키 보안 유지

## 기술 스택

- React 18
- TypeScript
- Vite
- CSS Modules
- 네이버 뉴스 검색 API

## 배포

GitHub Pages를 통해 자동 배포됩니다.

## 버전

현재 버전: ver0.40
