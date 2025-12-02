import { Outlet, useLocation } from 'react-router-dom';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import LoginComp from './LoginComp';
import SearchComp from './SearchComp';
import SideProfileComp from './SideProfileComp';

// Header Footer 동시에 관리 Write와 Modify에서는 렌더링 되지 않도록 제어

const Layout = () => {
  // 1. 현재 URL 경로 정보를 가져옵니다.
  const location = useLocation();

  // 2. Header와 Footer를 숨길 경로의 '시작 부분'을 정의합니다.
  const HIDDEN_PATH_PREFIXES = ['/board/write', '/board/modify'];

  // 3. 현재 경로가 숨김 대상인지 확인하는 로직
  // 현재 경로(location.pathname)가 정의된 목록 중 어느 하나로 '시작'하는지 확인합니다.
  const isHiddenPath = HIDDEN_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  /* **예시 작동 방식:**
    - 현재 경로가 '/write' -> isHiddenPath: true
    - 현재 경로가 '/modify/123' -> isHiddenPath: true (modify로 시작하므로)
    - 현재 경로가 '/home' -> isHiddenPath: false
    */

  return (
    <>
      {/* isHiddenPath가 false일 때(숨길 경로가 아닐 때)만 Header 표시 */}
      {!isHiddenPath && <HeaderComp />}

      {!isHiddenPath && <LoginComp />}

      {!isHiddenPath && <SearchComp />}

      {!isHiddenPath && <SideProfileComp />}

      <main>
        {/* 모든 페이지의 콘텐츠는 여기서 렌더링됩니다. */}
        <Outlet />
      </main>

      {/* isHiddenPath가 false일 때(숨길 경로가 아닐 때)만 Footer 표시 */}
      {!isHiddenPath && <FooterComp />}
    </>
  );
};

export default Layout;
