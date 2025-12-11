# Travly 데이터베이스 설정 가이드

## DBeaver로 Supabase 연결하기

### 1. Supabase 연결 정보 가져오기

1. Supabase 대시보드 (https://app.supabase.com) 접속
2. 프로젝트 선택 → Settings → Database
3. Connection string 섹션에서 다음 정보 확인:
   - **Host**: `db.xxxxx.supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Database password (비밀번호 재설정 가능)

### 2. DBeaver에서 연결 설정

1. DBeaver 실행
2. 상단 메뉴: Database → New Database Connection
3. PostgreSQL 선택 → Next
4. 연결 정보 입력:
   - **Host**: Supabase에서 가져온 Host
   - **Port**: 5432
   - **Database**: postgres
   - **Username**: postgres
   - **Password**: Supabase Database password
5. **SSL** 탭에서:
   - **Use SSL** 체크
   - **SSL Mode**: `require` 또는 `verify-full`
6. Test Connection 클릭하여 연결 확인
7. Finish

### 3. 스키마 실행하기

1. DBeaver에서 연결된 데이터베이스 선택
2. SQL 편집기 열기 (상단 SQL 편집기 아이콘 클릭)
3. `database/schema.sql` 파일 내용 복사하여 붙여넣기
4. 실행 (Ctrl+Enter 또는 실행 버튼)

## 테이블 구조

### profiles (프로필)
- `id`: UUID (auth.users와 연결)
- `nickname`: 닉네임 (고유값)
- `bio`: 소개글
- `profile_image_url`: 프로필 이미지 URL
- `level`: 등급 (1~10)
- `badge_type`: 배지 타입 (badge01~badge05)

### posts (게시글)
- `id`: UUID
- `user_id`: 작성자 ID
- `title`: 제목
- `content`: 내용
- `thumbnail_url`: 썸네일 이미지 URL
- `location`: 위치
- `distance`: 거리
- `tags`: 태그 배열
- `view_count`: 조회수
- `like_count`: 좋아요 수

### bookmarks (북마크)
- `id`: UUID
- `user_id`: 사용자 ID
- `post_id`: 게시글 ID
- 중복 북마크 방지 (UNIQUE 제약)

### comments (댓글)
- `id`: UUID
- `post_id`: 게시글 ID
- `user_id`: 작성자 ID
- `content`: 댓글 내용

### likes (좋아요)
- `id`: UUID
- `post_id`: 게시글 ID
- `user_id`: 사용자 ID
- 중복 좋아요 방지 (UNIQUE 제약)

## 보안 정책 (RLS)

모든 테이블에 Row Level Security가 활성화되어 있습니다:
- 프로필: 모든 사용자가 읽기 가능, 자신의 프로필만 수정 가능
- 게시글: 모든 사용자가 읽기 가능, 작성자만 수정/삭제 가능
- 북마크: 자신의 북마크만 관리 가능
- 댓글: 모든 사용자가 읽기 가능, 작성자만 수정/삭제 가능
- 좋아요: 모든 사용자가 읽기 가능, 자신의 좋아요만 관리 가능

## 유용한 쿼리 예시

### 프로필 조회
```sql
SELECT * FROM profiles WHERE id = 'user-uuid-here';
```

### 사용자 게시글 조회
```sql
SELECT * FROM posts WHERE user_id = 'user-uuid-here' ORDER BY created_at DESC;
```

### 북마크한 게시글 조회
```sql
SELECT p.* FROM posts p
JOIN bookmarks b ON p.id = b.post_id
WHERE b.user_id = 'user-uuid-here'
ORDER BY b.created_at DESC;
```

### 프로필 업데이트
```sql
UPDATE profiles 
SET nickname = '새닉네임', bio = '새소개글', profile_image_url = '이미지URL'
WHERE id = 'user-uuid-here';
```



