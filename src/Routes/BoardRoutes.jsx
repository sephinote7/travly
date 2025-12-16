import React from 'react';
import { Route } from 'react-router-dom';
import BoardComp from '../pages/board/BoardComp';
import ListComp from '../pages/board/ListComp';
import WriteComp from '../pages/board/WriteComp'; // ⭐ 이름이 PlannerMap이지만 WriteComp로 사용한다고 가정
import ModifyComp from '../pages/board/ModifyComp';
import ViewComp from '../pages/board/ViewComp';

// ⭐ Named Export로 Route 엘리먼트 배열을 정의합니다. (오류 해결 핵심)
export const boardRoutes = [
  // 부모 경로: /board
  <Route key="board-root" path="board" element={<BoardComp />}>
    {/* URL: /board (index는 부모 경로와 동일) */}
    <Route index element={<ListComp />} />

    {/* URL: /board/write */}
    <Route path="write" element={<WriteComp />} />

    {/* URL: /board/view/1, /board/view/2 등으로 파라미터 받음 */}
    <Route path=":id" element={<ViewComp />} />

    {/* URL: /board/modify/1 */}
    <Route path="modify/:id" element={<ModifyComp />} />
  </Route>,
];
