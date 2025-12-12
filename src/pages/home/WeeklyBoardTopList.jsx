import { useEffect, useState } from 'react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link, useNavigate } from 'react-router-dom';

import testprofile from '../../common/images/testprofile.gif';
import noimage from '../../common/images/noimage.png';
import badge01 from '../../common/images/badge01.png';
import badge02 from '../../common/images/badge02.png';
import badge03 from '../../common/images/badge03.png';
import badge04 from '../../common/images/badge04.png';
import badge05 from '../../common/images/badge05.png';
import weeklyboard from './images/weeklyboard.png';
import dayjs from 'dayjs';

import apiClient from '../../services/apiClient';

export default function WeeklyBoardTopList() {
  const [topBoards, setTopBoards] = useState([]);

  const navigate = useNavigate();

  const badgeImages = {
    1: badge01,
    2: badge02,
    3: badge03,
    4: badge04,
    5: badge05,
  };

  const IMAGE_BASE_URL = 'http://localhost:8080/api/travly/file/id/';
  const IMAGE_THUMBNAIL_URL = 'http://localhost:8080/api/travly/file/';

  // -----------------------------
  // 1) Spring API 연동
  // -----------------------------
  useEffect(() => {
    apiClient
      .get('/board?size=3&page=0&orderby=like') // 🎯 API 경로 확인
      .then((res) => {
        const boardList = res.data.content || [];

        setTopBoards(boardList);
        console.log('WeeklyBoard', boardList);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section
      className="py-12  h-[700px]"
      style={{ backgroundImage: `url(${weeklyboard})` }}
    >
      <div className="w-[1080px] mx-auto px-4 flex flex-col items-center">
        <div className="flex justify-between mx-auto rounded-t-[10px] items-center h-[100px] w-[1080px] px-[30px] bg-amber-300">
          <h2 className="h3 ">
            이번 주 <span className="text-sky-400">가장 많이 찾은 이야기</span>{' '}
            TOP 3
          </h2>
          <Link
            to="/board?size=10&page=0&orderby=like"
            className="font-bold text-sky-400 hover:text-sky-900"
          >
            + 이번 주 인기 여행기 더 보기
          </Link>
        </div>

        {/* -----------------------------
            2) 데이터가 없을 때 로딩
           ----------------------------- */}
        {topBoards.length === 0 ? (
          <p className="text-gray-500 w-[1080px] mx-auto rounded-b-[10px] overflow-hidden bg-white h-[460px] flex justify-center items-center h2">
            로딩 중...
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 10000 }}
            loop
            className="rounded-xl overflow-hidden w-[1080px] h-[full]"
          >
            {topBoards.map((board) => (
              <SwiperSlide key={board.id}>
                {/* 전체 카드 클릭 시 board 상세페이지로 이동 */}
                <Link to={`/board/${board.id}`} className="block w-full h-full">
                  <div className="bg-white p-8 rounded-b-[10px] shadow flex flex-col md:flex-row gap-8 w-full h-[460px] justify-between">
                    {/* --- Left Text Area --- */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Title */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="h2 font-extrabold hover:underline">
                          {board.title && board.title.length > 25
                            ? `${board.title.substring(0, 20)}...`
                            : board.title}
                        </h3>
                        <span className="text-yellow-400 text-2xl">🔖</span>
                      </div>

                      {/* Date */}
                      <p className="text-gray-500 p mb-4 ms-auto">
                        {dayjs(board.createdAt).format('YYYY.MM.DD | HH:mm')}
                      </p>

                      {/* User Info */}

                      <div
                        // 마우스 커서를 포인터로 변경하여 클릭 가능한 요소처럼 보이게 함
                        style={{ cursor: 'pointer' }}
                        // 1. 이벤트 전파 방지: 이 부분이 핵심! 상위 게시글 링크(A)로 클릭 이벤트가 전달되는 것을 막음.
                        onClick={(e) => {
                          e.stopPropagation();

                          // 2. 프로그래밍 방식으로 페이지 이동
                          navigate(`/board/member/${board.memberId}`);
                        }}
                      >
                        <div className="flex items-center gap-5 mb-4 ms-auto">
                          <img
                            src={
                              board.memberThumbail
                                ? IMAGE_THUMBNAIL_URL + board.memberThumbail
                                : testprofile
                            }
                            alt="profile"
                            className="w-[70px] h-[70px] rounded-full object-cover hover:opacity-80 transition ms-auto block border border-neutral-500"
                          />

                          <div className="flex  gap-3 flex-col">
                            <p className="h5 text-right">
                              {board.memberNickname}
                            </p>
                            <img
                              src={badgeImages[board.badgeId]}
                              alt="badge"
                              className="w-[90px] h-[30px] mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="ctext mb-4 line-clamp-1">
                        {/* 1. 태그 목록을 최대 5개까지 잘라냅니다. */}
                        {board.filterItemNames?.slice(0, 5).map((tag, idx) => (
                          <span key={idx} className="mr-2">
                            #{tag}
                          </span>
                        ))}

                        {/* 2. 전체 태그 개수가 5개를 초과하는지 확인합니다. */}
                        {board.tags && board.tags.length > 5 && (
                          <span className="mr-2 text-gray-500">...</span>
                        )}
                      </div>

                      {/* Content */}
                      <p className="p line-clamp-3 h-auto mb-6 hover:underline">
                        {board.placeContent ?? ''}
                      </p>

                      {/* Like + View */}
                      <div className="flex items-center gap-6 text-gray-700 font-semibold ms-auto">
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
                      // ⭐ 수정: board.cardImg 자체가 완전한 URL입니다.
                      src={
                        board.placeFileId
                          ? IMAGE_BASE_URL + board.placeFileId
                          : noimage
                      }
                      alt={board.placeFileId}
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
