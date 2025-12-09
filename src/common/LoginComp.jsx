// src/common/LoginComp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthStateContext.jsx';

function LoginComp({ open, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Supabase 로그인 사용

  const [saveEmail, setSaveEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // ✅ 에러 메시지

  if (!open) return null;

  const goSignup = () => {
    onClose?.();
    navigate('/signup');
  };

  const handleLogin = async () => {
    if (!email || !password) return;

    setErrorMsg('');
    const result = await login({ email, password }); // ✅ Supabase 로그인 시도

    if (!result.success) {
      setErrorMsg(result.error?.message ?? '이메일 또는 비밀번호를 확인해 주세요.');
      return;
    }

    onLoginSuccess?.();
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* 배경 딤 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 박스 800 x 500 */}
      <div
        className="relative z-50 bg-white rounded-[24px] shadow-xl flex flex-col items-center"
        style={{ width: '800px', height: '500px' }}
      >
        <div className="w-full h-full px-10 pt-8 pb-8 flex flex-col items-center">
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg"
          >
            ✕
          </button>

          {/* 제목 영역: 왼쪽 정렬 */}
          <div className="w-full max-w-[680px] self-start">
            <h2 className="font-semibold mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '24px' }}>
              로그인
            </h2>
            <p className="text-slate-500 mb-6" style={{ fontSize: '14px' }}>
              Travly에 로그인하고 여행 기록을 저장하세요.
            </p>
          </div>

          {/* 폼 + 로그인 버튼 영역 */}
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="w-full max-w-[680px]">
              {/* 이메일 */}
              <div className="mb-3">
                <label htmlFor="login-email" className="block mb-1 text-slate-800" style={{ fontSize: '16px' }}>
                  이메일
                </label>
                <div
                  className="rounded-xl border border-slate-300 px-3 py-2 flex items-center"
                  style={{ height: '44px' }}
                >
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-slate-900 placeholder-slate-400"
                    style={{ fontSize: '16px' }}
                    placeholder="이메일을 입력하세요"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="login-password" className="block mb-1 text-slate-800" style={{ fontSize: '16px' }}>
                  비밀번호
                </label>
                <div
                  className="rounded-xl border border-slate-300 px-3 py-2 flex items-center"
                  style={{ height: '44px' }}
                >
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none text-slate-900 placeholder-slate-400"
                    style={{ fontSize: '16px' }}
                    placeholder="비밀번호를 입력하세요"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* 에러 메시지 */}
              {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}

              {/* 로그인 버튼 */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={!email || !password}
                className="mt-4 rounded-xl font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: email && password ? '#2D7FEA' : '#E5E7EB',
                  color: email && password ? '#FFFFFF' : '#9CA3AF',
                }}
              >
                로그인
              </button>
            </div>
          </div>

          {/* 이메일 저장 체크박스 */}
          <div className="mt-4 w-full flex justify-center">
            <div className="flex items-center gap-2" style={{ width: '100%', maxWidth: '680px' }}>
              <button
                type="button"
                onClick={() => setSaveEmail((v) => !v)}
                className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white"
                style={{ borderRadius: '6px' }}
              >
                {saveEmail && (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: '#2D7FEA', borderRadius: '6px' }}
                  >
                    <span className="text-white" style={{ fontSize: '11px', lineHeight: 1 }}>
                      ✓
                    </span>
                  </div>
                )}
              </button>
              <span className="text-slate-700" style={{ fontSize: '16px' }}>
                이메일 저장
              </span>
            </div>
          </div>

          {/* 하단 텍스트들 */}
          <div className="mt-6 flex flex-col items-center justify-center text-center" style={{ fontSize: '16px' }}>
            <p className="text-slate-700">
              비밀번호를 잊으셨나요?{' '}
              <button type="button" className="text-[#2D7FEA] hover:underline">
                비밀번호 재설정
              </button>
            </p>
            <p className="text-slate-900 mt-1">
              <span className="text-[#2D7FEA]">계정</span>
              <span>이 없으신가요? </span>
              <button type="button" onClick={goSignup} className="text-[#2D7FEA] hover:underline">
                [회원 가입 하러가기]
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComp;
