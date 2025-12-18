// src/components/PlannerMap.jsx (지금 너 파일에 있는 PlannerMap 부분)
import { useState, useEffect, useRef } from "react";
import { useKakaoMap } from "../../hooks/useKakaoMap";
import { useTripPlanner } from "../../hooks/useTripPlanner";
import SearchPanel from "./components/SearchPanel";
import Timeline from "./components/Timeline";
import PlaceDetailPanel from "./components/PlaceDetailPanel";
import { fetchTourPlaceDetail } from "../../services/tourApiService";
import "../../styles/PlannerMap.css";
import TravelCategoryModal from "./components/TravelCategoryModal";

const TRIP_META_KEY = "travly.tripMeta";

function WriteComp({ mode = "write", initialData }) {
  // ✅ F5 유지: localStorage에서 tripMeta 복원

  const [tripMeta, setTripMeta] = useState(null);

  useEffect(() => {
    if (mode === "edit") return;

    // ✅ write는 페이지 진입 시 항상 빈 상태
    localStorage.removeItem(TRIP_META_KEY);
    setTripMeta(null);
    setShowIntroModal(true);
  }, [mode]);

  const [showIntroModal, setShowIntroModal] = useState(true);

  useEffect(() => {
    if (mode !== "edit") return;
    localStorage.removeItem(TRIP_META_KEY);
  }, [mode]);

  // ============================================
  // 1. 지도 / 플래너 훅
  // ============================================
  const mapRef = useKakaoMap("map");
  const planner = useTripPlanner(mapRef);

  // ============================================
  // 2. UI 상태
  // ============================================
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [expandedRouteId, setExpandedRouteId] = useState(null);

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

  const toggleTimeline = () => setIsTimelineOpen((prev) => !prev);

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
      alert("여행지는 최대 10개까지만 선택할 수 있어요!");
      return;
    }
    planner.handlePlaceSelect(activePlace);
  };

  const handleCloseDetail = () => {
    setActivePlace(null);
    setActiveDetail(null);
    setDetailError(null);
  };

  // ✅ ← 버튼: confirm + 강한 리셋 후 카테고리로
  const handleBackToCategory = () => {
    const ok = window.confirm("카테고리로 돌아가시겠습니까?");
    if (!ok) return;

    // 강한 리셋

    setShowIntroModal(true);
  };

  // ============================================
  // 4. TourAPI 상세 정보 불러오기
  // ============================================
  useEffect(() => {
    if (!activePlace || activePlace.source !== "tour") {
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
        if (!cancelled) setDetailError(err.message || "상세 조회 실패");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [activePlace]);

  // ============================================
  // 5. 수정 모드일 때 initialData 로 복원
  // ============================================
  // ✅ edit일 때 카테고리(tripMeta)는 planner 준비와 무관하게 먼저 세팅
  useEffect(() => {
    if (mode === "edit") {
      localStorage.removeItem(TRIP_META_KEY);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!initialData?.tripMeta) return;

    setTripMeta(initialData.tripMeta);
  }, [mode, initialData]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (showIntroModal) return;
    if (!planner || !planner.setSelectedPlaces) return;

    if (initialData.tripMeta) {
      // (선택) 수정 페이지에서 tripMeta도 유지하려면 저장해도 됨
      // localStorage.setItem(TRIP_META_KEY, JSON.stringify(initialData.tripMeta));
      // setShowIntroModal(false);
    }

    const restored = (initialData.items || []).map((item, idx) => {
      const routeId = `${item.placeId}-${idx}`;
      const d = initialData.drafts?.[routeId]; // ✅ 여기!

      return {
        id: item.placeId,
        routeId,
        order: item.order ?? idx + 1,
        name: item.name,
        addr: item.addr,
        lat: item.lat,
        lng: item.lng,
        photos: d?.photos ?? item.photos ?? [],
        title: d?.title ?? item.title ?? "",
        text: d?.text ?? item.text ?? "",
        source: "db",
      };
    });

    planner.restoreSelectedPlaces(restored);

    if (mapRef.current && window.kakao && initialData.center) {
      const { kakao } = window;
      const pos = new kakao.maps.LatLng(
        initialData.center.lat,
        initialData.center.lng
      );
      mapRef.current.setCenter(pos);
    }
  }, [mode, initialData, showIntroModal]);

  // ============================================
  // 7. 렌더링
  // ============================================
  return (
    <div className="planner-container">
      {/* ✅ 플래너 화면일 때만 ← 버튼 보여주기 */}
      {!showIntroModal && (
        <button
          type="button"
          className="tcm-global-back-btn"
          onClick={handleBackToCategory}
          style={{ position: "fixed", top: 12, left: 12, zIndex: 9999 }}
        >
          ←
        </button>
      )}

      {showIntroModal && (
        <TravelCategoryModal
          initialMeta={tripMeta}
          onNext={(meta) => {
            setTripMeta(meta);
            if (mode !== "edit") {
              localStorage.setItem(TRIP_META_KEY, JSON.stringify(meta));
            }
            setShowIntroModal(false);
          }}
          onClose={() => {
            // “닫기”를 허용할지 정책 선택:
            // 1) 아예 못 닫게: return;
            // 2) 닫으면 그냥 플래너로: setShowIntroModal(false);
            // 보통은 카테고리 필수라서 닫기 막는 게 안전.
            return;
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
          {isTimelineOpen ? "타임라인 닫기" : "타임라인 열기"}
        </button>

        <div
          className={`timeline-sidebar ${
            isTimelineOpen
              ? "timeline-sidebar--open"
              : "timeline-sidebar--closed"
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
            mode={mode === "edit" ? "edit" : "create"}
            boardId={initialData?.boardId}
            initialTripTitle={initialData?.tripTitle || ""}
            initialDrafts={initialData?.drafts || {}}
          />
        </div>
      </div>
    </div>
  );
}

export default WriteComp;
