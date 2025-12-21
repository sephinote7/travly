import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import LoginComp from './LoginComp';
import SideProfileComp from './SideProfileComp';
import { AuthProvider, useAuth } from './AuthStateContext'; // ⭐️ Context 훅/Provider 불러오기

// ⭐️ MainLayout 컴포넌트를 만들어 Context를 사용합니다.
const MainLayout = () => {
  const location = useLocation();
  const HIDDEN_PATH_PREFIXES = ['/board/write', '/board/modify'];
  const isHiddenPath = HIDDEN_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  // ⭐️ Context에서 필요한 상태와 함수를 가져옵니다.
  const { userData, isUserCompOpen, closeUserComp } = useAuth();

  return (
    <>
      {/* ⭐️ HeaderComp는 Context의 toggleUserComp를 사용하므로 prop을 제거합니다. */}
      {!isHiddenPath && <HeaderComp />}
      {/* ========================================================== */}
      {/* ⭐️ 유저 컴포넌트 조건부 렌더링 (Context 상태 사용) */}
      {isUserCompOpen && (
        <div className="fixed right-0 top-[80px] z-50">
          {userData.isLoggedIn ? (
            // 로그인 상태: SideProfileComp 렌더링
            // SideProfileComp는 Context에서 유저 정보와 로그아웃 함수를 가져옵니다.
            <SideProfileComp />
          ) : (
            // 로그아웃 상태: LoginComp 렌더링
            // LoginComp에 닫기 함수를 전달합니다.
            <LoginComp onClose={closeUserComp} />
          )}
        </div>
      )}
      {/* ========================================================== */}
      {/* SideProfileComp는 Context를 사용하도록 변경했으므로, 
          Layout에서 조건부 렌더링 로직을 담당하게 됩니다. 
          따라서 이 코드는 위에 통합되어 삭제됩니다. */}
      {/* {!isHiddenPath && <SideProfileComp />} */}
      <main className="pt-[80px]">
        <Outlet />
      </main>
      {!isHiddenPath && <FooterComp />}
    </>
  );
};

// ⭐️ Layout 컴포넌트에서 AuthProvider로 MainLayout을 감쌉니다.
const Layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default Layout;
