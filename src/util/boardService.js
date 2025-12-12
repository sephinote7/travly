// src/util/boardService.js
import apiClient from './apiClient';

/**
 * 게시글 관련 API 서비스
 */

// 주간 인기 게시글 TOP 3 조회
export const getWeeklyTopBoards = async () => {
  try {
    const response = await apiClient.get('/travly/board/top3');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('주간 인기 게시글 조회 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 목록 조회
export const getBoardList = async (params = {}) => {
  try {
    const response = await apiClient.get('/travly/board/list', { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 상세 조회
export const getBoardDetail = async (boardId) => {
  try {
    const response = await apiClient.get(`/travly/board/${boardId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 작성
export const createBoard = async (boardData) => {
  try {
    const response = await apiClient.post('/travly/board', boardData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 수정
export const updateBoard = async (boardId, boardData) => {
  try {
    const response = await apiClient.put(`/travly/board/${boardId}`, boardData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 삭제
export const deleteBoard = async (boardId) => {
  try {
    const response = await apiClient.delete(`/travly/board/${boardId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 좋아요
export const likeBoard = async (boardId) => {
  try {
    const response = await apiClient.post(`/travly/board/${boardId}/like`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('좋아요 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 게시글 북마크
export const bookmarkBoard = async (boardId) => {
  try {
    const response = await apiClient.post(`/travly/board/${boardId}/bookmark`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('북마크 실패:', error);
    return { success: false, error: error.response?.data || error.message };
  }
};


