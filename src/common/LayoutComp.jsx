// src/common/LayoutComp.jsx
import { Outlet, useLocation } from 'react-router-dom';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';

// 변경: 더 이상 여기서는 LoginComp / SearchComp / SideProfileComp를 import하지 않음
// 모달 관리는 HeaderComp 안에서만 처리

const LayoutComp = () => {
  // 1. 현재 URL 경로 정보를 가져옵니다.
  const location = useLocation();

  // 2. Header와 Footer를 숨길 경로의 '시작 부분'을 정의합니다.
  const HIDDEN_PATH_PREFIXES = ['/board/write', '/board/modify'];

  // 3. 현재 경로가 숨김 대상인지 확인하는 로직
  const isHiddenPath = HIDDEN_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <>
      {/* isHiddenPath가 false일 때(숨길 경로가 아닐 때)만 Header 표시 */}
      {!isHiddenPath && <HeaderComp />}

      {/* 변경: main에 Tailwind로 헤더 높이만큼 padding-top 적용 */}
      <main className={!isHiddenPath ? 'pt-20' : ''}>
        {/* 모든 페이지의 콘텐츠는 여기서 렌더링됩니다. */}
        <Outlet />
      </main>

      {/* isHiddenPath가 false일 때(숨길 경로가 아닐 때)만 Footer 표시 */}
      {!isHiddenPath && <FooterComp />}
    </>
  );
};

export default LayoutComp;
