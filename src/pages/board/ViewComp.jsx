// src/pages/board/ViewComp.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/ViewComp.css';
import apiClient from '../../services/apiClient';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { redrawMarkersAndPolyline } from '../../utils/mapDrawingUtils';
import LikeButtonComp from '../../common/LikeButtonComp';

const MARKER_COLORS = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#6366f1'];
const API_BASE = 'http://localhost:8080/api/travly';

// 외부 placeholder DNS 이슈 방지용
const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect width="100%" height="100%" rx="20" ry="20" fill="#eef2f7"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="14" fill="#64748b">U</text>
    </svg>
  `);

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd} ${hh}:${mi}`;
}

function normalizeFilename(name) {
  if (!name) return name;
  return name.replace(/(\.(jpg|jpeg|png|webp))\.\2$/i, '.$2');
}

function buildFileUrl(filename) {
  if (!filename) return '';
  return `${API_BASE}/file/${normalizeFilename(filename)}`;
}

// ✅ 네가 준 board 상세 JSON 구조에 맞춘 매핑
function mapBoardApiToViewModel(apiBoard) {
  const createdAtStr = formatDateTime(apiBoard.createdAt);
  const updatedAtStr = formatDateTime(apiBoard.updatedAt);

  const writer = {
    id: apiBoard.member?.id,
    nickname: apiBoard.member?.nickname || '익명',
    badgeName: apiBoard.member?.badge?.name || '',
    profileImageUrl: apiBoard.member?.profileImage
      ? buildFileUrl(apiBoard.member.profileImage)
      : FALLBACK_AVATAR,
  };

  const places =
    (apiBoard.places || [])
      .slice()
      .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
      .map((p) => {
        const files = (p.files || [])
          .slice()
          .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
          .map((f) => f?.file?.filename)
          .filter(Boolean);

        // 썸네일: t_ 있으면 우선, 없으면 첫 파일
        const thumb = files.find((fn) => fn.startsWith('t_')) || files[0] || '';

        return {
          id: p.id,
          name: p.title,
          content: p.content || '',
          orderNum: p.orderNum ?? 0,
          x: p.x,
          y: p.y,
          thumbnailUrl: thumb ? buildFileUrl(thumb) : '',
          photos: files.map((fn) => ({ url: buildFileUrl(fn) })),
        };
      }) || [];

  return {
    id: apiBoard.id,
    title: apiBoard.title || '',
    viewCount: apiBoard.viewCount ?? 0,
    likeCount: apiBoard.likeCount ?? 0,
    createdAtStr,
    updatedAtStr,
    writer,
    places,
  };
}

export default function ViewComp() {
  const navigate = useNavigate();
  const { id } = useParams(); // /board/:id

  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [rawBoard, setRawBoard] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Kakao map
  const mapRef = useKakaoMap('map');
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentPosting, setCommentPosting] = useState(false);

  const [commentPage, setCommentPage] = useState(0);
  const [commentLast, setCommentLast] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // 1) 게시글 상세 로드
  async function fetchBoardData({ silent = false } = {}) {
    try {
      if (!silent) setLoading(true); // ⭐ 최초 로딩만
      const res = await apiClient.get(`/board/${id}`);

      setRawBoard(res.data);
      setBoard(mapBoardApiToViewModel(res.data));
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchBoardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 2) 지도 마커/폴리라인 그리기
  useEffect(() => {
    if (!board?.places?.length) return;

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
        board.places,
        markersRef,
        polylineRef,
        MARKER_COLORS
      );

      // 첫 장소로 센터
      const first = board.places[0];
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
  }, [board, mapRef]);

  // ✅ 댓글 목록 조회 (GET /board/{boardId}/comment)
  async function fetchComments(page = 0) {
    if (!board?.id) return;
    if (commentLoading) return;
    if (page !== 0 && commentLast) return;

    try {
      setCommentLoading(true);

      const res = await apiClient.get(`/board/${board.id}/comment`, {
        params: { size: 2, page },
      });

      // Spring Page 형태를 가정: { content: [], last: boolean, ... }
      const content = res.data?.content ?? [];
      const last = res.data?.last ?? true;

      const mapped = content.map((c) => ({
        id: c.id,
        writerName:
          c.member?.nickname || c.memberNickname || c.writerName || '익명',
        content: c.content || c.comment || '',
        createdAt: c.createdAt || '',
      }));

      setComments((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
      setCommentLast(last);
      setCommentPage(page);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    } finally {
      setCommentLoading(false);
    }
  }

  // 게시글 로드되면 댓글 첫 페이지
  useEffect(() => {
    if (!board?.id) return;
    setComments([]);
    setCommentPage(0);
    setCommentLast(false);
    fetchComments(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board?.id]);

  // ✅ 댓글 작성 (POST /board/{boardId}/comment)
  async function handleCreateComment() {
    const text = commentText.trim();
    if (!text) {
      alert('댓글을 입력해 주세요.');
      return;
    }
    if (!board?.id) return;

    try {
      setCommentPosting(true);

      const res = await apiClient.post(`/board/${board.id}/comment`, {
        comment: text, // ✅ 서버가 쓰는 필드명
        // memberId: 1,         // ✅ 서버가 요구하면 추가 (응답엔 있으니까 필요할 수도 있음)
      });

      setCommentText('');
      setCommentLast(false);
      await fetchComments(0);

      return res.data;
    } catch (err) {
      console.error('댓글 등록 실패:', err.response?.data || err);
      alert('한글당 하나만 작성할수 있습니다.');
    } finally {
      setCommentPosting(false);
    }
  }

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

  if (loading) return <div className="view-root">로딩 중...</div>;
  if (!board)
    return <div className="view-root">데이터를 불러올 수 없습니다.</div>;

  // ⭐ 서버에서 내려준 좋아요 여부 (필드명에 맞게 하나만 쓰면 됨)
  const initialIsLiked = Boolean(rawBoard?.isLiked ?? rawBoard?.liked ?? false);

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
          {/* ✅ 좋아요 / 북마크 라인 */}
          <div className="view-actions-row">
            <LikeButtonComp
              boardId={board.id}
              initialIsLiked={initialIsLiked}
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
        <section className="view-box view-comments">
          <h3 className="view-comments-title">댓글 ({comments.length})개</h3>

          <div className="view-comment-input-wrap">
            <textarea
              className="view-comment-textarea"
              placeholder="댓글을 입력해 주세요."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="view-comment-submit-wrap">
              <button
                className="view-comment-submit-btn"
                type="button"
                onClick={handleCreateComment}
                disabled={commentPosting}
              >
                {commentPosting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>

          <ul className="view-comment-list">
            {comments.map((c) => (
              <li key={c.id} className="view-comment-item">
                <div className="view-comment-header">
                  <div className="view-comment-avatar">
                    {c.writerName?.[0] || '?'}
                  </div>
                  <div>
                    <div className="view-comment-writer">{c.writerName}</div>
                    <div className="view-comment-date">
                      {formatDateTime(c.createdAt)}
                    </div>
                  </div>
                </div>
                <p className="view-comment-content">{c.content}</p>
              </li>
            ))}
          </ul>

          {!commentLast && (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button
                type="button"
                onClick={() => fetchComments(commentPage + 1)}
                disabled={commentLoading}
              >
                {commentLoading ? '불러오는 중...' : '댓글 더 보기'}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
