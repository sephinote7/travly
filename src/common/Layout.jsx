import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderComp from "./HeaderComp";
import FooterComp from "./FooterComp";
import LoginComp from "./LoginComp";
import SideProfileComp from "./SideProfileComp";
import { AuthProvider, useAuth } from "./AuthStateContext";

// ⭐️ MainLayout 컴포넌트
const MainLayout = () => {
  const location = useLocation();
  const HIDDEN_PATH_PREFIXES = ["/board/write", "/board/modify"];
  const isHiddenPath = HIDDEN_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const sideProfileRef = useRef(null);

  // ⭐️ Context 상태
  const { userData, isUserCompOpen, closeUserComp } = useAuth();

  // ⭐️ 외부 클릭 / 스크롤 시 사이드 프로필 닫기
  useEffect(() => {
    if (!isUserCompOpen) return;

    const handleClickOutside = (event) => {
      if (
        sideProfileRef.current &&
        !sideProfileRef.current.contains(event.target)
      ) {
        const userIcon = event.target.closest('[alt="사용자"]');
        if (!userIcon) {
          closeUserComp();
        }
      }
    };

    const handleScroll = () => {
      closeUserComp();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isUserCompOpen, closeUserComp]);

  return (
    <>
      {/* ✅ 작성/수정 페이지에서는 헤더 숨김 */}
      {!isHiddenPath && <HeaderComp />}

      {/* ✅ 유저 사이드 프로필 */}
      {isUserCompOpen && (
        <div
          ref={sideProfileRef}
          className={`fixed right-0 ${
            isHiddenPath ? "top-0" : "top-[80px]"
          } z-50`}
        >
          {userData.isLoggedIn ? (
            <SideProfileComp />
          ) : (
            <LoginComp onClose={closeUserComp} />
          )}
        </div>
      )}

      {/* ✅ 핵심: write / modify 페이지에서는 main padding 제거 */}
      <main className={isHiddenPath ? "" : "pt-[80px]"}>
        <Outlet />
      </main>

      {/* ✅ 작성/수정 페이지에서는 푸터 숨김 */}
      {!isHiddenPath && <FooterComp />}
    </>
  );
};

// ⭐️ AuthProvider로 감싼 Layout
const Layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default Layout;
