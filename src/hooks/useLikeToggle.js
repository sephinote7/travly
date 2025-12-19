// src/hooks/useLikeToggle.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../common/AuthStateContext';

/**
 * @param {number} boardId - 게시글 고유 번호
 * @param {boolean} initialIsLiked - 서버에서 받아온 초기 좋아요 상태 (isLiked)
 * @param {function} refetchBoardData - 좋아요 성공 후 부모의 데이터를 새로고침할 함수
 */
export const useLikeToggle = (boardId, initialIsLiked, refetchBoardData) => {
  const { userData } = useAuth();
  const isAuthenticated = userData.isLoggedIn;

  // 1. 하트의 활성화 상태를 관리하는 로컬 state
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  // 2. 서버 통신 중 중복 클릭을 방지하기 위한 로딩 state
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ 중요: 서버에서 데이터가 새로 올 때마다(부모 리렌더링) 하트 상태를 동기화합니다.
  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const toggleLike = useCallback(async () => {
    // 방어 코드: 로그인 안 했거나 게시글 ID가 없으면 중단
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (!boardId) return;

    setIsLoading(true);

    try {
      // 3. 백엔드 API 호출 (@PostMapping("/{boardId}/like"))
      // apiClient 내부 interceptor가 토큰을 자동으로 헤더에 넣어줍니다.
      const response = await apiClient.post(`/board/${boardId}/like`, null);

      // 4. 백엔드에서 준 최신 좋아요 상태 반영 (LikeResponse { boolean isLiked })
      const serverStatus = response.data.isLiked;
      setIsLiked(serverStatus);

      // 5. 부모 컴포넌트의 좋아요 숫자(likeCount)를 갱신하기 위해 refetch 실행
      if (refetchBoardData) {
        // 지도 라이브러리와의 DOM 충돌을 피하기 위해 비동기로 호출
        setTimeout(() => {
          refetchBoardData();
        }, 0);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);

      // 401 Unauthorized 에러 처리 예시
      if (error.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, boardId, refetchBoardData]);

  return {
    isLiked, // 현재 하트 상태 (T/F)
    toggleLike, // 클릭 시 실행할 함수
    isLoading, // 통신 중 여부
    isAuthenticated, // 로그인 여부
  };
};
