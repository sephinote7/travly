// src/pages/board/view/useBoardComments.js
import { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '../../../services/apiClient';

function mapComment(c) {
  return {
    id: c.id,
    writerName:
      c.member?.nickname || c.memberNickname || c.writerName || '익명',
    content: c.content || c.comment || '',
    createdAt: c.createdAt || '',
  };
}

export function useBoardComments(boardId, pageSize = 2) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentPosting, setCommentPosting] = useState(false);

  const [commentPage, setCommentPage] = useState(0);
  const [commentLast, setCommentLast] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // ✅ 최신 플래그를 ref로 보관 (closure 문제/무한루프 방지)
  const loadingRef = useRef(false);
  const lastRef = useRef(false);

  useEffect(() => {
    loadingRef.current = commentLoading;
  }, [commentLoading]);

  useEffect(() => {
    lastRef.current = commentLast;
  }, [commentLast]);

  const fetchComments = useCallback(
    async (page = 0) => {
      if (!boardId) return;
      if (loadingRef.current) return;
      if (page !== 0 && lastRef.current) return;

      try {
        setCommentLoading(true);

        const res = await apiClient.get(`/board/${boardId}/comment`, {
          params: { size: pageSize, page },
        });

        const content = res.data?.content ?? [];
        const last = res.data?.last ?? true;

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
    [boardId, pageSize]
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
      lastRef.current = false; // ✅ ref도 같이 갱신
      await fetchComments(0);
    } catch (err) {
      console.error('댓글 등록 실패:', err.response?.data || err);
      alert('한글당 하나만 작성할수 있습니다.');
    } finally {
      setCommentPosting(false);
    }
  }, [boardId, commentText, fetchComments]);

  // ✅ 의존성에서 fetchComments 빼기 (boardId 바뀔 때만 1회)
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
