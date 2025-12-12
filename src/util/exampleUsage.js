// src/util/exampleUsage.js
/**
 * Spring API 중복 확인 사용 예시
 * 
 * 이 파일은 참고용 예시입니다. 실제 컴포넌트에서 사용할 때는
 * memberService.js의 함수들을 import하여 사용하세요.
 */

import { checkNickname, checkEmail } from './memberService';

// ============================================
// 예시 1: 닉네임 중복 확인
// ============================================
export const exampleCheckNickname = async () => {
  const nickname = '길동이';
  
  const result = await checkNickname(nickname);
  
  if (result.success) {
    if (result.isExist) {
      console.log('닉네임이 이미 사용 중입니다.');
      // isExist: true -> 중복 있음
    } else {
      console.log('닉네임을 사용할 수 있습니다.');
      // isExist: false -> 중복 없음 (사용 가능)
    }
  } else {
    console.error('에러 발생:', result.error);
  }
};

// ============================================
// 예시 2: 이메일 중복 확인
// ============================================
export const exampleCheckEmail = async () => {
  const email = 'abcd@abcd.com';
  
  const result = await checkEmail(email);
  
  if (result.success) {
    if (result.isExist) {
      console.log('이메일이 이미 사용 중입니다.');
      // isExist: true -> 중복 있음
    } else {
      console.log('이메일을 사용할 수 있습니다.');
      // isExist: false -> 중복 없음 (사용 가능)
    }
  } else {
    console.error('에러 발생:', result.error);
  }
};

// ============================================
// 예시 3: React 컴포넌트에서 사용
// ============================================
/*
import { useState } from 'react';
import { checkNickname, checkEmail } from '../util/memberService';

function SignupForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('idle'); // idle, checking, available, unavailable
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
        setNicknameStatus('unavailable');
        alert('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameStatus('available');
        alert('사용 가능한 닉네임입니다.');
      }
    } else {
      setNicknameStatus('error');
      alert('중복 확인 중 오류가 발생했습니다.');
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
        setEmailStatus('unavailable');
        alert('이미 사용 중인 이메일입니다.');
      } else {
        setEmailStatus('available');
        alert('사용 가능한 이메일입니다.');
      }
    } else {
      setEmailStatus('error');
      alert('중복 확인 중 오류가 발생했습니다.');
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
      </div>
    </div>
  );
}
*/


