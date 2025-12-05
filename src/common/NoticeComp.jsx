import React, { useState, useEffect } from 'react'; // ① useEffect와 useState 임포트
import { Link } from 'react-router-dom';
import rightArrow from './images/rightArrow.png';

// 임시 알림 데이터 (실제로는 API에서 가져와야 함)
const dummyNotices = [
  {
    id: 1,
    title: '가을 여행 기록',
    content: '정말재밋어보여요 와너무재밋겟어요',
    url: '/#',
  },
  {
    id: 2,
    title: '와와와와',
    content:
      "칭호 '여행 입문자'를 획득했습니다. ㅁㄴㄹㄴㅇㅁㄹㅇㄴㅁㄹㄴㅇㅁㄹㅇㄴㅁ",
    url: '/#',
  },
  {
    id: 3,
    title: 'sdasdfasdfsad',
    content: '겨울 이벤트 게시글이 등록되었습니다.',
    url: '/#',
  },
];

function NoticeComp() {
  // 알림 목록 상태
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 처음 렌더링될 때 (알림 창이 열릴 때) 데이터를 가져옵니다.
  useEffect(() => {
    // **TODO: [백엔드 통신]**
    // 실제 API 호출 로직을 여기에 작성하세요.
    // 예: fetch('/api/notifications')

    // **임시 데이터 사용:**
    setTimeout(() => {
      // API 호출 지연을 흉내냅니다.
      setNotices(dummyNotices);
      setIsLoading(false);
    }, 300);

    return () => {
      // 컴포넌트가 사라질 때 (알림 창이 닫힐 때) 정리 작업이 필요하면 여기에 작성합니다.
    };
  }, []); // 빈 배열: 최초 렌더링 시 1회만 실행

  return (
    <div className="absolute top-[60px] right-0 w-[300px] gap-2.5 flex flex-col bg-white p-5 z-10 shadow-lg rounded-[5px]">
      {/* z-10 추가로 다른 요소 위로 올림 */}
      <div className="flex flex-col gap-4">
        <h5 className="font-bold border-b border-neutral-500">새 댓글 알림</h5>

        {/* 2. 로딩 상태 표시 */}
        {isLoading && (
          <p className="text-gray-500 ctext">알림 불러오는 중...</p>
        )}

        {/* 3. 알림 목록 반복 출력 */}
        {!isLoading && (
          <div className="flex flex-col gap-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <Link
                  to={notice.url}
                  key={notice.id}
                  className="block hover:bg-gray-100 p-1 rounded transition-colors"
                >
                  <div className="flex flex-col justify-between gap-2">
                    <p className="font-bold truncate">{notice.title}</p>{' '}
                    <p className="ctext truncate">{notice.content}</p>
                    {/* 텍스트가 너무 길면 잘리도록 truncate 추가 */}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">새로운 알림이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeComp;
