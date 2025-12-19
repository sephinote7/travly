// src/pages/board/ListComp.jsx
import { useEffect, useMemo, useState } from 'react';
import PostListItem from './components/PostListItem';
import Pagination from './components/common/Pagination';
import apiClient from '../../services/apiClient';
import '../../styles/PostListPage.css';

const PAGE_SIZE = 5;

function ListComp() {
  const [page, setPage] = useState(1);

  /* =========================
     UI 상태
  ========================= */
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');

  /* =========================
     필터 버튼 상태 (핵심)
  ========================= */
  const [filters, setFilters] = useState([]); // 모든 필터 item
  const [selectedFilterIds, setSelectedFilterIds] = useState([]);

  /* =========================
     게시글 목록
  ========================= */
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const orderby = useMemo(() => (tab === 'hot' ? 'like' : 'updatedAt'), [tab]);

  /* =========================
     TOP3 Like순으로 정렬 및 버튼 눌리도록
  ========================= */
  useEffect(() => {
    // 1. 현재 주소창의 쿼리 스트링(?orderby=like 부분)을 가져옵니다.
    const params = new URLSearchParams(window.location.search);
    const orderbyValue = params.get('orderby');

    // 2. 값에 따라 기존에 선언된 setTab을 이용해 상태를 바꿔줍니다.
    if (orderbyValue === 'like') {
      setTab('hot'); // 인기순 버튼 활성화 + 정렬 변경
    } else if (orderbyValue === 'updated') {
      setTab('all'); // 최신순 버튼 활성화 + 정렬 변경
    }

    // 3. 페이지도 1페이지로 리셋 (필요시)
    setPage(1);
  }, []);

  /* =========================
     1️⃣ 필터 데이터 로드 (/filter)
  ========================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/filter');
        // 모든 카테고리의 items를 하나로 합침
        const allItems = (res.data || []).flatMap((f) => f.items || []);
        setFilters(allItems);
      } catch (e) {
        console.error(e);
        setFilters([]);
      }
    })();
  }, []);

  /* =========================
     2️⃣ 필터 버튼 토글
  ========================= */
  function toggleFilter(itemId) {
    setSelectedFilterIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
    setPage(1);
  }

  function resetFilters() {
    setSelectedFilterIds([]);
    setPage(1);
  }

  /* =========================
     3️⃣ 게시글 조회 (필터 포함)
  ========================= */
  async function fetchPosts() {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.request({
        method: 'get',
        url: '/board',
        params: {
          size: PAGE_SIZE,
          page: page - 1,
          orderby,
        },
        data: {
          itemIds: selectedFilterIds, // ✅ 버튼형 필터
        },
      });

      const data = res.data;

      const mapped = (data.content || []).map((b) => ({
        id: b.id,
        title: b.title,
        placeTitle: b.placeTitle,
        placeContent: b.placeContent,
        updatedAt: b.updatedAt,
        viewCount: b.viewCount ?? 0,
        likeCount: b.likeCount ?? 0,
        memberNickname: b.memberNickname,
        memberThumbail: b.memberThumbail,
        badgeId: b.badgeId,
        thumbnailFilename: b.thumbnailFilename,
        placeFileId: b.placeFileId,
      }));

      setPosts(mapped);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [page, orderby, selectedFilterIds]);

  /* =========================
     4️⃣ 검색어는 프론트 필터
  ========================= */
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(keyword) ||
        (p.placeTitle || '').toLowerCase().includes(keyword) ||
        (p.memberNickname || '').toLowerCase().includes(keyword)
    );
  }, [posts, q]);

  return (
    <div className="pl-root">
      <div className="pl-container">
        <header className="pl-header">
          <h1 className="pl-title">모든 이야기 둘러보기</h1>

          {/* 🔍 검색 + 필터 토글 */}
          <div className="pl-searchRow">
            <input
              className="pl-searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="어떤 여행을 찾고 있나요?"
            />
            <button
              className="pl-searchBtn"
              type="button"
              onClick={() => setShowFilters((v) => !v)}
            >
              🔍
            </button>
          </div>

          {/* ✅ 버튼형 필터 패널 */}
          {showFilters && (
            <div className="pl-filterPanel">
              <div className="pl-chipGrid">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`pl-chip ${
                      selectedFilterIds.includes(item.id) ? 'is-active' : ''
                    }`}
                    onClick={() => toggleFilter(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {selectedFilterIds.length > 0 && (
                <button
                  type="button"
                  className="pl-filterReset"
                  onClick={resetFilters}
                >
                  초기화
                </button>
              )}
            </div>
          )}

          {/* 정렬 탭 */}
          <div className="pl-tabRow">
            <button
              type="button"
              className={`pl-tab ${tab === 'all' ? 'is-active' : ''}`}
              onClick={() => {
                setTab('all');
                setPage(1);
              }}
            >
              최신순
            </button>
            <button
              type="button"
              className={`pl-tab ${tab === 'hot' ? 'is-active' : ''}`}
              onClick={() => {
                setTab('hot');
                setPage(1);
              }}
            >
              인기순
            </button>

            <div className="pl-resultInfo">
              검색 결과: <b>{filtered.length}</b>개
            </div>
          </div>
        </header>

        <main className="pl-main">
          {loading && <div className="pl-state">로딩 중...</div>}
          {error && <div className="pl-state is-error">{error}</div>}

          {!loading && !error && (
            <ul className="pl-list">
              {filtered.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </ul>
          )}

          <div className="pl-pagination">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ListComp;
