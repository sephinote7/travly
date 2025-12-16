// src/hooks/useKakaoMap.js
import { useEffect, useRef } from 'react';

export function useKakaoMap(containerId) {
  const mapRef = useRef(null);

  useEffect(() => {
    const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (!KAKAO_JS_KEY) {
      console.error('⚠ Kakao JS key missing');
      return;
    }

    const initMap = () => {
      const tryInit = () => {
        const container = document.getElementById(containerId);

        // ❗ DOM이 아직 준비 안 됐으면 재시도
        if (!container) {
          setTimeout(tryInit, 100);
          return;
        }

        // ⭐ 지도 객체 생성
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 6,
        });

        mapRef.current = map;
      };

      tryInit();
    };

    // 스크립트 이미 로드됨
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    // 처음 로드되는 경우
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(initMap);
    };
    document.head.appendChild(script);
  }, [containerId]);

  return mapRef;
}
