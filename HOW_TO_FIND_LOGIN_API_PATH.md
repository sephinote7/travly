# Spring 로그인 API 경로 찾는 방법

## 방법 1: Spring Boot 컨트롤러 파일 찾기 (가장 정확)

### 1단계: AuthController 또는 LoginController 찾기

Spring Boot 프로젝트에서 다음 파일들을 찾아보세요:

```
src/main/java/com/travly/api/controller/
├── AuthController.java      ← 이 파일 확인!
├── LoginController.java      ← 또는 이 파일
└── MemberController.java
```

또는 다른 패키지 구조일 수 있습니다:
```
src/main/java/com/yourcompany/travly/
├── controller/
│   ├── AuthController.java
│   └── LoginController.java
```

### 2단계: 컨트롤러 파일 열기

파일을 열면 다음과 같은 코드가 보입니다:

```java
@RestController
@RequestMapping("/api/auth")  // ← 이 부분이 중요!
public class AuthController {
    
    @PostMapping("/login")     // ← 이 부분도 중요!
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 로그인 로직
    }
}
```

### 3단계: 경로 조합하기

**최종 경로 = `@RequestMapping` + `@PostMapping`**

예시:
- `@RequestMapping("/api/auth")` + `@PostMapping("/login")` 
  → **`/api/auth/login`**
  
- `@RequestMapping("/auth")` + `@PostMapping("/login")`
  → **`/auth/login`**
  
- `@RequestMapping("/api/travly/auth")` + `@PostMapping("/login")`
  → **`/api/travly/auth/login`**

---

## 방법 2: Spring Boot 콘솔 로그 확인

Spring Boot 서버를 실행하면 콘솔에 다음과 같은 로그가 나타납니다:

```
Mapped "{[/api/auth/login],methods=[POST]}" onto ...
```

또는

```
Mapped "{POST /api/auth/login}" onto ...
```

이 로그에서 경로를 확인할 수 있습니다.

---

## 방법 3: Spring Boot Actuator 사용 (선택사항)

만약 Spring Boot Actuator가 설정되어 있다면:

```
http://localhost:8080/actuator/mappings
```

이 URL로 접속하면 모든 API 엔드포인트 목록을 볼 수 있습니다.

---

## 방법 4: Postman으로 테스트

다음 경로들을 하나씩 시도해보세요:

1. `POST http://localhost:8080/api/auth/login`
2. `POST http://localhost:8080/api/travly/auth/login`
3. `POST http://localhost:8080/auth/login`
4. `POST http://localhost:8080/api/login`

**요청 Body (JSON):**
```json
{
  "nickname": "test",
  "password": "test123"
}
```

작동하는 경로를 찾으면 그게 정답입니다!

---

## 방법 5: IDE에서 검색하기

IntelliJ IDEA나 Eclipse에서:

1. **전체 프로젝트 검색** (Ctrl+Shift+F 또는 Cmd+Shift+F)
2. 검색어: `@PostMapping("/login")` 또는 `@RequestMapping` + `login`
3. 검색 결과에서 컨트롤러 파일 찾기

---

## 가장 빠른 방법

**방법 1 (컨트롤러 파일 찾기)**이 가장 정확하고 빠릅니다!

다음 정보를 알려주세요:
1. `@RequestMapping`의 값: 예) `/api/auth`
2. `@PostMapping`의 값: 예) `/login`
3. 또는 전체 경로: 예) `/api/auth/login`

---

## 예시: 찾은 정보를 알려주는 방법

```
✅ 찾았습니다!

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(...) {
        ...
    }
}

→ 최종 경로: /api/auth/login
```

이렇게 알려주시면 바로 코드를 수정하겠습니다!

