// src/pages/board/ViewComp.jsx
import '../../styles/ViewComp.css';

function ViewComp({ board }) {
  // board는 백엔드에서 가져온 데이터라고 가정
  // board.places, board.comments 등…

  return (
    <main className="board-view-page">
      {/* 1. 상단 정보 박스 */}
      <section className="bv-box bv-header">
        <div className="bv-header-top">
          <h1 className="bv-title">{board.title}</h1>
          <p className="bv-sub">
            총 여행 경로 : {board.placeCount}곳 | {board.createdAt}
          </p>
        </div>

        <div className="bv-header-bottom">
          <button className="bv-back-btn">전체 글 목록으로 돌아가기</button>

          <div className="bv-writer">
            <img
              src={board.writer.profileImageUrl}
              alt={board.writer.nickname}
              className="bv-writer-avatar"
            />
            <div className="bv-writer-info">
              <span className="bv-writer-name">{board.writer.nickname}</span>
              <span className="bv-writer-meta">
                여행의 달인 · Lv.{board.writer.level}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 지도 박스 */}
      <section className="bv-box bv-map">
        <div id="map" className="bv-map-canvas" />
      </section>

      {/* 3. 상단 썸네일 슬라이더 박스 */}
      <section className="bv-box bv-thumbs">
        {/* 여기에 썸네일 슬라이더 컴포넌트 넣기 */}
        {/* <ThumbnailCarousel images={board.allPhotos} /> */}
      </section>

      {/* 4. 코스 상세 박스 (장소 1개 예시) */}
      <section className="bv-box bv-place">
        <header className="bv-place-header">
          <div>
            <h2 className="bv-place-title">#1. {board.places[0].name}</h2>
            <p className="bv-place-addr">{board.places[0].addr}</p>
          </div>
          <div className="bv-place-meta">
            <span>방문 순서: 1</span>
            <span>작성일: {board.createdAt}</span>
          </div>
        </header>

        <div className="bv-place-body">
          {/* 왼쪽 사진들 */}
          <div className="bv-place-photos">
            {/* 이미지 슬라이더 or 3장 정도 */}
          </div>

          {/* 오른쪽 설명 */}
          <div className="bv-place-text">
            <h3>여행지 설명</h3>
            <p>{board.places[0].content}</p>
          </div>
        </div>
      </section>

      {/* 5. 댓글 박스 */}
      <section className="bv-box bv-comments">
        <h3 className="bv-comments-title">댓글 ({board.commentCount})개</h3>

        {/* 댓글 입력창 */}
        <div className="bv-comment-form">
          <textarea placeholder="댓글을 입력해 주세요" />
          <button>등록</button>
        </div>

        {/* 댓글 리스트 */}
        <ul className="bv-comment-list">
          {board.comments.map((c) => (
            <li key={c.id} className="bv-comment-item">
              <div className="bv-comment-header">
                <span className="bv-comment-writer">{c.writerName}</span>
                <span className="bv-comment-date">{c.createdAt}</span>
              </div>
              <p className="bv-comment-text">{c.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default ViewComp;
