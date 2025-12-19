// src/pages/board/ListComp.jsx
import { useEffect, useMemo, useState } from 'react';
import PostListItem from './components/PostListItem';
import Pagination from './components/common/Pagination';
import apiClient from '../../services/apiClient';
import '../../styles/PostListPage.css';

const PAGE_SIZE = 10; // ✅ 1페이지 10개

function ListComp() {
  const [page, setPage] = useState(1);

  // UI 상태
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all'); // all=최신순, hot=인기순

  // 필터 상태
  const [filters, setFilters] = useState([]);
  const [selectedFilterIds, setSelectedFilterIds] = useState([]);

  // 게시글
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasFilter = selectedFilterIds.length > 0;
  // ✅ 서버 스펙: orderby=like / updatedAt
  const orderby = useMemo(() => (tab === 'hot' ? 'like' : 'updatedAt'), [tab]);

  // ✅ (유지) 프론트 검색: 현재 페이지 posts에서만 필터링
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

  // 필터 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get('/filter');
        const allItems = (res.data || []).flatMap((f) => f.items || []);
        setFilters(allItems);
      } catch (e) {
        console.error(e);
        setFilters([]);
      }
    })();
  }, []);

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

  // ✅ 검색/정렬/필터가 바뀌면 1페이지부터 다시
  useEffect(() => {
    setPage(1);
  }, [q, orderby, selectedFilterIds]);

  // ✅ 서버에서 목록 가져오기 (최신/인기 정렬 포함)
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderby, selectedFilterIds]);

  async function fetchPosts() {
    setLoading(true);
    setError(null);

    try {
      const hasFilter = selectedFilterIds.length > 0;

      const res = hasFilter
        ? await apiClient.post(
            '/board/search',
            { itemIds: selectedFilterIds },
            {
              params: {
                size: PAGE_SIZE,
                page: page - 1,
              },
            }
          )
        : await apiClient.get('/board', {
            params: {
              size: PAGE_SIZE,
              page: page - 1,
              orderby, // ✅ 전체글일 때만 최신/인기 적용
            },
          });

      const data = res.data;
      setPosts(data.content || []);
      const tp = Number.isFinite(data.totalPages)
        ? data.totalPages
        : Number.isFinite(data.totalElements)
        ? Math.ceil(data.totalElements / PAGE_SIZE)
        : 10;
      setTotalPages(tp);
    } catch (e) {
      console.error(e);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pl-root">
      <div className="pl-container">
        <header className="pl-header">
          <h1 className="pl-title">모든 이야기 둘러보기</h1>

          {/* 검색 + 필터 토글 */}
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

          {/* 필터 패널 */}
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
              onClick={() => setTab('all')}
            >
              최신순
            </button>
            <button
              type="button"
              className={`pl-tab ${tab === 'hot' ? 'is-active' : ''}`}
              onClick={() => setTab('hot')}
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
              maxButtons={5} // ✅ 사진처럼 최대 5개 버튼
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ListComp;
