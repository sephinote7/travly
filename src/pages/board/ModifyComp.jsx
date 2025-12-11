// src/pages/memberInfo/MemberInfoComp.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// src/pages/memberInfo/MemberInfoComp.jsx

import defaultAvatar from '../../common/images/logo2.png';
import thumb1 from '../../common/images/forest1.png';
import thumb2 from '../../common/images/forest2.png';
import thumb3 from '../../common/images/forest3.png';

const PROFILE_STORAGE_KEY = 'travlyProfile';

// 내가 작성한 글 더미 데이터
const myPostsDummy = [
  {
    id: 1,
    title: '겨울 은하수가 쏟아지는 밤하늘',
    dateTime: '2025/12/03 11:10',
    location: '전북 익산시',
    distance: '157km',
    tags: ['#한국의_밤하늘', '#별투어', '#2박3일', '#자연', '#여행지_느낌'],
    thumbnail: thumb1,
  },
  {
    id: 2,
    title: '제주 겨울 드라이브 코스 총정리',
    dateTime: '2025/11/30 09:20',
    location: '제주 애월읍',
    distance: '24km',
    tags: ['#제주도', '#드라이브', '#카페투어', '#바다'],
    thumbnail: thumb2,
  },
  {
    id: 3,
    title: '도쿄 야경 스카이라인 포인트 5곳',
    dateTime: '2025/11/25 20:05',
    location: '일본 도쿄',
    distance: '12km',
    tags: ['#도쿄', '#야경맛집', '#도시여행'],
    thumbnail: thumb3,
  },
  {
    id: 4,
    title: '강릉 바다와 함께하는 카페 투어',
    dateTime: '2025/11/18 14:40',
    location: '강원 강릉시',
    distance: '8km',
    tags: ['#강릉', '#카페투어', '#바다뷰'],
    thumbnail: thumb1,
  },
  {
    id: 5,
    title: '프라하 골목 산책 코스',
    dateTime: '2025/11/10 16:00',
    location: '체코 프라하',
    distance: '5km',
    tags: ['#유럽여행', '#골목산책', '#사진스팟'],
    thumbnail: thumb2,
  },
];

// 내가 북마크한 글 더미 데이터
const bookmarkedPostsDummy = [
  {
    id: 101,
    title: '몽골 별빛 투어 캠핑 기록',
    dateTime: '2025/12/04 22:15',
    location: '몽골 울란바토르',
    distance: '210km',
    tags: ['#몽골', '#사막캠핑', '#별보기'],
    thumbnail: thumb2,
    authorName: '노마드J',
    authorSubtitle: '별 쫓는 여행자',
    authorLevel: 'Lv.9',
  },
  {
    id: 102,
    title: '스페인 세비야 플라멩코 거리 산책',
    dateTime: '2025/12/02 19:40',
    location: '스페인 세비야',
    distance: '4km',
    tags: ['#세비야', '#플라멩코', '#거리공연'],
    thumbnail: thumb3,
    authorName: 'LaVida',
    authorSubtitle: '라틴 감성 여행러',
    authorLevel: 'Lv.5',
  },
  {
    id: 103,
    title: '후쿠오카 온천 & 라멘 원데이 코스',
    dateTime: '2025/11/29 13:20',
    location: '일본 후쿠오카',
    distance: '11km',
    tags: ['#후쿠오카', '#온천', '#라멘'],
    thumbnail: thumb1,
    authorName: 'ramen_holic',
    authorSubtitle: '먹방 여행자',
    authorLevel: 'Lv.4',
  },
  {
    id: 104,
    title: '스위스 융프라우 눈꽃 여행',
    dateTime: '2025/11/22 10:10',
    location: '스위스 인터라켄',
    distance: '18km',
    tags: ['#스위스', '#알프스', '#설경'],
    thumbnail: thumb2,
    authorName: 'mountainlover',
    authorSubtitle: '산을 닮은 사람',
    authorLevel: 'Lv.7',
  },
  {
    id: 105,
    title: '부산 해운대 야경 & 야시장 투어',
    dateTime: '2025/11/15 21:30',
    location: '부산 해운대구',
    distance: '6km',
    tags: ['#부산', '#야시장', '#야경'],
    thumbnail: thumb3,
    authorName: 'sea_side',
    authorSubtitle: '바다를 좋아하는 사람',
    authorLevel: 'Lv.3',
  },
];

