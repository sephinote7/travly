// src/pages/board/ModifyComp.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import WriteComp from './WriteComp';

export default function ModifyComp() {
  const { id } = useParams(); // /board/edit/:id 같은 라우트 가정
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ GET http://localhost:8080/api/travly/board/1
        const res = await apiClient.get(`/board/`);

        // ⚠️ 여기서 “백엔드 응답을 PlannerMap이 원하는 형태로 변환”
        const mapped = mapBoardToPlannerInitialData(res.data);

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

  // ✅ PlannerMap은 mode=edit + initialData면 타임라인 복원까지 다 해줌 :contentReference[oaicite:1]{index=1}
  return <WriteComp mode="edit" initialData={initialData} />;
}

// ===============================
// 변환 함수: 서버 응답 → PlannerMap initialData
// ===============================
function mapBoardToPlannerInitialData(board) {
  // 아래는 “너희 백엔드 응답 필드명”에 맞춰서 수정해야 해.
  // 핵심은 PlannerMap이 쓰는 키: { boardId, tripMeta, center, items } :contentReference[oaicite:2]{index=2}

  return {
    boardId: board.id,

    // 선택: 여행 메타(모달에서 쓰는 값). 서버에 저장/조회한다면 그대로 넣기
    tripMeta: board.tripMeta ?? null,

    // 선택: 지도 센터(없으면 생략 가능)
    center: board.center ?? null, // 예: { lat: 37.5, lng: 126.9 }

    // PlannerMap이 복원할 때 item.placeId, item.lat, item.lng, item.photos, item.title, item.text 등을 기대 :contentReference[oaicite:3]{index=3}
    items: (board.places || board.items || []).map((p, idx) => ({
      placeId: p.placeId ?? p.id, // 너희 응답에 맞게
      order: p.order ?? idx + 1,
      name: p.name ?? p.placeName,
      addr: p.addr ?? p.address,
      lat: p.lat ?? p.y,
      lng: p.lng ?? p.x,
      photos: p.photos ?? [],
      title: p.title ?? '',
      text: p.text ?? '',
    })),
  };
}
