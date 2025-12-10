// src/common/HeaderComp.jsx
import React, { useState } from 'react';
import TravLyLogo01 from './images/TravLyLogo01.png';
import TravlyLogo02 from './images/TravlyLogo02.png';
import utilBell from './images/utilBell.png';
import utilPen from './images/utilPen.png';
import utilSearch from './images/utilSearch.png';
import utilUser from './images/utilUser.png';
import utilbellon from './images/utilbellon.png';
import { Link, useNavigate } from 'react-router-dom';
import NoticeComp from './NoticeComp';
import SideProfileComp from './SideProfileComp';
import { useAuth } from './AuthStateContext';

function HeaderComp() {
  const navigate = useNavigate();
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [hasNewNotice, setHasNewNotice] = useState(true);

  const { userData, openLoginModal, isUserCompOpen, toggleUserComp } = useAuth();

  // 사람 아이콘 클릭 시: 로그인 여부에 따라 동작 분기
  const handleUserClick = () => {
    if (userData?.isLoggedIn) {
      toggleUserComp();
      return;
    }

    openLoginModal();
  };

  const toggleNotice = () => {
    const nextState = !isNoticeOpen;
    setIsNoticeOpen(nextState);

    if (nextState && hasNewNotice) {
      setHasNewNotice(false);
      // TODO: 서버에 "알림 읽음" API 호출
    }
  };

  return (
    <div className="container-fluid flex justify-between items-center px-[40px] h-[80px] relative">
      <Link to="/">
        <div className="flex h-[60px] ">
          <img src={TravlyLogo02} alt="Travly 로고 2" />
          <img src={TravLyLogo01} alt="Travly 로고 1" />
        </div>
      </Link>

      <ul className="flex w-[258px] h-[48px] justify-between">
        <li>
          <Link to="/board">
            <img src={utilSearch} alt="검색" />
          </Link>
        </li>
        <li>
          <Link to="/board/write">
            <img src={utilPen} alt="글쓰기" />
          </Link>
        </li>
        {/* 사람 아이콘 */}
        <li className="cursor-pointer relative" onClick={handleUserClick}>
          <img src={utilUser} alt="사용자" />
          {isUserCompOpen && <SideProfileComp />}
        </li>
        {/* 알림 종 아이콘 */}
        <li className="cursor-pointer relative" onClick={toggleNotice}>
          <img src={isNoticeOpen ? utilbellon : utilBell} alt="알림" />
          {hasNewNotice && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
          {isNoticeOpen && <NoticeComp />}
        </li>
      </ul>
    </div>
  );
}

export default HeaderComp;
