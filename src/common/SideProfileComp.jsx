import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import badge04 from './images/badge04.png';
import testprofile from './images/testprofile.gif';
import { useAuth } from './AuthStateContext';
import { getMemberInfoByAuthUuid } from '../util/memberService';
import { getFileUrl } from '../util/fileService';

function SideProfileComp() {
  const navigate = useNavigate();
  const { userData, logout, closeUserComp } = useAuth();
  const { name = 'Irem', email = 'test@test.com', id: authUuid } = userData;
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // 프로필 이미지 로드
  useEffect(() => {
    const loadProfileImage = async () => {
      if (!authUuid || !userData?.isLoggedIn) {
        setProfileImage(null);
        return;
      }

      try {
        const result = await getMemberInfoByAuthUuid(authUuid);
        if (result.success && result.data?.profileImage) {
          const imageUrl = getFileUrl(result.data.profileImage);
          if (imageUrl) {
            // 캐시 방지를 위해 타임스탬프 추가
            const separator = imageUrl.includes('?') ? '&' : '?';
            setProfileImage(`${imageUrl}${separator}t=${Date.now()}`);
            setImageLoadError(false);
          } else {
            setProfileImage(null);
          }
        } else {
          setProfileImage(null);
        }
      } catch (err) {
        console.error('프로필 이미지 로드 실패:', err);
        setProfileImage(null);
      }
    };

    loadProfileImage();
  }, [authUuid, userData?.isLoggedIn]);

  const handleLogout = async () => {
    await logout();
    closeUserComp();
    navigate('/');
  };

  return (
    <div className="w-[300px] h-[360px] p-8 absolute top-full right-0 mt-2 bg-white flex flex-col justify-center items-center shadow-lg z-50">
      <div className="flex flex-col gap-7.5">
        <div className="flex border-b py-[10px]">
          <div className="w-[80px] h-[80px] border rounded-[40px] overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center">
            {profileImage && !imageLoadError ? (
              <img
                src={profileImage}
                className="w-full h-full object-cover"
                alt="프로필 이미지"
                onError={() => {
                  console.error('❌ 프로필 이미지 로드 실패');
                  setImageLoadError(true);
                }}
              />
            ) : (
              <img src={testprofile} className="w-full h-full object-cover" alt="기본 프로필" />
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-[130px] ms-auto text-right">
            <div className="flex flex-col gap-[5px]">
              <p className="p font-bold">{name}</p>
              <p className="ctext">{email}</p>
            </div>

            <img src={badge04} className="block w-[120px] flex ms-auto" />
          </div>
        </div>

        <ul className="flex flex-col gap-5">
          <Link to="/memberinfo">
            <li className="p">나의 여행 공간</li>
          </Link>

          <li
            className="p cursor-pointer"
            onClick={() => {
              closeUserComp();
              navigate('/board/list?type=my');
            }}
          >
            내가 남긴 여행 기록
          </li>

          <li
            className="p cursor-pointer"
            onClick={() => {
              closeUserComp();
              navigate('/board/list?type=bookmark');
            }}
          >
            내가 저장한 여행
          </li>
          <li className=" text-red-600 cursor-pointer" onClick={handleLogout}>
            로그아웃
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideProfileComp;
