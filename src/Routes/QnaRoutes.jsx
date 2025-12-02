import { Route } from 'react-router-dom';
import QnaComp from '../pages/qna/QnaComp';
import QnaListComp from '../pages/qna/QnaListComp';
import QnaWriteComp from '../pages/qna/QnaWriteComp';

const QnaRoutes = (
  <Route path="qna" element={<QnaComp />}>
    <Route index element={<QnaListComp />} />
    <Route path="write" element={<QnaWriteComp />} />
  </Route>
);
export default QnaRoutes;
