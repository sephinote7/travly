// src/util/apiClient.js
import axios from 'axios';

// Spring API 기본 URL 설정 (환경 변수 또는 직접 설정)
// .env 파일에서 값에 공백이나 따옴표가 있으면 자동으로 제거
const rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/travly';
const API_BASE_URL = typeof rawUrl === 'string' ? rawUrl.trim().replace(/^['"]|['"]$/g, '') : rawUrl;

// 디버깅: 실제 사용되는 baseURL 확인 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: Authorization 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData를 사용하는 경우 Content-Type을 제거하여 Axios가 자동으로 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (import.meta.env.DEV) {
      const fullUrl = `${config.baseURL}${config.url}${
        config.params ? '?' + new URLSearchParams(config.params).toString() : ''
      }`;
      console.log('📤 API Request:', config.method?.toUpperCase(), fullUrl);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', response.status, response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        '❌ API Response Error:',
        error.response?.status,
        error.config?.url,
        error.response?.data || error.message
      );
    }

    // 401 Unauthorized: 인증 실패
    if (error.response?.status === 401) {
      console.warn('⚠️ 인증 실패: 토큰이 만료되었거나 유효하지 않습니다.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }

    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.warn('⚠️ 권한 없음: 이 작업을 수행할 권한이 없습니다.');
    }

    // 404 Not Found: 리소스를 찾을 수 없음
    if (error.response?.status === 404) {
      console.warn('⚠️ 리소스를 찾을 수 없습니다:', error.config?.url);
    }

    // 500 Internal Server Error: 서버 오류
    if (error.response?.status === 500) {
      console.error('❌ 서버 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
