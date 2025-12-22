import axios from 'axios';
import supabase from '../util/supabaseClient';

const apiClient = axios.create({
  // ⭐ API의 기본 주소만 설정합니다.
  baseURL: 'http://localhost:8080/api/travly',
});

export default apiClient;

// 모든 요청 전에 실행되어 JWT를 가져와 헤더에 추가합니다.
//
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Supabase 세션 정보 비동기 호출
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      // 세션이 유효하고 access_token이 있다면
      if (session && session.access_token) {
        // Authorization 헤더에 Bearer 토큰 형식으로 JWT 추가
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      // Supabase 클라이언트에서 세션 정보를 가져오는 중 오류 발생 시
      console.error('Supabase JWT 가져오기 오류:', error);
    }

    // 수정된 config 객체를 반환하여 요청을 서버로 전송
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);