function MemberInfoComp() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    nickname: '닉네임',
    email: '이메일@이메일.com',
    bio: '',
    profileImage: null,
  });

  const [myPosts] = useState(myPostsDummy);
  const [bookmarkedPosts] = useState(bookmarkedPostsDummy);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setProfile((prev) => ({ ...prev, ...parsed }));
    } catch (err) {
      console.error('프로필 불러오기 실패', err);
    }
  }, []);

  const handleProfileEdit = () => {
    navigate('/memberinfo/modify');
  };

  // ListComp로 이동 (필요하면 쿼리스트링 등으로 구분)
  const goMyPostsList = () => {
    navigate('/board/list?type=my'); // 원하는 경로로 수정
  };

  const goBookmarkedList = () => {
    navigate('/board/list?type=bookmark');
  };

  // 카드 안에서 미리보기용 아이템 (2~3개 정도만 표시)
  const renderPreviewItem = (post) => {
    const tagsText = (post.tags || []).slice(0, 3).join(' ');

    return (
      <div key={post.id} className="flex items-center gap-3">
        {/* 썸네일 */}
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-300 flex-shrink-0">
          {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />}
        </div>

        {/* 텍스트 미리보기 */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-900 truncate">{post.title}</p>
          <p className="text-[11px] text-slate-500 truncate">{post.dateTime}</p>
          <p className="text-[11px] text-slate-600 truncate">
            {post.location} · {post.distance}
          </p>
          <p className="text-[11px] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">{tagsText}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-24" />

      <main className="flex-1 w-full flex justify-center pb-20">
        <div className="w-[1080px] px-4">
          {/* 상단 프로필 */}
          <section className="flex flex-col items-center text-center mb-16">
            <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center mb-6 overflow-hidden">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="프로필 이미지" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-6xl">👤</span>
              )}
            </div>

            <p className="text-[18px] font-semibold text-slate-900 mb-1">{profile.nickname}</p>
            <p className="text-[13px] text-slate-600 mb-2">ID: {profile.email}</p>

            <button
              type="button"
              onClick={handleProfileEdit}
              className="text-[13px] text-slate-800 underline underline-offset-2 hover:text-sky-600"
            >
              [프로필 수정]
            </button>
          </section>

          {/* ===== 섹션 카드 2개 ===== */}
          <section className="space-y-8">
            {/* 내가 작성한 글 섹션 카드 */}
            <div>
              {/* 타이틀 + 전체 글 보기 */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-semibold text-slate-900">내가 작성한 글</h2>
                <button
                  type="button"
                  onClick={goMyPostsList}
                  className="text-[12px] text-slate-500 hover:text-sky-500 underline underline-offset-2"
                >
                  [전체 글 보기]
                </button>
              </div>

              {/* 섹션 전체가 클릭 가능한 카드 */}
              <button type="button" onClick={goMyPostsList} className="w-full text-left">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:shadow-[0_10px_28px_rgba(15,23,42,0.15)] transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    {/* 왼쪽: 프로필 요약 */}
                    <div className="flex flex-col items-center gap-2 pr-4 border-r border-slate-200">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300">
                        <img src={defaultAvatar} alt={profile.nickname} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[12px] font-semibold text-slate-900">{profile.nickname}</p>
                      <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-sky-500 text-[10px] font-semibold text-white">
                        Lv.6
                      </span>
                    </div>

                    {/* 오른쪽: 최근 글 3개 미리보기 */}
                    <div className="flex-1 flex flex-col gap-3">
                      {myPosts.slice(0, 3).map(renderPreviewItem)}
                      {myPosts.length === 0 && <p className="text-[12px] text-slate-400">아직 작성한 글이 없습니다.</p>}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* 내가 북마크 한 글 섹션 카드 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-semibold text-slate-900">내가 북마크 한 글</h2>
                <button
                  type="button"
                  onClick={goBookmarkedList}
                  className="text-[12px] text-slate-500 hover:text-sky-500 underline underline-offset-2"
                >
                  [전체 글 보기]
                </button>
              </div>

              <button type="button" onClick={goBookmarkedList} className="w-full text-left">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:shadow-[0_10px_28px_rgba(15,23,42,0.15)] transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    {/* 왼쪽: 대표 프로필 (북마크 강조용 아이콘 느낌) */}
                    <div className="flex flex-col items-center gap-2 pr-4 border-r border-slate-200">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300">
                        <img src={defaultAvatar} alt="북마크" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[12px] font-semibold text-slate-900">Bookmark</p>
                      <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-emerald-500 text-[10px] font-semibold text-white">
                        Saved
                      </span>
                    </div>

                    {/* 오른쪽: 최근 북마크 3개 미리보기 (작성자 정보 포함) */}
                    <div className="flex-1 flex flex-col gap-3">
                      {bookmarkedPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex items-center gap-3">
                          {/* 썸네일 */}
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-300 flex-shrink-0">
                            {post.thumbnail && (
                              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                            )}
                          </div>

                          {/* 텍스트 + 작성자 */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 truncate">{post.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{post.dateTime}</p>
                            <p className="text-[11px] text-slate-600 truncate">
                              {post.location} · {post.distance}
                            </p>
                            <p className="text-[11px] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
                              {(post.tags || []).slice(0, 3).join(' ')}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                              {post.authorName} · {post.authorLevel}
                            </p>
                          </div>
                        </div>
                      ))}

                      {bookmarkedPosts.length === 0 && (
                        <p className="text-[12px] text-slate-400">아직 북마크한 글이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MemberInfoComp;
