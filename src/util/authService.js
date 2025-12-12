// src/util/authService.js
import apiClient from './apiClient';
import axios from 'axios';

/**
 * 인증 관련 API 서비스
 */

/**
 * 로그인
 * POST /auth/login
 * 
 * 사용자가 닉네임과 비밀번호를 입력해 로그인하고
 * 인증 성공 시 JWT 토큰을 발급받습니다.
 * 
 * @param {Object} loginData - 로그인 정보
 * @param {string} loginData.nickname - 회원 닉네임 (필수)
 * @param {string} loginData.password - 회원 비밀번호 (필수)
 * 
 * @returns {Promise<{success: boolean, data?: Object, error?: string, status?: number}>}
 * 
 * 성공 응답:
 * - data: {
 *     message: "ok",
 *     accessToken: "JWT 토큰",
 *     refreshToken: "리프레시 토큰",
 *     result: {
 *       id: 회원 ID,
 *       nickname: 닉네임,
 *       email: 이메일,
 *       name: 이름,
 *       gender: 성별,
 *       height: 키,
 *       weight: 몸무게,
 *       activityLevel: 활동 수준,
 *       profileImage: 프로필 이미지,
 *       createDate: 생성일시,
 *       age: 나이,
 *       recommendedCalories: 권장 칼로리
 *     }
 *   }
 * 
 * 에러 응답:
 * - status: 200 → 잘못된 정보
 *   - "잘못된 정보입니다. 정확한 닉네임과 비밀번호를 입력해 주세요"
 * - status: 400 → 입력값 누락 (프론트엔드에서 처리하므로 불필요할 수 있음)
 *   - "아이디와 비밀번호는 필수 입력값입니다."
 */
export const login = async (loginData) => {
  // 입력값 검증
  if (!loginData || typeof loginData !== 'object') {
    return {
      success: false,
      error: '로그인 정보를 입력해주세요.',
      status: 400,
    };
  }

  const { nickname, password } = loginData;

  // 필수 필드 검증
  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    return {
      success: false,
      error: '닉네임을 입력해주세요.',
      status: 400,
    };
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return {
      success: false,
      error: '비밀번호를 입력해주세요.',
      status: 400,
    };
  }

  // 요청 바디 구성
  const requestBody = {
    nickname: nickname.trim(),
    password: password.trim(),
  };

  try {
    // POST 메서드로 요청
    // 명세서: POST /auth/login
    // 
    // ⚠️ 중요: Spring API의 실제 경로를 확인해야 합니다!
    // 가능한 경로들:
    // 1. /api/travly/auth/login (baseURL + /auth/login)
    // 2. /api/auth/login (auth 컨트롤러가 /api/auth로 매핑)
    // 3. /auth/login (auth 컨트롤러가 루트에 매핑)
    //
    // 현재는 /api/auth/login을 시도합니다 (가장 일반적인 구조)
    // 만약 다른 경로라면 아래 URL을 수정하세요!
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/travly';
    
    // 방법 1: /api/auth/login 시도 (auth 컨트롤러가 /api/auth로 매핑된 경우)
    let response;
    let loginUrl;
    
    try {
      // baseURL에서 /api/travly를 /api로 변경
      const apiBase = baseUrl.replace('/api/travly', '/api');
      loginUrl = `${apiBase}/auth/login`;
      console.log('🔐 로그인 요청 (경로 1):', loginUrl);
      response = await axios.post(loginUrl, requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error1) {
      console.warn('⚠️ 경로 1 실패 (404):', loginUrl);
      
      // 방법 2: /api/travly/auth/login 시도
      try {
        loginUrl = `${baseUrl}/auth/login`;
        console.log('🔐 로그인 요청 (경로 2):', loginUrl);
        response = await axios.post(loginUrl, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error2) {
        console.warn('⚠️ 경로 2 실패 (404):', loginUrl);
        
        // 방법 3: /auth/login 직접 시도
        try {
          loginUrl = 'http://localhost:8080/auth/login';
          console.log('🔐 로그인 요청 (경로 3):', loginUrl);
          response = await axios.post(loginUrl, requestBody, {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error3) {
          // 모든 경로 실패
          console.error('❌ 모든 로그인 경로 실패');
          console.error('시도한 경로들:');
          console.error('  1. /api/auth/login');
          console.error('  2. /api/travly/auth/login');
          console.error('  3. /auth/login');
          console.error('💡 Spring API의 실제 로그인 경로를 확인하고 authService.js를 수정하세요!');
          throw error3;
        }
      }
    }

    // 성공 응답 처리
    const responseData = response.data;
    console.log('✅ 로그인 응답:', responseData);

    // ⚠️ 중요: 200 상태코드지만 에러 메시지인 경우 처리
    // 명세서에 따르면 잘못된 정보일 때도 200 상태코드로 반환됨
    if (responseData.status === 200 && responseData.message && responseData.message !== 'ok') {
      const errorMessage = responseData.message;
      console.error('❌ 로그인 실패 (200 상태코드):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 200,
      };
    }

    // 성공 응답 확인 (message가 "ok"인지 확인)
    if (responseData.message !== 'ok' || !responseData.accessToken) {
      console.error('❌ 로그인 실패: 응답 형식이 올바르지 않습니다.', responseData);
      return {
        success: false,
        error: responseData.message || '로그인 응답 형식이 올바르지 않습니다.',
        status: response.status,
      };
    }

    // 토큰 저장
    if (responseData.accessToken) {
      localStorage.setItem('authToken', responseData.accessToken);
      console.log('💾 accessToken 저장 완료');
    }
    if (responseData.refreshToken) {
      localStorage.setItem('refreshToken', responseData.refreshToken);
      console.log('💾 refreshToken 저장 완료');
    }

    // 회원 정보 저장 (선택사항)
    if (responseData.result) {
      localStorage.setItem('userInfo', JSON.stringify(responseData.result));
      console.log('💾 회원 정보 저장 완료:', responseData.result);
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    // 네트워크 에러 또는 HTTP 에러 처리
    console.error('❌ 로그인 에러 발생:', error);
    console.error('에러 상세:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // 400 에러 처리: 입력값 누락
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '아이디와 비밀번호는 필수 입력값입니다.';
      console.error('로그인 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // Network Error인 경우 (서버가 실행되지 않았거나 연결 불가)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Network Error: Spring 서버에 연결할 수 없습니다.');
      return {
        success: false,
        error: 'Spring API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (http://localhost:8080)',
        status: 0,
      };
    }

    // 기타 에러 처리
    console.error('로그인 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '로그인 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

/**
 * 로그아웃
 * 토큰을 제거하고 로컬 스토리지를 정리합니다.
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('travlyProfile');
};

/**
 * 저장된 토큰 가져오기
 */
export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * 저장된 리프레시 토큰 가져오기
 */
export const getStoredRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * 저장된 사용자 정보 가져오기
 */
export const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

