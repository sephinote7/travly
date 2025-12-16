// src/pages/board/ModifyComp.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import WriteComp from './WriteComp';

export default function ModifyComp() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ 수정 페이지는 항상 서버 기준으로 다시 받는다 (places/타임라인 확실히 채우기)
        const [boardRes, selectedRes, allFiltersRes] = await Promise.all([
          apiClient.get(`/board/${id}`),
          apiClient.get(`/board/${id}/filter`),
          apiClient.get(`/filter`),
        ]);

        // 디버깅(필요 없으면 나중에 삭제)
        console.log('[modify] board:', boardRes?.data);
        console.log('[modify] selected(filter):', selectedRes?.data);
        console.log(
          '[modify] allFilters length:',
          Array.isArray(allFiltersRes?.data)
            ? allFiltersRes.data.length
            : allFiltersRes?.data
        );

        const selectedItemIds = extractSelectedItemIds(selectedRes.data);

        const tripMeta = buildTripMetaFromSelectedIds(
          selectedItemIds,
          allFiltersRes.data
        );

        const mapped = mapBoardToPlannerInitialData(boardRes.data, tripMeta);

        // 디버깅(필요 없으면 나중에 삭제)
        console.log('[modify] mapped.items length:', mapped.items?.length);
        console.log('[modify] mapped.tripMeta:', mapped.tripMeta);

        if (!cancelled) setInitialData(mapped);
      } catch (e) {
        if (!cancelled) setError(e?.message || '불러오기 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>로딩중...</div>;
  if (error) return <div style={{ padding: 16 }}>에러: {error}</div>;
  if (!initialData) return <div style={{ padding: 16 }}>데이터 없음</div>;

  return <WriteComp mode="edit" initialData={initialData} />;
}

/** /board/{id}/filter 응답에서 선택된 itemId 배열을 뽑아냄 */
function extractSelectedItemIds(payload) {
  if (!payload) return [];

  // ✅ 지금 네 응답은 [{ id, itemId, itemName }, ...]
  if (Array.isArray(payload)) {
    return payload
      .map((v) => {
        if (v == null) return null;
        if (typeof v === 'number') return v;
        if (typeof v === 'object') {
          // ⭐ 핵심: itemId 우선
          if (v.itemId != null) return v.itemId;
          // 예비: 다른 형태 대비
          if (v.filterItemId != null) return v.filterItemId;
          if (v.id != null) return v.id;
        }
        return null;
      })
      .filter((x) => x != null);
  }

  // 혹시 다른 형태면 예비 처리
  if (Array.isArray(payload.itemIds)) return payload.itemIds;
  if (Array.isArray(payload.filterItemIds)) return payload.filterItemIds;

  return [];
}

/**
 * 선택된 filterItemIds + 전체 /filter 정의로
 * 모달이 요구하는 tripMeta(withWhoIds, durationId, styleIds, filterItemIds) 생성
 */
function buildTripMetaFromSelectedIds(selectedItemIds, allFilters) {
  const withWhoIds = [];
  const styleIds = [];
  let durationId = null;

  if (!Array.isArray(allFilters)) {
    return { withWhoIds, durationId, styleIds, filterItemIds: selectedItemIds };
  }

  const withWhoFilter = allFilters.find(
    (f) => f?.id === 1 || f?.code === 'WITH_WHO'
  );
  const durationFilter = allFilters.find(
    (f) => f?.id === 2 || f?.code === 'DURATION'
  );
  const styleFilter = allFilters.find(
    (f) => f?.id === 3 || f?.code === 'STYLE'
  );

  const pickIds = (filter) =>
    (filter?.items ?? [])
      .map((item) => item?.id)
      .filter((itemId) => selectedItemIds.includes(itemId));

  withWhoIds.push(...pickIds(withWhoFilter));

  const pickedDuration = pickIds(durationFilter);
  durationId = pickedDuration.length ? pickedDuration[0] : null;

  styleIds.push(...pickIds(styleFilter));

  return {
    withWhoIds,
    durationId,
    styleIds,
    filterItemIds: selectedItemIds,
  };
}

// ===============================
// 변환 함수: 서버 응답 → WriteComp initialData
// ===============================
function mapBoardToPlannerInitialData(board, tripMeta) {
  const buildFileUrl = (filename) =>
    `http://localhost:8080/api/travly/file/${filename}`;

  const places = board.places || [];

  const drafts = {};
  const items = places.map((p, idx) => {
    const placeId = p.placeId ?? p.id;
    const routeId = `${placeId}-${idx}`;

    const fileLinks = (p.files || []).map((pf) => pf.file).filter(Boolean);
    const fileIds = fileLinks.map((f) => f.id).filter((v) => v != null);

    const photos = fileLinks
      .map((f) => f.filename)
      .filter(Boolean)
      .filter((name) => !name.startsWith('t_'))
      .map((name) => buildFileUrl(name))
      .slice(0, 5);

    drafts[routeId] = {
      photos,
      title: p.title ?? '',
      text: p.content ?? '',
      fileIds,
    };

    return {
      placeId,
      order: p.order ?? idx + 1,
      name: p.name ?? p.placeName ?? p.title ?? '',
      addr: p.addr ?? p.address ?? '',
      lat: p.lat ?? p.y,
      lng: p.lng ?? p.x,
      photos,
    };
  });

  return {
    boardId: board.id,
    tripTitle: board.title ?? '',
    tripMeta, // ✅ 카테고리 눌림용
    center: board.center ?? null,
    items, // ✅ 타임라인 복원용
    drafts, // ✅ 타임라인 카드 내용(사진/제목/글) 복원용
  };
}
