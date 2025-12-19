// src/pages/board/view/useBoardDetail.js
import { useCallback, useEffect, useState } from 'react';
import apiClient from '../../../services/apiClient';
import { mapBoardApiToViewModel } from './viewMappers';

export function useBoardDetail(id) {
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [rawBoard, setRawBoard] = useState(null);

  const fetchBoardData = useCallback(
    async ({ silent = false } = {}) => {
      if (!id) return;

      try {
        if (!silent) setLoading(true);
        const res = await apiClient.get(`/board/${id}`);
        setRawBoard(res.data);
        setBoard(mapBoardApiToViewModel(res.data));
      } catch (e) {
        console.error(e);
        setBoard(null);
        setRawBoard(null);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchBoardData();
  }, [id, fetchBoardData]);

  return { loading, board, rawBoard, fetchBoardData };
}
