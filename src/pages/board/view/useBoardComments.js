// src/pages/board/view/useBoardComments.js
import { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '../../../services/apiClient';

function mapComment(c) {
  return {
    id: c.id,
    memberId: c.memberId ?? null,
    writerName: c.nickname || '익명',
    content: c.comment || c.content || '',
    createdAt: c.updatedAt || c.createdAt || '',
    badgeId: c.badgeId ?? null, // ✅ 댓글 응답에 이미 있음!
    profileImageFilename: c.profileImageFilename ?? null,
  };
}

export function useBoardComments(boardId, pageSize = 2) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentPosting, setCommentPosting] = useState(false);

  const [commentPage, setCommentPage] = useState(0);
  const [commentLast, setCommentLast] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // ✅ badgeId -> badgeName 캐시
  const [badgeNameMap, setBadgeNameMap] = useState({}); // { [badgeId]: "새싹" }

  const loadingRef = useRef(false);
  const lastRef = useRef(false);

  useEffect(() => {
    loadingRef.current = commentLoading;
  }, [commentLoading]);

  useEffect(() => {
    lastRef.current = commentLast;
  }, [commentLast]);

  // ✅ 뱃지 마스터 한 번만 로드해서 badgeId->name 매핑 만들기
  const ensureBadgeMaster = useCallback(async () => {
    // 이미 로드했으면 skip
    if (Object.keys(badgeNameMap).length) return;

    try {
      const res = await apiClient.get('/badge'); // ⚠️ 이게 GET 가능해야 함
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.content ?? res.data ?? [];

      // list 예시: [{id:1,name:"새싹",...}, ...]
      const next = {};
      list.forEach((b) => {
        if (b?.id != null) next[b.id] = b.name ?? b.badgeName ?? '';
      });
      setBadgeNameMap(next);
    } catch (e) {
      console.error('뱃지 목록 로딩 실패:', e);
      // 실패해도 댓글은 보여야 하니까 조용히 두기
    }
  }, [badgeNameMap]);

  const fetchComments = useCallback(
    async (page = 0) => {
      if (!boardId) return;
      if (loadingRef.current) return;
      if (page !== 0 && lastRef.current) return;

      try {
        setCommentLoading(true);

        // ✅ 뱃지 마스터는 먼저 확보(가능하면)
        await ensureBadgeMaster();

        const res = await apiClient.get(`/board/${boardId}/comment`, {
          params: { size: pageSize, page },
        });

        const content = res.data?.content ?? [];
        // 너 응답은 last가 없고 page.totalPages가 있음
        const totalPages = res.data?.page?.totalPages ?? 1;
        const last = page >= totalPages - 1;

        const mapped = content.map(mapComment);

        setComments((prev) => (page === 0 ? mapped : [...prev, ...mapped]));
        setCommentLast(last);
        setCommentPage(page);
      } catch (err) {
        console.error('댓글 조회 실패:', err);
      } finally {
        setCommentLoading(false);
      }
    },
    [boardId, pageSize, ensureBadgeMaster]
  );

  const createComment = useCallback(async () => {
    const text = commentText.trim();
    if (!text) {
      alert('댓글을 입력해 주세요.');
      return;
    }
    if (!boardId) return;

    try {
      setCommentPosting(true);
      await apiClient.post(`/board/${boardId}/comment`, { comment: text });

      setCommentText('');
      setCommentLast(false);
      lastRef.current = false;
      await fetchComments(0);
    } catch (err) {
      console.error('댓글 등록 실패:', err.response?.data || err);
      alert('댓글 등록 실패');
    } finally {
      setCommentPosting(false);
    }
  }, [boardId, commentText, fetchComments]);

  useEffect(() => {
    if (!boardId) return;
    setComments([]);
    setCommentPage(0);
    setCommentLast(false);
    lastRef.current = false;
    fetchComments(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  return {
    comments,
    badgeNameMap,
    commentText,
    setCommentText,
    commentPosting,
    commentPage,
    commentLast,
    commentLoading,
    fetchComments,
    createComment,
  };
}
