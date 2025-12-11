// src/pages/board/ViewComp.jsx
import { useState, useEffect, useRef } from 'react';
import '../../styles/ViewComp.css';
import apiClient from '../../services/apiClient';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { redrawMarkersAndPolyline } from '../../utils/mapDrawingUtils';

// 🔥 마커 색상들 (원하는 대로 바꿔도 됨)
const MARKER_COLORS = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#6366f1'];

// 🔧 백엔드 응답(JSON) -> ViewComp에서 쓰기 좋은 형태로 변환
function mapBoardApiToViewModel(apiBoard) {
  const createdDate = apiBoard.createdAt ? new Date(apiBoard.createdAt) : null;

  const createdAtStr = createdDate
    ? `${createdDate.getFullYear()}. ${String(
        createdDate.getMonth() + 1
      ).padStart(2, '0')}. ${String(createdDate.getDate()).padStart(2, '0')}`
    : '';

  const viewCount = apiBoard.viewCount ?? 0;

  // ⭐ 파일 URL 생성 규칙 (서버 규칙에 맞게 수정 가능)
  const buildFileUrl = (filename) =>
    `http://localhost:8080/api/travly/file/${filename}`;

  return {
    id: apiBoard.id,
    title: apiBoard.title,
    placeCount: apiBoard.places ? apiBoard.places.length : 0,
    createdAt: `${createdAtStr} · 조회 ${viewCount}`,
    writer: {
      profileImageUrl: apiBoard.member?.profileImage
        ? buildFileUrl(apiBoard.member.profileImage)
        : 'https://via.placeholder.com/40x40.png?text=U',
      nickname: apiBoard.member?.nickname || '알 수 없음',
      level: 1,
    },
    places:
      apiBoard.places?.map((p) => {
        const allFiles = p.files || [];

        // ✅ t_ 썸네일 / 원본 사진 분리
        const thumbFile = allFiles.find((f) =>
          f.file.filename.startsWith('t_')
        );
        const originalFiles = allFiles.filter(
          (f) => !f.file.filename.startsWith('t_')
        );

        const photos =
          originalFiles.map((f) => ({
            url: buildFileUrl(f.file.filename),
          })) || [];

        return {
          id: p.id,
          name: p.title,
          addr: '', // 나중에 주소 필드 생기면 매핑
          content: p.content,
          thumbnailUrl: thumbFile
            ? buildFileUrl(thumbFile.file.filename)
            : photos[0]?.url || '',
          photos,
          // ⭐ 지도에서 사용할 좌표
          x: p.x, // 경도(lng)
          y: p.y, // 위도(lat)
        };
      }) || [],
    commentCount: apiBoard.commentCount ?? 0,
    comments: apiBoard.comments ?? [], // 지금은 그냥 그대로 둠
  };
}

