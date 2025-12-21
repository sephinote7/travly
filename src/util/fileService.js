// src/util/fileService.js
import apiClient from './apiClient';
import axios from 'axios';

/**
 * 파일 업로드 서비스
 */

/**
 * 파일 업로드
 * POST /api/travly/file
 *
 * files key를 복수로 사용하여 파일을 업로드한다.
 * 하나 이상의 파일을 서버에 업로드하고, 저장된 파일 정보를 반환합니다.
 * 폼 데이터(multipart/form-data)를 사용함.
 *
 * 파일 저장 폴더: application.properties의 file.upload-dir에서 설정 (초기값: c:/travly/upload)
 *
 * @param {File|File[]} files - 업로드할 파일(들)
 * @returns {Promise<{success: boolean, data?: Array, error?: string, status?: number}>}
 *
 * API 명세:
 * - URL: http://localhost:8080/api/travly/file
 * - Method: POST
 * - Content-Type: multipart/form-data (Axios가 자동 설정)
 * - FormData key: "files" (복수형)
 *
 * 성공 응답:
 * - data: 업로드된 파일 정보 배열
 *   - id: 파일 ID (number)
 *   - filename: 저장된 파일명 (UUID + "." + 원본 파일 확장자)
 *     예: "72fcc3dd-6ca0-4645-a553-cace9c4781c2.png"
 *   - org_filename: 원본 파일명
 *     예: "zmtb.png"
 *
 * 오류 처리:
 * - status: 400
 *   - message: "key files가 존재하지 않거나 비어있습니다."
 */
