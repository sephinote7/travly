# API URL 설정 가이드

## 현재 설정 확인

### .env 파일 형식
```env
VITE_API_BASE_URL=http://localhost:8080/api/travly
```

**⚠️ 주의사항:**
- 따옴표(`'` 또는 `"`)를 사용하지 마세요
- 등호(`=`) 앞뒤에 공백을 넣지 마세요
- 올바른 형식: `VITE_API_BASE_URL=http://localhost:8080/api/travly`
- 잘못된 형식: `VITE_API_BASE_URL= 'http://localhost:8080/api/travly'` (공백과 따옴표)

### 현재 URL 구조

**apiClient.js의 baseURL:** `http://localhost:8080/api/travly`

**memberService.js에서 호출:**
- `checkNickname()` → `/member/check`
- **최종 URL:** `http://localhost:8080/api/travly/member/check`

## Spring API 엔드포인트에 따른 설정

### 경우 1: Spring API가 `/api/travly/member/check`인 경우
현재 설정 그대로 사용하면 됩니다.

### 경우 2: Spring API가 `/api/member/check`인 경우
두 가지 방법이 있습니다:

#### 방법 A: baseURL을 `/api`로 변경
`.env` 파일:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

`memberService.js`에서 `/travly/member/check` 호출:
```javascript
apiClient.get('/travly/member/check', { params: { nickname } });
```

#### 방법 B: baseURL은 그대로 두고 경로만 수정
`.env` 파일:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

`memberService.js`에서 `/member/check` 호출:
```javascript
apiClient.get('/member/check', { params: { nickname } });
```

## 디버깅

개발 환경에서 브라우저 콘솔을 열면:
- `🔗 API Base URL:` - 실제 사용되는 baseURL
- `📤 API Request:` - 실제 요청 URL

이 로그를 통해 정확한 URL을 확인할 수 있습니다.

## 확인 방법

1. 브라우저 개발자 도구 콘솔 열기 (F12)
2. `checkNickname()` 또는 `checkEmail()` 함수 호출
3. 콘솔에서 실제 요청 URL 확인
4. Spring API 엔드포인트와 일치하는지 확인


