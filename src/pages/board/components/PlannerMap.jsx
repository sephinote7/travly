// src/components/PlannerMap.jsx
import { useState, useEffect, useRef } from 'react';
import { useKakaoMap } from '../../../hooks/useKakaoMap';
import { useTripPlanner } from '../../../hooks/useTripPlanner';
import SearchPanel from './SearchPanel';
import Timeline from './Timeline';
import PlaceDetailPanel from './PlaceDetailPanel';
import { fetchTourPlaceDetail } from '../../../services/tourApiService';
import '../../../styles/PlannerMap.css';
import TravelCategoryModal from './TravelCategoryModal';

// ⭐ 지도 util: ViewComp와 동일한 마커/경로 그리기 기능

function PlannerMap({ mode = 'write', initialData }) {
  //0. 모달
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [tripMeta, setTripMeta] = useState(null);

  // ============================================
  // 1. 지도 / 플래너 훅
  // ============================================
  const mapRef = useKakaoMap('map');
  const planner = useTripPlanner(mapRef);

  // ============================================
  // 2. UI 상태
  // ============================================

  // 타임라인 열림/닫힘
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  // 타임라인에서 펼친 routeId
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  // 상세 패널 상태
  const [activePlace, setActivePlace] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // ============================================
  // 3. 핸들러들
  // ============================================

  const handleTimelineToggle = (place) => {
    setExpandedRouteId((prev) =>
      prev === place.routeId ? null : place.routeId
    );
  };

  const toggleTimeline = () => {
    setIsTimelineOpen((prev) => !prev);
  };

  const handleSearchResultClick = (place) => {
    setActivePlace(place);

    if (mapRef.current && window.kakao) {
      const { kakao } = window;
      const pos = new kakao.maps.LatLng(place.lat, place.lng);
      mapRef.current.setCenter(pos);
    }
  };

  const handleAddToTimeline = () => {
    if (!activePlace) return;

    if (planner.selectedPlaces.length >= 10) {
      alert('여행지는 최대 10개까지만 선택할 수 있어요!');
      return;
    }
    planner.handlePlaceSelect(activePlace);
  };

  const handleCloseDetail = () => {
    setActivePlace(null);
    setActiveDetail(null);
    setDetailError(null);
  };

  // ============================================
  // 4. TourAPI 상세 정보 불러오기
  // ============================================
  useEffect(() => {
    if (!activePlace || activePlace.source !== 'tour') {
      setActiveDetail(null);
      setDetailError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);

        const detail = await fetchTourPlaceDetail(
          activePlace.id,
          activePlace.contentTypeId
        );

        if (!cancelled) setActiveDetail(detail);
      } catch (err) {
        if (!cancelled) setDetailError(err.message || '상세 조회 실패');
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [activePlace]);

  // ============================================
  // 5. 수정 모드일 때 initialData 로 복원
  // ============================================
  useEffect(() => {
    if (mode !== 'edit') return;
    if (!initialData) return;
    if (!planner || !planner.setSelectedPlaces) return;

    if (initialData.tripMeta) {
      setTripMeta(initialData.tripMeta);
    }

    const restored = (initialData.items || []).map((item, idx) => ({
      id: item.placeId,
      routeId: `${item.placeId}-${idx}`,
      order: item.order ?? idx + 1,
      name: item.name,
      addr: item.addr,
      lat: item.lat,
      lng: item.lng,
      photos: item.photos || [],
      title: item.title || '',
      text: item.text || '',
      source: 'db',
    }));

    planner.setSelectedPlaces(restored);

    if (mapRef.current && window.kakao && initialData.center) {
      const { kakao } = window;
      const pos = new kakao.maps.LatLng(
        initialData.center.lat,
        initialData.center.lng
      );
      mapRef.current.setCenter(pos);
    }
  }, [mode, initialData, planner, mapRef]);

  // ============================================
  // 7. 렌더링
  // ============================================
  return (
    <div className="planner-container">
      {showIntroModal && (
        <TravelCategoryModal
          onNext={(meta) => {
            setTripMeta(meta);
            setShowIntroModal(false);
          }}
        />
      )}

      <SearchPanel
        regionKeyword={planner.regionKeyword}
        onRegionKeywordChange={planner.setRegionKeyword}
        onRegionSearch={planner.handleRegionSearch}
        category={planner.category}
        onCategoryChange={planner.handleCategoryChange}
        categories={planner.categories}
        center={planner.center}
        places={planner.places}
        onPlaceClick={handleSearchResultClick}
        page={planner.page}
        totalPages={planner.totalPages}
        onPageChange={planner.handlePageChange}
        selectedPlaces={planner.selectedPlaces}
        totalCount={planner.totalCount}
      />

      {activePlace && (
        <div className="detail-panel-wrapper">
          <PlaceDetailPanel
            place={activePlace}
            detail={activeDetail}
            loading={detailLoading}
            error={detailError}
            onClose={handleCloseDetail}
            onAddToTimeline={handleAddToTimeline}
          />
        </div>
      )}

      <div className="map-area">
        <div id="map" className="map-canvas" />

        <button
          type="button"
          className="timeline-toggle-btn"
          onClick={toggleTimeline}
        >
          {isTimelineOpen ? '타임라인 닫기' : '타임라인 열기'}
        </button>

        <div
          className={`timeline-sidebar ${
            isTimelineOpen
              ? 'timeline-sidebar--open'
              : 'timeline-sidebar--closed'
          }`}
        >
          <Timeline
            selectedPlaces={planner.selectedPlaces}
            totalDistance={planner.totalDistance}
            draggingIndex={planner.draggingIndex}
            onDragStart={planner.handleDragStart}
            onDragOver={planner.handleDragOver}
            onDrop={planner.handleDrop}
            onRemove={planner.handleRemovePlace}
            expandedRouteId={expandedRouteId}
            onItemToggle={handleTimelineToggle}
            onClearAll={() => {
              planner.handleClearAll();
              setExpandedRouteId(null);
            }}
            tripMeta={tripMeta}
            mode={mode === 'edit' ? 'edit' : 'create'}
            boardId={initialData?.boardId}
          />
        </div>
      </div>
    </div>
  );
}

export default PlannerMap;
