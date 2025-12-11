// src/utils/mapDrawingUtils.js

// 😆 CSS 한 번만 임포트해두면 route-marker 스타일을 쓸 수 있다.
import '../styles/markers.css';

// mapRef: useKakaoMap에서 받은 ref
// markersRef: 현재 지도에 표시된 마커들 저장용 ref (배열)
// polylineRef: 현재 표시된 polyline 저장용 ref
// markerColors: 마커 색상 배열
export function redrawMarkersAndPolyline(
  mapRef,
  placesArray,
  markersRef,
  polylineRef,
  markerColors
) {
  const { kakao } = window;
  if (!kakao || !mapRef.current) return placesArray;

  const map = mapRef.current;

  // 1) 기존 마커 전부 제거
  if (markersRef.current && markersRef.current.length > 0) {
    markersRef.current.forEach((marker) => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
  }
  markersRef.current = [];

  // 2) 기존 polyline 제거
  if (polylineRef.current && polylineRef.current.setMap) {
    polylineRef.current.setMap(null);
  }
  polylineRef.current = null;

  if (!placesArray || placesArray.length === 0) {
    return placesArray;
  }

  const path = [];

  // 3) 새 마커 + path 생성
  placesArray.forEach((p, idx) => {
    const order = idx + 1;

    // ⚠️ 여기 좌표는 프로젝트에서 사용하는 필드에 맞춰야 함
    // selectedPlaces에 lat / lng가 있으면 그대로, y/x면 그걸로 써야 한다.
    const lat = p.lat ?? p.y;
    const lng = p.lng ?? p.x;

    if (lat == null || lng == null) {
      return;
    }

    const pos = new kakao.maps.LatLng(lat, lng);
    const color = markerColors[(order - 1) % markerColors.length];

    // ====== DOM 기반 동그란 마커 (CSS 클래스 사용) ======
    const el = document.createElement('div');
    el.className = 'route-marker'; // ⭐ markers.css에서 스타일 지정
    el.innerText = String(order);

    // 각 마커마다 색만 다르게 주고 싶으면 이렇게 배경색만 JS에서 세팅
    el.style.backgroundColor = color;

    const overlay = new kakao.maps.CustomOverlay({
      position: pos,
      content: el,
      yAnchor: 1,
    });

    overlay.setMap(map);
    markersRef.current.push(overlay);

    path.push(pos);
  });

  // 4) polyline 그리기
  if (path.length >= 2) {
    const polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 4,
      strokeColor: '#ff5252',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);
    polylineRef.current = polyline;
  }

  return placesArray;
}