function ViewComp() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ⭐ 지도용 훅 & ref들
  const mapRef = useKakaoMap('map'); // #map 요소에 카카오맵 생성
  const markersRef = useRef([]); // 현재 마커들
  const polylineRef = useRef(null); // 현재 polyline

  // 1) Board 데이터 불러오기
  useEffect(() => {
    async function fetchBoard() {
      try {
        // apiClient baseURL이 "http://localhost:8080/api" 라고 가정
        const res = await apiClient.get('/board/11');
        const mapped = mapBoardApiToViewModel(res.data);
        setBoard(mapped);
      } catch (err) {
        console.error('board 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, []);

  // 2) Board 데이터 준비되면 지도에 마커 + 이동 경로 그리기
  useEffect(() => {
    if (!board) return;
    if (!board.places || board.places.length === 0) return;

    let cancelled = false;
    let timeoutId = null;

    const draw = () => {
      if (cancelled) return;

      // ❗ 지도(ref)나 kakao 가 준비 안 됐으면 100ms 뒤에 재시도
      if (!mapRef.current || !window.kakao) {
        timeoutId = setTimeout(draw, 100);
        return;
      }

      // ✅ 여기부터는 지도 준비 완료
      redrawMarkersAndPolyline(
        mapRef,
        board.places,
        markersRef,
        polylineRef,
        MARKER_COLORS
      );

      const first = board.places[0];
      if (first && first.y != null && first.x != null) {
        const { kakao } = window;
        const center = new kakao.maps.LatLng(first.y, first.x);
        mapRef.current.setCenter(center);
      }
    };

    // 처음 한 번 호출
    draw();

    // cleanup
    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [board, mapRef]);

  if (loading) {
    return <div className="view-root">로딩 중...</div>;
  }

  if (!board) {
    return <div className="view-root">데이터를 불러올 수 없습니다.</div>;
  }

  const selectedPlace = board.places[selectedIndex] ||
    board.places[0] || { name: '', addr: '', content: '', photos: [] };

  return (
    <div className="view-root">
      {/* 상단 헤더 */}
      <header className="view-header">
        <div className="view-header-inner">
          <div className="view-logo-wrap">
            <span className="view-logo-text">Travly</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="view-main">
        {/* 제목 / 작성자 */}
        <section className="view-box view-box-header">
          <button className="view-back-link">전체 여행기 목록보기</button>

          <h1 className="view-title">{board.title}</h1>

          <div className="view-submeta">
            {board.createdAt} · 총 여행 경로 {board.placeCount}곳
          </div>

          <div className="view-writer">
            <img
              src={board.writer.profileImageUrl}
              alt={board.writer.nickname}
              className="view-writer-avatar"
            />
            <div>
              <div className="view-writer-name">{board.writer.nickname}</div>
              <div className="view-writer-meta">
                여행의 달인 · Lv.{board.writer.level}
              </div>
            </div>
          </div>
        </section>

        {/* 지도 영역 */}
        <section className="view-box">
          <div id="map" className="view-map">
            {/* useKakaoMap가 여기 안에 실제 지도를 렌더링함 */}
          </div>
        </section>

        {/* 상단 코스 썸네일 목록 */}
        <section className="view-box">
          <div className="view-thumb-scroll">
            {board.places.map((place, idx) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);

                  // 썸네일 클릭 시 지도 중심도 해당 장소로 이동
                  if (
                    mapRef.current &&
                    place.y != null &&
                    place.x != null &&
                    window.kakao
                  ) {
                    const { kakao } = window;
                    const pos = new kakao.maps.LatLng(place.y, place.x);
                    mapRef.current.panTo(pos);
                  }
                }}
                className={
                  'view-thumb-item' +
                  (idx === selectedIndex ? ' view-thumb-item--active' : '')
                }
              >
                {place.thumbnailUrl ? (
                  <img
                    src={place.thumbnailUrl}
                    alt={place.name}
                    className="view-thumb-img"
                  />
                ) : (
                  <div className="view-thumb-placeholder" />
                )}

                <span className="view-thumb-label">
                  #{idx + 1} {place.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 코스 상세 설명 */}
        <section className="view-box view-course">
          <header className="view-course-header">
            <div>
              <h2 className="view-course-title">
                #{selectedIndex + 1}. {selectedPlace.name}
              </h2>
              <p className="view-course-addr">{selectedPlace.addr}</p>
            </div>
            <div className="view-course-meta">
              방문 순서 {selectedIndex + 1} · {board.createdAt}
            </div>
          </header>

          <div className="view-course-body">
            {/* 왼쪽 사진 영역 */}
            <div className="view-course-photos">
              {selectedPlace.photos && selectedPlace.photos.length > 0
                ? selectedPlace.photos.map((photo, idx) => (
                    <div key={idx} className="view-course-photo-item">
                      <img
                        src={photo.url}
                        alt={`${selectedPlace.name} 사진 ${idx + 1}`}
                        className="view-course-photo-img"
                      />
                    </div>
                  ))
                : // 사진 없을 때는 플레이스홀더 3개
                  [0, 1, 2].map((idx) => (
                    <div key={idx} className="view-course-photo-item" />
                  ))}
            </div>

            {/* 오른쪽 설명 텍스트 */}
            <div className="view-course-text">
              <h3 className="view-course-text-title">여행지 설명</h3>
              <p className="view-course-text-content">
                {selectedPlace.content}
              </p>
            </div>
          </div>
        </section>

        {/* 댓글 섹션 */}
        <section className="view-box view-comments">
          <h3 className="view-comments-title">댓글 ({board.commentCount})개</h3>

          {/* 댓글 입력 */}
          <div className="view-comment-input-wrap">
            <textarea
              className="view-comment-textarea"
              placeholder="댓글을 입력해 주세요."
            />
            <div className="view-comment-submit-wrap">
              <button className="view-comment-submit-btn">등록</button>
            </div>
          </div>

          {/* 댓글 리스트 */}
          <ul className="view-comment-list">
            {board.comments.map((c) => (
              <li key={c.id} className="view-comment-item">
                <div className="view-comment-header">
                  <div className="view-comment-avatar">
                    {c.writerName?.[0] || '?'}
                  </div>
                  <div>
                    <div className="view-comment-writer">
                      {c.writerName || '익명'}
                    </div>
                    <div className="view-comment-date">{c.createdAt}</div>
                  </div>
                </div>
                <p className="view-comment-content">{c.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default ViewComp;
