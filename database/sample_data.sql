-- 샘플 데이터 삽입용 SQL
-- 테스트용 더미 데이터 (실제 사용자 ID로 변경 필요)

-- 프로필 샘플 데이터 (실제 auth.users의 ID로 변경 필요)
-- INSERT INTO profiles (id, nickname, bio, level, badge_type)
-- VALUES 
--   ('user-uuid-1', '여행러', '세계를 여행하는 사람입니다', 5, 'badge03'),
--   ('user-uuid-2', '탐험가', '새로운 곳을 찾아 떠납니다', 3, 'badge02');

-- 게시글 샘플 데이터
-- INSERT INTO posts (user_id, title, content, location, distance, tags)
-- VALUES 
--   ('user-uuid-1', '제주도 여행기', '제주도의 아름다운 풍경을 담았습니다', '제주 애월읍', '24km', ARRAY['#제주도', '#여행', '#바다']),
--   ('user-uuid-1', '도쿄 야경 포인트', '도쿄의 멋진 야경을 볼 수 있는 곳들', '일본 도쿄', '12km', ARRAY['#도쿄', '#야경', '#도시여행']);

-- 북마크 샘플 데이터
-- INSERT INTO bookmarks (user_id, post_id)
-- VALUES 
--   ('user-uuid-2', 'post-uuid-1');

-- 주의: 실제 사용 시 auth.users에 존재하는 user_id를 사용해야 합니다.



















