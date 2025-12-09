import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BoardRoutes from './Routes/BoardRoutes';
import LayoutComp from './common/LayoutComp';
import HomeRoutes from './Routes/HomeRoutes';
import QnaRoutes from './Routes/QnaRoutes';
import SignupComp from './pages/signup/SignupComp';
import MemberInfoRoutes from './Routes/MemberInfoRoutes';
import MemberInfoComp from '../src/pages/memberInfo/MemberInfoComp';
import MemberInfoModify from '../src/pages/memberInfo/MemberInfoModifyComp';
import BoardRoutes from './Routes/BoardRoutes';
import PlannerMap from './pages/board/components/PlannerMap';
import ListComp from './pages/board/ListComp';
import MyBoardListPage from './pages/board/MyBoardListPage';

/* eslint-disable */
function App() {
  return (
    <>
      <Routes>
        {/* 전체 레이아웃 적용 */}
        <Route path="/" element={<LayoutComp />}>
          {/* 1. Board 관련 모든 라우트를 한 줄로 통합 */}
          {BoardRoutes}
          <Route path="write" element={<PlannerMap />} />
          <Route path="/posts" element={<ListComp />} />
          <Route path="/my-list" element={<MyBoardListPage />} />
          {/* 2. 나머지 라우트 (최상위 및 기타) */}
          {HomeRoutes}
          {QnaRoutes}
          <Route path="signup" element={<SignupComp />} />
          <Route path="memberinfo" element={<MemberInfoComp />} />
          <Route path="memberinfo/modify" element={<MemberInfoModify />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
