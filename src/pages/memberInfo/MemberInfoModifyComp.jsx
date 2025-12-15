// src/pages/member/MemberInfoModifyComp.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PROFILE_STORAGE_KEY = 'travlyProfile';

function MemberInfoModifyComp() {
  const navigate = useNavigate();

  // 기본 폼 상태
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('email@email.com');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 닉네임 중복 확인 상태
  const [nicknameStatus, setNicknameStatus] = useState('idle');
  const [nicknameMessage, setNicknameMessage] = useState('');

  // 프로필 이미지
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // 비밀번호 변경
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (passwordConfirm && passwordConfirm !== value) {
      setPasswordError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    if (password && value !== password) {
      setPasswordError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordError('');
    }
  };

  // 닉네임 중복 확인 (더미)
  const handleNicknameCheck = () => {
    const trimmed = nickname.trim();

    if (!trimmed) {
      setNicknameStatus('empty');
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }

    setNicknameStatus('checking');
    setNicknameMessage('중복 확인 중입니다...');

    const usedNicknames = ['travly', 'admin', '테스트', 'traveler'];

    setTimeout(() => {
      const isUsed = usedNicknames.some((n) => n.toLowerCase() === trimmed.toLowerCase());

      if (isUsed) {
        setNicknameStatus('unavailable');
        setNicknameMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameStatus('available');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      }
    }, 500);
  };

  // 프로필 이미지 업로드
  const handleProfileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfilePreview(imageUrl);
  };

  // 제출 + 저장 + 이동
  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordError) return;

    const profileData = {
      nickname,
      email,
      bio,
      profileImage: profilePreview || null,
    };

    // localStorage에 저장 (브라우저에 영구 저장되는 키/값 저장소)[web:71]
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

    // TODO: 실제 서버로 수정 요청 보내기

    navigate('/memberinfo');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-24" />

      <main className="flex-1 max-w-6xl mx-auto px-10 pb-24">
        <h1 className="text-2xl font-semibold text-sky-500 border-b border-slate-200 pb-4 mb-10">프로필 수정</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* 왼쪽 2열: 입력 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 닉네임 + 중복 확인 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">닉네임</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameStatus('idle');
                    setNicknameMessage('');
                  }}
                  className="flex-1 h-10 border border-slate-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  disabled={nicknameStatus === 'checking'}
                  className={`px-4 h-10 text-xs font-semibold rounded-sm text-white
                    ${
                      nicknameStatus === 'checking'
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-500'
                    }`}
                >
                  {nicknameStatus === 'checking' ? '확인 중...' : '중복 확인'}
                </button>
              </div>

              {nicknameMessage && (
                <p
                  className={`mt-1 text-xs ${
                    nicknameStatus === 'available'
                      ? 'text-emerald-500'
                      : nicknameStatus === 'unavailable'
                      ? 'text-rose-500'
                      : 'text-slate-500'
                  }`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">이메일</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full h-10 border border-slate-300 rounded-sm px-3 text-sm text-slate-500 bg-slate-50"
              />
            </div>

            {/* 소개글 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">소개글</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="내 소개를 입력하세요..."
                className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* 비밀번호 변경 */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">비밀번호 변경</p>

              <input
                type="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={handlePasswordChange}
                className="w-full h-10 border border-slate-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <div>
                <input
                  type="password"
                  placeholder="새 비밀번호 재 입력"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  className={`w-full h-10 border rounded-sm px-3 text-sm focus:outline-none focus:ring-2 ${
                    passwordError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-sky-400'
                  }`}
                />
                {passwordError && <p className="mt-1 text-xs text-rose-500">{passwordError}</p>}
              </div>
            </div>
          </div>

          {/* 오른쪽: 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <div className="w-52 h-52 rounded-full bg-amber-400 flex items-center justify-center mb-4 overflow-hidden">
              {profilePreview ? (
                <img src={profilePreview} alt="프로필 미리보기" className="w-full h-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-amber-300 flex items-center justify-center">
                  <span className="text-6xl text-white">👤</span>
                </div>
              )}
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <button
              type="button"
              onClick={handleProfileButtonClick}
              className="px-5 py-2 text-xs font-semibold bg-sky-500 text-white rounded-sm hover:bg-sky-600"
            >
              프로필 사진 변경
            </button>
          </div>

          {/* 하단 수정 버튼 */}
          <div className="lg:col-span-3 flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-2.5 bg-amber-400 text-white text-sm font-semibold rounded-sm hover:bg-amber-500"
            >
              수정 하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default MemberInfoModifyComp;
