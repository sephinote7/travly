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
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('getSession error:', error);
        return;
      }

      const session = data.session;
      if (session) {
        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? null,
          email: session.user.email,
        });
      }
    };

    checkSession();
    // 세션 변경(OAuth 리디렉션 포함) 실시간 반영
    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? null,
          email: session.user.email,
        });
      } else {
        setUserData({ isLoggedIn: false, name: null, email: null });
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
