import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginComp({ onClose }) {
  const [isChecked, setIsChecked] = useState(false);
  const checkToggle = () => {
    setIsChecked(!isChecked);
  };

  const navigate = useNavigate();

  const handleSignupClick = () => {
    onClose();

    navigate('/signup');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // ⭐️ 1. Modal Overlay: 화면 전체를 덮고 가운데 정렬
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={handleOverlayClick} // ⭐️ 배경 클릭 시 닫기 함수 연결
    >
      {/* ⭐️ 2. Modal Content: 실제 로그인 폼 */}
      <div className="bg-white rounded-[10px] border-sky-500 border border-2 p-6 w-[600px] h-auto shadow-2xl relative">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-6 justify-center w-[100%]">
            <div className="flex flex-col gap-4">
              <p className="h4">로그인</p>
              <p className="ctext">
                Travly에 로그인하고 여행 기록을 저장해보세요!
              </p>
            </div>

            {/* 이메일 / 비밀번호 입력 필드 */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-[5px]">
                <label className="p font-bold" htmlFor="email">
                  이메일
                </label>
                <input
                  type="text"
                  placeholder="이메일을 입력하세요"
                  id="email"
                  className="border p-2.5 rounded-[5px] border-neutral-400"
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <label className="p font-bold" htmlFor="password">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  className="border p-2.5 rounded-[5px] border-neutral-400"
                />
              </div>
            </div>

            {/* 체크박스 (개선된 버전) */}
            <div className="flex gap-3 mx-auto cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={checkToggle}
                id="saveEmail"
              />
              <label className="p" htmlFor="saveEmail">
                이메일 저장하기
              </label>
            </div>

            {/* 안내 링크 */}
            <div className="flex flex-col gap-2 mx-auto text-center">
              <p className="p">
                비밀번호를 잊으셨나요? ({' '}
                <Link to="#">
                  <span className="hover:underline">비밀번호 재설정 </span>
                </Link>{' '}
                )
              </p>
              <p className="p">
                계정이 없으신가요? [{' '}
                <span
                  onClick={handleSignupClick}
                  className="cursor-pointer hover:underline"
                >
                  회원가입{' '}
                </span>{' '}
                ]
              </p>
            </div>
          </div>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-xl font-bold"
          >
            &times;
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginComp;
