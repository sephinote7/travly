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

// 요청 인터셉터 (요청 전에 실행)
apiClient.interceptors.request.use(
  (config) => {
    // 로그인 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 디버깅: 실제 요청 URL 확인 (개발 환경에서만)
    if (import.meta.env.DEV) {
      const fullUrl = `${config.baseURL}${config.url}${config.params ? '?' + new URLSearchParams(config.params).toString() : ''}`;
      console.log('📤 API Request:', config.method?.toUpperCase(), fullUrl);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후에 실행)
apiClient.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    // 디버깅: 응답 데이터 확인 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', response.status, response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버에서 응답이 온 경우
      switch (error.response.status) {
        case 401:
          // 인증 실패 - 로그인 페이지로 리다이렉트
          console.error('인증 실패: 로그인이 필요합니다.');
          // 필요시 로그인 페이지로 리다이렉트
          // window.location.href = '/?login=open';
          break;
        case 403:
          console.error('권한 없음: 접근 권한이 없습니다.');
          break;
        case 404:
          console.error('리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error('서버 오류가 발생했습니다.');
          break;
        default:
          console.error('API 요청 실패:', error.response.data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('서버에 연결할 수 없습니다.');
    } else {
      // 요청 설정 중 오류 발생
      console.error('요청 설정 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
