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
    // 인증 및 ID 체크
    if (!isAuthenticated || !authUuid || !boardId) {
      // ⭐ authUuid 체크
      console.warn('인증 또는 ID 정보 부족으로 좋아요 토글 불가');
      return;
    }

    setIsLoading(true);

    try {
      // ⭐ 1. 백엔드 API 경로/메서드에 맞춤 (POST /board/{boardId}/like)
      const response = await apiClient.post(`/board/${boardId}/like`, null, {
        headers: {
          // ⭐ 2. 백엔드 인증 필터가 요구하는 헤더 추가
          'X-AUTH-UUID': authUuid,
        },
      });

      // ⭐ 3. 성공 시, 로컬 상태만 토글 (백엔드가 등록/취소 처리했음)
      setIsLiked((prev) => !prev);

      // 4. 게시물 데이터를 다시 불러와 최신 좋아요 수 반영
      if (refetchBoardData) {
        refetchBoardData();
      }

      alert(response.data); // 서버 응답 메시지 (등록됨/취소됨) 표시
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
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
