import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import LikeButtonComp from '../../common/LikeButtonComp'; // ⭐ 분리된 컴포넌트 임포트
import '../../styles/ViewComp.css';
import apiClient from '../../services/apiClient';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { redrawMarkersAndPolyline } from '../../utils/mapDrawingUtils';
import { useNavigate, useParams } from 'react-router-dom';

function ViewComp() {
  const { id } = useParams();
  const boardId = id ? parseInt(id) : null; // 상태 정의

  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ⭐ 1. 게시글 데이터 조회 로직 (useCallback 유지)

  const fetchBoardData = useCallback(async () => {
    if (!boardId) {
      console.error('Board ID가 유효하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // API 호출
      const boardResponse = await apiClient.get(`/board/${boardId}`);
      const boardData = boardResponse.data;

      if (!boardData || !boardData.id) {
        throw new Error('데이터 유효성 검사 실패: 게시글 ID 없음');
      } // ⭐ 전체 boardData 상태 업데이트 (likeCount, isLikedByMe 모두 포함)

      setBoard(boardData);
    } catch (error) {
      console.error('⛔ 데이터 조회 중 예외 발생:', error.message);
      setBoard(null);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]); // 2. 컴포넌트 마운트 시 데이터 조회 및 갱신 의존성

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  if (isLoading || !board) {
    return <div className="view-loading">게시글을 불러오는 중입니다...</div>;
  } // ⭐ 3. 렌더링 시, board 객체에서 필요한 값 추출

  const initialIsLiked = board.isLikedByMe || false;
  const likeCount = board.likeCount || 0;

  return (
    <div className="view-root">
      {' '}
      <main className="view-main">
        {/* ... (제목 / 작성자 섹션 등 중략) ... */}{' '}
        {/* 좋아요 버튼 및 카운트 표시 */}{' '}
        <section className="view-box view-box-header">
          {' '}
          <div className="view-actions">
            {' '}
            <LikeButtonComp
              boardId={boardId}
              initialIsLiked={initialIsLiked}
              refetchBoardData={fetchBoardData}
            />
            {/* ⭐ board 객체에 저장된 likeCount 사용 */}{' '}
            <span className="view-like-count">({likeCount}개)</span>{' '}
          </div>{' '}
        </section>
        {/* ... (하략) ... */}{' '}
      </main>{' '}
    </div>
  );
}

export default ViewComp;
