// src/App.jsx (요청하신 대로 BoardRoutes만 수정)

import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 1. 컴포넌트 및 Context import
import Layout from './common/Layout';
import SignupComp from './pages/signup/SignupComp';
import MemberInfoComp from '../src/pages/memberInfo/MemberInfoComp';
import MemberInfoModify from '../src/pages/memberInfo/MemberInfoModifyComp';
import { AuthProvider } from './common/AuthStateContext';

// 2. ⭐ BoardRoutes만 Named Export된 배열로 가져옵니다.
//    - BoardRoutes.jsx에서 export const boardRoutes = [...] 가정
import { boardRoutes } from './Routes/BoardRoutes';

// 3. HomeRoutes와 QnaRoutes는 기존대로 Default Export로 가져옵니다.
//    - HomeRoutes.jsx에서 export default HomeRoutes; 가정
import HomeRoutes from './Routes/HomeRoutes';
//    - QnaRoutes.jsx에서 export default QnaRoutes; 가정
import QnaRoutes from './Routes/QnaRoutes';

/* eslint-disable */
function App() {
  return (
    <>
      <Routes>
        {/* 전체 레이아웃 적용 */}
        <Route path="/" element={<Layout />}>
          {/* ⭐ 1. BoardRoutes만 배열 전개 구문으로 삽입 (오류 해결 및 요청 반영) */}
          {[...boardRoutes]}

          {/* 2. HomeRoutes와 QnaRoutes는 기존 방식대로 변수 자체를 삽입 (요청 유지) */}
          {HomeRoutes}
          {QnaRoutes}

          {/* 3. 기타 개별 라우트 유지 */}
          <Route path="signup" element={<SignupComp />} />
          <Route path="memberinfo" element={<MemberInfoComp />} />
          <Route path="memberinfo/modify" element={<MemberInfoModify />} />

          {/* 기존에 있던 불필요한 라우트 정의는 제거했습니다. 
             (예: <Route path="/*" element={<BoardRoutes />} />) */}
        </Route>

        {/* 404 라우트 추가 (Layout 밖에 위치) */}
        <Route path="*" element={<div>404 Not Found Page</div>} />
      </Routes>
    </>
  );
}

export default App;
