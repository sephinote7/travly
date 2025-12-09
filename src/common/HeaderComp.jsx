// src/common/HeaderComp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPen, FaUser, FaBell } from 'react-icons/fa';

import SearchComp from './SearchComp';
import SideProfileComp from './SideProfileComp';

function HeaderComp({ onUserClick, onWriteClick, isLoggedIn, onLoginOpen }) {
  const navigate = useNavigate();

  // 모달/사이드 패널 상태 (로그인 제외)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 검색 모달 열기
  const openSearch = () => setIsSearchOpen(true);

  // 로그인 모달 열기: 항상 부모(HomeComp)의 onLoginOpen만 사용
  const openLogin = () => {
    if (onLoginOpen) {
      onLoginOpen();
    }
  };

  // 사람 버튼 클릭
  const handleUserButtonClick = () => {
    if (onUserClick) {
      onUserClick();
    } else {
      openLogin();
    }
  };

  // 연필 버튼 클릭
  const handleWriteButtonClick = () => {
    if (onWriteClick) {
      onWriteClick();
    } else {
      openLogin();
    }
  };

  return (
    <>
      {/* 고정 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/95 border-b border-slate-200">
        <div className="h-20 w-full max-w-[1440px] px-8 flex items-center justify-between">
          {/* 로고 */}
          <button type="button" onClick={() => navigate('/')} className="text-[22px] font-bold text-slate-900">
            Travly
          </button>

          {/* 오른쪽 아이콘들 */}
          <nav className="flex items-center gap-4">
            {/* 검색 */}
            <button
              type="button"
              aria-label="검색"
              onClick={openSearch}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <FaSearch className="text-[16px]" />
            </button>

            {/* 글쓰기 */}
            <button
              type="button"
              aria-label="글쓰기"
              onClick={handleWriteButtonClick}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <FaPen className="text-[16px]" />
            </button>

            {/* 프로필 */}
            <button
              type="button"
              aria-label={isLoggedIn ? '프로필' : '로그인'}
              onClick={handleUserButtonClick}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <FaUser className="text-[16px]" />
            </button>

            {/* 알림 */}
            <button
              type="button"
              aria-label="알림 / 로그인"
              onClick={openLogin}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
            >
              <FaBell className="text-[16px]" />
            </button>
          </nav>
        </div>
      </header>

      {/* 모달 / 사이드 패널 (검색 / 사이드 프로필만) */}
      <SearchComp open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SideProfileComp open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}

export default HeaderComp;
