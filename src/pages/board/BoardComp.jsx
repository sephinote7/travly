import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

function BoardComp() {
  return (
    <div>
      {/* Header와 Footer가 숨겨지더라도, 게시판의 공통 레이아웃은 여기에 유지 /}

      {/ URL에 따라 ListComp, WriteComp, ModifyComp 중 하나가 이 자리에 렌더링됨 */}
      <Outlet />
    </div>
  );
}

export default BoardComp;
