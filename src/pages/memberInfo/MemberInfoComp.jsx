// src/pages/memberInfo/MemberInfoComp.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/AuthStateContext';

// 이미지 경로 수정
import defaultAvatar from '../../common/images/logo2.png';
import thumb1 from '../../common/images/forest1.png';
import thumb2 from '../../common/images/forest2.png';
import thumb3 from '../../common/images/forest3.png';

const PROFILE_STORAGE_KEY = 'travlyProfile';

// 내가 작성한 글 더미 데이터 (5개)
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

// 내가 북마크한 글 더미 데이터 (5개)
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
  const { userData } = useAuth();
  const { name: userName, email: userEmail } = userData || {};

  const [profile, setProfile] = useState({
    nickname: userName || '닉네임',
    email: userEmail || '이메일@이메일.com',
    bio: '',
    profileImage: null,
  });

  const [myPosts] = useState(myPostsDummy);
  const [bookmarkedPosts] = useState(bookmarkedPostsDummy);

  useEffect(() => {
    // userData가 없으면 초기화
    if (!userData?.isLoggedIn || !userEmail) {
      setProfile({
        nickname: '닉네임',
        email: '이메일@이메일.com',
        bio: '',
        profileImage: null,
      });
      return;
    }

    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // localStorage의 email이 현재 사용자의 email과 일치하는지 확인
        if (parsed.email === userEmail) {
          setProfile((prev) => ({
            ...prev,
            nickname: parsed.nickname || userName,
            email: parsed.email || userEmail,
            bio: parsed.bio || '',
            profileImage: parsed.profileImage || null,
          }));
        } else {
          // 이전 사용자 정보이므로 userData 사용하고 localStorage 클리어
          localStorage.removeItem(PROFILE_STORAGE_KEY);
          setProfile({
            nickname: userName || '닉네임',
            email: userEmail,
            bio: '',
            profileImage: null,
          });
        }
      } catch (err) {
        console.error('프로필 불러오기 실패', err);
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        setProfile({
          nickname: userName || '닉네임',
          email: userEmail,
          bio: '',
          profileImage: null,
        });
      }
    } else {
      // localStorage에 없으면 userData 사용
      setProfile({
        nickname: userName || '닉네임',
        email: userEmail,
        bio: '',
        profileImage: null,
      });
    }
  }, [userName, userEmail, userData?.isLoggedIn]);

  const handleProfileEdit = () => {
    navigate('/memberinfo/modify');
  };

  // 실제 ListComp 라우트에 맞게 경로 수정해서 사용
  const goMyPostsList = () => {
    navigate('/board/list?type=my');
  };

  const goBookmarkedList = () => {
    navigate('/board/list?type=bookmark');
  };

  // 개별 카드 (프레임) 렌더링 – 카드 전체를 클릭하면 해당 섹션 리스트로 이동
  const renderFrameItem = (post, isMyPost) => {
    const tagsToShow = (post.tags || []).slice(0, 4);
    const tagsText = tagsToShow.join(' ');

    const handleClick = () => {
      if (isMyPost) {
        goMyPostsList();
      } else {
        goBookmarkedList();
      }
    };

    return (
      <div
        key={post.id}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        }}
        className="flex bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] overflow-hidden h-[96px] cursor-pointer hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-shadow"
      >
        {/* 왼쪽 이미지 고정 */}
        <div className="w-40 sm:w-44 h-full bg-slate-300 overflow-hidden flex-shrink-0">
          {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />}
        </div>

        {/* 가운데 텍스트 + 오른쪽 프로필 */}
        <div className="flex-1 flex items-stretch min-w-0">
          {/* 텍스트 영역 */}
          <div className="flex-1 px-4 py-2 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 mb-1 truncate">{post.title}</h3>
              <p className="text-[11px] text-slate-500 mb-0.5 truncate">{post.dateTime}</p>
              <p className="text-[11px] text-slate-600 truncate">
                {post.location} · {post.distance}
              </p>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {tagsText}
            </p>
          </div>

          {/* 프로필 영역 고정 폭 (내 글: 내 정보, 북마크: 작성자 정보) */}
          <div className="hidden sm:flex flex-col items-center justify-center w-28 min-w-[112px] flex-shrink-0 pr-4 pl-2 gap-1">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-300">
              <img
                src={defaultAvatar}
                alt={isMyPost ? profile.nickname : post.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-slate-900 truncate max-w-[96px]">
                {isMyPost ? profile.nickname : post.authorName}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[96px]">
                {isMyPost ? '여행의 달인' : post.authorSubtitle}
              </p>
            </div>
            <span className="mt-1 inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-sky-500 text-[10px] font-semibold text-white">
              {isMyPost ? 'Lv.6' : post.authorLevel}
            </span>
          </div>
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

          {/* 좌우 2컬럼 섹션: 내가 작성한 글 / 북마크한 글 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 내가 작성한 글 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-slate-900">내가 작성한 글</h2>
                <button
                  type="button"
                  onClick={goMyPostsList}
                  className="text-[11px] text-slate-500 hover:text-sky-500 underline underline-offset-2"
                >
                  [전체 글 보기]
                </button>
              </div>
              <div className="space-y-4">{myPosts.map((post) => renderFrameItem(post, true))}</div>
            </div>

            {/* 오른쪽: 내가 북마크 한 글 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-slate-900">내가 북마크 한 글</h2>
                <button
                  type="button"
                  onClick={goBookmarkedList}
                  className="text-[11px] text-slate-500 hover:text-sky-500 underline underline-offset-2"
                >
                  [전체 글 보기]
                </button>
              </div>
              <div className="space-y-4">{bookmarkedPosts.map((post) => renderFrameItem(post, false))}</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MemberInfoComp;
