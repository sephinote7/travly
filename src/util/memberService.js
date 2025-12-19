// src/util/memberService.js
import apiClient from './apiClient';

/**
 * 회원 관련 API 서비스
 */

/**
 * 회원 정보 조회
 * GET /api/travly/member/{memberId}
 *
 * @param {number|string} memberId - 회원 ID (필수)
 * @returns {Promise<{success: boolean, data?: Object, error?: string, status?: number}>}
 *
 * 성공 응답:
 * - data: 회원 정보 객체
 *   - id: 회원 ID
 *   - nickname: 닉네임
 *   - email: 이메일
 *   - introduction: 자기소개
 *   - notificationCount: 댓글 알림 수
 *   - badge: 배지 정보 (id, name, likeMin, likeMax)
 *   - profileImage: 프로필 이미지 파일 정보 (또는 null)
 *   - createdAt: 생성일시
 *   - updatedAt: 수정일시
 *
 * 에러 응답:
 * - status: 400 → 존재하지 않는 member.id
 *   - "존재하지 않는 member.id [{memberId}]"
 * - 기타 에러 → 네트워크 오류 등
 */
export const getMemberInfo = async (memberId) => {
  // 입력값 검증
  if (!memberId) {
    return {
      success: false,
      error: '회원 ID가 필요합니다.',
      status: 400,
    };
  }

  try {
    const response = await apiClient.get(`/member/${memberId}`);

    // 성공 응답: 회원 정보 객체 반환
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // 400 에러 처리: 존재하지 않는 member.id
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || `존재하지 않는 member.id [${memberId}]`;
      console.error('회원 정보 조회 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 기타 에러 처리
    console.error('회원 정보 조회 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '회원 정보 조회 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

// 회원 정보 수정
export const updateMemberInfo = async (memberId, memberData) => {
  try {
    const response = await apiClient.put(`/travly/member/${memberId}`, memberData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await apiClient.get(`/travly/member/check-nickname`, {
      params: { nickname },
    });
    return { success: true, available: response.data.available };
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

/**
 * 닉네임 중복 확인
 * GET member/check?nickname=길동이
 *
 * @param {string} nickname - 확인할 닉네임 (필수)
 * @returns {Promise<{success: boolean, isExist?: boolean, available?: boolean, error?: string, status?: number}>}
 *
 * 성공 응답:
 * - isExist: false → 중복 없음 (사용 가능)
 * - isExist: true → 중복 있음 (사용 불가)
 *
 * 에러 응답:
 * - status: 400 → 파라미터 오류 (nickname 또는 email이 필요함)
 * - 기타 에러 → 네트워크 오류 등
 */
export const checkNickname = async (nickname) => {
  // 입력값 검증
  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    return {
      success: false,
      error: '닉네임을 입력해주세요.',
      status: 400,
    };
  }

  try {
    const response = await apiClient.get('/member/check', {
      params: { nickname: nickname.trim() },
    });

    // 성공 응답: { "isExist": false } 또는 { "isExist": true }
    const isExist = response.data?.isExist ?? false;

    return {
      success: true,
      isExist: isExist,
      available: !isExist, // 중복이 없으면 사용 가능
    };
  } catch (error) {
    // 400 에러 처리: 파라미터 오류
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '파라미터가 올바르지 않습니다.';
      console.error('닉네임 중복 확인 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 기타 에러 처리
    console.error('닉네임 중복 확인 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '닉네임 중복 확인 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

/**
 * 회원정보 생성/수정 (UPSERT)
 * POST /api/travly/member
 *
 * 회원정보가 없으면 생성, 있으면 수정한다.
 *
 * @param {Object} memberData - 회원 정보 객체
 * @param {string} memberData.authUuid - 인증 사용자 UUID (필수)
 * @param {string} memberData.name - 이름 (필수)
 * @param {string} memberData.nickname - 닉네임 (필수)
 * @param {string} memberData.introduction - 소개글 (선택)
 * @param {number} memberData.profileImageFileId - 프로필 이미지 파일 ID (선택)
 *
 * @returns {Promise<{success: boolean, data?: Object, error?: string, status?: number}>}
 *
 * 성공 응답:
 * - data: 회원 정보 객체 (id, name, nickname, introduction, badge, profileImage 등)
 *
 * 에러 응답:
 * - status: 400 → 파라미터 오류
 *   - "등록되지 않은 인증 사용자 uuid입니다: {uuid}"
 *   - "유효하지 않은 파일 ID입니다: {fileId}"
 *   - "이미 사용 중인 닉네임: {nickname}"
 */
export const createOrUpdateMember = async (memberData) => {
  // 입력값 검증
  if (!memberData || typeof memberData !== 'object') {
    return {
      success: false,
      error: '회원 정보를 입력해주세요.',
      status: 400,
    };
  }

  const { authUuid, name, nickname, introduction, profileImageFileId } = memberData;

  // 필수 필드 검증
  if (!authUuid || typeof authUuid !== 'string') {
    return {
      success: false,
      error: '인증 사용자 UUID가 필요합니다.',
      status: 400,
    };
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return {
      success: false,
      error: '이름을 입력해주세요.',
      status: 400,
    };
  }

  if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
    return {
      success: false,
      error: '닉네임을 입력해주세요.',
      status: 400,
    };
  }

  // 요청 바디 구성
  const requestBody = {
    authUuid: authUuid.trim(),
    name: name.trim(),
    nickname: nickname.trim(),
    introduction: introduction ? introduction.trim() : '',
    profileImageFileId: profileImageFileId || null,
  };

  // 디버깅: API 요청 데이터 확인
  console.log('📤 API 요청 데이터:', requestBody);

  try {
    // POST 메서드로 요청 (UPSERT: 없으면 생성, 있으면 수정)
    // Spring API는 @PostMapping을 사용하므로 POST 메서드 사용
    const response = await apiClient.post('/member', requestBody);

    // 디버깅: API 응답 확인
    console.log('📥 API 응답 데이터:', response.data);

    // 성공 응답: 회원 정보 객체 반환
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // 400 에러 처리: 파라미터 오류
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '파라미터가 올바르지 않습니다.';
      console.error('회원정보 생성/수정 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 기타 에러 처리
    console.error('회원정보 생성/수정 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '회원정보 생성/수정 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

/**
 * authUuid로 회원 정보 조회
 * GET /api/travly/member/auth/{authUuid}
 *
 * @param {string} authUuid - 인증 사용자 UUID (필수)
 * @returns {Promise<{success: boolean, data?: Object, error?: string, status?: number}>}
 *
 * 성공 응답:
 * - data: 회원 정보 객체 (id, nickname, email, introduction, badge, profileImage 등)
 *
 * 에러 응답:
 * - status: 400 → 존재하지 않는 authUuid 또는 Member
 * - 기타 에러 → 네트워크 오류 등
 */
export const getMemberInfoByAuthUuid = async (authUuid) => {
  // 입력값 검증
  if (!authUuid || typeof authUuid !== 'string') {
    console.warn('getMemberInfoByAuthUuid: 유효하지 않은 authUuid:', authUuid);
    return {
      success: false,
      error: '인증 사용자 UUID가 필요합니다.',
      status: 400,
    };
  }

  try {
    console.log('getMemberInfoByAuthUuid 호출:', authUuid);
    // authUuid로 회원 정보 조회 (인증 불필요한 엔드포인트 사용)
    const response = await apiClient.get(`/member/auth/${authUuid}`);
    console.log('getMemberInfoByAuthUuid 응답:', response.data);

    // 성공 응답: 회원 정보 객체 반환
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // 400 에러 처리: 존재하지 않는 authUuid 또는 Member
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || `UUID에 해당하는 Member를 찾을 수 없습니다: ${authUuid}`;
      console.error('회원 정보 조회 실패 (400):', errorMessage, error.response?.data);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 404 에러 처리
    if (error.response?.status === 404) {
      console.error('회원 정보 조회 실패 (404):', error.response?.data);
      return {
        success: false,
        error: '회원 정보를 찾을 수 없습니다.',
        status: 404,
      };
    }

    // 기타 에러 처리
    console.error('회원 정보 조회 실패:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error: error,
    });
    return {
      success: false,
      error: error.response?.data?.message || error.message || '회원 정보 조회 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

/**
 * 이메일 중복 확인
 * GET member/check?email=abcd@abcd.com
 *
 * @param {string} email - 확인할 이메일 (필수)
 * @returns {Promise<{success: boolean, isExist?: boolean, available?: boolean, error?: string, status?: number}>}
 *
 * 성공 응답:
 * - isExist: false → 중복 없음 (사용 가능)
 * - isExist: true → 중복 있음 (사용 불가)
 *
 * 에러 응답:
 * - status: 400 → 파라미터 오류 (nickname 또는 email이 필요함)
 * - 기타 에러 → 네트워크 오류 등
 */
export const checkEmail = async (email) => {
  // 입력값 검증
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return {
      success: false,
      error: '이메일을 입력해주세요.',
      status: 400,
    };
  }

  // 이메일 형식 간단 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      success: false,
      error: '올바른 이메일 형식이 아닙니다.',
      status: 400,
    };
  }

  try {
    const response = await apiClient.get('/member/check', {
      params: { email: email.trim() },
    });

    // 성공 응답: { "isExist": false } 또는 { "isExist": true }
    const isExist = response.data?.isExist ?? false;

    return {
      success: true,
      isExist: isExist,
      available: !isExist, // 중복이 없으면 사용 가능
    };
  } catch (error) {
    // 400 에러 처리: 파라미터 오류
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '파라미터가 올바르지 않습니다.';
      console.error('이메일 중복 확인 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 기타 에러 처리
    console.error('이메일 중복 확인 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '이메일 중복 확인 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};
