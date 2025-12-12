# Spring API 연동 가이드

이 프로젝트는 React 프론트엔드와 Spring 백엔드를 axios를 통해 연동합니다.

## 📁 파일 구조

```
src/
├── util/
│   ├── apiClient.js          # axios 인스턴스 설정 (기본 URL, 인터셉터)
│   ├── boardService.js        # 게시글 관련 API 서비스
│   └── memberService.js       # 회원 관련 API 서비스
└── pages/
    └── home/
        └── WeeklyBoardTopList.jsx  # API 사용 예시
```

## 🔧 설정 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Spring API 기본 URL을 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

또는 `apiClient.js`에서 직접 설정할 수 있습니다:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 2. Spring API 엔드포인트 예시

Spring 백엔드에서 다음과 같은 엔드포인트를 제공해야 합니다:

#### 게시글 관련
- `GET /api/travly/board/top3` - 주간 인기 게시글 TOP 3
- `GET /api/travly/board/list` - 게시글 목록 조회
- `GET /api/travly/board/{id}` - 게시글 상세 조회
- `POST /api/travly/board` - 게시글 작성
- `PUT /api/travly/board/{id}` - 게시글 수정
- `DELETE /api/travly/board/{id}` - 게시글 삭제
- `POST /api/travly/board/{id}/like` - 게시글 좋아요
- `POST /api/travly/board/{id}/bookmark` - 게시글 북마크

#### 회원 관련
- `GET /api/travly/member/{id}` - 회원 정보 조회
- `PUT /api/travly/member/{id}` - 회원 정보 수정
- `GET /api/travly/member/check-nickname?nickname={nickname}` - 닉네임 중복 확인

## 📝 사용 방법

### 1. 기본 사용 예시

```javascript
import { getWeeklyTopBoards } from '../../util/boardService';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWeeklyTopBoards();
      
      if (result.success) {
        setData(result.data);
      } else {
        console.error('에러:', result.error);
      }
    };

    fetchData();
  }, []);

  return <div>{/* 컴포넌트 내용 */}</div>;
}
```

### 2. 직접 axios 사용하기

`apiClient`를 직접 사용할 수도 있습니다:

```javascript
import apiClient from '../../util/apiClient';

// GET 요청
const response = await apiClient.get('/travly/board/list', {
  params: { page: 1, size: 10 }
});

// POST 요청
const response = await apiClient.post('/travly/board', {
  title: '제목',
  content: '내용'
});

// PUT 요청
const response = await apiClient.put('/travly/board/1', {
  title: '수정된 제목'
});

// DELETE 요청
const response = await apiClient.delete('/travly/board/1');
```

### 3. 인증 토큰 사용

로그인 후 토큰을 localStorage에 저장하면 자동으로 헤더에 추가됩니다:

```javascript
// 로그인 성공 후
localStorage.setItem('authToken', 'your-jwt-token');

// 이후 모든 API 요청에 자동으로 Authorization 헤더가 추가됩니다
```

## 🔐 인증 처리

`apiClient.js`의 인터셉터가 자동으로 처리합니다:

- **요청 인터셉터**: localStorage에서 `authToken`을 읽어 Authorization 헤더에 추가
- **응답 인터셉터**: 401 에러 시 자동으로 로그인 페이지로 리다이렉트 (필요시 주석 해제)

## 🛠️ 새로운 API 서비스 추가하기

1. `src/util/` 폴더에 새로운 서비스 파일 생성 (예: `commentService.js`)
2. `apiClient`를 import하여 사용:

```javascript
// src/util/commentService.js
import apiClient from './apiClient';

export const getComments = async (boardId) => {
  try {
    const response = await apiClient.get(`/travly/board/${boardId}/comments`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const createComment = async (boardId, commentData) => {
  try {
    const response = await apiClient.post(`/travly/board/${boardId}/comments`, commentData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};
```

3. 컴포넌트에서 사용:

```javascript
import { getComments, createComment } from '../../util/commentService';
```

## ⚠️ CORS 설정

Spring 백엔드에서 CORS를 허용해야 합니다:

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/travly")
public class BoardController {
    // ...
}
```

또는 전역 설정:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 📊 응답 데이터 형식

Spring API는 다음과 같은 형식으로 응답해야 합니다:

```json
{
  "id": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "createdAt": "2025-12-11T10:00:00",
  "memberName": "작성자명",
  "memberId": 1,
  "likeCount": 10,
  "viewCount": 100
}
```

## 🐛 에러 처리

모든 서비스 함수는 `{ success: boolean, data?: any, error?: any }` 형식으로 반환합니다:

```javascript
const result = await getWeeklyTopBoards();

if (result.success) {
  // 성공 처리
  console.log(result.data);
} else {
  // 에러 처리
  console.error(result.error);
}
```

## 📚 참고 예시

`src/pages/home/WeeklyBoardTopList.jsx` 파일을 참고하여 실제 사용 예시를 확인할 수 있습니다.


