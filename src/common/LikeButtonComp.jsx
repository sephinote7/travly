import React from 'react';
import { useLikeToggle } from '../hooks/useLikeToggle';

function LikeButtonComp({ postId }) {
  const { isLiked, toggleLike, isLoading, isAuthenticated } =
    useLikeToggle(postId);

  const buttonText = isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요';

  const handleClick = () => {
    // 인증 확인은 useLikeToggle 내부에서 처리되지만, UI 피드백을 위해 한 번 더 확인
    if (!isAuthenticated) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    toggleLike();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !isAuthenticated} // 로딩 중이거나 미인증 시 버튼 비활성화
      style={{ color: isLiked ? 'red' : 'gray' }}
    >
      {isLoading ? '처리 중...' : buttonText}
    </button>
  );
}
