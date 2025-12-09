// src/pages/home/HomeComp.jsx (완전한 최신 버전)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../common/HeaderComp';
import LoginComp from '../../common/LoginComp';
import './HomeComp.css';

// 장점 섹션 아이콘 이미지
import airplaneIcon from '../../assets/airplane.png';
import museumIcon from '../../assets/museum.png';
import earthIcon from '../../assets/earth.png';

// TOP3 슬라이드 카드 이미지
import topImage1 from '../../assets/forest1.png';
import topImage2 from '../../assets/forest2.png';
import topImage3 from '../../assets/forest3.png';

// 북마크 아이콘 이미지
import bookmarkOn from '../../assets/bookmark.png';
import bookmarkOff from '../../assets/bookmarkempty.png';

// ===== 새로 올라온 이야기 더미 데이터 =====
const initialRecentCards = [
  {
    id: 1,
    title: '겨울 홋카이도 설경 여행',
    author: 'travel_holic',
    date: '2025.12.01',
    summary: '삿포로·오타루·비에이를 돌면서 눈꽃 야경과 온천을 즐긴 4박 5일 코스입니다.',
    likeCount: 1.2,
    bookmarked: false,
    category: '일본 · 설경 여행',
  },
  {
    id: 2,
    title: '제주 한 달 살기 현실 후기',
    author: 'jejulife',
    date: '2025.11.28',
    summary: '애월 바닷가 근처에서 지내며 장단점, 생활비, 추천 동네를 정리했어요.',
    likeCount: 0.8,
    bookmarked: true,
    category: '제주 · 장기 체류',
  },
  {
    id: 3,
    title: '다낭 3박 5일 가족 여행',
    author: 'family_trip',
    date: '2025.11.20',
    summary: '바나힐·미케비치·호이안까지 아이들과 함께 다녀온 일정과 꿀팁을 정리했습니다.',
    likeCount: 2.4,
    bookmarked: false,
    category: '베트남 · 가족 여행',
  },
  {
    id: 4,
    title: '파리 박물관 투어 2일 코스',
    author: 'artlover',
    date: '2025.11.18',
    summary: '루브르·오르세·로댕 미술관을 무리 없이 도는 박물관 투어 루트입니다.',
    likeCount: 0.6,
    bookmarked: false,
    category: '프랑스 · 박물관 투어',
  },
  {
    id: 5,
    title: '강릉 카페 투어 당일치기',
    author: 'cafe_in_korea',
    date: '2025.11.12',
    summary: '경포대·안목 해변 위주로 하루 동안 돌아본 카페들을 지도와 함께 정리했어요.',
    likeCount: 1.0,
    bookmarked: false,
    category: '국내 · 카페 투어',
  },
  {
    id: 6,
    title: '스위스 인터라켄 하이킹',
    author: 'mountain_go',
    date: '2025.11.05',
    summary: '융프라우요흐·그린델발트 트레킹 코스를 초보자 관점에서 소개합니다.',
    likeCount: 3.1,
    bookmarked: true,
    category: '유럽 · 하이킹',
  },
  {
    id: 7,
    title: '방콕 야시장 먹거리 투어',
    author: 'foodie_trip',
    date: '2025.10.30',
    summary: '짜뚜짝·라차다 야시장에서 꼭 먹어봐야 할 길거리 음식들을 정리했습니다.',
    likeCount: 1.7,
    bookmarked: false,
    category: '태국 · 미식 여행',
  },
  {
    id: 8,
    title: '부산 해운대 & 광안리 야경 산책',
    author: 'sea_side',
    date: '2025.10.25',
    summary: '해운대에서 광안리까지 이어지는 야경 산책 코스와 포토 스팟을 소개해요.',
    likeCount: 0.9,
    bookmarked: false,
    category: '국내 · 야경 산책',
  },
  {
    id: 9,
    title: '뉴욕 브루클린 감성 카페 투어',
    author: 'ny_local',
    date: '2025.10.18',
    summary: '덤보와 브루클린 하이츠 일대의 분위기 좋은 로컬 카페들을 모아봤습니다.',
    likeCount: 2.0,
    bookmarked: true,
    category: '미국 · 도시 탐방',
  },
];

