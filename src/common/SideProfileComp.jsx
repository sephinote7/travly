import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import badge04 from './images/badge04.png';
import testprofile from './images/testprofile.gif';
import { useAuth } from './AuthStateContext';

const PROFILE_STORAGE_KEY = 'travlyProfile';

function SideProfileComp() {
  const navigate = useNavigate();
  const { userData, logout, closeUserComp } = useAuth();
  const { name: userName = 'Irem', email: userEmail = 'test@test.com' } = userData || {};

  // 프로필 정보 상태 (나중에 DB에서 가져올 수 있도록 구조화)
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    profileImage: null,
    badge: badge04, // 등급 배지 (나중에 DB에서 가져올 수 있음)
  });

  // 프로필 정보 로드 (현재는 localStorage, 나중에 DB로 변경 가능)
  useEffect(() => {
    // 로그인하지 않은 경우 프로필 초기화
    if (!userData?.isLoggedIn) {
      setProfile({
        nickname: '',
        email: '',
        profileImage: null,
        badge: badge04,
      });
      return;
    }

    // localStorage에서 프로필 정보 불러오기
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // localStorage의 email이 현재 사용자의 email과 일치하는지 확인
        if (parsed.email === userEmail) {
          setProfile({
            nickname: parsed.nickname || userName,
            email: parsed.email || userEmail,
            profileImage: parsed.profileImage || null,
            badge: parsed.badge || badge04, // 나중에 DB에서 등급에 따라 배지 선택
          });
        } else {
          // 이전 사용자 정보이므로 userData 사용하고 localStorage 클리어
          localStorage.removeItem(PROFILE_STORAGE_KEY);
          setProfile({
            nickname: userName,
            email: userEmail,
            profileImage: null,
            badge: badge04,
          });
        }
      } catch (err) {
        console.error('프로필 불러오기 실패', err);
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        setProfile({
          nickname: userName,
          email: userEmail,
          profileImage: null,
          badge: badge04,
        });
      }
    } else {
      // localStorage에 없으면 userData 사용
      setProfile({
        nickname: userName,
        email: userEmail,
        profileImage: null,
        badge: badge04,
      });
    }
  }, [userName, userEmail, userData?.isLoggedIn]);

  const handleLogout = async () => {
    await logout();
    closeUserComp();
    navigate('/');
  };

  return (
    <div className="w-[300px] h-[360px] p-8 absolute top-full right-0 mt-2 bg-white flex flex-col justify-center items-center shadow-lg z-50">
      <div className="flex flex-col gap-7.5">
        <div className="flex border-b py-[10px]">
          {/* 프로필 이미지 (나중에 DB에서 가져온 URL 사용) */}
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              className="w-[80px] h-[80px] border rounded-[40px] object-cover"
              alt="프로필"
            />
          ) : (
            <img src={testprofile} className="w-[80px] h-[80px] border rounded-[40px]" alt="기본 프로필" />
          )}

          <div className="flex flex-col gap-2.5 w-[130px] ms-auto text-right">
            <div className="flex flex-col gap-[5px]">
              <p className="p font-bold">{profile.nickname || userName}</p>
              <p className="ctext">{profile.email || userEmail}</p>
            </div>

            {/* 등급 배지 (나중에 DB에서 등급에 따라 다른 배지 선택) */}
            <img src={profile.badge || badge04} className="block w-[120px] flex ms-auto" alt="등급 배지" />
          </div>
        </div>

        <ul className="flex flex-col gap-5">
          <Link to="/memberinfo" onClick={closeUserComp}>
            <li className="p">나의 여행 공간</li>
          </Link>

          <Link to="/board/list?type=my" onClick={closeUserComp}>
            <li className="p">내가 남긴 여행 기록</li>
          </Link>

          <Link to="/board/list?type=bookmark" onClick={closeUserComp}>
            <li className="p">내가 저장한 여행</li>
          </Link>
          <li className=" text-red-600 cursor-pointer" onClick={handleLogout}>
            로그아웃
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideProfileComp;
