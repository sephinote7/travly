import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../util/supabaseClient.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// ⭐ 헬퍼 함수: Supabase User 객체에서 필요한 데이터를 깔끔하게 추출
const extractUserData = (user) => {
  // 1. user_metadata, raw_user_meta_data, app_metadata 등 다양한 위치에서 memberId 값을 찾습니다.
  const memberIdValue =
    user.user_metadata?.memberId ||
    user.raw_user_meta_data?.memberId ||
    user.app_metadata?.memberId || // app_metadata도 체크합니다.
    null; // 2. 찾은 값이 있으면 parseInt를 사용하여 숫자로 변환합니다.

  const memberId = memberIdValue ? parseInt(memberIdValue, 10) : null;

  return {
    isLoggedIn: true,
    name: user.user_metadata?.nickname ?? user.user_metadata?.full_name ?? null,
    email: user.email, // ⭐ [수정 1] Supabase UUID (user.id)를 authUuid 필드에 추가합니다.
    authUuid: user.id,
    memberId: memberId,
  };
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
    memberId: null,
    authUuid: null, // ✅ 초기 상태에 authUuid 포함
  });

  const [isUserCompOpen, setIsUserCompOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // ⭐ Supabase 로그인 세션 체크

  useEffect(() => {
    let initialSessionChecked = false;

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
        // ⭐ 수정: extractUserData 헬퍼 함수를 사용하여 authUuid까지 데이터 설정
        setUserData(extractUserData(session.user));

        if (isOAuthRedirect) {
          setIsUserCompOpen(true);
          setIsLoginModalOpen(false);

          setTimeout(() => {
            const cleanUrl = window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
          }, 100);
        }
      }
      initialSessionChecked = true;
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!initialSessionChecked) {
          return;
        }

        if (session) {
          const isOAuthRedirect = checkOAuthRedirect(); // ⭐ 수정: extractUserData 헬퍼 함수를 사용하여 authUuid까지 데이터 설정

          setUserData(extractUserData(session.user));

          if (isOAuthRedirect || event === 'SIGNED_IN') {
            setIsUserCompOpen(true);
            setIsLoginModalOpen(false);

            if (isOAuthRedirect) {
              setTimeout(() => {
                const cleanUrl = window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
              }, 100);
            }
          }
        } else {
          // ⭐ [수정 2] 로그아웃 시 authUuid 포함하여 모든 필드 초기화
          setUserData({
            isLoggedIn: false,
            name: null,
            email: null,
            memberId: null,
            authUuid: null, // ⬅️ 필드 추가
          });
          setIsUserCompOpen(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const toggleUserComp = () => setIsUserCompOpen((prev) => !prev);
  const closeUserComp = () => setIsUserCompOpen(false); // 로그인 모달 제어

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false); // 회원가입

  const signup = async ({ email, password, nickname }) => {
    // ... (회원가입 로직 유지)
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
  }; // ⭐ 로그인 로직 수정 (memberId 추출)

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error }; // ⭐ 수정: 로그인 성공 후, extractUserData 헬퍼 함수를 사용하여 authUuid까지 데이터 설정

    if (data.user) {
      setUserData(extractUserData(data.user));
    }

    closeUserComp();
    return { success: true };
  }; // 로그아웃

  const logout = async () => {
    await supabase.auth.signOut(); // ⭐ [수정 2] 로그아웃 시 authUuid 포함하여 모든 필드 초기화
    setUserData({
      isLoggedIn: false,
      name: null,
      email: null,
      memberId: null,
      authUuid: null, // ⬅️ 필드 추가
    });
    setIsUserCompOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userData, // ⭐ userData에 authUuid 포함됨
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
      {children}{' '}
    </AuthContext.Provider>
  );
};
