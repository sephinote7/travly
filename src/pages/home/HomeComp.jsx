// src/pages/home/HomeComp.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import QnaVisual from './QnaVisual';
import RecentBoardList from './RecentBoardList';
import TravlyInfoComp from './TravlyInfoComp';
import VisualComp from './VisualComp';
import WeeklyBoardTopList from './WeeklyBoardTopList';
import SideProfileComp from '../../common/SideProfileComp.jsx'; // 사이드 프로필 컴포넌트

import LoginComp from '../../common/LoginComp.jsx';
import { useAuth } from '../../common/AuthStateContext.jsx';

function HomeComp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isUserCompOpen,
    closeUserComp,
    userData,
    isProcessingOAuth,
  } = useAuth();

  // URL 쿼리 파라미터로 로그인 모달 열기 (OAuth 리디렉션이 아닐 때만)
  useEffect(() => {
    const loginParam = searchParams.get('login');
    const isOAuthRedirect =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('code=') ||
      window.location.search.includes('code=');

    // OAuth 리디렉션이 아니고, OAuth 처리 중이 아니고, 로그인되지 않았고, login=open 파라미터가 있을 때만 모달 열기
    if (!isOAuthRedirect && !isProcessingOAuth && !userData?.isLoggedIn && loginParam === 'open') {
      openLoginModal();
      // 쿼리 파라미터 제거
      setSearchParams({});
    }
  }, [searchParams, userData, isProcessingOAuth, openLoginModal, setSearchParams]);

  return (
    <div className="home-page">
      {/* 로그인 모달 */}
      <LoginComp open={isLoginModalOpen} onClose={closeLoginModal} />

      <VisualComp />
      <TravlyInfoComp />
      <WeeklyBoardTopList />
      <RecentBoardList />
      <QnaVisual />
    </div>
  );
}

export default HomeComp;
