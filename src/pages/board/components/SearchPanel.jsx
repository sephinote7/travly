// src/components/SearchPanel.jsx
import "../../../styles/SearchPanel.css";

function SearchPanel({
  regionKeyword,
  onRegionKeywordChange,
  onRegionSearch,
  category,
  onCategoryChange,
  categories,
  center,
  places,
  onPlaceClick,
  page,
  totalPages,
  onPageChange,
  selectedPlaces = [],
  totalCount,
}) {
  // ============================
  // 1. 유틸 & 계산값
  // ============================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onRegionSearch();
    }
  };

  const safePage = page && page > 0 ? page : 1;
  const safeTotalPages = totalPages && totalPages > 0 ? totalPages : 1;
  const MAX_PAGE_BTNS = 5;
  const half = Math.floor(MAX_PAGE_BTNS / 2);

  let start = Math.max(1, safePage - half);
  let end = Math.min(safeTotalPages, start + MAX_PAGE_BTNS - 1);

  // 끝 쪽에서 보정
  start = Math.max(1, end - MAX_PAGE_BTNS + 1);

  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  // 선택된 카드인지 확인 (id + source 기준)
  const isPlaceSelected = (p) =>
    selectedPlaces.some(
      (sp) => sp.id === p.id && (sp.source || "") === (p.source || "")
    );

  // ============================
  // 2. 렌더링
  // ============================

  return (
    <div className="search-panel-root">
      {/* =======================
          헤더 영역
       ======================= */}
      <header className="search-header">
        {/* 상단 타이틀 줄 */}
        <div className="search-header-top">
          <button type="button" className="header-back-btn">
            ←
          </button>

          <div className="header-title-wrap">
            <div className="header-subtitle">Travly 글 작성</div>
            <div className="header-title">Travly 검색</div>
          </div>

          <div className="header-logo">✈️</div>
        </div>

        {/* 검색창 */}
        <div className="header-search-row">
          <input
            type="text"
            value={regionKeyword}
            onChange={(e) => onRegionKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="header-search-input"
          />
          <button
            type="button"
            className="header-search-btn"
            onClick={onRegionSearch}
          >
            검색
          </button>
        </div>

        {/* 카테고리 버튼 */}
        <div className="header-category-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={
                category === cat
                  ? "header-category-btn header-category-btn--active"
                  : "header-category-btn"
              }
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* =======================
          검색 결과 영역
       ======================= */}
      <section className="search-results-section">
        {/* 결과 헤더 */}
        <div className="search-results-header">
          {center ? (
            <>
              <span className="results-title">검색 결과</span>
              <span className="results-count">
                (현재 {places.length}건 / 전체 {totalCount}건)
              </span>
            </>
          ) : (
            <span className="results-title">먼저 지역 검색을 해주세요.</span>
          )}
        </div>

        {/* 결과 리스트 */}
        <div className="search-results-list-wrapper">
          <ul className="search-results-list">
            {places.map((p) => {
              const selected = isPlaceSelected(p);

              return (
                <li
                  key={p.id}
                  className={
                    selected
                      ? "result-card result-card--selected"
                      : "result-card"
                  }
                  onClick={() => onPlaceClick && onPlaceClick(p)}
                >
                  {/* 썸네일 */}
                  <div className="result-thumb-wrap">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="result-thumb-img"
                      />
                    ) : (
                      <div className="result-thumb-placeholder">No Image</div>
                    )}
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="result-main">
                    <div className="result-category-badge">
                      {p.category || category || "장소"}
                    </div>
                    <div className="result-name">{p.name}</div>
                    <div className="result-addr">{p.addr}</div>
                  </div>

                  {/* 오른쪽 상태 아이콘 */}
                  <div className="result-right">
                    {selected ? (
                      <div className="result-selected-icon">✓</div>
                    ) : (
                      <div className="result-marker-icon">📍</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 페이지네이션 */}
        {center && safeTotalPages > 1 && (
          <div className="search-pagination">
            {/* 이전 */}
            <button
              type="button"
              className="page-btn"
              disabled={safePage === 1}
              onClick={() => onPageChange(safePage - 1)}
            >
              .
            </button>

            {/* 페이지 번호 (최대 5개) */}
            {pageNumbers.map((num) => (
              <button
                key={num}
                type="button"
                disabled={num === safePage}
                className={
                  num === safePage ? "page-btn page-btn--active" : "page-btn"
                }
                onClick={() => onPageChange(num)}
              >
                {num}
              </button>
            ))}

            {/* 다음 */}
            <button
              type="button"
              className="page-btn"
              disabled={safePage === safeTotalPages}
              onClick={() => onPageChange(safePage + 1)}
            >
              ›
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchPanel;
