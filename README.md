# TRAVLY 🧳

**검색 키워드 로그 기반 맞춤형 여행지 추천** 커뮤니티

> 사용자가 자주 검색하는 키워드를 분석해 개인화된 여행지를 추천합니다.

[![Frontend](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Backend](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com)

---

## 1. 프로젝트 개요

- **프로젝트명**: TRAVLY
- **기간**: 2025.11 ~ 2025.12 (웹 개발 부트캠프 그룹 프로젝트)
- **인원**: Frontend 3명 / Backend 1명

### 주요 기능

- Kakao 소셜 로그인 + 프로필 관리(사진, 닉네임, 소개글)
- 여행지 검색 + 키워드 로그 자동 수집
- 여행 후기 게시판(CRUD + 댓글 + 북마크)
- 회원 등급 시스템(활동량 기반 브론즈/실버/골드)

---

## 2. 기술 스택

### Frontend

React 18 + Vite + TypeScript
Tailwind CSS + React Router
Axios + Zustand(상태관리)
React Query(API)

### Backend

Spring Boot 3.2 + JPA(Hibernate)
Spring Security + JWT
MySQL 8.0
Validation + Lombok
Swagger UI

### Infra

Git/GitHub (협업)
Vercel (FE 배포)
Render (BE 배포)
Supabase (초기 Auth 테스트)

---

## 3. 시스템 아키텍처

[Client: React] ← Axios → [Server: Spring Boot] ← JPA → [MySQL]
↓ 인증
[JWT Token]

**핵심 테이블**
member (id, email, nickname, profile_img, grade)
search_log (id, member_id, keyword, searched_at)
place (id, name, address, tags)
post (id, member_id, title, content, place_id)

---

## 4. 실행 방법

### Frontend

cd travly-frontend
npm install
npm run dev

http://localhost:5173

### Backend

cd travly-backend
./gradlew bootRun

http://localhost:8080
Swagger: http://localhost:8080/swagger-ui.html

**.env 예시 (백엔드)**
spring:
datasource:
url: jdbc:mysql://localhost:3306/travly
username: root
password: 1234
jwt:
secret: your-256bit-secret-key-here

---

## 5. API 명세

| Method | Endpoint           | 설명                    |
| ------ | ------------------ | ----------------------- |
| `POST` | `/api/auth/kakao`  | Kakao 로그인            |
| `POST` | `/api/auth/signup` | 회원가입                |
| `GET`  | `/api/places`      | 여행지 검색 `{keyword}` |
| `POST` | `/api/search-logs` | 검색 로그 저장          |
| `GET`  | `/api/posts`       | 게시글 목록             |
| `POST` | `/api/posts`       | 게시글 작성             |

**예시 응답**
{
"success": true,
"data": {
"places": [
{
"id": 1,
"name": "제주도 성산일출봉",
"tags": ["자연", "제주", "등산"]
}
]
}
}

---

## 6. 폴더 구조

travly-frontend/
├── src/
│ ├── pages/ (Home, Search, MemberInfo, PostList)
│ ├── components/ (Card, Header, LoginModal)
│ ├── hooks/ (useAuth, usePlaces)
│ └── api/ (auth.js, places.js)

travly-backend/
├── src/main/java/com/study/travly/
│ ├── controller/ (MemberController, PlaceController)
│ ├── service/ (MemberService, SearchLogService)
│ ├── repository/ (MemberRepository, JpaRepository)
│ └── entity/ (Member, Place, SearchLog)

---

## 7. 개발 히스토리

### ✅ 완료

- [x] Kakao OAuth 로그인 구현
- [x] 회원 프로필 CRUD
- [x] 여행지 검색 + 로그 수집
- [x] 게시판 기본 CRUD

### 🔄 진행중

- [ ] 추천 알고리즘 (키워드 빈도 기반)
- [ ] 모바일 반응형 최적화

### 📋 예정

- [ ] 단위테스트 (80% 커버리지)
- [ ] Redis 캐싱 도입
- [ ] 이미지 업로드 (S3)

---

## 9. 팀 규칙

브랜치: feat/기능명, fix/버그명
커밋: feat: 로그인 UI 개선
PR: 1명 이상 리뷰 → 머지

---

## 📞 문의

- 팀 리포지토리: [GitHub](https://github.com/your-team/travly)
- 이슈 트래커: [Issues](https://github.com/your-team/travly/issues)

---

**Made with ❤️ by TRAVLY Team**
