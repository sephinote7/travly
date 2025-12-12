import axios from 'axios';

const apiClient = axios.create({
  // ⭐ API의 기본 주소만 설정합니다.
  baseURL: 'http://localhost:8080/api/travly',
});

export default apiClient;
