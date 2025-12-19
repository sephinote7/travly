import React from 'react';
import { useLikeToggle } from '../hooks/useLikeToggle';

// ⭐ props로 boardId, 초기 상태, 데이터 갱신 함수를 받습니다.
function LikeButtonComp({ boardId, initialIsLiked, refetchBoardData }) {
  const { isLiked, toggleLike, isLoading, isAuthenticated } = useLikeToggle(
    boardId,
    initialIsLiked,
    refetchBoardData
  ); // ⬅️ 모든 정보 전달

  const buttonText = isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요';

  const handleClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // [!] 프론트엔드에서는 로그인 모달을 띄우는 것이 더 사용자 친화적일 수 있습니다.
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    toggleLike();
  };

  return (
    // ⭐ 버튼 스타일링 및 이벤트 핸들링은 이 컴포넌트가 전담합니다.
    <button
      className={`view-like-btn ${isLiked ? 'view-like-btn--active' : ''}`}
      onClick={handleClick}
      disabled={isLoading || !isAuthenticated} // 로딩 중이거나 미인증 시 버튼 비활성화
    >
      {isLoading ? '처리 중...' : `${isLiked ? '❤️' : '🤍'} 좋아요`}{' '}
    </button>
  );
}

export default LikeButtonComp;
