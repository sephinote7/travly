// src/pages/board/view/useKakaoBoardMap.js
import { useEffect } from 'react';
import { redrawMarkersAndPolyline } from '../../../utils/mapDrawingUtils';

export function useKakaoBoardMap({
  mapRef,
  places,
  markersRef,
  polylineRef,
  markerColors,
}) {
  useEffect(() => {
    if (!places?.length) return;

    let cancelled = false;
    let t = null;

    const draw = () => {
      if (cancelled) return;

      if (!mapRef.current || !window.kakao) {
        t = setTimeout(draw, 100);
        return;
      }

      redrawMarkersAndPolyline(
        mapRef,
        places,
        markersRef,
        polylineRef,
        markerColors
      );

      // 첫 장소로 센터
      const first = places[0];
      if (first?.y != null && first?.x != null) {
        const { kakao } = window;
        mapRef.current.setCenter(new kakao.maps.LatLng(first.y, first.x));
      }
    };

    draw();

    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, [mapRef, places, markersRef, polylineRef, markerColors]);
}
