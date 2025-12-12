/**
 * member/check API 사용 예시
 * 
 * 이 파일은 참고용 예시입니다.
 * 실제 사용 시에는 memberService.js의 함수들을 import하여 사용하세요.
 */

import { checkNickname, checkEmail } from './memberService';

// ============================================
// 예시 1: 닉네임 중복 확인 - 성공 케이스
// ============================================
export const exampleCheckNicknameSuccess = async () => {
  const nickname = '길동이';
  
  const result = await checkNickname(nickname);
  
  if (result.success) {
    if (result.isExist) {
      // isExist: true → 중복 있음 (사용 불가)
      console.log('❌ 닉네임이 이미 사용 중입니다.');
      console.log('응답:', { isExist: true });
    } else {
      // isExist: false → 중복 없음 (사용 가능)
      console.log('✅ 닉네임을 사용할 수 있습니다.');
      console.log('응답:', { isExist: false });
    }
  } else {
    console.error('에러 발생:', result.error);
    if (result.status === 400) {
      console.error('400 에러: 파라미터 오류');
    }
  }
};

// ============================================
// 예시 2: 이메일 중복 확인 - 성공 케이스
// ============================================
export const exampleCheckEmailSuccess = async () => {
  const email = 'abcd@abcd.com';
  
  const result = await checkEmail(email);
  
  if (result.success) {
    if (result.isExist) {
      // isExist: true → 중복 있음 (사용 불가)
      console.log('❌ 이메일이 이미 사용 중입니다.');
      console.log('응답:', { isExist: true });
    } else {
      // isExist: false → 중복 없음 (사용 가능)
      console.log('✅ 이메일을 사용할 수 있습니다.');
      console.log('응답:', { isExist: false });
    }
  } else {
    console.error('에러 발생:', result.error);
    if (result.status === 400) {
      console.error('400 에러: 파라미터 오류');
    }
  }
};

// ============================================
// 예시 3: 400 에러 처리 (파라미터 누락)
// ============================================
export const exampleCheckNicknameError400 = async () => {
  // 빈 값으로 호출하면 400 에러 발생
  const result = await checkNickname('');
  
  if (!result.success && result.status === 400) {
    console.error('400 에러:', result.error);
    // 예상 응답: "파라미터 'nickname' 또는 'email' 가 사용 되어야 합니다."
  }
};

// ============================================
// 예시 4: React 컴포넌트에서 사용
// ============================================
/*
import { useState } from 'react';
import { checkNickname, checkEmail } from '../util/memberService';

function SignupForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('idle');
  const [emailStatus, setEmailStatus] = useState('idle');

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setNicknameStatus('checking');
    const result = await checkNickname(nickname);

    if (result.success) {
      if (result.isExist) {
        // isExist: true → 중복 있음
        setNicknameStatus('unavailable');
        alert('이미 사용 중인 닉네임입니다.');
      } else {
        // isExist: false → 중복 없음 (사용 가능)
        setNicknameStatus('available');
        alert('사용 가능한 닉네임입니다.');
      }
    } else {
      setNicknameStatus('error');
      
      // 400 에러인 경우 서버 메시지 표시
      if (result.status === 400) {
        alert(`파라미터 오류: ${result.error}`);
      } else {
        alert(`오류 발생: ${result.error}`);
      }
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setEmailStatus('checking');
    const result = await checkEmail(email);

    if (result.success) {
      if (result.isExist) {
        // isExist: true → 중복 있음
        setEmailStatus('unavailable');
        alert('이미 사용 중인 이메일입니다.');
      } else {
        // isExist: false → 중복 없음 (사용 가능)
        setEmailStatus('available');
        alert('사용 가능한 이메일입니다.');
      }
    } else {
      setEmailStatus('error');
      
      // 400 에러인 경우 서버 메시지 표시
      if (result.status === 400) {
        alert(`파라미터 오류: ${result.error}`);
      } else {
        alert(`오류 발생: ${result.error}`);
      }
    }
  };

  return (
    <div>
      <div>
        <input 
          type="text" 
          value={nickname} 
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
        />
        <button onClick={handleCheckNickname}>중복 확인</button>
        {nicknameStatus === 'available' && <span>✓ 사용 가능</span>}
        {nicknameStatus === 'unavailable' && <span>✗ 이미 사용 중</span>}
        {nicknameStatus === 'error' && <span>⚠ 오류 발생</span>}
      </div>

      <div>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <button onClick={handleCheckEmail}>중복 확인</button>
        {emailStatus === 'available' && <span>✓ 사용 가능</span>}
        {emailStatus === 'unavailable' && <span>✗ 이미 사용 중</span>}
        {emailStatus === 'error' && <span>⚠ 오류 발생</span>}
      </div>
    </div>
  );
}
*/

// ============================================
// API 응답 형식 정리
// ============================================

/**
 * 성공 응답 (200 OK):
 * {
 *   "isExist": false  // 중복 없음 (사용 가능)
 * }
 * 또는
 * {
 *   "isExist": true   // 중복 있음 (사용 불가)
 * }
 * 
 * 에러 응답 (400 Bad Request):
 * {
 *   "status": 400,
 *   "message": "파라미터 'nickname' 또는 'email' 가 사용 되어야 합니다."
 * }
 * 
 * 함수 반환 형식:
 * {
 *   success: true/false,
 *   isExist: boolean (success가 true일 때만),
 *   available: boolean (success가 true일 때만, !isExist와 동일),
 *   error: string (success가 false일 때),
 *   status: number (에러 상태 코드)
 * }
 */


