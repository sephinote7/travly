// src/pages/home/HomeComp.jsx
import QnaVisual from './QnaVisual';
import RecentBoardList from './RecentBoardList';
import TravlyInfoComp from './TravlyInfoComp';
import VisualComp from './VisualComp';
import WeeklyBoardTopList from './WeeklyBoardTopList';
import SideProfileComp from '../../common/SideProfileComp.jsx'; // 사이드 프로필 컴포넌트

import LoginComp from '../../common/LoginComp.jsx';
import { useAuth } from '../../common/AuthStateContext.jsx';

function HomeComp() {
  const { isLoginModalOpen, closeLoginModal, isUserCompOpen, closeUserComp } = useAuth();

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
