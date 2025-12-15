# DB 연동 가이드

## 현재 상태

✅ **준비 완료**:
- `database/schema.sql`: Supabase 테이블 스키마
- `src/util/profileService.js`: 프로필 관련 서비스 함수
- `database/README.md`: DBeaver 연결 가이드

⏳ **아직 미연동**:
- 코드는 현재 localStorage만 사용 중
- DB 테이블은 아직 사용하지 않음

## 나중에 연동하는 방법

### 1단계: Supabase에 스키마 실행

1. Supabase 대시보드 접속
2. SQL Editor 열기
3. `database/schema.sql` 파일 내용 복사하여 실행
4. 테이블이 생성되었는지 확인

### 2단계: 코드 수정

#### MemberInfoModifyComp.jsx 수정 예시

```javascript
// import 추가
import { upsertProfile, checkNicknameAvailable } from '../../util/profileService';
import supabase from '../../util/supabaseClient';

// 닉네임 중복 확인 함수 수정
const handleNicknameCheck = async () => {
  const trimmed = nickname.trim();
  if (!trimmed) {
    setNicknameStatus('empty');
    setNicknameMessage('닉네임을 입력해주세요.');
    return;
  }

  setNicknameStatus('checking');
  setNicknameMessage('중복 확인 중입니다...');

  // DB에서 중복 확인
  const { available, error } = await checkNicknameAvailable(trimmed, userData?.id);
  
  if (error) {
    setNicknameStatus('error');
    setNicknameMessage('확인 중 오류가 발생했습니다.');
    return;
  }

  if (available) {
    setNicknameStatus('available');
    setNicknameMessage('사용 가능한 닉네임입니다.');
  } else {
    setNicknameStatus('unavailable');
    setNicknameMessage('이미 사용 중인 닉네임입니다.');
  }
};

// 제출 함수 수정
const handleSubmit = async (e) => {
  e.preventDefault();
  if (passwordError) return;

  // 프로필 이미지 업로드 (Supabase Storage 사용)
  let profileImageUrl = null;
  if (profilePreview && fileInputRef.current?.files[0]) {
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file);
    
    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      profileImageUrl = publicUrl;
    }
  }

  // DB에 프로필 저장
  const { success, error } = await upsertProfile(userData.id, {
    nickname,
    bio,
    profileImage: profileImageUrl || profilePreview,
  });

  if (!success) {
    alert('프로필 저장 실패: ' + error.message);
    return;
  }

  // 비밀번호 변경 (기존 코드 유지)
  if (password && passwordConfirm) {
    const { error: passwordError } = await supabase.auth.updateUser({
      password: password,
    });
    if (passwordError) {
      alert('비밀번호 변경 실패: ' + passwordError.message);
      return;
    }
  }

  alert('프로필이 성공적으로 저장되었습니다.');
  navigate('/memberinfo');
};
```

#### MemberInfoComp.jsx 수정 예시

```javascript
// import 추가
import { getProfile } from '../../util/profileService';

// useEffect 수정
useEffect(() => {
  const loadProfile = async () => {
    if (!userData?.isLoggedIn || !userData.id) return;

    // DB에서 프로필 불러오기
    const profileData = await getProfile(userData.id);
    
    if (profileData) {
      setProfile({
        nickname: profileData.nickname || userData.name || '닉네임',
        email: userData.email || '이메일@이메일.com',
        bio: profileData.bio || '',
        profileImage: profileData.profile_image_url || null,
      });
    } else {
      // DB에 프로필이 없으면 userData 사용
      setProfile({
        nickname: userData.name || '닉네임',
        email: userData.email || '이메일@이메일.com',
        bio: '',
        profileImage: null,
      });
    }
  };

  loadProfile();
}, [userData]);
```

#### SideProfileComp.jsx 수정 예시

```javascript
// import 추가
import { getProfile } from '../../util/profileService';

// useEffect 수정
useEffect(() => {
  const loadProfile = async () => {
    if (!userData?.isLoggedIn || !userData.id) return;

    const profileData = await getProfile(userData.id);
    if (profileData) {
      setProfile({
        nickname: profileData.nickname || userName,
        email: profileData.email || userEmail,
        profileImage: profileData.profile_image_url || null,
        badge: getBadgeImage(profileData.badge_type), // badge_type에 따라 배지 선택
      });
    }
  };

  loadProfile();
}, [userName, userEmail, userData]);
```

### 3단계: Supabase Storage 설정 (프로필 이미지용)

1. Supabase 대시보드 → Storage
2. 새 버킷 생성: `profile-images`
3. Public 버킷으로 설정
4. RLS 정책 설정:
   - 읽기: 모든 사용자 허용
   - 업로드: 인증된 사용자만 허용

## 주의사항

1. **스키마 실행 필수**: 코드 수정 전에 반드시 `schema.sql`을 실행해야 합니다
2. **기존 데이터**: localStorage에 저장된 데이터는 마이그레이션이 필요할 수 있습니다
3. **에러 처리**: 네트워크 오류나 DB 오류에 대한 적절한 에러 처리가 필요합니다
4. **로딩 상태**: DB 조회 시 로딩 상태를 표시하는 것이 좋습니다

## 테스트 방법

1. 회원가입 후 프로필 생성 확인
2. 프로필 수정 후 DB에 반영되는지 확인
3. 다른 사용자 프로필 조회 확인
4. 닉네임 중복 확인 기능 테스트







