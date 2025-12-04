import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthStateContext';

function LoginComp({ onClose }) {
  // ⭐️ 1. 이메일과 비밀번호 입력 값을 위한 상태 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일 저장 체크박스 상태 (기존 코드 유지)
  const [isChecked, setIsChecked] = useState(false);
  const checkToggle = () => {
    setIsChecked(!isChecked);
  };

  // ⭐️ 2. Context에서 로그인 성공 처리 함수를 가져옵니다.
  const { mockLoginSuccess } = useAuth();

  const navigate = useNavigate();

  // 3. 회원가입 버튼 클릭 핸들러 (기존 코드 유지)
  const handleSignupClick = () => {
    onClose();
    navigate('/signup');
  };

  // 4. 오버레이 클릭 핸들러 (기존 코드 유지)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ⭐️ 5. 폼 제출(로그인) 핸들러 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    // ⭐️ [TODO: Supabase 연동 부분]
    // 1. 여기서 실제 Supabase의 signInWithPassword 함수를 호출합니다.
    //    (예: const { error } = await supabase.auth.signInWithPassword({ email, password });)

    console.log(`로그인 시도 - 이메일: ${email}, 비밀번호: ${password}`);

    // 2. 로그인 성공 가정 후, Context의 로그인 성공 함수 호출
    // 이 함수가 AuthProvider 내에서 유저 상태를 업데이트하고 창을 닫아줍니다.
    mockLoginSuccess();
  };

  return (
    // ⭐️ 1. Modal Overlay
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      {/* ⭐️ 2. Modal Content */}
      <div className="bg-white rounded-[10px] border-sky-500 border border-2 p-6 w-[600px] h-auto shadow-2xl relative">
        {/* ⭐️ 3. onSubmit에 handleSubmit 연결 */}
        <form onSubmit={handleSubmit}>
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
                  // ⭐️ 입력 값 상태와 연결
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  // ⭐️ 입력 값 상태와 연결
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2.5 rounded-[5px] border-neutral-400"
                />
              </div>
            </div>

            {/* 체크박스 (기존 코드 유지) */}
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

            {/* ⭐️ 6. 로그인 버튼 추가 */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-[5px] font-bold mt-4 hover:bg-blue-600 transition"
            >
              로그인
            </button>

            {/* 안내 링크 (기존 코드 유지) */}
            <div className="flex flex-col gap-2 mx-auto text-center">
              <p className="p">
                비밀번호를 잊으셨나요? (
                <Link to="#">
                  <span className="hover:underline">비밀번호 재설정 </span>
                </Link>
                )
              </p>
              <p className="p">
                계정이 없으신가요? [
                <span
                  onClick={handleSignupClick}
                  className="cursor-pointer hover:underline"
                >
                  회원가입
                </span>
                ]
              </p>
            </div>
          </div>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-xl font-bold text-gray-700 hover:text-black"
          >
            &times;
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginComp;
