import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import LoginComp from './LoginComp';
import SideProfileComp from './SideProfileComp';
import NoticeComp from './NoticeComp';

const Layout = () => {
  const location = useLocation();
  const HIDDEN_PATH_PREFIXES = ['/board/write', '/board/modify'];
  const isHiddenPath = HIDDEN_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  // ⭐️ 1. 로그인 모달 표시 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // ⭐️ 2. 모달 토글 함수
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <>
      {!isHiddenPath && (
        // HeaderComp에 모달을 여는 함수 전달
        <HeaderComp onLoginClick={toggleLoginModal} />
      )}

      {/* ⭐️ 모달이 열려 있을 때만 LoginComp를 렌더링 */}
      {isLoginModalOpen && (
        // LoginComp에 모달을 닫는 함수 전달
        <LoginComp onClose={toggleLoginModal} />
      )}

      {!isHiddenPath && <SideProfileComp />}
      {!isHiddenPath && <NoticeComp />}

      <main>
        <Outlet />
      </main>

      {!isHiddenPath && <FooterComp />}
    </>
  );
};

export default Layout;