export const uploadFiles = async (files) => {
  if (!files) {
    return {
      success: false,
      error: '업로드할 파일이 없습니다.',
      status: 400,
    };
  }

  // 단일 파일을 배열로 변환
  const fileArray = Array.isArray(files) ? files : [files];

  if (fileArray.length === 0) {
    return {
      success: false,
      error: '업로드할 파일이 없습니다.',
      status: 400,
    };
  }

  try {
    // FormData 생성
    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append('files', file); // key는 "files" (복수형)
      console.log('📎 파일 추가:', file.name);
    });

    console.log(
      '📤 파일 업로드 요청:',
      fileArray.map((f) => f.name)
    );

    // apiClient를 사용하여 인증 토큰 자동 추가
    // 중요: FormData를 사용할 때는 Content-Type을 설정하지 않아야 함
    // Axios가 FormData를 인식하고 자동으로 'multipart/form-data'로 설정합니다.
    // 수동으로 설정하면 경계(boundary)가 누락되어 오류가 발생할 수 있습니다.
    // apiClient의 인터셉터가 FormData를 감지하여 Content-Type을 자동으로 제거합니다.
    const response = await apiClient.post('/file', formData, {
      timeout: 30000, // 30초 타임아웃
    });

    console.log('📥 파일 업로드 응답:', response.data);

    return {
      success: true,
      data: response.data, // List<File> - [{id, filename, org_filename}, ...]
    };
  } catch (error) {
    console.error('파일 업로드 실패:', error);

    // 400 에러 처리: "key files가 존재하지 않거나 비어있습니다."
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'key files가 존재하지 않거나 비어있습니다.';
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 기타 에러 처리
    return {
      success: false,
      error: error.response?.data?.message || error.message || '파일 업로드 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};

/**
 * 파일 다운로드 URL 생성
 *
 * @param {Object|number|string} fileInfo - 파일 정보 객체 또는 파일 ID 또는 파일명
 *   - 파일 객체: {id: number, filename: string, org_filename: string}
 *   - 파일 ID: number 또는 string
 *   - 파일명: string (예: "7adc1a6b-d861-4022-b549-516365680e3b.png")
 * @param {Object} options - 옵션
 *   - thumbnail: boolean - 썸네일 URL 생성 여부 (기본값: false)
 *     - 이미지 파일(jpg, jpeg, png, gif, bmp, webp)인 경우에만 사용 가능
 *     - 썸네일 명명 규칙: "t_" + filename + ".jpg"
 * @returns {string|null} 파일 다운로드 URL
 *
 * API 명세:
 * 1. 파일 ID로 다운로드: GET /api/travly/file/id/{fileId}
 *    - 파라미터: fileId (long, 필수)
 *    - 성공: 파일의 바이너리 반환
 *    - 오류 (400): "존재하지 않는 file.id [{fileId}]"
 *
 * 2. 파일명으로 다운로드: GET /api/travly/file/{filename}
 *    - 예시: http://localhost:8080/api/travly/file/7adc1a6b-d861-4022-b549-516365680e3b.png
 *    - 성공: 파일의 바이너리 반환
 *    - 오류 (404): "file not found"
 *
 * 3. 썸네일 다운로드: GET /api/travly/file/t_{filename}.jpg
 *    - 확장자가 jpg, jpeg, png, gif, bmp, webp인 경우에만 사용 가능
 *    - 썸네일 명명 규칙: "t_" + filename + ".jpg"
 *    - 예시: http://localhost:8080/api/travly/file/t_7adc1a6b-d861-4022-b549-516365680e3b.png.jpg
 *    - 성공: 썸네일 파일의 바이너리 반환
 *    - 오류 (404): "file not found"
 */
export const getFileUrl = (fileInfo, options = {}) => {
  if (!fileInfo) return null;

  const { thumbnail = false } = options;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/travly';

  // 썸네일 URL 생성
  if (thumbnail) {
    let filename = null;

    // 파일명 추출
    if (typeof fileInfo === 'string' && fileInfo.includes('.')) {
      // 파일명 문자열인 경우
      filename = fileInfo;
    } else if (fileInfo.filename) {
      // 파일 객체인 경우
      filename = fileInfo.filename;
    } else {
      // 파일 ID만 있는 경우는 썸네일을 생성할 수 없음
      console.warn('⚠️ 썸네일을 생성하려면 파일명이 필요합니다.');
      return null;
    }

    // 이미지 파일 확장자 확인
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const fileExtension = filename.split('.').pop()?.toLowerCase();

    if (!imageExtensions.includes(fileExtension)) {
      console.warn('⚠️ 썸네일은 이미지 파일(jpg, jpeg, png, gif, bmp, webp)에만 사용 가능합니다.');
      return null;
    }

    // 썸네일 URL 생성: "t_" + filename + ".jpg"
    const thumbnailFilename = `t_${filename}.jpg`;
    return `${baseUrl}/file/${thumbnailFilename}`;
  }

  // 일반 파일 URL 생성
  // 파일 ID가 직접 전달된 경우 (number 또는 string)
  if (typeof fileInfo === 'number' || (typeof fileInfo === 'string' && !fileInfo.includes('.'))) {
    return `${baseUrl}/file/id/${fileInfo}`;
  }

  // 파일명 문자열인 경우
  if (typeof fileInfo === 'string' && fileInfo.includes('.')) {
    return `${baseUrl}/file/${fileInfo}`;
  }

  // 파일 객체인 경우
  if (fileInfo.id) {
    // 파일 ID 우선 사용
    return `${baseUrl}/file/id/${fileInfo.id}`;
  }

  // 파일명만 있는 경우
  if (fileInfo.filename) {
    return `${baseUrl}/file/${fileInfo.filename}`;
  }

  return null;
};

/**
 * 파일 다운로드 (실제 파일 데이터 가져오기)
 *
 * @param {number|string|Object} fileInfo - 파일 ID, 파일명, 또는 파일 객체
 * @param {Object} options - 옵션
 *   - thumbnail: boolean - 썸네일 다운로드 여부 (기본값: false)
 * @returns {Promise<{success: boolean, data?: Blob, error?: string, status?: number}>}
 *
 * API 명세:
 * 1. 파일 ID로 다운로드: GET /api/travly/file/id/{fileId}
 *    - 파라미터: fileId (long, 필수)
 *    - 성공: 파일의 바이너리 반환
 *    - 오류 (400): "존재하지 않는 file.id [{fileId}]"
 *
 * 2. 파일명으로 다운로드: GET /api/travly/file/{filename}
 *    - 성공: 파일의 바이너리 반환
 *    - 오류 (404): "file not found"
 *
 * 3. 썸네일 다운로드: GET /api/travly/file/t_{filename}.jpg
 *    - 확장자가 jpg, jpeg, png, gif, bmp, webp인 경우에만 사용 가능
 *    - 오류 (404): "file not found"
 */
export const downloadFile = async (fileInfo, options = {}) => {
  if (!fileInfo) {
    return { success: false, error: '파일 정보가 필요합니다.', status: 400 };
  }

  const { thumbnail = false } = options;

  try {
    // URL 생성
    const downloadUrl = getFileUrl(fileInfo, { thumbnail });

    if (!downloadUrl) {
      return { success: false, error: '파일 URL을 생성할 수 없습니다.', status: 400 };
    }

    console.log('📥 파일 다운로드 요청:', downloadUrl);

    const response = await axios.get(downloadUrl, {
      responseType: 'blob', // 바이너리 데이터로 받기
      timeout: 30000, // 30초 타임아웃
    });

    console.log('✅ 파일 다운로드 성공');

    return {
      success: true,
      data: response.data, // Blob 객체
    };
  } catch (error) {
    // 400 에러 처리: 존재하지 않는 file.id
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '존재하지 않는 file.id입니다.';
      console.error('파일 다운로드 실패 (400):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 400,
      };
    }

    // 404 에러 처리: file not found
    if (error.response?.status === 404) {
      const errorMessage = 'file not found';
      console.error('파일 다운로드 실패 (404):', errorMessage);
      return {
        success: false,
        error: errorMessage,
        status: 404,
      };
    }

    // 기타 에러 처리
    console.error('파일 다운로드 실패:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || '파일 다운로드 중 오류가 발생했습니다.',
      status: error.response?.status,
    };
  }
};





