import React, { useState } from 'react';
import TravLyLogo01 from './images/TravLyLogo01.png';
import TravlyLogo02 from './images/TravlyLogo02.png';
import utilBell from './images/utilBell.png';
import utilPen from './images/utilPen.png';
import utilSearch from './images/utilSearch.png';
import utilUser from './images/utilUser.png';
import utilbellon from './images/utilbellon.png';
import { Link } from 'react-router-dom';
import NoticeComp from './NoticeComp';
import { useAuth } from './AuthStateContext';

function HeaderComp() {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const [hasNewNotice, setHasNewNotice] = useState(true);

  const { toggleUserComp } = useAuth();

  // 3. 종 아이콘 클릭 시 호출되는 함수
  const toggleNotice = () => {
    // 1. isNoticeOpen 상태를 먼저 반전시켜 알림창을 열거나 닫습니다.
    const nextState = !isNoticeOpen;
    setIsNoticeOpen(nextState);

    // 2. 알림 창을 '열 때' (nextState가 true일 때)만 새 알림 배지를 숨깁니다.
    //    *hasNewNotice가 true이고, 알림창을 여는 순간*에만 setHasNewNotice(false)를 호출합니다.
    if (nextState && hasNewNotice) {
      setHasNewNotice(false);
      // TODO: [백엔드 통신] 여기에 서버에 "알림 모두 읽음" API 호출 로직 추가
    }
  };

  return (
    <div className="container-fluid flex justify-between items-center px-[40px] h-[80px] relative">
      <Link to="/">
        <div className="flex h-[60px] ">
          <img src={TravlyLogo02} />
          <img src={TravLyLogo01} />
        </div>
      </Link>

      <ul className="flex w-[258px] h-[48px] justify-between">
        <li>
          <Link to="/board">
            <img src={utilSearch} />
          </Link>
        </li>
        <li>
          <Link to="/board/write">
            <img src={utilPen} />
          </Link>
        </li>
        <li className="cursor-pointer" onClick={toggleUserComp}>
          <img src={utilUser} />
        </li>
        {/* 4. 알림 종 부분 수정 */}
        <li className="cursor-pointer relative" onClick={toggleNotice}>
          {/* 5. 아이콘 이미지 변경 로직 */}
          <img src={isNoticeOpen ? utilbellon : utilBell} alt="알림" />

          {/* 6. 새 알림 배지 (빨간 점) */}
          {hasNewNotice && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-1 border-white"></div>
          )}
          {/* 7. NoticeComp 표시/숨김 로직 */}
          {isNoticeOpen && <NoticeComp />}
        </li>
      </ul>
    </div>
  );
}

export default HeaderComp;
