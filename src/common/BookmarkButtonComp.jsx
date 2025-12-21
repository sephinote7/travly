// src/common/BookmarkButtonComp.jsx
import { useBookmarkToggle } from "../hooks/useBookmarkToggle";

export default function BookmarkButtonComp({
  boardId,
  initialIsBookmarked = false,
  refetchBoardData,
}) {
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarkToggle(
    boardId,
    initialIsBookmarked,
    refetchBoardData
  );

  return (
    <button
      type="button"
      className={`view-bookmark-btn ${
        isBookmarked ? "view-bookmark-btn--active" : ""
      }`}
      onClick={toggleBookmark}
      disabled={isLoading}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 등록"}
    >
      {isLoading ? (
        "처리 중..."
      ) : (
        <>
          <span className="bookmark-icon">{isBookmarked ? "🔖" : "📑"}</span>
          <span className="bookmark-text"> 북마크</span>
        </>
      )}
    </button>
  );
}
