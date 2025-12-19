// src/hooks/useLikeToggle.js

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../common/AuthStateContext';

export const useLikeToggle = (boardId, initialIsLiked, refetchBoardData) => {
  const { userData } = useAuth();
  const isAuthenticated = userData.isLoggedIn;
  const authUuid = userData.authUuid; // ⬅️ 전역 상태에서 UUID 가져오기

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    console.log('훅 상태:', { isAuthenticated, authUuid, boardId });
  }, [initialIsLiked]);

  const toggleLike = useCallback(async () => {
    if (!isAuthenticated || !authUuid || !boardId) return;

    setIsLoading(true);

    try {
      const response = await apiClient.post(`/board/${boardId}/like`, null, {
        headers: { 'X-AUTH-UUID': authUuid },
      });

      // ✅ [해결책 1] alert을 절대 사용하지 마세요. (렌더링 충돌의 주범)
      console.log('좋아요 처리 완료:', response.data);

      // ✅ [해결책 2] 로컬 상태 업데이트
      setIsLiked((prev) => !prev);

      // ✅ [해결책 3] 데이터 갱신을 0초 뒤로 미룸 (리액트 사이클 분리)
      if (refetchBoardData) {
        setTimeout(() => {
          refetchBoardData();
        }, 0);
      }
    } catch (error) {
      console.error('좋아요 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authUuid, boardId, isLiked, refetchBoardData]);

  return {
    isLiked,
    toggleLike,
    isLoading,
    isAuthenticated,
  };
};
