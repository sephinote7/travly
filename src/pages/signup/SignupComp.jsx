// src/pages/signup/SignupComp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kakaoIcon from '../../common/images/kakao.png';
import travlyLogo from '../../common/images/logo2.png';
import { useAuth } from '../../common/AuthStateContext.jsx';
import supabase from '../../util/supabaseClient.js';

function SignupComp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // 입력값 상태
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  // 이메일 / 닉네임 중복 확인 상태
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'ok' | 'error'
  const [emailMessage, setEmailMessage] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('idle');
  const [nicknameMessage, setNicknameMessage] = useState('');

  // 더미 중복 데이터 (나중에 API 연동 시 교체)
  const usedEmails = ['test@example.com', 'hello@travly.com'];
  const usedNicknames = ['travler', 'admin', 'tester'];

  const onChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const goLogin = () => {
    navigate('/?login=open');
  };

  // ✅ Supabase 이메일 회원가입
  const handleSignup = async () => {
    if (!form.email || !form.nickname || !form.password || !form.passwordCheck) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    if (form.password !== form.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await signup({
      email: form.email.trim(),
      password: form.password.trim(),
      nickname: form.nickname.trim(),
    });

    if (!result.success) {
      alert('회원가입 실패: ' + result.error.message);
      return;
    }

    alert('회원가입 성공! 이메일 인증을 완료해주세요.');
    navigate('/');
  };

  // ✅ 이메일 중복 체크 (더미)
  const handleEmailCheck = () => {
    const value = form.email.trim();

    if (!value) {
      setEmailStatus('error');
      setEmailMessage('이메일을 입력해주세요.');
      return;
    }

    const isUsed = usedEmails.some((e) => e.toLowerCase() === value.toLowerCase());

    if (isUsed) {
      setEmailStatus('error');
      setEmailMessage('이미 사용 중인 이메일입니다.');
    } else {
      setEmailStatus('ok');
      setEmailMessage('사용 가능한 이메일입니다.');
    }
  };

  // ✅ 닉네임 중복 체크 (더미)
  const handleNicknameCheck = () => {
    const value = form.nickname.trim();

    if (!value) {
      setNicknameStatus('error');
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }

    const isUsed = usedNicknames.some((n) => n.toLowerCase() === value.toLowerCase());

    if (isUsed) {
      setNicknameStatus('error');
      setNicknameMessage('이미 사용 중인 닉네임입니다.');
    } else {
      setNicknameStatus('ok');
      setNicknameMessage('사용 가능한 닉네임입니다.');
    }
  };

  // ✅ 카카오 로그인/회원가입 (SignupComp에서 직접 호출)
  const handleKakaoSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('카카오 로그인 에러:', error);
        alert('카카오 로그인 중 에러가 발생했습니다: ' + error.message);
        return;
      }

      // OAuth 리디렉션이 자동으로 일어나므로 추가 동작 불필요
      // AuthStateContext의 onAuthStateChange가 세션 변경을 감지하여 자동으로 로그인 처리
    } catch (err) {
      console.error('카카오 로그인 예외:', err);
      alert('카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-full flex justify-center bg-slate-100 py-16">
      {/* 540 x 700 프레임 2개를 붙인 전체 래퍼 */}
      <div
        className="flex shadow-[0_18px_40px_rgba(15,23,42,0.18)] overflow-hidden rounded-[50px]"
        style={{ width: '1080px', height: '700px', backgroundColor: '#2D7FEA' }}
      >
        {/* 왼쪽 프레임 */}
        <div
          className="flex flex-col items-center justify-center bg-[#2D7FEA] text-center"
          style={{
            width: '540px',
            height: '700px',
          }}
        >
          <h4 className="text-white mb-6" style={{ fontSize: '20px', fontWeight: 600 }}>
            Travly에 오신 것을 환영합니다!
          </h4>

          <div
            className="bg-white flex items-center justify-center"
            style={{ width: '260px', height: '260px', borderRadius: '40px' }}
          >
            <img src={travlyLogo} alt="Travly 로고" className="w-[200px] h-auto object-contain" />
          </div>
        </div>

        {/* 오른쪽 프레임 */}
        <div
          className="bg-white flex flex-col items-center"
          style={{
            width: '540px',
            height: '700px',
            borderTopRightRadius: '50px',
            borderBottomRightRadius: '50px',
          }}
        >
          <div className="w-full h-full px-10 pt-10 pb-8 flex flex-col items-center">
            <h2 className="text-center font-semibold mb-6" style={{ fontSize: '24px', color: '#ff7a00' }}>
              회원 가입
            </h2>

            {/* 폼 영역 */}
            <div className="flex flex-col gap-4" style={{ width: '320px' }}>
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block mb-1 text-slate-800" style={{ fontSize: '14px' }}>
                  이메일
                </label>
                <div className="flex gap-2">
                  <div
                    className="rounded-md border border-slate-300 px-3 flex items-center"
                    style={{ width: '100%', height: '31px' }}
                  >
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        onChange(e);
                        setEmailStatus('idle');
                        setEmailMessage('');
                      }}
                      className="w-full outline-none text-slate-900 placeholder-slate-400"
                      style={{ fontSize: '14px' }}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleEmailCheck}
                    className="rounded-md bg-[#2D7FEA] text-white flex items-center justify-center"
                    style={{ width: '106px', height: '31px', fontSize: '14px' }}
                  >
                    중복 확인
                  </button>
                </div>
                {emailMessage && (
                  <p className={`mt-1 text-xs ${emailStatus === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {emailMessage}
                  </p>
                )}
              </div>

              {/* 닉네임 */}
              <div>
                <label htmlFor="nickname" className="block mb-1 text-slate-800" style={{ fontSize: '14px' }}>
                  닉네임
                </label>
                <div className="flex gap-2">
                  <div
                    className="rounded-md border border-slate-300 px-3 flex items-center"
                    style={{ width: '100%', height: '31px' }}
                  >
                    <input
                      id="nickname"
                      type="text"
                      value={form.nickname}
                      onChange={(e) => {
                        onChange(e);
                        setNicknameStatus('idle');
                        setNicknameMessage('');
                      }}
                      className="w-full outline-none text-slate-900 placeholder-slate-400"
                      style={{ fontSize: '14px' }}
                      placeholder="닉네임을 입력하세요"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNicknameCheck}
                    className="rounded-md bg-[#2D7FEA] text-white flex items-center justify-center"
                    style={{ width: '106px', height: '31px', fontSize: '14px' }}
                  >
                    중복 확인
                  </button>
                </div>
                {nicknameMessage && (
                  <p className={`mt-1 text-xs ${nicknameStatus === 'ok' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {nicknameMessage}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block mb-1 text-slate-800" style={{ fontSize: '14px' }}>
                  비밀번호
                </label>
                <div
                  className="rounded-md border border-slate-300 px-3 flex items-center"
                  style={{ width: '100%', height: '31px' }}
                >
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className="w-full outline-none text-slate-900 placeholder-slate-400"
                    style={{ fontSize: '14px' }}
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="passwordCheck" className="block mb-1 text-slate-800" style={{ fontSize: '14px' }}>
                  비밀번호 확인
                </label>
                <div
                  className="rounded-md border border-slate-300 px-3 flex items-center"
                  style={{ width: '100%', height: '31px' }}
                >
                  <input
                    id="passwordCheck"
                    type="password"
                    value={form.passwordCheck}
                    onChange={onChange}
                    className="w-full outline-none text-slate-900 placeholder-slate-400"
                    style={{ fontSize: '14px' }}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignup}
                  className="h-[36px] rounded-md bg-[#2D7FEA] text-white text-sm font-semibold hover:bg-sky-600 transition"
                  style={{ width: '260px' }}
                >
                  회원가입
                </button>
              </div>
            </div>

            {/* OR 라인 + 카카오톡 회원가입 버튼 */}
            <div className="mt-6 mb-3 flex flex-col items-center gap-2">
              <div className="flex items-center w-full justify-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleKakaoSignup} // ✅ 여기서 바로 카카오 OAuth 호출
                className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white"
                style={{ width: '260px', height: '36px' }}
              >
                <div
                  className="flex items-center justify-center rounded-full overflow-hidden"
                  style={{
                    width: '22px',
                    height: '22px',
                    backgroundColor: '#FEE500',
                  }}
                >
                  <img src={kakaoIcon} alt="카카오" className="w-[18px] h-[18px] object-contain" />
                </div>
                <span className="text-[13px] text-slate-900">카카오톡으로 회원가입</span>
              </button>
            </div>

            {/* 하단: 이미 회원이신가요? 로그인 하기 */}
            <div className="mt-auto text-center" style={{ fontSize: '13px' }}>
              <span className="text-slate-500">이미 회원이신가요? </span>
              <button type="button" onClick={goLogin} className="text-[#ff7a00] hover:underline">
                로그인 하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupComp;
