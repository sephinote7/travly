
// src/common/AuthStateContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../util/supabaseClient.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
  });

  const [isUserCompOpen, setIsUserCompOpen] = useState(false);

  // 헤더에서 띄우는 로그인 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // ⭐ Supabase 로그인 세션 체크
  useEffect(() => {
    let initialSessionChecked = false;

    // OAuth 리디렉션 감지 (URL 해시 및 쿼리 파라미터 확인)
    const checkOAuthRedirect = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      return (
        hash.includes('access_token') ||
        hash.includes('code=') ||
        hash.includes('type=recovery') ||
        search.includes('code=')
      );
    };

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('getSession error:', error);
        initialSessionChecked = true;
        return;
      }

      const session = data.session;
      const isOAuthRedirect = checkOAuthRedirect();

      if (session) {
        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? session.user.user_metadata?.full_name ?? null,
          email: session.user.email,
        });

        // OAuth 리디렉션인 경우 프로필 모달 자동 오픈 및 로그인 모달 닫기
        if (isOAuthRedirect) {
          setIsUserCompOpen(true);
          setIsLoginModalOpen(false);

          // URL 정리 (해시 및 쿼리 파라미터 제거)
          setTimeout(() => {
            const cleanUrl = window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
          }, 100);
        }
      }
      initialSessionChecked = true;
    };

    // 세션 체크 먼저 실행
    checkSession();

    // 세션 변경(OAuth 리디렉션 포함) 실시간 반영
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // 초기 세션 체크가 완료될 때까지 기다림
      if (!initialSessionChecked) {
        return;
      }

      if (session) {
        const isOAuthRedirect = checkOAuthRedirect();

        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? session.user.user_metadata?.full_name ?? null,
          email: session.user.email,
        });

        // OAuth 리디렉션이거나 새로 로그인된 경우 프로필 모달 자동 오픈
        if (isOAuthRedirect || event === 'SIGNED_IN') {
          setIsUserCompOpen(true);
          setIsLoginModalOpen(false); // 로그인 모달 닫기

          // URL 정리 (해시 및 쿼리 파라미터 제거)
          if (isOAuthRedirect) {
            setTimeout(() => {
              const cleanUrl = window.location.pathname;
              window.history.replaceState(null, '', cleanUrl);
            }, 100);
          }
        }
      } else {
        setUserData({ isLoggedIn: false, name: null, email: null });
        setIsUserCompOpen(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const toggleUserComp = () => setIsUserCompOpen((prev) => !prev);
  const closeUserComp = () => setIsUserCompOpen(false);

  // 로그인 모달 제어
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // ⭐ 회원가입
  const signup = async ({ email, password, nickname }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        user_metadata: { nickname: nickname.trim() },
        emailRedirectTo: 'http://localhost:5173',
      },
    });

    if (error) return { success: false, error };
    return { success: true, data };
  };

  // ⭐ 로그인
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error };

    setUserData({
      isLoggedIn: true,
      name: data.user.user_metadata?.nickname ?? null,
      email: data.user.email,
    });

    closeUserComp();
    return { success: true };
  };

  // ⭐ 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    setUserData({ isLoggedIn: false, name: null, email: null });
    setIsUserCompOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isUserCompOpen,
        toggleUserComp,
        closeUserComp,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
