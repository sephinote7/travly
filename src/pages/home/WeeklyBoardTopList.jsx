import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

import testprofile from '../../common/images/testprofile.gif';
import noimage from '../../common/images/noimage.png';
import badge01 from '../../common/images/badge01.png';
import badge02 from '../../common/images/badge02.png';
import badge03 from '../../common/images/badge03.png';
import badge04 from '../../common/images/badge04.png';
import badge05 from '../../common/images/badge05.png';
import rightArrow from '../../common/images/rightArrow.png';

// Spring API 연동을 위한 서비스 import
import { getWeeklyTopBoards } from '../../util/boardService';

export default function WeeklyBoardTopList() {
  const [topBoards, setTopBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 더미 데이터 (Spring API가 준비되지 않았을 때 사용)
  const dummyBoards = [
    {
      id: 1,
      title: 'sadfsdafdsa08',
      createdAt: '2025.12.09 | 18:08',
      memberName: 'test04',
      memberId: 1,
      profileImg: testprofile,
      badgeId: 1,
      thumbnailUrl: noimage,
      likeCount: 0,
      viewCount: 1234,
      content: '여행 이야기 내용입니다...',
      tags: ['여행', '추천'],
    },
    {
      id: 2,
      title: '제주도 여행 후기',
      createdAt: '2025.12.08 | 14:30',
      memberName: 'traveler01',
      memberId: 2,
      profileImg: testprofile,
      badgeId: 2,
      thumbnailUrl: noimage,
      likeCount: 45,
      viewCount: 2345,
      content: '제주도의 아름다운 풍경을 담았습니다...',
      tags: ['제주도', '바다', '카페'],
    },
    {
      id: 3,
      title: '서울 명소 탐방기',
      createdAt: '2025.12.07 | 10:15',
      memberName: 'explorer02',
      memberId: 3,
      profileImg: testprofile,
      badgeId: 3,
      thumbnailUrl: noimage,
      likeCount: 78,
      viewCount: 3456,
      content: '서울의 숨겨진 명소들을 찾아다녔습니다...',
      tags: ['서울', '명소', '도시'],
    },
  ];

  const badgeImages = {
    1: badge01,
    2: badge02,
    3: badge03,
    4: badge04,
    5: badge05,
  };

  // Spring API에서 데이터 가져오기
  useEffect(() => {
    const fetchTopBoards = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getWeeklyTopBoards();

        if (result.success) {
          // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
          // Spring API 응답 형식에 맞게 조정 필요
          setTopBoards(result.data || []);
        } else {
          // API 호출 실패 시 더미 데이터 사용
          console.warn('API 호출 실패, 더미 데이터 사용:', result.error);
          setTopBoards(dummyBoards);
        }
      } catch (err) {
        console.error('데이터 로딩 중 오류 발생:', err);
        setError(err.message);
        // 에러 발생 시 더미 데이터 사용
        setTopBoards(dummyBoards);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopBoards();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <section className="w-full bg-white">
        <div className="bg-yellow-400 py-4">
          <div className="max-w-[1080px] mx-auto px-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              이번 주 <span className="text-blue-500">가장 많이 찾은 이야기</span> TOP 3
            </h2>
          </div>
        </div>
        <div className="bg-white py-8">
          <div className="max-w-[1080px] mx-auto px-4 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  // 에러 발생 시 표시
  if (error && topBoards.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="bg-yellow-400 py-4">
          <div className="max-w-[1080px] mx-auto px-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              이번 주 <span className="text-blue-500">가장 많이 찾은 이야기</span> TOP 3
            </h2>
          </div>
        </div>
        <div className="bg-white py-8">
          <div className="max-w-[1080px] mx-auto px-4 text-center">
            <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      {/* 노란색 헤더 */}
      <div className="bg-yellow-400 py-4">
        <div className="max-w-[1080px] mx-auto px-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            이번 주 <span className="text-blue-500">가장 많이 찾은 이야기</span> TOP 3
          </h2>
          <Link to="/board" className="text-sm hover:underline">
            <span className="text-blue-500">+</span> 이번 주 인기 여행기 더 보기
          </Link>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="bg-white py-8 relative">
        <div className="max-w-[1080px] mx-auto px-4">
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              autoplay={{ delay: 5000 }}
              loop
              className="w-full"
            >
              {topBoards.map((board) => (
                <SwiperSlide key={board.id}>
                  <Link to={`/board/${board.id}`} className="block">
                    <div className="bg-white p-8 rounded-xl shadow relative w-full min-h-[460px]">
                      {/* --- Left Title Only (왼쪽 상단) --- */}
                      <div className="absolute left-8 top-8">
                        {/* Title with Edit Icon */}
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-extrabold text-black">{board.title}</h3>
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* --- Right Image with Info --- */}
                      <div className="flex items-center justify-end h-full pr-8">
                        <div className="flex items-center gap-0">
                          {/* Info - 이미지 왼쪽에 배치 */}
                          <div className="flex flex-col gap-10 pr-4 justify-between h-[380px]">
                            {/* Date */}
                            <p className="text-gray-400 text-sm mt-8">{board.createdAt}</p>

                            {/* User Info */}
                            <Link to={`/board/member/${board.memberId}`} onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                                  <img
                                    src={board.profileImg ?? testprofile}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-sm font-bold text-black mb-1">{board.memberName}</p>
                                  <div>
                                    <img
                                      src={badgeImages[board.badgeId] ?? badge01}
                                      alt="badge"
                                      className="h-4 object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>

                            {/* ID (AGFJNO8 같은 식별자) */}
                            <p className="text-gray-400 text-xs">{board.id}</p>

                            {/* Like + View */}
                            <div className="flex items-center gap-6 text-gray-700 font-semibold">
                              <div className="flex items-center gap-2">
                                <span className="text-red-500 text-lg">❤️</span>
                                <span className="text-black">{board.likeCount}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-lg">👁️</span>
                                <span className="text-black">{board.viewCount}</span>
                              </div>
                            </div>
                          </div>

                          {/* Image */}
                          <div className="w-full md:w-[480px] h-[380px]">
                            <img
                              src={board.thumbnailUrl ?? noimage}
                              alt="thumbnail"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 커스텀 네비게이션 화살표 - 양쪽 끝에 위치 (화면 끝까지) */}
            <button className="swiper-button-prev-custom absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition transform rotate-180">
              <img src={rightArrow} alt="prev" className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-custom absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
              <img src={rightArrow} alt="next" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
