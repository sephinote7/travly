import { Route } from 'react-router-dom';
import MemberInfoComp from '../pages/memberInfo/MemberInfoComp';
import MemberInfoModify from '../pages/memberInfo/MemberInfoModifyComp';

const MemberInfoRoutes = (
  <Route path="memberinfo" element={<MemberInfoComp />}>
    <Route index element={<MemberInfoComp />} />
    <Route path="modify" element={<MemberInfoModify />} />
  </Route>
);
export default MemberInfoRoutes;
