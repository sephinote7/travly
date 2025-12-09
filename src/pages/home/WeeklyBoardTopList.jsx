import { useEffect, useState } from 'react';
import axios from 'axios';

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

export default function WeeklyBoardTopList() {
  const [topBoards, setTopBoards] = useState([]);

  const badgeImages = {
    1: badge01,
    2: badge02,
    3: badge03,
    4: badge04,
    5: badge05,
  };

  // -----------------------------
  // 1) Spring API 연동
  // -----------------------------
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/travly/board/top3')
      .then((res) => {
        setTopBoards(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-12 bg-[#f8fbe1] h-[700px]">
      <div className="max-w-[1080px] mx-auto px-4 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-xl font-semibold">
            이번 주{' '}
            <span className="text-green-600">가장 많이 찾은 이야기</span> TOP 3
          </h2>
          <Link to="/board" className="text-sm text-gray-500 hover:text-black">
            + 더 많은 인기글 보기
          </Link>
        </div>

        {/* -----------------------------
            2) 데이터가 없을 때 로딩
           ----------------------------- */}
        {topBoards.length === 0 ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 10000 }}
            loop
            className="rounded-xl overflow-hidden w-[1080px] h-[460px]"
          >
            {topBoards.map((board) => (
              <SwiperSlide key={board.id}>
                {/* 전체 카드 클릭 시 board 상세페이지로 이동 */}
                <Link to={`/board/${board.id}`} className="block w-full h-full">
                  <div className="bg-white p-8 rounded-xl shadow flex flex-col md:flex-row gap-8 w-full h-[460px] justify-between">
                    {/* --- Left Text Area --- */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Title */}
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-2xl font-extrabold hover:underline">
                          {board.title}
                        </h3>
                        <span className="text-yellow-400 text-2xl">🔖</span>
                      </div>

                      {/* Date */}
                      <p className="text-gray-500 text-sm mb-4 ms-auto">
                        {board.createdAt}
                      </p>

                      {/* User Info */}
                      <Link
                        to={`/board/member/${board.memberId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-5 mb-4 ms-auto">
                          <img
                            src={board.profileImg ?? testprofile}
                            alt="profile"
                            className="w-30 h-30 rounded-full object-cover hover:opacity-80 transition ms-auto"
                          />

                          <div className="flex  gap-3 flex-col">
                            <p className="text-sm font-semibold text-right">
                              {board.memberName}
                            </p>
                            <img
                              src={badgeImages[board.badgeI d]}
                              alt="badge"
                              className="w-[100px] h-[40px] mt-1"
                            />
                          </div>
                        </div>
                      </Link>

                      {/* Tags */}
                      <div className="text-gray-500 text-sm mb-4">
                        {board.tags?.map((tag, idx) => (
                          <span key={idx} className="mr-2">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-gray-700 text-[16px] leading-relaxed mb-6 hover:underline">
                        {board.content?.substring(0, 70) ?? ''}
                      </p>

                      {/* Like + View */}
                      <div className="flex items-center gap-6 text-gray-700 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 text-lg">❤️</span>
                          <span>{board.likeCount}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-lg">👁️</span>
                          <span>{board.viewCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* --- Right Image (클릭 시 board 상세로 이동) --- */}
                    <img
                      src={board.thumbnailUrl ?? noimage}
                      alt="thumbnail"
                      className="w-full md:w-[480px] h-[380px] object-cover rounded-xl hover:opacity-90 transition"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
