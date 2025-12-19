// src/pages/board/view/useBoardLike.js
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../../../services/apiClient';

/**
 * boardId 기준으로 "내가 좋아요 눌렀는지" 상태를 서버에서 가져와 유지
 * 1) 우선 GET /board/{id}/like (상태조회)
 * 2) 405/403이면 fallback: GET /board/{id} 에 isLiked/lIiked 필드가 있으면 사용
 *
 * 옵션:
 * - onMergeToBoard(liked): 좋아요 상태를 board state에도 합치고 싶을 때 콜백 전달
 *   예) (liked) => setBoard(prev => ({...prev, isLiked: liked}))
 */
export function useBoardLike(boardId, { onMergeToBoard } = {}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const applyLiked = useCallback(
    (liked) => {
      setIsLiked(liked);
      // ✅ 네가 원한 "기존 board 상태에 isLiked 합치기"를 여기서 수행
      if (typeof onMergeToBoard === 'function') onMergeToBoard(liked);
    },
    [onMergeToBoard]
  );

  const fetchLikeStatus = useCallback(async () => {
    if (!boardId) return;

    try {
      setLikeLoading(true);

      // ✅ 1) 상태조회 시도
      const res = await apiClient.get(`/board/${boardId}/like`);

      const liked =
        typeof res.data === 'boolean'
          ? res.data
          : Boolean(
              res.data?.isLiked ??
                res.data?.liked ??
                res.data?.likedByMe ??
                false
            );

      applyLiked(liked);
      return;
    } catch (e) {
      // ✅ 405(Method Not Allowed) 또는 403(Forbidden)일 수 있음
      // fallback: board 상세에서 isLiked 찾아보기
      try {
        const detail = await apiClient.get(`/board/${boardId}`);
        const likedFromDetail = Boolean(
          detail.data?.isLiked ?? detail.data?.liked ?? false
        );
        applyLiked(likedFromDetail);
      } catch {
        applyLiked(false);
      }
    } finally {
      setLikeLoading(false);
    }
  }, [boardId, applyLiked]);

  useEffect(() => {
    if (!boardId) return;
    fetchLikeStatus();
  }, [boardId, fetchLikeStatus]);

  return {
    isLiked,
    setIsLiked: applyLiked, // ✅ setIsLiked를 외부에서도 쓰면 board 합치기까지 같이 됨
    likeLoading,
    fetchLikeStatus,
  };
}
