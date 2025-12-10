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

  // OAuth 리디렉션 처리 중 플래그 (중복 처리 방지)
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  // ⭐ Supabase 로그인 세션 체크
  useEffect(() => {
    let initialSessionChecked = false;
    let oauthTimeoutId = null;

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

    const isOAuthRedirect = checkOAuthRedirect();

    // OAuth 리디렉션이 감지되면 처리 중 플래그 설정
    if (isOAuthRedirect) {
      setIsProcessingOAuth(true);
      setIsLoginModalOpen(false); // 즉시 로그인 모달 닫기

      // 타임아웃을 두어 일정 시간 후 플래그 해제 (세션이 설정되지 않은 경우 대비)
      oauthTimeoutId = setTimeout(() => {
        console.warn('OAuth session not found after timeout, resetting flag');
        setIsProcessingOAuth(false);
      }, 5000); // 5초 후 플래그 해제
    }

    const checkSession = async () => {
      // OAuth 리디렉션인 경우 Supabase가 URL 해시를 처리할 시간을 줌
      if (isOAuthRedirect) {
        // 짧은 지연 후 세션 체크 (Supabase가 URL 해시를 처리할 시간)
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('getSession error:', error);
        initialSessionChecked = true;
        if (isOAuthRedirect) {
          // 에러가 있어도 OAuth 처리 중 플래그는 유지 (onAuthStateChange에서 처리)
          console.warn('Session check error, waiting for onAuthStateChange');
        }
        return;
      }

      const session = data.session;

      if (session) {
        // 디버깅: 카카오에서 받아온 정보 확인
        console.log('Session data:', {
          email: session.user.email,
          metadata: session.user.user_metadata,
          provider: session.user.app_metadata?.provider,
        });

        setUserData({
          isLoggedIn: true,
          name:
            session.user.user_metadata?.nickname ??
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            session.user.email?.split('@')[0] ??
            null,
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
            setIsProcessingOAuth(false); // 처리 완료
          }, 200);
        }
      } else if (isOAuthRedirect) {
        // 세션이 없는데 OAuth 리디렉션이면 onAuthStateChange에서 처리될 때까지 기다림
        console.log('OAuth redirect detected, waiting for session from onAuthStateChange');
        // 플래그는 유지하여 로그인 모달이 열리지 않도록 함
        // 타임아웃은 이미 설정되어 있음
      }
      initialSessionChecked = true;
    };

    // 세션 체크 먼저 실행
    checkSession();

    // 세션 변경(OAuth 리디렉션 포함) 실시간 반영
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const currentIsOAuthRedirect = checkOAuthRedirect();

        // 디버깅: 세션 변경 이벤트 확인
        console.log('Auth state changed:', {
          event,
          email: session.user.email,
          metadata: session.user.user_metadata,
          isOAuthRedirect: currentIsOAuthRedirect,
          provider: session.user.app_metadata?.provider,
        });

        setUserData({
          isLoggedIn: true,
          name:
            session.user.user_metadata?.nickname ??
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            session.user.email?.split('@')[0] ??
            null,
          email: session.user.email,
        });

        // OAuth 리디렉션이거나 새로 로그인된 경우 프로필 모달 자동 오픈
        // OAuth provider가 있거나 SIGNED_IN 이벤트인 경우 프로필 모달 열기
        const isOAuthProvider =
          session.user.app_metadata?.provider === 'kakao' ||
          session.user.app_metadata?.provider === 'oauth' ||
          session.user.identities?.some((identity) => identity.provider === 'kakao');

        // isProcessingOAuth가 true이거나 OAuth 관련 조건이면 프로필 모달 열기
        const shouldOpenProfile =
          currentIsOAuthRedirect || event === 'SIGNED_IN' || isOAuthProvider || isProcessingOAuth;

        if (shouldOpenProfile) {
          console.log('Opening profile modal:', {
            currentIsOAuthRedirect,
            event,
            isOAuthProvider,
            isProcessingOAuth,
            initialSessionChecked,
          });
          setIsUserCompOpen(true);
          setIsLoginModalOpen(false); // 로그인 모달 닫기

          // URL 정리 (해시 및 쿼리 파라미터 제거)
          if (currentIsOAuthRedirect) {
            // 타임아웃 취소 (세션이 설정되었으므로)
            if (oauthTimeoutId) {
              clearTimeout(oauthTimeoutId);
              oauthTimeoutId = null;
            }
            setTimeout(() => {
              const cleanUrl = window.location.pathname;
              window.history.replaceState(null, '', cleanUrl);
              setIsProcessingOAuth(false);
            }, 200);
          } else {
            // OAuth 처리 중이었던 경우 플래그 해제 및 타임아웃 취소
            if (oauthTimeoutId) {
              clearTimeout(oauthTimeoutId);
              oauthTimeoutId = null;
            }
            setTimeout(() => {
              setIsProcessingOAuth(false);
            }, 200);
          }
        }
      } else {
        // 세션이 없을 때만 상태 업데이트 (초기 체크 완료 후)
        if (initialSessionChecked) {
          setUserData({ isLoggedIn: false, name: null, email: null });
          setIsUserCompOpen(false);
          setIsProcessingOAuth(false);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
      if (oauthTimeoutId) {
        clearTimeout(oauthTimeoutId);
      }
    };
  }, []);

  const toggleUserComp = () => setIsUserCompOpen((prev) => !prev);
  const closeUserComp = () => setIsUserCompOpen(false);

  // 로그인 모달 제어 (OAuth 처리 중에는 열리지 않도록)
  const openLoginModal = () => {
    if (!isProcessingOAuth && !userData?.isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  };
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
        isProcessingOAuth, // OAuth 처리 중 플래그 추가
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
