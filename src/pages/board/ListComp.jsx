// src/pages/ListComp.jsx
import { useEffect, useState } from 'react';
import PostListItem from '../board/components/post/PostListItem';
import Pagination from '../board/components/common/Pagination';
import apiClient from '../../services/apiClient';

const PAGE_SIZE = 5;

function ListComp() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        // ⭐ 스펙대로: GET /board?size=5&page={page-1} + body { itemIds: [] }
        const res = await apiClient.get('/board', {
          params: {
            size: PAGE_SIZE,
            page: page - 1,
          },
        });

        const data = res.data;
        const rawList = data.content || [];

        const mapped = rawList.map((b) => ({
          postId: b.id,
          title: b.title,
          placeTitle: b.placeTitle,
          thumbnailFileId: b.placeFileId,
          updatedAt: b.updatedAt,
          nickname: b.memberNickname,
          likeCount: b.likeCount,
          filterItemNames: b.filterItemNames || [],
        }));

        setPosts(mapped);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error('📛 게시글 목록 불러오기 실패');
        console.error('status:', err?.response?.status);
        console.error('data  :', err?.response?.data);
        console.error('config:', err?.config);

        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  return (
    <div className="post-list-page">
      <header className="post-list-header">
        <h1>게시글 목록</h1>
      </header>

      <main>
        {loading && <p>로딩 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <ul className="post-list">
          {posts.map((post) => (
            <PostListItem key={post.postId} post={post} />
          ))}
        </ul>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}

export default ListComp;
