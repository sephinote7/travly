// AuthStateContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from './supabaseClient'; // ⭐️ 추후 Supabase 클라이언트 불러오기

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Context를 쉽게 사용할 수 있는 Custom Hook 생성
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider 컴포넌트 구현
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
  });

  // ⭐️ 4. 유저 컴포넌트(프로필/로그인) 표시 상태 관리 통합
  // 이 상태가 SideProfileComp 또는 LoginComp의 표시를 결정합니다.
  const [isUserCompOpen, setIsUserCompOpen] = useState(false);

  useEffect(() => {
    // ⭐️ Supabase 연결 전까지 Mock 로그인 상태 유지 (테스트용)
    const mockLogin = () => {
      setUserData({
        isLoggedIn: true,
        name: '호놀룰루',
        email: 'test@test.com',
      });
    };
    mockLogin();
  }, []);

  // 유저 컴포넌트 토글 함수
  const toggleUserComp = () => {
    setIsUserCompOpen((prev) => !prev);
  };

  // 유저 컴포넌트 닫기 함수
  const closeUserComp = () => {
    setIsUserCompOpen(false);
  };

  // 임시 로그아웃 함수
  const mockLogout = () => {
    // ⭐️ [Supabase 연동 시]: supabase.auth.signOut() 호출
    setUserData({ isLoggedIn: false, name: null, email: null });
    closeUserComp();
  };

  // 임시 로그인 성공 처리 함수
  const mockLoginSuccess = () => {
    // ⭐️ [Supabase 연동 시]: 로그인 API 호출 후 유저 정보 설정
    setUserData({
      isLoggedIn: true,
      name: '새 사용자',
      email: 'new@user.com',
    });
    closeUserComp(); // 로그인 성공 시 창 닫기
  };

  // Context가 제공할 값
  const value = {
    userData,
    isUserCompOpen, // ⭐️ 표시 상태 제공
    toggleUserComp, // ⭐️ 토글 함수 제공
    closeUserComp, // ⭐️ 닫기 함수 제공 (모달의 onClose 등에 사용)
    mockLogout,
    mockLoginSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
