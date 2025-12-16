import React from 'react';

function ModifyComp() {
  return <div>ModifyComp</div>;
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

export default ModifyComp;
