# Spring 로그인 API 문제 해결 가이드

## 현재 상황

로그인 시도 시 다음과 같은 에러가 발생:
- 모든 경로에서 404 에러
- 마지막에 "Network Error" 발생

## 문제 진단

### 1. Network Error의 의미
- **Network Error** = Spring 서버가 실행되지 않았거나 연결할 수 없음
- 404 에러 = 서버는 응답했지만 해당 경로가 없음

### 2. 확인해야 할 사항

#### ✅ Spring 서버 실행 확인
```bash
# Spring Boot 서버가 실행 중인지 확인
# 콘솔에 다음과 같은 메시지가 보여야 함:
# "Started TravlyApiApplication in X.XXX seconds"
```

#### ✅ 포트 확인
- Spring 서버가 `http://localhost:8080`에서 실행 중인지 확인
- 다른 포트를 사용한다면 `.env` 파일 수정 필요

#### ✅ 로그인 API 경로 확인
Spring Boot 컨트롤러에서 실제 경로 확인:

```java
@RestController
@RequestMapping("/api/auth")  // 또는 다른 경로
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // ...
    }
}
```

## 해결 방법

### 방법 1: Spring 서버 실행 확인

1. **Spring Boot 프로젝트 실행**
   - IntelliJ IDEA에서 `TravlyApiApplication.java` 실행
   - 또는 터미널에서 `mvn spring-boot:run`

2. **서버 실행 확인**
   - 브라우저에서 `http://localhost:8080` 접속 시도
   - 또는 `http://localhost:8080/actuator/health` (Spring Actuator가 있다면)

### 방법 2: 실제 로그인 경로 확인

Spring API의 실제 로그인 경로를 확인한 후 `authService.js` 수정:

```javascript
// src/util/authService.js
// 예시: Spring API가 /api/travly/auth/login에 있다면
const loginUrl = 'http://localhost:8080/api/travly/auth/login';
response = await axios.post(loginUrl, requestBody, {
  headers: { 'Content-Type': 'application/json' },
});
```

### 방법 3: Postman으로 테스트

1. Postman에서 직접 테스트:
   ```
   POST http://localhost:8080/api/auth/login
   Body (JSON):
   {
     "nickname": "test",
     "password": "test123"
   }
   ```

2. 작동하는 경로를 찾으면 그 경로로 코드 수정

### 방법 4: CORS 설정 확인

Spring API에서 CORS가 설정되어 있는지 확인:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // React 앱 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 현재 시도 중인 경로들

1. `http://localhost:8080/api/auth/login`
2. `http://localhost:8080/api/travly/auth/login`
3. `http://localhost:8080/auth/login`

## 다음 단계

1. ✅ Spring 서버가 실행 중인지 확인
2. ✅ Spring API의 실제 로그인 경로 확인
3. ✅ `authService.js`에서 올바른 경로로 수정
4. ✅ CORS 설정 확인

## 빠른 확인 방법

브라우저 콘솔에서 직접 테스트:

```javascript
// 브라우저 콘솔에서 실행
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nickname: 'test', password: 'test123' })
})
.then(res => res.json())
.then(data => console.log('성공:', data))
.catch(err => console.error('에러:', err));
```

이렇게 하면 실제로 어떤 경로가 작동하는지 확인할 수 있습니다.

