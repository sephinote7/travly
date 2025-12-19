import React from 'react';
import { useLikeToggle } from '../hooks/useLikeToggle';

function LikeButtonComp({ boardId, initialIsLiked, refetchBoardData }) {
  const { isLiked, toggleLike, isLoading, isAuthenticated } = useLikeToggle(
    boardId,
    initialIsLiked,
    refetchBoardData
  );

  const handleClick = (e) => {
    e.preventDefault(); // 이벤트 전파 방지

    if (!isAuthenticated) {
      alert('로그인 후 이용 가능합니다.');
      // 여기서 로그인 모달을 여는 openLoginModal() 등을 호출하면 더 좋습니다.
      return;
    }

    toggleLike();
  };

  return (
    <button
      type="button" // form 태그 안에 있을 때 전송되는 것을 방지
      className={`view-like-btn ${isLiked ? 'view-like-btn--active' : ''}`}
      onClick={handleClick}
      disabled={isLoading} // 중복 클릭 방지
      aria-label={isLiked ? '좋아요 취소' : '좋아요 등록'}
    >
      {isLoading ? (
        '처리 중...'
      ) : (
        <>
          <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="like-text"> 좋아요</span>
        </>
      )}
    </button>
  );
}

export default LikeButtonComp;
