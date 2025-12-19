// src/pages/board/components/common/Pagination.jsx
function Pagination({ page, totalPages, onPageChange, maxButtons = 5 }) {
  const tp = Math.max(1, Number(totalPages || 1));
  const cur = Math.min(Math.max(1, Number(page || 1)), tp);

  const goPrev = () => cur > 1 && onPageChange(cur - 1);
  const goNext = () => cur < tp && onPageChange(cur + 1);

  const pages = (() => {
    const half = Math.floor(maxButtons / 2);
    let start = cur - half;
    let end = cur + half;

    if (maxButtons % 2 === 0) end -= 1;

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }
    if (end > tp) {
      start -= end - tp;
      end = tp;
    }
    start = Math.max(1, start);

    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  })();

  // totalPages가 1이면 굳이 안 보여도 됨 (원하면 지워도 됨)

  return (
    <nav className="Pagination" aria-label="Pagination">
      <button onClick={goPrev} disabled={cur <= 1} aria-label="Previous page">
        ‹
      </button>

      <div className="Pagination-pages">
        {pages.map((p) => (
          <button
            key={p}
            className={p === cur ? 'active' : ''}
            onClick={() => onPageChange(p)}
            aria-current={p === cur ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button onClick={goNext} disabled={cur >= tp} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}

export default Pagination;
