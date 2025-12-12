# Spring API 준비 가이드 (초보자용)

이 가이드는 Spring Boot를 처음 사용하는 분들을 위한 단계별 설명입니다.

## 📋 목차
1. [필수 준비물](#1-필수-준비물)
2. [Spring Boot 프로젝트 생성](#2-spring-boot-프로젝트-생성)
3. [의존성 설정](#3-의존성-설정)
4. [API 컨트롤러 작성](#4-api-컨트롤러-작성)
5. [CORS 설정](#5-cors-설정)
6. [Spring Boot 실행](#6-spring-boot-실행)
7. [테스트 방법](#7-테스트-방법)

---

## 1. 필수 준비물

### 설치해야 할 것들:
- **Java JDK 17 이상** (권장: JDK 17 또는 21)
  - 다운로드: https://www.oracle.com/java/technologies/downloads/
  - 설치 확인: 터미널에서 `java -version` 입력
- **IDE (통합 개발 환경)**
  - **IntelliJ IDEA** (Community 버전 무료) - 추천
  - 또는 **Eclipse**, **VS Code** 등
- **Maven** 또는 **Gradle** (빌드 도구)
  - IntelliJ IDEA에는 Maven이 포함되어 있음

---

## 2. Spring Boot 프로젝트 생성

### 방법 1: Spring Initializr 사용 (가장 쉬움)

1. **Spring Initializr 웹사이트 접속**
   - https://start.spring.io/

2. **프로젝트 설정**
   ```
   Project: Maven
   Language: Java
   Spring Boot: 3.2.0 (또는 최신 버전)
   Project Metadata:
     - Group: com.travly (또는 원하는 패키지명)
     - Artifact: travly-api (또는 원하는 프로젝트명)
     - Name: travly-api
     - Package name: com.travly.api
     - Packaging: Jar
     - Java: 17
   ```

3. **의존성 추가**
   - **Spring Web** (필수) - REST API를 만들기 위해 필요
   - **Spring Data JPA** (선택) - 데이터베이스 연동 시 필요
   - **MySQL Driver** 또는 **PostgreSQL Driver** (선택) - DB 사용 시 필요

4. **Generate 버튼 클릭**
   - ZIP 파일이 다운로드됨

5. **프로젝트 열기**
   - IntelliJ IDEA에서 File → Open → 다운로드한 폴더 선택

### 방법 2: IntelliJ IDEA에서 직접 생성

1. **IntelliJ IDEA 실행**
2. **New Project** 클릭
3. **Spring Initializr** 선택
4. 위의 설정과 동일하게 입력
5. **Next** → 의존성 선택 → **Finish**

---

## 3. 의존성 설정

프로젝트가 생성되면 `pom.xml` (Maven) 또는 `build.gradle` (Gradle) 파일이 있습니다.

### Maven 사용 시 (`pom.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.travly</groupId>
    <artifactId>travly-api</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>travly-api</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Web (REST API) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- 데이터베이스 연동 (필요 시) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- MySQL (필요 시) -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- 테스트 (자동 포함) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 4. API 컨트롤러 작성

이제 실제 API 엔드포인트를 만들어봅시다.

### 프로젝트 구조
```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── travly/
    │           └── api/
    │               ├── TravlyApiApplication.java  (메인 클래스)
    │               └── controller/
    │                   └── MemberController.java  (새로 생성)
    └── resources/
        └── application.properties  (설정 파일)
```

### 4-1. MemberController.java 생성

`src/main/java/com/travly/api/controller/MemberController.java` 파일을 생성합니다.

```java
package com.travly.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/travly/member")
@CrossOrigin(origins = "http://localhost:5173") // React 앱 주소
public class MemberController {

    /**
     * 닉네임 중복 확인
     * GET /api/travly/member/check?nickname=길동이
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkNicknameOrEmail(
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) String email) {
        
        Map<String, Object> response = new HashMap<>();
        
        // 파라미터 검증
        if (nickname == null && email == null) {
            response.put("status", 400);
            response.put("message", "파라미터 'nickname' 또는 'email' 가 사용 되어야 합니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // TODO: 실제 데이터베이스에서 중복 확인
        // 여기서는 예시로 더미 데이터 사용
        boolean isExist = false;
        
        if (nickname != null) {
            // 닉네임 중복 확인 로직
            // 예시: "길동이"라는 닉네임이 이미 존재한다고 가정
            if ("길동이".equals(nickname)) {
                isExist = true;
            }
        } else if (email != null) {
            // 이메일 중복 확인 로직
            // 예시: "test@test.com"이라는 이메일이 이미 존재한다고 가정
            if ("test@test.com".equals(email)) {
                isExist = true;
            }
        }
        
        // 응답 생성
        response.put("isExist", isExist);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 회원 정보 조회
     * GET /api/travly/member/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMemberInfo(@PathVariable Long id) {
        Map<String, Object> member = new HashMap<>();
        member.put("id", id);
        member.put("nickname", "테스트유저");
        member.put("email", "test@test.com");
        
        return ResponseEntity.ok(member);
    }
}
```

### 4-2. 실제 데이터베이스 연동 (선택사항)

데이터베이스를 사용하려면:

1. **Entity 클래스 생성**
```java
package com.travly.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nickname;
    private String email;
    private LocalDateTime createdAt;
    
    // getter, setter 생략
}
```

2. **Repository 인터페이스 생성**
```java
package com.travly.api.repository;

import com.travly.api.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByEmail(String email);
}
```

3. **Controller에서 Repository 사용**
```java
@Autowired
private MemberRepository memberRepository;

@GetMapping("/check")
public ResponseEntity<Map<String, Object>> checkNicknameOrEmail(
        @RequestParam(required = false) String nickname,
        @RequestParam(required = false) String email) {
    
    Map<String, Object> response = new HashMap<>();
    
    if (nickname == null && email == null) {
        response.put("status", 400);
        response.put("message", "파라미터 'nickname' 또는 'email' 가 사용 되어야 합니다.");
        return ResponseEntity.badRequest().body(response);
    }
    
    boolean isExist = false;
    
    if (nickname != null) {
        isExist = memberRepository.findByNickname(nickname).isPresent();
    } else if (email != null) {
        isExist = memberRepository.findByEmail(email).isPresent();
    }
    
    response.put("isExist", isExist);
    return ResponseEntity.ok(response);
}
```

---

## 5. CORS 설정

React 앱에서 Spring API를 호출하려면 CORS(Cross-Origin Resource Sharing) 설정이 필요합니다.

### 방법 1: 컨트롤러에 직접 설정 (간단)
```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class MemberController {
    // ...
}
```

### 방법 2: 전역 설정 (권장)

`src/main/java/com/travly/api/config/WebConfig.java` 파일 생성:

```java
package com.travly.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173") // React 개발 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 6. Spring Boot 실행

### 방법 1: IntelliJ IDEA에서 실행
1. `TravlyApiApplication.java` 파일 열기
2. 메인 메서드 왼쪽의 ▶ 버튼 클릭
3. 또는 `Shift + F10` 단축키

### 방법 2: 터미널에서 실행
```bash
# Maven 사용 시
./mvnw spring-boot:run

# 또는
mvn spring-boot:run

# Gradle 사용 시
./gradlew bootRun
```

### 실행 확인
콘솔에 다음과 같은 메시지가 보이면 성공:
```
Started TravlyApiApplication in 2.345 seconds
```

기본적으로 **포트 8080**에서 실행됩니다.

---

## 7. 테스트 방법

### 7-1. 브라우저에서 테스트

1. **닉네임 중복 확인**
   ```
   http://localhost:8080/api/travly/member/check?nickname=길동이
   ```
   응답:
   ```json
   {
     "isExist": true
   }
   ```

2. **이메일 중복 확인**
   ```
   http://localhost:8080/api/travly/member/check?email=test@test.com
   ```
   응답:
   ```json
   {
     "isExist": true
   }
   ```

3. **파라미터 없이 호출 (에러 테스트)**
   ```
   http://localhost:8080/api/travly/member/check
   ```
   응답:
   ```json
   {
     "status": 400,
     "message": "파라미터 'nickname' 또는 'email' 가 사용 되어야 합니다."
   }
   ```

### 7-2. Postman으로 테스트

1. Postman 다운로드: https://www.postman.com/downloads/
2. 새 요청 생성
3. GET 메서드 선택
4. URL 입력: `http://localhost:8080/api/travly/member/check?nickname=길동이`
5. Send 버튼 클릭

### 7-3. React 앱에서 테스트

React 앱이 실행 중이면, 브라우저 콘솔에서 다음을 확인할 수 있습니다:

```javascript
// 브라우저 콘솔에서 직접 테스트
fetch('http://localhost:8080/api/travly/member/check?nickname=길동이')
  .then(res => res.json())
  .then(data => console.log(data));
```

또는 React 컴포넌트에서:
```javascript
import { checkNickname } from '../../util/memberService';

// 사용 예시
const result = await checkNickname('길동이');
console.log(result); // { success: true, isExist: true, available: false }
```

---

## 8. 포트 변경 (선택사항)

기본 포트 8080이 아닌 다른 포트를 사용하려면:

`src/main/resources/application.properties` 파일에 추가:
```properties
server.port=8081
```

또는 `application.yml` 파일 사용 시:
```yaml
server:
  port: 8081
```

그리고 React 앱의 `.env` 파일도 수정:
```env
VITE_API_BASE_URL=http://localhost:8081/api/travly
```

---

## 9. 자주 발생하는 문제 해결

### 문제 1: 포트 8080이 이미 사용 중
**해결**: `application.properties`에서 포트 변경 (위 참고)

### 문제 2: CORS 에러
**해결**: 5번 CORS 설정 확인

### 문제 3: 404 Not Found
**해결**: 
- URL 경로 확인 (`/api/travly/member/check`)
- Spring Boot가 정상 실행되었는지 확인
- 컨트롤러의 `@RequestMapping` 경로 확인

### 문제 4: 데이터베이스 연결 오류
**해결**: 
- `application.properties`에 DB 설정 추가:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/travly
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

---

## 10. 다음 단계

1. ✅ Spring Boot 프로젝트 생성 완료
2. ✅ API 컨트롤러 작성 완료
3. ✅ CORS 설정 완료
4. ✅ Spring Boot 실행 완료
5. ✅ React 앱과 연동 테스트 완료

이제 React 앱에서 `checkNickname()`과 `checkEmail()` 함수를 사용할 수 있습니다!

---

## 📚 추가 학습 자료

- Spring Boot 공식 문서: https://spring.io/projects/spring-boot
- Spring Web MVC: https://docs.spring.io/spring-framework/reference/web/webmvc.html
- REST API 설계 가이드: https://restfulapi.net/

---

## 💡 팁

- **개발 중에는 항상 Spring Boot와 React 앱을 동시에 실행**해야 합니다.
- **에러가 발생하면 콘솔 로그를 먼저 확인**하세요.
- **브라우저 개발자 도구의 Network 탭**에서 실제 요청/응답을 확인할 수 있습니다.

