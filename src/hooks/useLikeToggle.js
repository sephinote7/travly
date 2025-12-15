// src/hooks/useLikeToggle.js

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient'; // ⭐ 백엔드 API 클라이언트 사용
import { useAuth } from '../common/AuthStateContext';

// refetchBoardData: ViewComp에서 게시글 데이터를 다시 불러오는 함수를 받습니다.
export const useLikeToggle = (postId, initialIsLiked, refetchBoardData) => {
  const { userData } = useAuth();
  const isAuthenticated = userData.isLoggedIn;
  const memberId = userData.memberId;

  // 좋아요 상태는 외부(ViewComp)에서 전달받은 초기 값으로 시작합니다.
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 초기 좋아요 상태 설정 (ViewComp에서 전달받은 값으로 초기화)
  // ViewComp가 데이터를 가져올 때마다 이 값이 갱신됩니다.
  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  // 2. 좋아요 토글 로직 (백엔드 서버 API 호출)
  const toggleLike = useCallback(async () => {
    // ID 및 인증 체크
    if (
      !isAuthenticated ||
      typeof memberId !== 'number' ||
      memberId <= 0 ||
      !postId
    ) {
      console.warn('인증 또는 ID 정보 부족으로 좋아요 토글 불가');
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        // ⭐ 좋아요 취소: DELETE 메서드로 백엔드 API 호출
        await apiClient.delete(`/like/${postId}`);
        setIsLiked(false);
      } else {
        // ⭐ 좋아요 추가: POST 메서드로 백엔드 API 호출
        await apiClient.post(`/like/${postId}`);
        setIsLiked(true);
      }

      // ⭐ 핵심: 상태 변경 후, ViewComp에 전달받은 함수로 데이터를 다시 불러오도록 요청
      if (refetchBoardData) {
        refetchBoardData();
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, memberId, postId, isLiked, refetchBoardData]);

  // useLikeToggle은 이제 좋아요 상태를 '조회'하지 않습니다.
  // '조회'는 백엔드가 처리하며, '상태 변경'만 클라이언트가 요청합니다.

  return {
    isLiked,
    toggleLike,
    isLoading,
    isAuthenticated,
  };
};
