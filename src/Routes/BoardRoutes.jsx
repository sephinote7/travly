import { Route } from 'react-router-dom';
import BoardComp from '../pages/home/board/BoardComp';
import ListComp from '../pages/home/board/ListComp';
import WriteComp from '../pages/home/board/WriteComp';
import ModifyComp from '../pages/home/board/ModifyComp';
import ViewComp from '../pages/home/board/ViewComp';
import CommentComp from '../pages/home/board/CommentComp'; // 일반적으로 ViewComp 내부에 렌더링되지만, 라우팅을 분리할 경우

// Board 관련 라우트 설정을 JSX 엘리먼트 형태로 반환
const BoardRoutes = (
  // 부모 경로: /board
  <Route path="board" element={<BoardComp />}>
    {/* 1. 목록 (ListComp) */}
    {/* URL: /board */}
    {/* URL: /board?userid=123&title=ㅇㅇ&... */}
    <Route index element={<ListComp />} />

    {/* 2. 글 작성 (WriteComp) - Header/Footer 숨김 대상 */}
    {/* URL: /board/write */}
    <Route path="write" element={<WriteComp />} />

    {/* 3. 글 상세 보기 (ViewComp) */}
    {/* URL: /board/view?id=123 */}
    <Route path="view" element={<ViewComp />} />

    {/* 4. 글 수정 (ModifyComp) - Header/Footer 숨김 대상 */}
    {/* URL: /board/modify?id=123*/}
    <Route path="modify" element={<ModifyComp />} />

    {/* 5. 댓글 (CommentComp): Comment는 보통 ViewComp 내부에 렌더링되므로, 별도 라우트가 필요하지 않을 수 있지만, 
           만약 독립적인 페이지가 필요하다면 위처럼 정의합니다. 
           (일반적으로는 ViewComp 내부에서 렌더링됩니다.)
        */}
  </Route>
);

export default BoardRoutes;
