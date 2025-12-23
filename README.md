![로고(글자)](https://github.com/sephinote7/travly/blob/main/src/common/images/TravlyLogo01.png)

> # Project Travly

---

> ### 일정 및 팀원 소개

- 제작 기간 : 25.11.10 ~ 25.12.22
- 팀 원 : 김태길(조장) / 김학철(백엔드) / 강성진(사용자 정보) / 김명환(게시글)

### [프로젝트 노션 링크](https://www.notion.so/Project-01-Travly-2d258a06e20c805eabc0ecbc77103efb)

---

> ## Travly란?
>
> ### - Travly는 기존 SNS와 블로그의 한계를 극복하고 사용자가 자신의 여행 경험을 경로 중심으로 효율적으로 기록하며 공유할 수 있도록 설계된 지도 기반 여행 기록 및 커뮤니티 플랫폼입니다.

---

> ### _Persona_
>
> ![페르소나](https://github.com/sephinote7/travly/blob/main/src/common/images/Persona.jpg)

# 팀원 역할

> ### 김태길

- FrontEnd 라우터 구성
- 디자인 전반 제작
- Index Page 작성

> ### 김학철

- BackEnd 전반 작성
- RestFul API 이용 각종 API 작성
- travlyserver git 관리 및 운용

> ### 강성진

- Header/Footer 등 공용 레이아웃 제작
- Login/SignUp 기능 구현
- UserProfile 및 UserData 가져오기 및 수정 기능 구현

> ### 김명환

- 외부 API(카카오 맵/ 한국관광공사)를 가져와 지도에 매핑 기능 구현
- 전반적인 게시글/게시판(CRUD)작업
- 검색(Tag) 기능 구현

---

# 기술 스택

<div>
<img src="https://img.shields.io/badge/GitHub-black?logo=github"/>
<img src="https://img.shields.io/badge/Discord-black?logo=discord"/>
<img src="https://img.shields.io/badge/VSCode-blue?logo=vscode"/>
<img src="https://img.shields.io/badge/supabase-white?logo=supabase"/>
<img src="https://img.shields.io/badge/DBeaber-blue?logo=dbeaber"/>
<img src="https://img.shields.io/badge/AWS_EC2-blue?logo=ec2"/>
<img src="https://img.shields.io/badge/AWS_S3-blue?logo=s3"/>
<img src="https://img.shields.io/badge/Spring_tools-white?logo=spring"/>
<img src="https://img.shields.io/badge/TailwindCss-black?logo=tailwind"/>
<img src="https://img.shields.io/badge/React-blue?logo=react"/>
<img src="https://img.shields.io/badge/Context_API-green?logo=contextapi"/>
<img src="https://img.shields.io/badge/Swiper-black?logo=swiper"/>
 <img src="https://img.shields.io/badge/Axios-black?logo=axios"/>
 <img src="https://img.shields.io/badge/PostgreSQL-black?logo=postgresql"/>
 <img src="https://img.shields.io/badge/JPA-blue?logo=jpa"/>
 <img src="https://img.shields.io/badge/JWT-skyblue?logo=jwt"/>
 <img src="https://img.shields.io/badge/Lombok-gray?logo=lombok"/>
 <img src="https://img.shields.io/badge/Jakarta-black?logo=jakarta"/>
</div>

---

# 주요 기능

> ### _INDEX PAGE_

- 주간 인기 게시물 3종 노출 (Swiper 기능 사용)
- 최근 게시물 9종 게시
- Travly에 대한 소개 및 QNA 로 이동 기능

> ### _HEADER_

- 로그인 / 회원가입 창을 들어갈 수 있는 모달 창 제공
- 로그인 처리 되었을 시 사이드 프로필로 사용자의 간단한 정보 및 상세 페이지 이동
- 작성 페이지 / 검색 + 전체 게시글 페이지로 이동 할 수 있도록 설계
- 로그인 시 자신의 게시물에 댓글이 달렸을 경우 알림 처리 창 제공

> ### _BOARD_

- 기본적인 CRUD 사이클 제공

- WRITE

  - 외부 API(카카오맵/한국관광공사)를 사용해서 다양한 검색 결과 제공 및 맵에 마커 표시
  - 멀티미디어(사진/최대 5개 복수첨부 가능) 첨부 기능
  - 각 장소에 대한 순서 변경 및 그에 따른 썸네일 변화

- List

  - 전체 게시글 인기순/최신순으로 정렬 기능
  - 원하는 게시물 탐색 기능(검색어/태그)

- View

  - 원하는 특정 게시물 상세 보기 제공
  - 좋아요 / 북마크 / 댓글 기능
  - 각 장소 썸네일을 눌러 다른 항목들 확인 가능 / 지도에 표기

- Modify / Delete
  - 자신의 게시글에서 수정 / 삭제 기능 제공
  - 수정 시 카테고리 선택부터 시작 나머지는 작성 기능과 동일

> ### _USER_

- 회원 정보 수정 기능 제공(사진 / 소개말 / 닉네임)
- 자신이 북마크한 글 / 자신이 작성한 글 리스트 제공

![Travly](https://github.com/hakchulk/travlyserver/blob/dev/src/main/resources/travly.png?raw=true)

## - 여행 기록과 공유, 그리고 사용자 성장 경험을 결합한 지도 기반 커뮤니티 플랫폼 API

**Travly Server**는 사용자들이 자신만의 특별한 여행 경로를 기록하고 공유할 수 있도록 돕는 RESTful API 서버입니다. Spring Boot와 JPA를 기반으로 효율적인 데이터 처리를 구현.

---

## 🛠 Tech Stack

### Backend

<img src="https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/Spring%20Boot%203.5.8-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white"> <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white"> <img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white">

### Database & Auth

<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"> <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white">

### Libraries & Tools

<img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white"> <img src="https://img.shields.io/badge/Swagger(Springdoc)-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"> <img src="https://img.shields.io/badge/Lombok-BC2139?style=for-the-badge"> <img src="https://img.shields.io/badge/Thumbnailator-FF6F00?style=for-the-badge&logo=image-charts&logoColor=white">
<img src="https://img.shields.io/badge/DBeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">

### Design & Management

<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"> <img src="https://img.shields.io/badge/Canva-00C4CC?style=for-the-badge&logo=canva&logoColor=white">

---

## 🏗 Project Architecture

본 프로젝트는 **도메인형 구조(Domain-driven packaging)**로 설계되어 각 기능별로 응집도가 높습니다.

- **`board`**: 여행 게시글 관련 핵심 비즈니스 로직 (북마크, 댓글, 좋아요 기능 포함)
- **`auth` / `member`**: **HS256 대칭키** 방식의 JWT 인증 및 회원 관리 시스템
- **`file` / `fileupload`**: 여행지 인증 및 이미지 업로드 관리
- **`repository`**: Spring Data JPA를 이용한 선언적 데이터 처리 및 메서드 쿼리 활용
- **`config`**: Security 필터 체인 및 DB 연결 설정 관리

---

## ✨ Key Features

- [x] **HS256 JWT 인증**: Supabase의 JWT Secret을 활용한 대칭키 기반 사용자 인증
- [x] **JPA 기반 데이터 관리**: 인터페이스 메서드를 활용한 깔끔한 데이터 조회 및 영속성 관리
- [x] **다중 파일 업로드**: 여행 코스별 사진을 안정적으로 업로드 및 처리
- [x] **게시판 인터랙션**: 좋아요, 북마크, 댓글 등 사용자의 실시간 활동 기록
- [x] **커스텀 예외 처리**: 서비스 계층의 에러를 통합 관리하는 Exception Handler 구축

---

## 🔒 Security & Auth (HS256)

본 프로젝트는 **HS256(HMAC with SHA-256)** 알고리즘을 사용하여 보안을 강화했습니다.

- **Symmetric Key**: 하나의 Secret Key를 공유하여 발행(Sign)과 검증(Verify)을 수행합니다.
- **Supabase Integration**: Supabase API 설정의 JWT Secret을 서버 환경 변수로 관리하여 보안성을 확보했습니다.

---

## 🚀 Installation & Setup

1. **Repository Clone**
   ```bash
   git clone [https://github.com/hakchulk/travlyserver.git](https://github.com/hakchulk/travlyserver.git)
   ```
