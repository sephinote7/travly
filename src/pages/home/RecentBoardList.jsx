import { useEffect, useState } from 'react'; // API 연동 및 상태 관리를 위해 추가
import axios from 'axios'; // API 호출을 위해 추가

import { Link, useNavigate } from 'react-router-dom';

// 이미지 import는 그대로 유지
import testprofile from '../../common/images/testprofile.gif';
import noimage from '../../common/images/noimage.png';
import badge01 from '../../common/images/badge01.png';
import badge02 from '../../common/images/badge02.png';
import badge03 from '../../common/images/badge03.png';
import badge04 from '../../common/images/badge04.png';
import badge05 from '../../common/images/badge05.png';
import dayjs from 'dayjs';

import apiClient from '../../services/apiClient';

export default function RecentBoardList() {
  const navigate = useNavigate();

  // 💡 1. 상태 추가: 게시글 데이터와 로딩 상태
  const [recentBoards, setRecentBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 2. 배지 이미지 맵 (ID에 따라 이미지 동적 선택)
  const badgeImages = {
    1: badge01,
    2: badge03, // 예시로 맵핑 ID를 변경했습니다.
    3: badge05,
    4: badge02,
    5: badge04,
  };

  const IMAGE_BASE_URL = 'http://localhost:8080/api/travly/file/';

  // -----------------------------
  // 3. API 연동 로직 (가장 중요)
  // -----------------------------
  useEffect(() => {
    apiClient
      .get('/board?size=9&page=0&orderby=updated') // 🎯 API 경로 확인
      .then((res) => {
        const boardList = res.data.content || [];

        setRecentBoards(boardList);
        setIsLoading(false); // 로드 성공
        console.log('recentBoard', boardList);
      })
      .catch((err) => {
        console.error('최신 게시글 로드 실패:', err);
        setIsLoading(false); // 로드 실패 시에도 로딩 상태 해제
      });
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회만 실행

  // 태그를 형식에 맞게 변환하는 함수 (기존과 동일)
  const formatTags = (tags) => {
    if (!tags || tags.length === 0) return '';
    const limitedTags = tags
      .slice(0, 3)
      .map((tag) => `#${tag}`)
      .join(' ');
    return tags.length > 3 ? `${limitedTags} ...` : limitedTags;
  };

  // 사용자 프로필로 이동하는 핸들러 함수 (기존과 동일)
  const handleProfileClick = (e, memberId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/board/member/${memberId}`);
  };

  return (
    <section className="py-[50px] max-w-[1080px] mx-auto">
      <div className="flex justify-between items-end mb-8 relative">
        <h2 className="h2 font-semibold w-full text-center">
          새로 올라온 이야기
        </h2>
        <Link
          to="/board?size=10&page=0&orderby=updated"
          className="text-sky-400 font-bold hover:text-sky-900 absolute right-0 top-0"
        >
          + 더 많은 글 보기
        </Link>
      </div>

      {/* 💡 4. 로딩 중 UI 처리 */}
      {isLoading ? (
        <p className="text-center text-gray-500 h4 py-10">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* 💡 5. recentBoards 데이터 사용 */}
          {recentBoards.map((board, i) => (
            <Link key={board.id} to={`/board/${board.id}`} className="block">
              <div className="bg-white border border-neutral-500 shadow rounded-xl overflow-hidden w-[350px] h-[590px] transition duration-300 hover:shadow-xl">
                <img
                  // 썸네일 파일명을 서버 경로와 합쳐 완전한 URL을 만듭니다.
                  src={
                    board.thumbnailFilename
                      ? IMAGE_BASE_URL + board.thumbnailFilename
                      : noimage
                  }
                  className="w-full h-[250px] object-cover border-b  border-neutral-500"
                  alt={board.title}
                />

                <div className="p-4 flex flex-col justify-between h-[300px]">
                  <div>
                    {/* 제목 */}
                    <h4 className="h4 mb-[20px] hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                      {board.title}
                    </h4>

                    {/* 날자 */}
                    <p className="ctext text-right mb-3 text-gray-500">
                      {board.updatedAt
                        ? dayjs(board.updatedAt).format('YYYY.MM.DD | HH:mm')
                        : '날짜 미정'}
                    </p>

                    {/* 배지 & 프로필 영역 */}
                    <div
                      className="flex justify-between items-center mb-6 cursor-pointer"
                      onClick={(e) => handleProfileClick(e, board.memberId)}
                    >
                      {/* 프로필 및 뱃지*/}
                      <div className="flex gap-4 items-center  p-1 ms-auto">
                        <img
                          src={
                            board.memberThumbail
                              ? IMAGE_BASE_URL + board.memberThumbail
                              : testprofile
                          }
                          className="w-[50px] h-[50px] rounded-full border border-neutral-500 object-cover"
                          alt="profile"
                        />
                        <div className="flex flex-col text-right">
                          <p className="p font-bold">{board.memberNickname}</p>
                          {/* 💡 DTO 필드명에 맞춰 board.createdAt 사용 */}
                          <img
                            // 💡 배지 ID에 따라 동적으로 이미지 설정
                            src={
                              board.badgeId && badgeImages[board.badgeId]
                                ? badgeImages[board.badgeId]
                                : null
                            }
                            className="w-[70px] h-[25px]"
                            alt="badge"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 태그 */}
                    <p className="ctext mb-[20px] line-clamp-1">
                      {formatTags(board.filterItemNames)}
                    </p>

                    {/* 본문 */}
                    <p className="ctext line-clamp-4 h-[65px] hover:underline">
                      {board.placeContent}
                    </p>
                  </div>

                  {/* 좋아요 및 조회수 */}
                  <div className="flex gap-4 ms-auto w-full justify-end mt-4">
                    <p className="text-red-500 ctext flex items-center gap-1">
                      <span className="text-lg">❤️</span>
                      {board.likeCount}
                    </p>
                    <p className="text-gray-600 ctext flex items-center gap-1">
                      <span className="text-lg">👁️</span>
                      {board.viewCount}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
