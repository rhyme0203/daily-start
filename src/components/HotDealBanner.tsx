import React, { useEffect } from 'react';
import './HotDealBanner.css';

const HotDealBanner: React.FC = () => {
  useEffect(() => {
    // 쿠팡 파트너스 스크립트 동적 로드
    const script1 = document.createElement('script');
    script1.src = 'https://ads-partners.coupang.com/g.js';
    script1.async = true;
    document.head.appendChild(script1);

    // 파트너스 위젯 초기화
    const script2 = document.createElement('script');
    script2.textContent = `
      new PartnersCoupang.G({
        "id": 933114,
        "template": "carousel",
        "trackingCode": "AF4548739",
        "width": "300",
        "height": "250",
        "tsource": ""
      });
    `;
    document.head.appendChild(script2);

    // 컴포넌트 언마운트 시 스크립트 정리
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return (
    <div className="hotdeal-banner">
      <div className="banner-header">
        <span className="banner-icon">🔥</span>
        <span className="banner-title">오늘의 핫딜</span>
        <span className="banner-subtitle">쿠팡 파트너스</span>
      </div>
      <div className="banner-content">
        <div id="coupang-widget" className="coupang-widget">
          {/* 쿠팡 파트너스 위젯이 여기에 렌더링됩니다 */}
        </div>
      </div>
      <div className="banner-footer">
        <span className="banner-note">💡 광고를 통해 소정의 수수료를 받을 수 있습니다</span>
      </div>
    </div>
  );
};

export default HotDealBanner;
