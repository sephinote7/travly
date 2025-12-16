// src/components/Timeline.jsx
import { useState, useEffect } from 'react';
import '../../../styles/Timeline.css';
import apiClient from '../../../services/apiClient';

function Timeline({
  selectedPlaces,
  totalDistance,
  draggingIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  expandedRouteId,
  onItemToggle,
  onClearAll,
  tripMeta, // 아직은 안 쓰지만 남겨둠
  mode = 'create', // 'create' | 'edit'
  initialTripTitle = '',
  initialDrafts = {}, // { [routeId]: { photos, title, text, fileIds } }
  boardId, // edit 모드일 때 필요
}) {
  // =========================
  // 1. 상태
  // =========================
  const [tripTitle, setTripTitle] = useState(initialTripTitle);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [savedMap, setSavedMap] = useState({});
  const [photoIndexMap, setPhotoIndexMap] = useState({});
  useEffect(() => {
    console.log('[Timeline] selectedPlaces length:', selectedPlaces?.length);
    console.log('[Timeline] first place:', selectedPlaces?.[0]);
  }, [selectedPlaces]);

  // 🔥 edit 모드에서 initial 값 동기화
  useEffect(() => {
    setTripTitle(initialTripTitle || '');
  }, [initialTripTitle]);

  useEffect(() => {
    setDrafts(initialDrafts || {});
  }, [initialDrafts]);

  const getRouteId = (p, idx) => {
    const baseId = p.placeId ?? p.id; // db 복원: placeId, 검색 추가: id
    return p.routeId || `${baseId}-${idx}`;
  };
  // =========================
  // 2. draft / 사진 관련 핸들러
  // =========================

  // 텍스트/제목 변경
  const handleDraftChange = (routeId, field, value) => {
    setDrafts((prev) => {
      const prevDraft = prev[routeId] || {
        photos: [],
        title: '',
        text: '',
        fileIds: [],
      };

      return {
        ...prev,
        [routeId]: {
          ...prevDraft,
          [field]: value,
        },
      };
    });
  };

  // 사진 업로드 (최대 5장)
  const handleFilesChange = async (routeId, fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, 5);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const res = await apiClient.post('/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedFiles = res.data || [];
      const newFileIds = uploadedFiles.map((f) => f.id);
      const newUrls = files.map((file) => URL.createObjectURL(file));

      setDrafts((prev) => {
        const prevDraft = prev[routeId] || {
          photos: [],
          title: '',
          text: '',
          fileIds: [],
        };

        const prevPhotos = prevDraft.photos || [];
        const prevFileIds = prevDraft.fileIds || [];

        const mergedPhotos = [...prevPhotos, ...newUrls].slice(0, 5);
        const mergedFileIds = [...prevFileIds, ...newFileIds].slice(0, 5);

        return {
          ...prev,
          [routeId]: {
            ...prevDraft,
            photos: mergedPhotos,
            fileIds: mergedFileIds,
          },
        };
      });

      setPhotoIndexMap((prev) => ({
        ...prev,
        [routeId]: 0,
      }));
    } catch (err) {
      console.error('사진 업로드 실패:', err);
      alert('사진 업로드 중 오류가 발생했습니다.');
    }
  };

  // 현재 보고 있는 사진 삭제
  const handleCurrentPhotoDelete = (routeId) => {
    setDrafts((prev) => {
      const prevDraft = prev[routeId] || {
        photos: [],
        title: '',
        text: '',
        fileIds: [],
      };

      const photos = prevDraft.photos || [];
      const fileIds = prevDraft.fileIds || [];
      const curIndex = photoIndexMap[routeId] ?? 0;

      if (photos.length === 0) return prev;

      const nextPhotos = photos.filter((_, i) => i !== curIndex);
      const nextFileIds = fileIds.filter((_, i) => i !== curIndex);

      const nextDraft = {
        ...prevDraft,
        photos: nextPhotos,
        fileIds: nextFileIds,
      };

      // 인덱스 정리
      setPhotoIndexMap((prevMap) => {
        const newLen = nextPhotos.length;
        if (newLen === 0) {
          return { ...prevMap, [routeId]: 0 };
        }
        const prevIdx = prevMap[routeId] ?? 0;
        const adjusted = Math.min(prevIdx, newLen - 1);
        return { ...prevMap, [routeId]: adjusted };
      });

      return {
        ...prev,
        [routeId]: nextDraft,
      };
    });
  };

  // 사진 인덱스 이동
  const changePhotoIndex = (routeId, nextIndex, total) => {
    if (total <= 0) return;
    const safeIndex =
      nextIndex < 0 ? 0 : nextIndex >= total ? total - 1 : nextIndex;

    setPhotoIndexMap((prev) => ({
      ...prev,
      [routeId]: safeIndex,
    }));
  };

  // 전체 취소 (작성/수정 분기)
  const handleCancelAll = () => {
    if (mode === 'edit') {
      setDrafts(initialDrafts);
      setTripTitle(initialTripTitle);
    } else {
      setDrafts({});
      setTripTitle('');
    }
    setSavedMap({});
    setPhotoIndexMap({});
  };

  // =========================
  // 3. 제출 (POST / PUT)
  // =========================
  const handleSubmitAll = async () => {
    if (!tripTitle.trim()) {
      alert('여행 제목을 입력하세요.');
      return;
    }

    const places = selectedPlaces.map((p, idx) => {
      const routeId = getRouteId(p, idx);
      const draft = drafts[routeId] || {};

      return {
        title: draft.title ?? '',
        content: draft.text ?? '',
        mapPlaceId: String(p.id ?? ''),
        externalId: String(p.id ?? ''),
        x: Number(p.lng ?? 0),
        y: Number(p.lat ?? 0),
        files: (draft.fileIds || []).map((id) => ({ fileId: id })),
      };
    });

    const payload = {
      title: tripTitle ?? '',
      memberId: 1,
      filterItemIds: tripMeta?.filterItemIds || [],
      places,
    };

    console.log('📌 서버 전송 payload:', payload);

    try {
      let res;
      if (mode === 'edit') {
        if (!boardId) {
          alert('boardId가 없습니다 (edit 모드).');
          return;
        }
        res = await apiClient.put(`/board/${boardId}`, payload);
        alert('수정 성공!');
      } else {
        res = await apiClient.post('/board', payload);
        alert('작성 완료!');
      }
      console.log('🟢 서버 응답:', res.data);
    } catch (err) {
      console.error('🔴 저장 실패:', err);
      alert('저장 실패!');
    }
  };

  // =========================
  // 4. 렌더링
  // =========================
  return (
    <div className="timeline-root">
      {/* 상단 제목 */}
      <div className="timeline-header">
        <h2 className="timeline-header-title">
          {mode === 'edit' ? '여행 계획 수정' : '나의 여행계획'}
        </h2>

        <div className="timeline-trip-title-row">
          <input
            type="text"
            className="timeline-trip-title-input"
            placeholder="여행 제목을 입력하세요"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
          />
        </div>
      </div>

      {/* 요약 박스 */}
      <section className="timeline-summary-box">
        <div className="timeline-summary-header">
          <h3 className="timeline-summary-title">경로 요약</h3>
        </div>

        <div className="timeline-summary">
          <div className="timeline-summary-left">
            총 <b>{selectedPlaces.length}</b>개 여행지
            <br />총 이동 거리:{' '}
            <b>{totalDistance ? totalDistance.toFixed(2) : 0} km</b>
          </div>

          <button
            type="button"
            className="timeline-summary-button"
            onClick={() => {
              if (
                onClearAll &&
                window.confirm('정말 전체 경로를 모두 삭제할까요?')
              ) {
                onClearAll();
              }
            }}
          >
            전체경로삭제
          </button>
        </div>
      </section>

      {/* 타임라인 카드 리스트 */}
      <div className="timeline-list-wrapper">
        {selectedPlaces.length === 0 && (
          <p className="timeline-empty">
            왼쪽에서 장소를 선택하면
            <br />
            여기 타임라인이 채워집니다.
          </p>
        )}

        {selectedPlaces.map((p, idx) => {
          const routeId = getRouteId(p, idx);
          const isExpanded = expandedRouteId === routeId;

          const draft = drafts[routeId] || {
            photos: [],
            title: '',
            text: '',
          };
          const photos = (draft.photos || []).slice(0, 5);
          const firstPhoto = photos[0] || null;
          const isSaved = !!savedMap[routeId];

          const currentIndex =
            photoIndexMap[routeId] != null ? photoIndexMap[routeId] : 0;
          const safeIndex =
            photos.length === 0
              ? 0
              : Math.min(Math.max(currentIndex, 0), photos.length - 1);
          const currentPhoto = photos[safeIndex] || null;

          const handleHeaderClick = () => {
            if (
              isExpanded &&
              (draft.text || draft.title || photos.length > 0)
            ) {
              setSavedMap((prev) => ({
                ...prev,
                [routeId]: true,
              }));
            }

            onItemToggle && onItemToggle(p);
          };

          return (
            <div key={getRouteId(p, idx)} className="timeline-card">
              <div
                className={
                  draggingIndex === idx
                    ? 'timeline-item timeline-item--dragging'
                    : 'timeline-item'
                }
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(idx)}
                onClick={handleHeaderClick}
              >
                <div className="timeline-item-left">
                  <span className="timeline-drag-handle">⋮⋮</span>
                  <div className="timeline-item-order">#{p.order}</div>

                  <div className="timeline-item-maintext">
                    <div className="timeline-item-name">{p.name}</div>
                    <div className="timeline-item-addr">{p.addr}</div>
                  </div>
                </div>

                <div className="timeline-item-right">
                  <div className="timeline-right-top">
                    {firstPhoto && (
                      <img
                        src={firstPhoto}
                        alt={p.name}
                        className="timeline-item-thumb"
                      />
                    )}
                    <button
                      type="button"
                      className="timeline-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(idx);
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {isSaved && (
                    <div className="timeline-right-status">
                      <span className="timeline-status-dot" />
                      <span className="timeline-status-text">작성됨</span>
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="timeline-editor">
                  {/* 사진 업로드 */}
                  <div className="timeline-photo-row">
                    <label className="timeline-photo-label-btn">
                      사진 등록
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleFilesChange(routeId, e.target.files)
                        }
                      />
                    </label>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      최대 5장까지 추가할 수 있어요.
                    </div>
                  </div>

                  {/* 사진 슬라이더 */}
                  {photos.length > 0 && (
                    <div className="timeline-photo-preview-slider">
                      <button
                        type="button"
                        className="timeline-photo-nav-btn"
                        disabled={safeIndex <= 0}
                        onClick={() =>
                          changePhotoIndex(
                            routeId,
                            safeIndex - 1,
                            photos.length
                          )
                        }
                      >
                        〈
                      </button>

                      <div className="timeline-photo-preview-main">
                        {currentPhoto && (
                          <img
                            src={currentPhoto}
                            alt={`${p.name} 사진 ${safeIndex + 1}`}
                            className="timeline-photo-preview-img"
                          />
                        )}
                        <div className="timeline-photo-preview-indicator">
                          {safeIndex + 1} / {photos.length}
                        </div>
                        <button
                          type="button"
                          className="timeline-photo-delete-btn"
                          onClick={() => handleCurrentPhotoDelete(routeId)}
                        >
                          현재 사진 삭제
                        </button>
                      </div>

                      <button
                        type="button"
                        className="timeline-photo-nav-btn"
                        disabled={safeIndex >= photos.length - 1}
                        onClick={() =>
                          changePhotoIndex(
                            routeId,
                            safeIndex + 1,
                            photos.length
                          )
                        }
                      >
                        〉
                      </button>
                    </div>
                  )}

                  {/* 장소 제목 */}
                  <div className="timeline-place-title-row">
                    <input
                      type="text"
                      className="timeline-place-title-input"
                      placeholder="이 장소에 대한 제목을 입력하세요"
                      value={draft.title}
                      onChange={(e) =>
                        handleDraftChange(routeId, 'title', e.target.value)
                      }
                    />
                  </div>

                  {/* 장소 설명 */}
                  <div className="timeline-textarea-wrap">
                    <textarea
                      className="timeline-textarea"
                      placeholder="이 장소에 대한 소개나 여행 계획을 작성해보세요."
                      value={draft.text}
                      onChange={(e) =>
                        handleDraftChange(routeId, 'text', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 버튼 */}
      <div className="timeline-footer">
        <button
          type="button"
          className="timeline-footer-btn"
          onClick={handleCancelAll}
        >
          취소
        </button>

        <button
          type="button"
          className="timeline-footer-btn timeline-footer-btn--primary"
          onClick={handleSubmitAll}
        >
          {mode === 'edit' ? '글 수정하기' : '글 작성하기'}
        </button>
      </div>
    </div>
  );
}

export default Timeline;
