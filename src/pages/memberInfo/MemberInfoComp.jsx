// src/pages/memberInfo/MemberInfoComp.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../common/AuthStateContext';
import { getMemberInfo } from '../../util/memberService';
import { getFileUrl } from '../../util/fileService';

// 이미지 경로 수정
import defaultAvatar from '../../common/images/Logo2.png';
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
  const location = useLocation();
  const { userData } = useAuth();
  const { email: userEmail, memberId } = userData || {};

  // URL 쿼리 파라미터에서 memberId 가져오기 (회원정보 수정 후 전달된 경우)
  const queryParams = new URLSearchParams(location.search);
  const memberIdFromQuery = queryParams.get('memberId');

  const [profile, setProfile] = useState({
    nickname: null, // Spring API에서 가져온 데이터만 사용
    email: userEmail || '이메일@이메일.com',
    bio: '',
    profileImage: null,
  });

  const [imageLoadError, setImageLoadError] = useState(false);
  const [isMemberNotFound, setIsMemberNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [myPosts] = useState(myPostsDummy);
  const [bookmarkedPosts] = useState(bookmarkedPostsDummy);

  useEffect(() => {
    // userData가 없으면 초기화
    if (!userData?.isLoggedIn || !userEmail) {
      setProfile({
        nickname: null,
        email: '이메일@이메일.com',
        bio: '',
        profileImage: null,
      });
      return;
    }

    // location.state에서 업데이트된 데이터 확인 (수정 페이지에서 전달된 경우)
    const updatedMemberData = location.state?.updatedMemberData;
    if (updatedMemberData) {
      console.log('✅ 수정 페이지에서 전달된 업데이트된 데이터 사용:', updatedMemberData);

      // memberId를 localStorage에 저장
      if (updatedMemberData.id) {
        localStorage.setItem('memberId', updatedMemberData.id.toString());
        console.log('✅ memberId 저장됨 (from updatedMemberData):', updatedMemberData.id);
      }

      // profileImage 객체를 URL로 변환
      let profileImageUrl = null;
      if (updatedMemberData.profileImage) {
        profileImageUrl = getFileUrl(updatedMemberData.profileImage);
        if (profileImageUrl) {
          // 캐시 방지를 위해 타임스탬프 추가
          const separator = profileImageUrl.includes('?') ? '&' : '?';
          profileImageUrl = `${profileImageUrl}${separator}t=${Date.now()}`;
        }
      }

      setProfile({
        nickname: updatedMemberData.nickname || userData.nickname || null,
        email: updatedMemberData.email || userEmail,
        bio: updatedMemberData.introduction || '',
        profileImage: profileImageUrl,
      });
      setImageLoadError(false);
      setIsMemberNotFound(false);

      // location.state를 초기화하여 다음 렌더링 시 API 호출하도록 함
      window.history.replaceState({}, document.title);
      return;
    }

    // Spring API에서 프로필 정보 불러오기 (프로필 이미지 포함)
    const loadProfileFromSpring = async () => {
      setIsLoading(true);
      try {
        // 회원 정보 조회 시작 시 isMemberNotFound 초기화
        setIsMemberNotFound(false);

        // memberId 우선순위: URL 쿼리 파라미터 > userData.memberId > localStorage
        const storedMemberId = localStorage.getItem('memberId');
        let targetMemberId =
          memberIdFromQuery || memberId || userData?.memberId || (storedMemberId ? parseInt(storedMemberId, 10) : null);

        console.log('🔄 프로필 정보 불러오기 시작:', {
          memberIdFromQuery,
          memberId,
          userDataMemberId: userData?.memberId,
          storedMemberId,
          targetMemberId,
        });

        // memberId가 있으면 바로 getMemberInfo 호출 (가장 빠른 방법)
        if (targetMemberId) {
          console.log('🔄 프로필 데이터 불러오기 시작 (memberId):', targetMemberId);
          const result = await getMemberInfo(targetMemberId);

          if (result.success && result.data) {
            const memberData = result.data;

            // profileImage 객체를 URL로 변환
            let profileImageUrl = null;
            if (memberData.profileImage) {
              console.log('🖼️ profileImage 객체:', JSON.stringify(memberData.profileImage, null, 2));

              // getFileUrl 함수 사용 (가장 안정적)
              // 파일 ID 우선 사용, 없으면 파일명 사용
              profileImageUrl = getFileUrl(memberData.profileImage);

              if (!profileImageUrl) {
                console.error('❌ 이미지 URL을 생성할 수 없습니다. profileImage 구조:', memberData.profileImage);
              } else {
                // 캐시 방지를 위해 타임스탬프 추가
                const separator = profileImageUrl.includes('?') ? '&' : '?';
                profileImageUrl = `${profileImageUrl}${separator}t=${Date.now()}`;
                console.log('🖼️ 최종 이미지 URL:', profileImageUrl);
              }
            } else {
              console.log('⚠️ 프로필 이미지가 없습니다.');
            }

            console.log('✅ 프로필 데이터 불러오기 성공:', {
              nickname: memberData.nickname,
              profileImageUrl,
              hasProfileImage: !!memberData.profileImage,
            });

            setProfile({
              nickname: memberData.nickname || userData.nickname || null,
              email: memberData.email || userEmail,
              bio: memberData.introduction || '',
              profileImage: profileImageUrl, // Spring API에서 가져온 프로필 이미지 URL
            });
            setImageLoadError(false); // 이미지 로드 에러 상태 초기화
            setIsMemberNotFound(false); // 회원 정보를 찾았으므로 false로 설정
            setIsLoading(false);
            return;
          } else {
            console.warn('⚠️ getMemberInfo 실패:', result.error, 'status:', result.status);

            // 404 에러이고 authUuid가 있으면 재시도
            if (result.status === 404 && userData?.id) {
              console.log('🔄 memberId가 유효하지 않아 authUuid로 재시도...');
              const { getMemberInfoByAuthUuid } = await import('../../util/memberService');
              const authUuidResult = await getMemberInfoByAuthUuid(userData.id);
              if (authUuidResult.success && authUuidResult.data) {
                const memberData = authUuidResult.data;
                const newMemberId = memberData.id;
                console.log('✅ 새로운 memberId 획득:', newMemberId);

                // profileImage 객체를 URL로 변환
                let profileImageUrl = null;
                if (memberData.profileImage) {
                  profileImageUrl = getFileUrl(memberData.profileImage);
                  if (profileImageUrl) {
                    const separator = profileImageUrl.includes('?') ? '&' : '?';
                    profileImageUrl = `${profileImageUrl}${separator}t=${Date.now()}`;
                  }
                }

                setProfile({
                  nickname: memberData.nickname || userData.nickname || null,
                  email: memberData.email || userEmail,
                  bio: memberData.introduction || '',
                  profileImage: profileImageUrl,
                });
                setImageLoadError(false);
                setIsMemberNotFound(false);

                // localStorage에도 memberId 저장
                if (newMemberId) {
                  localStorage.setItem('memberId', newMemberId.toString());
                }
                setIsLoading(false);
                return;
              } else {
                if (authUuidResult.status === 404) {
                  console.warn('⚠️ 회원 정보가 아직 생성되지 않았습니다.');
                  setIsMemberNotFound(true);
                }
              }
            }
          }
        }

        // memberId가 없으면 authUuid로 시도
        if (!targetMemberId && userData?.id) {
          console.log('🔄 memberId가 없어 authUuid로 조회 시도...');
          const { getMemberInfoByAuthUuid } = await import('../../util/memberService');
          const authUuidResult = await getMemberInfoByAuthUuid(userData.id);
          if (authUuidResult.success && authUuidResult.data) {
            const memberData = authUuidResult.data;
            targetMemberId = memberData.id;
            console.log('✅ memberId 획득:', targetMemberId);

            // profileImage 객체를 URL로 변환
            let profileImageUrl = null;
            if (memberData.profileImage) {
              profileImageUrl = getFileUrl(memberData.profileImage);
              if (profileImageUrl) {
                const separator = profileImageUrl.includes('?') ? '&' : '?';
                profileImageUrl = `${profileImageUrl}${separator}t=${Date.now()}`;
              }
            }

            setProfile({
              nickname: memberData.nickname || userData.nickname || null,
              email: memberData.email || userEmail,
              bio: memberData.introduction || '',
              profileImage: profileImageUrl,
            });
            setImageLoadError(false);
            setIsMemberNotFound(false);

            // localStorage에도 memberId 저장
            if (targetMemberId) {
              localStorage.setItem('memberId', targetMemberId.toString());
            }
            setIsLoading(false);
            return;
          } else {
            if (authUuidResult.status === 404) {
              console.warn('⚠️ 회원 정보가 아직 생성되지 않았습니다.');
              setIsMemberNotFound(true);
            }
          }
        }

        // memberId를 얻지 못했거나 조회 실패 시
        console.warn('⚠️ Spring API에서 프로필 정보를 불러올 수 없습니다.');
        setIsMemberNotFound(true);
        setProfile({
          nickname: userData.nickname || '회원 정보 없음',
          email: userEmail,
          bio: '',
          profileImage: null,
        });
        setImageLoadError(false);
      } catch (error) {
        console.error('❌ 프로필 정보 불러오기 실패:', error);
        setProfile({
          nickname: userData.nickname || null,
          email: userEmail,
          bio: '',
          profileImage: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileFromSpring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userEmail,
    userData?.isLoggedIn,
    userData?.memberId, // memberId가 변경되면 다시 불러오기
    userData?.id,
    location.pathname,
    location.search, // 쿼리 파라미터 변경 감지
    // location.key 제거 - 페이지 이동할 때마다 재호출 방지
  ]);

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
            {isLoading && (
              <div className="w-40 h-40 rounded-full bg-slate-200 flex items-center justify-center mb-6 animate-pulse">
                <span className="text-slate-400">로딩 중...</span>
              </div>
            )}
            {!isLoading && (
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center mb-6 overflow-hidden">
                {profile.profileImage && !imageLoadError ? (
                  <img
                    src={profile.profileImage}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ 프로필 이미지 로드 실패');
                      console.error('❌ 이미지 URL:', profile.profileImage);
                      console.error('❌ 에러 이벤트:', e);
                      console.error('❌ 이미지 요소:', e.target);

                      // 네트워크 탭에서 확인할 수 있도록 URL 출력
                      console.error('❌ 브라우저에서 다음 URL을 직접 열어보세요:', profile.profileImage);

                      setImageLoadError(true);
                      e.target.style.display = 'none';
                      // 이미지 로드 실패 시 기본 아이콘 표시를 위해 부모 요소 확인
                      const parent = e.target.parentElement;
                      if (parent) {
                        const defaultIcon = parent.querySelector('.default-icon');
                        if (!defaultIcon) {
                          const icon = document.createElement('span');
                          icon.className = 'default-icon text-white text-6xl';
                          icon.textContent = '👤';
                          parent.appendChild(icon);
                        }
                      }
                    }}
                    onLoad={() => {
                      console.log('✅ 프로필 이미지 로드 성공:', profile.profileImage);
                      setImageLoadError(false);
                      // 기본 아이콘 제거
                      const parent = document.querySelector('.default-icon');
                      if (parent) {
                        parent.remove();
                      }
                    }}
                  />
                ) : (
                  <span className="text-white text-6xl">👤</span>
                )}
              </div>
            )}

            <p className="text-[18px] font-semibold text-slate-900 mb-1">
              {profile.nickname || '회원 정보를 불러올 수 없습니다'}
            </p>
            <p className="text-[13px] text-slate-600 mb-2">ID: {profile.email}</p>

            {isMemberNotFound && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[12px] text-amber-800 mb-2">⚠️ 회원 정보가 아직 생성되지 않았습니다.</p>
                <p className="text-[11px] text-amber-700">프로필을 생성하려면 아래 버튼을 클릭하세요.</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleProfileEdit}
              className={`text-[13px] underline underline-offset-2 ${
                isMemberNotFound
                  ? 'text-amber-600 hover:text-amber-700 font-semibold'
                  : 'text-slate-800 hover:text-sky-600'
              }`}
            >
              {isMemberNotFound ? '[프로필 생성하기]' : '[프로필 수정]'}
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
