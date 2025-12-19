// src/pages/board/view/useBoardLike.js
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../../../services/apiClient';

/**
 * ✅ boardId 기준으로 "내가 좋아요 눌렀는지" 상태를 서버에서 가져와 유지
 * - GET /board/{id}/like
 * - 응답이 boolean(true/false) 또는 { liked: true } 같은 형태도 대응
 */
export function useBoardLike(boardId) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const refetchLike = useCallback(async () => {
    if (!boardId) return;

    try {
      setLikeLoading(true);

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

      setIsLiked(liked);
    } catch (e) {
      // 로그인 안 됨/권한 문제(401 등)면 false로 두기
      setIsLiked(false);
    } finally {
      setLikeLoading(false);
    }
  }, [boardId]);

  // ✅ boardId가 바뀌면(=다른 글 들어가면) 좋아요 상태 다시 조회
  useEffect(() => {
    if (!boardId) return;
    refetchLike();
  }, [boardId, refetchLike]);

  return {
    isLiked,
    setIsLiked, // 토글 직후 UI 즉시 반영용
    likeLoading,
    refetchLike, // 필요할 때 다시 조회
  };
}
