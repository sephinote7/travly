// src/pages/board/ViewComp.jsx
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/ViewComp.css';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import apiClient from '../../services/apiClient';
import LikeButtonComp from '../../common/LikeButtonComp';
import { useBoardLike } from './view/useBoardLike';

import { MARKER_COLORS } from './view/viewMappers';
import { useBoardDetail } from './view/useBoardDetail';
import { useBoardComments } from './view/useBoardComments';
import { useKakaoBoardMap } from './view/useKakaoBoardMap';
import ViewComments from './view/ViewComments';

export default function ViewComp() {
  const navigate = useNavigate();
  const { id } = useParams(); // /board/:id
  const { isLiked, setIsLiked, refetchLike } = useBoardLike(id);

  // ✅ 1) 게시글 상세 로드 (훅)
  const { loading, board, rawBoard, fetchBoardData } = useBoardDetail(id);

  // ✅ 2) 댓글 (훅)
  const {
    comments,
    commentText,
    setCommentText,
    commentPage,
    commentLast,
    commentLoading,
    commentPosting,
    fetchComments,
    createComment,
  } = useBoardComments(board?.id);

  // ✅ 3) 썸네일 선택
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Kakao map
  const mapRef = useKakaoMap('map');
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // ✅ 4) 지도 렌더링 (훅)
  useKakaoBoardMap({
    mapRef,
    places: board?.places,
    markersRef,
    polylineRef,
    markerColors: MARKER_COLORS,
  });

  async function handleDelete() {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await apiClient.delete(`/board/${board.id}`);
      alert('삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  }

  async function handleCreateComment() {
    await createComment(); // ✅ commentText는 훅에서 이미 들고 있음
  }

  if (loading) return <div className="view-root">로딩 중...</div>;
  if (!board)
    return <div className="view-root">데이터를 불러올 수 없습니다.</div>;

  const selectedPlace = board.places[selectedIndex] ||
    board.places[0] || { name: '', content: '', photos: [] };

  return (
    <div className="view-root">
      <header className="view-header">
        <div className="view-header-inner">
          <div className="view-logo-wrap"></div>
        </div>
      </header>

      <main className="view-main">
        {/* 제목 / 작성자 */}
        <section className="view-box view-box-header">
          <button
            className="view-back-link"
            type="button"
            onClick={() => navigate('/board')}
          >
            전체 여행기 목록보기
          </button>

          <h1 className="view-title">{board.title}</h1>

          <div className="view-submeta">
            작성 {board.createdAtStr} · 수정 {board.updatedAtStr} · 조회{' '}
            {board.viewCount}
          </div>

          <div className="view-writer">
            <img
              src={board.writer.profileImageUrl}
              alt={board.writer.nickname}
              className="view-writer-avatar"
            />

            <div className="view-writer-info">
              <div className="view-writer-name-row">
                <span className="view-writer-name">
                  {board.writer.nickname}
                </span>

                <div className="view-writer-actions">
                  <button
                    type="button"
                    className="view-writer-btn view-writer-btn--edit"
                    onClick={() =>
                      navigate(`/board/modify/${board.id}`, {
                        state: { boardApi: rawBoard },
                      })
                    }
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="view-writer-btn view-writer-btn--delete"
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="view-writer-meta">
                {board.writer.badgeName || '여행자'}
              </div>
            </div>
          </div>

          {/* 좋아요 / 북마크 */}
          <div className="view-actions-row">
            <LikeButtonComp
              boardId={board.id}
              initialIsLiked={isLiked}
              onLikeChange={setIsLiked}
              refetchBoardData={() => fetchBoardData({ silent: true })}
            />

            <button type="button" className="view-bookmark-btn">
              북마크
            </button>
          </div>
        </section>

        {/* 지도 */}
        <section className="view-box">
          <div id="map" className="view-map" />
        </section>

        {/* 장소 썸네일 목록 */}
        <section className="view-box">
          <div className="view-thumb-scroll">
            {board.places.map((place, idx) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);

                  if (
                    mapRef.current &&
                    place.y != null &&
                    place.x != null &&
                    window.kakao
                  ) {
                    const { kakao } = window;
                    mapRef.current.panTo(
                      new kakao.maps.LatLng(place.y, place.x)
                    );
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

        {/* 선택된 장소 상세 */}
        <section className="view-box view-course">
          <header className="view-course-header">
            <div>
              <h2 className="view-course-title">
                #{selectedIndex + 1}. {selectedPlace.name}
              </h2>
            </div>
            <div className="view-course-meta">
              방문 순서 {selectedIndex + 1}
            </div>
          </header>

          <div className="view-course-body">
            <div className="view-course-photos">
              {selectedPlace.photos?.length
                ? selectedPlace.photos.map((photo, idx) => (
                    <div key={idx} className="view-course-photo-item">
                      <img
                        src={photo.url}
                        alt=""
                        className="view-course-photo-img"
                      />
                    </div>
                  ))
                : [0, 1, 2].map((idx) => (
                    <div key={idx} className="view-course-photo-item" />
                  ))}
            </div>

            <div className="view-course-text">
              <h3 className="view-course-text-title">여행지 설명</h3>
              <p className="view-course-text-content">
                {selectedPlace.content}
              </p>
            </div>
          </div>
        </section>

        {/* 댓글 */}
        <ViewComments
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          commentPosting={commentPosting}
          commentPage={commentPage}
          commentLast={commentLast}
          commentLoading={commentLoading}
          onSubmit={handleCreateComment}
          onLoadMore={fetchComments}
        />
      </main>
    </div>
  );
}
