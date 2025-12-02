import { Route } from 'react-router-dom';
import HomeComp from '../pages/home/HomeComp';

const HomeRoutes = (
  // '/' 경로는 최상위 라우트에 있으므로 index로 정의
  <Route index element={<HomeComp />} />
);

export default HomeRoutes;