function HomeComp() {
  const navigate = useNavigate();

  // 로그인/프로필/로그인 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 새로 올라온 이야기 카드 상태
  const [recentCards, setRecentCards] = useState(initialRecentCards); // 배열 상태로 카드 리스트 렌더링[web:87][web:114]

  // 이번 주 TOP 3 슬라이드 데이터
  const slides = [
    {
      id: 1,
      title: '하늘 아래 첫 산, 새벽빛 설산 트레킹',
      summary:
        '이른 새벽에만 만날 수 있는 고요한 산 풍경. 숨이 멎을 만큼 맑았던 날씨 속에서 차분하게 걸어본 설산 코스예요.',
      imageUrl: topImage1,
      likeCount: 1234,
    },
    {
      id: 2,
      title: '도시와 바다가 만나는 모던 시티 바이크 투어',
      summary: '해안선을 따라 자전거를 타며, 도시의 스카이라인과 노을을 한 번에 담을 수 있었던 코스를 소개해요.',
      imageUrl: topImage2,
      likeCount: 980,
    },
    {
      id: 3,
      title: '숲 속에서 찾은 작은 온천 마을',
      summary: '눈이 소복이 쌓인 숲길 끝, 연기가 피어오르는 온천 마을에서 하루를 보내봤어요.',
      imageUrl: topImage3,
      likeCount: 752,
    },
  ];

  // 슬라이드 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const current = slides[currentIndex];

  // src/pages/home/HomeComp.jsx

  // 헤더 버튼 핸들러들 (로그인 여부에 따라 분기)
  // HomeComp.jsx 안의 handleUserClick 수정
  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate('/memberinfo'); // ✅ MemberInfoComp 라우트로 바로 이동
    } else {
      setIsLoginOpen(true); // 미로그인 시 로그인 모달
    }
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate('/board/write'); // WriteComp로 이동
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const toggleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  const goWeeklyMore = () => {
    navigate('/board/weekly-top');
  };

  const toggleCardBookmark = (id) => {
    setRecentCards((prev) => prev.map((card) => (card.id === id ? { ...card, bookmarked: !card.bookmarked } : card)));
  };

  const goMoreStories = () => {
    navigate('/board/list');
  };

  const goQnaPage = () => {
    navigate('/qna');
  };

  // HeaderComp에 전달할 props
  const headerProps = {
    onUserClick: handleUserClick,
    onWriteClick: handleWriteClick,
    isLoggedIn,
    onLoginOpen: () => setIsLoginOpen(true),
  };

  return (
    <>
      {/* Login 모달 */}
      <LoginComp open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />

      {/* 프로필 모달 */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">마이페이지</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-semibold">
                  R
                </div>
                <div>
                  <p className="font-semibold text-lg text-slate-900">Robert B.</p>
                  <p className="text-sm text-slate-500">robert@example.com</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/member'); // MemberInfoComp로 이동
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3"
                >
                  <span className="w-5 h-5 bg-slate-300 rounded text-slate-600 flex items-center justify-center text-xs">
                    👤
                  </span>
                  회원 정보
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3">
                  <span className="w-5 h-5 bg-slate-300 rounded text-slate-600 flex items-center justify-center text-xs">
                    ⭐
                  </span>
                  북마크
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3">
                  <span className="w-5 h-5 bg-slate-300 rounded text-slate-600 flex items-center justify-center text-xs">
                    ⚙️
                  </span>
                  설정
                </button>
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsProfileOpen(false);
                }}
                className="w-full py-3 px-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-100 font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HeaderComp */}
      <HeaderComp {...headerProps} />

      <div className="home-root pt-20">
        {/* ===== 히어로 섹션 ===== */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-text">
              <h1 className="home-hero-title font-roboto font-semibold text-hero-title">
                당신의 이야기가 시작되는 곳, Travly
              </h1>
              <p className="home-hero-subtitle">
                가장 새로운 여행 이야기가 당신을 기다려요! <br />
                매일매일 새로운 세상을 발견하세요
              </p>
            </div>
          </div>
        </section>

        {/* ===== 장점 섹션 ===== */}
        <section className="home-benefits-wrap">
          <div className="home-benefits">
            <h2 className="home-benefits-title">STEP UP YOUR TRAVEL GAME</h2>
            <p className="home-benefits-desc">
              최고의 여행 팁과 현지 정보, 그리고 여행자가 직접 기록한 실시간 루트를 탐색해보세요. <br />
              숨겨진 명소부터 필수 코스까지 한번에 확인할 수 있습니다.
            </p>
            <div className="home-benefits-cards">
              <article className="benefit-card">
                <div className="benefit-icon">
                  <img src={airplaneIcon} alt="여행 아이콘" className="w-6 h-6" />
                </div>
                <p className="benefit-text">
                  Travly는 여행자들이 직접 기록하고 <br />
                  공유하는 새로운 여행 기준을 제시합니다.
                  <br />
                  <span className="highlight-2a7fff">여행 경험의 진짜 가치를 발견하세요.</span>
                </p>
              </article>
              <article className="benefit-card">
                <div className="benefit-icon">
                  <img src={museumIcon} alt="추천 아이콘" className="w-6 h-6" />
                </div>
                <p className="benefit-text">
                  트래블리의 모든 여행 기록은 실제 사용자가
                  <br />
                  방문한 루트 기반으로 검증됩니다.
                  <br />
                  <span className="highlight-2a7fff">더 진실되고 생생한 여행 정보를 제공합니다.</span>
                </p>
              </article>
              <article className="benefit-card">
                <div className="benefit-icon">
                  <img src={earthIcon} alt="커뮤니티 아이콘" className="w-6 h-6" />
                </div>
                <p className="benefit-text">
                  전 세계 여행자들과 연결되고,
                  <br />
                  목적지 정보를 한곳에서 탐색하세요.
                  <br />
                  <span className="highlight-2a7fff">여행 커뮤니티의 새로운 기준</span>
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===== 이번 주 TOP 3 ===== */}
        <section className="w-full flex justify-center bg-slate-50 py-16">
          <div className="relative w-full max-w-[1440px] h-[700px] flex items-center justify-center overflow-hidden rounded-none bg-cover bg-center home-slide-bg">
            <div className="absolute top-[40px] w-[1080px] h-[80px] bg-amber-400 flex items-center justify-between px-8 box-border rounded-t-[8px]">
              <h2 className="text-[20px] font-semibold text-slate-900">
                이번 주 <span className="text-[#1492FF]">가장 많이</span> 찾은 이야기{' '}
                <span className="text-[#1492FF]">TOP 3</span>
              </h2>
              <button type="button" onClick={goWeeklyMore} className="text-sm text-sky-700 hover:text-sky-800">
                + 이번 주 인기 여행기 더 보기
              </button>
            </div>
            <div className="w-[1080px] h-[600px] bg-white rounded-[8px] shadow-[0_18px_40px_rgba(15,23,42,0.25)] flex flex-col pt-[90px] pb-10 px-10 box-border">
              <div className="mx-auto w-[1020px] h-[380px] flex justify-between">
                <div className="flex flex-col justify-between" style={{ width: '390px', height: '340px' }}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-3xl font-semibold text-slate-900 leading-snug">{current.title}</h3>
                      <button
                        type="button"
                        onClick={toggleBookmark}
                        aria-label="북마크"
                        className="w-7 h-7 flex items-center justify-center"
                      >
                        <img
                          src={bookmarked ? bookmarkOn : bookmarkOff}
                          alt={bookmarked ? '북마크됨' : '북마크'}
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    <p className="text-2xl leading-relaxed text-slate-700 whitespace-pre-line">{current.summary}</p>
                  </div>
                  <div className="mt-6 flex justify-end text-sm text-slate-500 gap-1">
                    <span className="text-rose-500">♥</span>
                    <span>{current.likeCount.toLocaleString()}명</span>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden rounded-[12px] bg-slate-900 flex items-center justify-center"
                  style={{ width: '500px', height: '380px' }}
                >
                  {current.imageUrl ? (
                    <img src={current.imageUrl} alt={current.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm opacity-70">여기 이미지가 들어갈 예정입니다.</span>
                  )}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      index === currentIndex ? 'bg-sky-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 새로 올라온 이야기 ===== */}
        <section className="w-full flex justify-center bg-white py-16">
          <div className="w-[1080px] h-[1690px] mx-auto box-border flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[24px] font-semibold text-slate-900">새로 올라온 이야기</h2>
              <button type="button" onClick={goMoreStories} className="text-sm text-sky-600 hover:text-sky-700">
                + 더 많은 이야기 둘러보기
              </button>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-6">
              {recentCards.map((card) => (
                <article
                  key={card.id}
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col"
                  style={{ width: '350px', height: '462px' }}
                >
                  <div className="bg-slate-300 overflow-hidden" style={{ width: '350px', height: '250px' }} />
                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[16px] font-semibold text-slate-900 line-clamp-1">{card.title}</h3>
                      <button
                        type="button"
                        onClick={() => toggleCardBookmark(card.id)}
                        aria-label="카드 북마크"
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                      >
                        <img
                          src={card.bookmarked ? bookmarkOn : bookmarkOff}
                          alt={card.bookmarked ? '북마크됨' : '북마크'}
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {card.author} | {card.date}
                    </p>
                    <p className="text-[13px] text-slate-600 line-clamp-2">{card.summary}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[12px] text-slate-400">도시 · 자전거 투어</span>
                      <span className="text-[13px] text-slate-500 flex items-center gap-1">
                        <span className="text-rose-500">♥</span>
                        <span>{card.likeCount}k</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Q&A 섹션 ===== */}
        <section className="w-full flex justify-center bg-slate-100 py-16">
          <div className="relative w-full max-w-[1440px] h-[600px] overflow-hidden rounded-none bg-cover bg-center home-qna-bg">
            <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
              <p className="text-[28px] font-semibold text-white mb-4 leading-snug">
                궁금한 점이 있으신가요? 언제든지 <span className="text-sky-400">Travly</span>에 물어보세요!
                <br />
                당신의 소중한 의견을 기다립니다.
              </p>
              <p className="text-[14px] text-slate-100 leading-relaxed">
                남겨주신 모든 문의는 소중하게 검토됩니다.
                <br />
                업무 시간(평일 09:00 ~ 18:00) 외 문의는 순차적으로 답변드립니다.
              </p>
            </div>
            <button
              type="button"
              onClick={goQnaPage}
              className="absolute right-16 bottom-12 flex items-center gap-2 px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-[0_10px_25px_rgba(37,99,235,0.5)]"
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">?</span>
              <span>문의하기</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomeComp;
