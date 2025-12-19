// src/pages/member/MemberInfoModifyComp.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/AuthStateContext';
import {
  getMemberInfoByAuthUuid,
  createOrUpdateMember,
  checkNickname,
} from '../../util/memberService';
import { uploadFiles, getFileUrl } from '../../util/fileService';
import { supabase } from '../../util/supabaseClient';

function MemberInfoModifyComp() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  // 기본 폼 상태
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 닉네임 중복 확인 상태
  const [nicknameStatus, setNicknameStatus] = useState('idle');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');

  // 프로필 이미지
  const [profilePreview, setProfilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingProfileImageFileId, setExistingProfileImageFileId] =
    useState(null);
  const fileInputRef = useRef(null);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 기존 회원 정보 불러오기
  useEffect(() => {
    const loadMemberInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        // 로그인 상태 확인
        if (!userData.isLoggedIn) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        // Supabase 세션에서 authUuid 가져오기
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          setError('세션을 가져올 수 없습니다.');
          setLoading(false);
          return;
        }

        const authUuid = session.user.id;
        const name =
          session.user.user_metadata?.nickname ||
          session.user.user_metadata?.full_name ||
          '사용자';
        const nickname = session.user.user_metadata?.nickname || '사용자';

        // 백엔드에서 회원 정보 가져오기
        const result = await getMemberInfoByAuthUuid(authUuid);

        if (!result.success) {
          setError(result.error || '회원 정보를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }

        const memberData = result.data;

        // API 응답의 email을 우선 사용, 없으면 Supabase 세션의 email 사용
        const email =
          memberData.email || session.user.email || userData.email || '';

        // 폼 상태 업데이트
        const loadedNickname = memberData.nickname || nickname;
        setEmail(email);
        setNickname(loadedNickname);
        setOriginalNickname(loadedNickname); // 원본 닉네임 저장
        setBio(memberData.introduction || '');

        // 프로필 이미지 URL 생성 및 기존 파일 ID 저장
        if (memberData.profileImage?.id) {
          const profileImageUrl = getFileUrl(memberData.profileImage.id);
          setProfilePreview(profileImageUrl);
          setExistingProfileImageFileId(memberData.profileImage.id);
        }
      } catch (err) {
        console.error('회원 정보 불러오기 실패', err);
        setError('회원 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMemberInfo();
  }, [userData.isLoggedIn, userData.email]);

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

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    const trimmed = nickname.trim();

    if (!trimmed) {
      setNicknameStatus('empty');
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }

    setNicknameStatus('checking');
    setNicknameMessage('중복 확인 중입니다...');

    try {
      const result = await checkNickname(trimmed);

      if (!result.success) {
        setNicknameStatus('error');
        setNicknameMessage(result.error || '중복 확인 중 오류가 발생했습니다.');
        return;
      }

      if (result.isExist) {
        setNicknameStatus('unavailable');
        setNicknameMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameStatus('available');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      }
    } catch (err) {
      console.error('닉네임 중복 확인 실패', err);
      setNicknameStatus('error');
      setNicknameMessage('중복 확인 중 오류가 발생했습니다.');
    }
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
    setSelectedFile(file);
  };

  // 제출 + 저장 + 이동
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) return;

    // 닉네임이 변경되었고 중복 확인이 필요한 경우
    const nicknameChanged = nickname.trim() !== originalNickname;
    if (nicknameChanged && nicknameStatus !== 'available') {
      if (nicknameStatus === 'idle') {
        setNicknameMessage('닉네임 중복 확인을 해주세요.');
      }
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 로그인 상태 확인
      if (!userData.isLoggedIn) {
        setError('로그인이 필요합니다.');
        setSaving(false);
        return;
      }

      // Supabase 세션에서 authUuid 가져오기
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setError('세션을 가져올 수 없습니다.');
        setSaving(false);
        return;
      }

      const authUuid = session.user.id;
      // name은 실제 이름, nickname과는 별개
      // 기존 회원 정보에서 name을 가져오거나, 없으면 기본값 사용
      const name =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.nickname ||
        nickname ||
        '사용자';

      // 프로필 이미지 업로드 (파일이 선택된 경우)
      let profileImageFileId = existingProfileImageFileId; // 기존 이미지 ID로 초기화
      if (selectedFile) {
        const uploadResult = await uploadFiles(selectedFile);
        if (!uploadResult.success) {
          setError(
            uploadResult.error || '프로필 이미지 업로드에 실패했습니다.'
          );
          setSaving(false);
          return;
        }
        if (uploadResult.data && uploadResult.data.length > 0) {
          profileImageFileId = uploadResult.data[0].id;
        }
      }

      // 회원 정보 업데이트
      const trimmedNickname = nickname.trim();
      const trimmedName = name.trim() || trimmedNickname || '사용자';
      const trimmedBio = bio.trim();

      // 디버깅: 전송할 데이터 확인
      console.log('📤 저장할 회원 정보:', {
        authUuid,
        name: trimmedName,
        nickname: trimmedNickname,
        introduction: trimmedBio,
        profileImageFileId,
      });

      // nickname이 비어있으면 에러
      if (!trimmedNickname) {
        setError('닉네임을 입력해주세요.');
        setSaving(false);
        return;
      }

      const memberData = {
        authUuid,
        name: trimmedName,
        nickname: trimmedNickname,
        introduction: trimmedBio,
        profileImageFileId,
      };

      const result = await createOrUpdateMember(memberData);

      // 디버깅: 응답 확인
      console.log('📥 저장 결과:', result);

      if (!result.success) {
        setError(result.error || '회원 정보 저장에 실패했습니다.');
        setSaving(false);
        return;
      }

      // 저장된 memberId를 localStorage에 저장하고 userData 업데이트
      const savedMemberId = result.data?.id;
      if (savedMemberId) {
        localStorage.setItem('memberId', savedMemberId.toString());
        console.log('✅ memberId 저장됨:', savedMemberId);

        // userData 업데이트를 위해 페이지 새로고침 또는 context 업데이트
        // AuthStateContext가 세션 체크 시 memberId를 가져오도록 했으므로
        // 여기서는 localStorage에만 저장하고, 페이지 이동 시 자동으로 업데이트됨
      }

      // 성공 시 프로필 페이지로 이동 (업데이트된 데이터 전달)
      navigate('/memberinfo', {
        state: {
          updatedMemberData: result.data,
          updatedAt: Date.now(), // 캐시 방지를 위한 타임스탬프
        },
      });
    } catch (err) {
      console.error('회원 정보 저장 실패', err);
      setError('회원 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="pt-24" />
        <main className="flex-1 max-w-6xl mx-auto px-10 pb-24">
          <div className="text-slate-500">로딩 중...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-24" />

      <main className="flex-1 max-w-6xl mx-auto px-10 pb-24">
        <h1 className="text-2xl font-semibold text-sky-500 border-b border-slate-200 pb-4 mb-10">
          프로필 수정
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-sm text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start"
        >
          {/* 왼쪽 2열: 입력 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 닉네임 + 중복 확인 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                닉네임
              </label>
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
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full h-10 border border-slate-300 rounded-sm px-3 text-sm text-slate-500 bg-slate-50"
              />
            </div>

            {/* 소개글 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                소개글
              </label>
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
              <p className="text-sm font-semibold text-slate-800">
                비밀번호 변경
              </p>

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
                    passwordError
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-sky-400'
                  }`}
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-rose-500">{passwordError}</p>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <div className="w-52 h-52 rounded-full bg-amber-400 flex items-center justify-center mb-4 overflow-hidden">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="프로필 미리보기"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-amber-300 flex items-center justify-center">
                  <span className="text-6xl text-white">👤</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

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
              disabled={saving}
              className={`px-8 py-2.5 text-white text-sm font-semibold rounded-sm ${
                saving
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500'
              }`}
            >
              {saving ? '저장 중...' : '수정 하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default MemberInfoModifyComp;
