// src/pages/board/ViewComp.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { supabase } from '../../util/supabaseClient'; // ⚠️ Supabase 직접 사용 제거
import { useLikeToggle } from '../../hooks/useLikeToggle';
import apiClient from '../../services/apiClient';
import '../../styles/ViewComp.css';

function ViewComp() {
  const { id } = useParams();
  const boardId = id ? parseInt(id) : null;

  // 상태 정의
  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [isPostLiked, setIsPostLiked] = useState(false); // ⭐ 현재 로그인 사용자의 좋아요 여부
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ⭐ 1. 게시글 데이터 조회 로직 (Supabase 카운트 조회 제거)
  const fetchBoardData = useCallback(async () => {
    if (!boardId) {
      console.error('Board ID가 유효하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // A. 게시글 데이터 조회: Axios를 사용하여 백엔드 API만 호출
      const boardResponse = await apiClient.get(`/board/${boardId}`);
      const boardData = boardResponse.data;

      // ⭐ 수신 데이터 확인
      console.log('✅ API로부터 수신된 데이터:', boardData);

      if (!boardData || !boardData.id) {
        throw new Error('데이터 유효성 검사 실패: 게시글 ID 없음');
      }

      // ⭐ B. 좋아요 카운트 및 사용자 좋아요 상태 추출 (백엔드 응답 사용)
      // 백엔드가 제공하는 likeCount와 isLikedByMe 필드를 사용합니다.
      const initialLikeCount = boardData.likeCount || 0;
      const initialIsLiked = boardData.isLikedByMe || false; // ⭐ 백엔드에서 사용자 좋아요 여부도 함께 받아야 합니다.

      setBoard(boardData);
      setLikeCount(initialLikeCount);
      setIsPostLiked(initialIsLiked); // 좋아요 상태 업데이트
    } catch (error) {
      console.error('⛔ 데이터 조회 중 예외 발생:', error.message);
      setBoard(null);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // 2. 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  // ⭐ 3. useLikeToggle 훅 사용 시 fetchBoardData를 전달하여 갱신 유도
  const {
    isLiked,
    toggleLike,
    isLoading: isLiking,
    isAuthenticated,
  } = useLikeToggle(boardId, isPostLiked, fetchBoardData); // ⭐ isPostLiked와 fetchBoardData 전달

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      alert('로그인 후 좋아요를 누를 수 있습니다.');
      return;
    }
    await toggleLike();
  };

  // ... (나머지 로딩/에러 처리 및 렌더링 코드는 동일) ...

  if (isLoading) {
    return <div className="view-loading">게시글을 불러오는 중입니다...</div>;
  }
  // ... (나머지 렌더링 코드 유지) ...

  return (
    <div className="view-root">
      <main className="view-main">
        {/* 제목 / 작성자 섹션 */}
        <section className="view-box view-box-header">
          {/* ... (중략) ... */}

          {/* 좋아요 버튼 및 카운트 표시 */}
          <div className="view-actions">
            <button
              // ⭐ useLikeToggle에서 받은 isLiked 상태 사용
              className={`view-like-btn ${
                isLiked ? 'view-like-btn--active' : ''
              }`}
              onClick={handleLikeClick}
              disabled={isLiking}
            >
              {isLiked ? '❤️' : '🤍'} 좋아요
            </button>
            <span className="view-like-count">({likeCount}개)</span>
          </div>
        </section>
        {/* ... (하략) ... */}
      </main>
    </div>
  );
}

export default ViewComp;
