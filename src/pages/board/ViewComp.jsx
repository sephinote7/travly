// src/pages/board/ViewComp.jsx
import { useState } from 'react';
import '../../styles/ViewComp.css';

const mockBoard = {
  id: 1,
  title: '알프에서 엑사까지 익산의 오묘 여행코스',
  placeCount: 6,
  createdAt: '2025. 12. 10 · 조회 1,234',
  writer: {
    profileImageUrl: 'https://via.placeholder.com/40x40.png?text=U',
    nickname: '여행하는개발자',
    level: 7,
  },
  places: [
    {
      id: 101,
      name: '연천재폭포',
      addr: '전북 익산시 어디어디 123-4',
      content: '물소리랑 숲 냄새가 압도적인 구간. 사진 많이 찍는 포인트.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
    {
      id: 102,
      name: '분홍호수전망대',
      addr: '전북 익산시 무슨동 56-7',
      content: '해 질 무렵에 가면 하늘과 호수가 뒤섞여서 최고.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
    {
      id: 103,
      name: '알프마을 산책로',
      addr: '전북 익산시 알프구 알프동',
      content: '잔잔한 산책 코스. 가족 여행에 최적화.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
    {
      id: 104,
      name: '노을전망 언덕',
      addr: '전북 익산시 노을동',
      content: '노을 보는 순간 “아 여기 맞다” 싶은 장소.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
    {
      id: 105,
      name: '숲속하늘길',
      addr: '전북 익산시 하늘구 88-1',
      content: '나무 사이 빛 들어오는 풍경이 예술.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
    {
      id: 106,
      name: '엑사강변 자전거길',
      addr: '전북 익산시 강변로 222',
      content: '여행 마무리로 자전거 타기 좋은 루트.',
      thumbnailUrl: '',
      photos: [{ url: '' }, { url: '' }, { url: '' }, { url: '' }, { url: '' }],
    },
  ],
  commentCount: 5,
  comments: [
    {
      id: 1,
      writerName: '여행초보',
      createdAt: '2025. 12. 11',
      content: '코스 너무 좋아보여요!',
    },
    {
      id: 2,
      writerName: '익산토박이',
      createdAt: '2025. 12. 11',
      content: '로컬 식당도 추천해주세요 ㅎㅎ',
    },
  ],
};

function ViewComp({ board: _board }) {
  const board = _board || mockBoard;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPlace = board.places[selectedIndex] || board.places[0];

  return (
    <div className="view-root">
      {/* 상단 헤더 */}
      <header className="view-header">
        <div className="view-header-inner">
          <div className="view-logo-wrap">
            <span className="view-logo-text">Travly</span>
          </div>

          <div className="view-header-right">
            <button className="view-icon-btn">🔍</button>
            <button className="view-icon-btn">🔔</button>
            <img
              src={board.writer.profileImageUrl}
              alt="user"
              className="view-header-avatar"
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="view-main">
        {/* 제목 / 작성자 */}
        <section className="view-box view-box-header">
          <button className="view-back-link">전체 여행기 목록보기</button>

          <h1 className="view-title">{board.title}</h1>

          <div className="view-submeta">
            {board.createdAt} · 총 여행 경로 {board.placeCount}곳
          </div>

          <div className="view-writer">
            <img
              src={board.writer.profileImageUrl}
              alt={board.writer.nickname}
              className="view-writer-avatar"
            />
            <div>
              <div className="view-writer-name">{board.writer.nickname}</div>
              <div className="view-writer-meta">
                여행의 달인 · Lv.{board.writer.level}
              </div>
            </div>
          </div>
        </section>

        {/* 지도 영역 */}
        <section className="view-box">
          <div id="map" className="view-map">
            <span className="view-map-placeholder">
              여기에 지도 들어감 (카카오맵)
            </span>
          </div>
        </section>

        {/* 상단 코스 썸네일 목록 */}
        <section className="view-box">
          <div className="view-thumb-scroll">
            {board.places.map((place, idx) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={
                  'view-thumb-item' +
                  (idx === selectedIndex ? ' view-thumb-item--active' : '')
                }
              >
                {place.thumbnailUrl ? (
                  <img
                    src={place.thumbnailUrl}
                    alt={place.name}
                    className="view-thumb-img"
                  />
                ) : (
                  <div className="view-thumb-placeholder" />
                )}

                <span className="view-thumb-label">
                  #{idx + 1} {place.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 코스 상세 설명 */}
        <section className="view-box view-course">
          <header className="view-course-header">
            <div>
              <h2 className="view-course-title">
                #{selectedIndex + 1}. {selectedPlace.name}
              </h2>
              <p className="view-course-addr">{selectedPlace.addr}</p>
            </div>
            <div className="view-course-meta">
              방문 순서 {selectedIndex + 1} · {board.createdAt}
            </div>
          </header>

          <div className="view-course-body">
            {/* 왼쪽 사진 영역 */}
            <div className="view-course-photos">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="view-course-photo-item" />
              ))}
            </div>

            {/* 오른쪽 설명 텍스트 */}
            <div className="view-course-text">
              <h3 className="view-course-text-title">여행지 설명</h3>
              <p className="view-course-text-content">
                {selectedPlace.content}
              </p>
            </div>
          </div>
        </section>

        {/* 댓글 섹션 */}
        <section className="view-box view-comments">
          <h3 className="view-comments-title">댓글 ({board.commentCount})개</h3>

          {/* 댓글 입력 */}
          <div className="view-comment-input-wrap">
            <textarea
              className="view-comment-textarea"
              placeholder="댓글을 입력해 주세요."
            />
            <div className="view-comment-submit-wrap">
              <button className="view-comment-submit-btn">등록</button>
            </div>
          </div>

          {/* 댓글 리스트 */}
          <ul className="view-comment-list">
            {board.comments.map((c) => (
              <li key={c.id} className="view-comment-item">
                <div className="view-comment-header">
                  <div className="view-comment-avatar">{c.writerName[0]}</div>
                  <div>
                    <div className="view-comment-writer">{c.writerName}</div>
                    <div className="view-comment-date">{c.createdAt}</div>
                  </div>
                </div>
                <p className="view-comment-content">{c.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default ViewComp;
