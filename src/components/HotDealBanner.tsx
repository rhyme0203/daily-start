import React, { useEffect } from 'react';
import './HotDealBanner.css';

// 쿠팡 파트너스 타입 정의
declare global {
  interface Window {
    PartnersCoupang?: {
      G: (config: any) => void;
    };
  }
}

const HotDealBanner: React.FC = () => {
  useEffect(() => {
    // 쿠팡 파트너스 스크립트 동적 로드 (에러 처리 포함)
    const loadCoupangScript = async () => {
      try {
        // 이미 스크립트가 로드되었는지 확인
        if (window.PartnersCoupang) {
          initializeWidget();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://ads-partners.coupang.com/g.js';
        script.async = true;
        script.onload = () => {
          console.log('쿠팡 파트너스 스크립트 로드 성공');
          initializeWidget();
        };
        script.onerror = () => {
          console.log('쿠팡 파트너스 스크립트 로드 실패 - 광고 차단기 또는 네트워크 문제');
          showFallbackContent();
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.log('쿠팡 파트너스 스크립트 로드 중 오류:', error);
        showFallbackContent();
      }
    };

    const initializeWidget = () => {
      try {
        if (window.PartnersCoupang && window.PartnersCoupang.G) {
          (window.PartnersCoupang.G as any)({
            "id": 933114,
            "template": "carousel",
            "trackingCode": "AF4548739",
            "width": "300",
            "height": "250",
            "tsource": ""
          });
        }
      } catch (error) {
        console.log('쿠팡 위젯 초기화 오류:', error);
        showFallbackContent();
      }
    };

    const showFallbackContent = () => {
      const widget = document.getElementById('coupang-widget');
      if (widget) {
        widget.innerHTML = `
          <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.8);">
            <div style="font-size: 24px; margin-bottom: 8px;">🛒</div>
            <div style="font-size: 14px; margin-bottom: 4px;">쿠팡 핫딜</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">
              광고 차단기를 해제하거나 새로고침해주세요
            </div>
          </div>
        `;
      }
    };

    loadCoupangScript();
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
