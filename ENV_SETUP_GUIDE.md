# .env 파일 설정 가이드

## ✅ 자동으로 동작합니다!

`.env` 파일에 URL을 넣으면 **자동으로** 그 URL로 요청이 갑니다. 추가 설정은 필요 없습니다.

## 📝 .env 파일 위치 및 형식

### 파일 위치
프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요:
```
travly/
├── .env          ← 여기에 생성
├── package.json
├── src/
└── ...
```

### 올바른 형식
```env
VITE_SUPABASE_URL=https://dbrdapcheieyctehmmae.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_vo5lWZ3RXGiPL8HNcFhNAw_ulyhXhll
VITE_API_BASE_URL=http://localhost:8080/api/travly
```

**⚠️ 중요:**
- 따옴표(`'` 또는 `"`) 사용하지 마세요
- 등호(`=`) 앞뒤에 공백 없이 작성하세요
- `VITE_` 접두사가 있어야 합니다 (Vite 환경 변수 규칙)

### 잘못된 형식 (작동하지 않음)
```env
# ❌ 따옴표 사용
VITE_API_BASE_URL='http://localhost:8080/api/travly'

# ❌ 공백 있음
VITE_API_BASE_URL= 'http://localhost:8080/api/travly'

# ❌ VITE_ 접두사 없음
API_BASE_URL=http://localhost:8080/api/travly
```

## 🔄 서버 재시작 필요

`.env` 파일을 수정한 후에는 **Vite 개발 서버를 재시작**해야 합니다:

1. 현재 실행 중인 서버 중지 (Ctrl + C)
2. 다시 시작: `npm run dev`

## ✅ 설정 확인 방법

### 방법 1: 브라우저 콘솔 확인
1. 브라우저 개발자 도구 열기 (F12)
2. 콘솔 탭 선택
3. 페이지 새로고침
4. 콘솔에서 다음 메시지 확인:
   ```
   🔗 API Base URL: http://localhost:8080/api/travly
   ```

### 방법 2: API 요청 시 확인
`checkNickname()` 또는 `checkEmail()` 함수를 호출하면 콘솔에 실제 요청 URL이 표시됩니다:
```
📤 API Request: GET http://localhost:8080/api/travly/member/check?nickname=길동이
```

## 🔍 문제 해결

### 환경 변수가 읽히지 않는 경우

1. **서버 재시작 확인**
   - `.env` 파일 수정 후 서버를 재시작했는지 확인

2. **파일 위치 확인**
   - `.env` 파일이 프로젝트 루트에 있는지 확인
   - `src/` 폴더 안이 아닌 루트에 있어야 합니다

3. **변수명 확인**
   - `VITE_` 접두사가 있는지 확인
   - 대소문자 정확히 일치하는지 확인

4. **콘솔에서 직접 확인**
   브라우저 콘솔에서 다음 명령어 실행:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   ```
   - `undefined`가 나오면 환경 변수가 읽히지 않은 것입니다
   - URL이 나오면 정상적으로 설정된 것입니다

## 📋 현재 설정 요약

- **apiClient.js**: `import.meta.env.VITE_API_BASE_URL` 자동 읽기
- **자동 처리**: 공백/따옴표 제거
- **디버깅**: 개발 환경에서 콘솔에 URL 표시
- **추가 작업 불필요**: `.env` 파일만 올바르게 작성하면 자동 동작

## 🎯 결론

**추가 설정 없이 자동으로 동작합니다!**
- `.env` 파일에 올바른 형식으로 URL 작성
- Vite 서버 재시작
- 끝! 🎉


