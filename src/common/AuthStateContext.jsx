// AuthStateContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../util/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
  });

  const [isUserCompOpen, setIsUserCompOpen] = useState(false);

  // ⭐ Supabase 로그인 정보 체크
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata.nickname,
          email: session.user.email,
        });
      }
    };

    checkSession();
  }, []);

  const toggleUserComp = () => setIsUserCompOpen((prev) => !prev);
  const closeUserComp = () => setIsUserCompOpen(false);

  // ⭐ 실제 회원가입 함수
  const signup = async ({ email, password, nickname }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        user_metadata: { nickname: nickname.trim() },
        emailRedirectTo: 'http://localhost:5174',
      },
    });

    if (error) return { success: false, error };
    return { success: true, data };
  };

  // ⭐ 실제 로그인 함수
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error };

    setUserData({
      isLoggedIn: true,
      name: data.user.user_metadata.nickname,
      email: data.user.email,
    });

    closeUserComp();
    return { success: true };
  };

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
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
