// src/components/TravelCategoryModal.jsx
import { useState, useEffect } from "react";
import "../../../styles/TravelCategoryModal.css";
import apiClient from "../../../services/apiClient";
import { useNavigate } from "react-router-dom";

function TravelCategoryModal({ onNext, onClose, initialMeta }) {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [withWhoIds, setWithWhoIds] = useState([]);
  const [durationId, setDurationId] = useState(null);
  const [styleIds, setStyleIds] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!initialMeta) return;

    setWithWhoIds(initialMeta.withWhoIds || []);
    setDurationId(initialMeta.durationId ?? null);
    setStyleIds(initialMeta.styleIds || []);
  }, [initialMeta]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/filter");
        setFilters(res.data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("여행 카테고리 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const withWhoFilter = Array.isArray(filters)
    ? filters.find((f) => f.id === 1 || f.code === "WITH_WHO") ?? null
    : null;

  const durationFilter = Array.isArray(filters)
    ? filters.find((f) => f.id === 2 || f.code === "DURATION") ?? null
    : null;

  const styleFilter = Array.isArray(filters)
    ? filters.find((f) => f.id === 3 || f.code === "STYLE") ?? null
    : null;

  const withWhoOptions = withWhoFilter?.items ?? [];
  const durationOptions = durationFilter?.items ?? [];
  const styleOptions = styleFilter?.items ?? [];

  const withWhoMax = withWhoFilter?.multiSelectCount ?? 3;
  const styleMax = styleFilter?.multiSelectCount ?? 5;

  const toggleWithWho = (itemId) => {
    setWithWhoIds((prev) => {
      if (prev.includes(itemId)) return prev.filter((id) => id !== itemId);
      if (prev.length >= withWhoMax) return prev;
      return [...prev, itemId];
    });
  };

  const selectDuration = (itemId) => setDurationId(itemId);

  const toggleStyle = (itemId) => {
    setStyleIds((prev) => {
      if (prev.includes(itemId)) return prev.filter((id) => id !== itemId);
      if (prev.length >= styleMax) return prev;
      return [...prev, itemId];
    });
  };

  const handleNext = () => {
    if (withWhoIds.length < 1) {
      alert("“누구와 떠나나요?”를 1개 이상 선택해 주세요.");
      return;
    }
    if (!durationId) {
      alert("“여행 기간”을 1개 선택해 주세요.");
      return;
    }
    if (styleIds.length < 1) {
      alert("“여행 스타일”을 1개 이상 선택해 주세요.");
      return;
    }

    const filterItemIds = [...withWhoIds, durationId, ...styleIds];
    const meta = { withWhoIds, durationId, styleIds, filterItemIds };

    onNext && onNext(meta);
    onClose && onClose();
  };

  if (loading) {
    return (
      <div className="tcm-backdrop">
        <div className="tcm-card">
          <div className="tcm-header-center">
            <div className="tcm-logo">✈️</div>
            <h1 className="tcm-title">여행 카테고리 불러오는 중...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tcm-backdrop">
        <div className="tcm-card">
          <div className="tcm-header-center">
            <div className="tcm-logo">⚠️</div>
            <h1 className="tcm-title">오류</h1>
            <p style={{ marginTop: 16 }}>{error}</p>
            <button type="button" className="tcm-next-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!withWhoFilter || !durationFilter || !styleFilter) {
    return (
      <div className="tcm-backdrop">
        <div className="tcm-card">
          <div className="tcm-header-center">
            <div className="tcm-logo">⚠️</div>
            <h1 className="tcm-title">카테고리 설정 오류</h1>
            <p style={{ marginTop: 16 }}>
              여행 카테고리 정보가 올바르지 않습니다. 관리자에게 문의해 주세요.
            </p>
            <button type="button" className="tcm-next-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tcm-backdrop">
      <header className="tcm-global-header">
        <button
          className="tcm-global-back-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          ←
        </button>

        <div className="tcm-global-title">Travly 글 작성</div>
      </header>

      <div className="tcm-card">
        <div className="tcm-header-center">
          <div className="tcm-logo">✈️</div>
          <h1 className="tcm-title">나의 여행 카테고리</h1>
        </div>

        <div className="tcm-body">
          <section className="tcm-section">
            <div className="tcm-section-title">{withWhoFilter.name} </div>
            <div className="tcm-chip-grid">
              {withWhoOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleWithWho(item.id)}
                  className={
                    withWhoIds.includes(item.id)
                      ? "tcm-chip tcm-chip--active"
                      : "tcm-chip"
                  }
                >
                  {item.name}
                </button>
              ))}
            </div>
          </section>

          <section className="tcm-section">
            <div className="tcm-section-title">{durationFilter.name} </div>
            <div className="tcm-chip-grid">
              {durationOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectDuration(item.id)}
                  className={
                    durationId === item.id
                      ? "tcm-chip tcm-chip--active"
                      : "tcm-chip"
                  }
                >
                  {item.name}
                </button>
              ))}
            </div>
          </section>

          <section className="tcm-section">
            <div className="tcm-section-title">{styleFilter.name} </div>
            <div className="tcm-chip-grid">
              {styleOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleStyle(item.id)}
                  className={
                    styleIds.includes(item.id)
                      ? "tcm-chip tcm-chip--active"
                      : "tcm-chip"
                  }
                >
                  {item.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="tcm-footer">
          <button type="button" className="tcm-next-btn" onClick={handleNext}>
            다음으로
          </button>
        </footer>
      </div>
    </div>
  );
}

export default TravelCategoryModal;
