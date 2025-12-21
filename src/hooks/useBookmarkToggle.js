// src/hooks/useBookmarkToggle.js
import { useCallback, useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "../common/AuthStateContext";

/**
 * @param {number|string} boardId
 * @param {boolean} initialIsBookmarked  - 서버에서 받아온 초기 북마크 상태
 * @param {function} refetchBoardData    - 토글 성공 후 board 상세를 다시 불러오고 싶을 때
 */
export function useBookmarkToggle(
  boardId,
  initialIsBookmarked,
  refetchBoardData
) {
  const { userData } = useAuth();
  const isAuthenticated = userData?.isLoggedIn;

  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(initialIsBookmarked)
  );
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 초기값이 갱신되면 로컬도 동기화
  useEffect(() => {
    setIsBookmarked(Boolean(initialIsBookmarked));
  }, [initialIsBookmarked]);

  // ✅ [추가] F5/재진입 대비: 서버에서 "현재 북마크 상태" 조회해서 초기값을 진짜로 맞춤
  // GET /board/{id}/bookmark  (너가 말한 상태조회)
  useEffect(() => {
    if (!boardId) return;
    if (!isAuthenticated) return;

    let alive = true;

    (async () => {
      try {
        const res = await apiClient.get(`/board/${boardId}/bookmark`);

        // 서버가 true/false 또는 {isBookmarked:true} 둘 다 대응
        const next =
          typeof res.data === "boolean"
            ? res.data
            : Boolean(
                res.data?.isBookmarked ??
                  res.data?.bookmarked ??
                  res.data?.saved ??
                  false
              );

        if (alive) setIsBookmarked(next);
      } catch (err) {
        // 상태 조회 실패는 치명적이지 않게 경고만
        console.warn("북마크 상태 조회 실패:", err?.response?.data ?? err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [boardId, isAuthenticated]);

  const toggleBookmark = useCallback(async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    if (!boardId) return;

    setIsLoading(true);
    try {
      let res;

      if (isBookmarked) {
        // ✅ 해제: DELETE /bookmark?boardId=9  (너가 말한 실제 API)
        res = await apiClient.delete("/bookmark", { params: { boardId } });
        setIsBookmarked(false);
      } else {
        // ✅ 등록: POST /board/{id}/bookmark
        res = await apiClient.post(`/board/${boardId}/bookmark`, null);

        // 서버가 boolean/object로 줄 수도 있으니 최대한 대응
        const next =
          typeof res?.data === "boolean"
            ? res.data
            : Boolean(
                res?.data?.isBookmarked ??
                  res?.data?.bookmarked ??
                  res?.data?.saved ??
                  true
              );

        setIsBookmarked(next);
      }

      if (typeof refetchBoardData === "function") {
        setTimeout(() => refetchBoardData(), 0);
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const msg = data?.message || data?.error || "";

      console.error("북마크 처리 중 오류:", err, data);

      // ✅ 서버가 "이미 존재"를 400으로 주는 구조라면: 등록 상태(true)가 맞음
      if (
        !isBookmarked &&
        status === 400 &&
        typeof msg === "string" &&
        msg.includes("이미 존재")
      ) {
        setIsBookmarked(true);
        if (typeof refetchBoardData === "function") {
          setTimeout(() => refetchBoardData(), 0);
        }
        return;
      }

      if (status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert(data?.message ?? "북마크 처리에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, boardId, isBookmarked, refetchBoardData]);

  return {
    isBookmarked,
    setIsBookmarked, // 필요하면 유지
    toggleBookmark,
    isLoading,
    isAuthenticated,
  };
}
