// src/common/AuthStateContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../util/supabaseClient.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    id: null, // Supabase 사용자 ID
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
        // 액세스 토큰을 localStorage에 저장 (API 호출용)
        if (session.access_token) {
          localStorage.setItem('authToken', session.access_token);
        }

        setUserData({
          isLoggedIn: true,
          id: session.user.id, // Supabase 사용자 ID 추가
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
      } else {
        // 세션이 없으면 토큰도 제거
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
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

        // 액세스 토큰을 localStorage에 저장 (API 호출용)
        if (session.access_token) {
          localStorage.setItem('authToken', session.access_token);
        }

        setUserData({
          isLoggedIn: true,
          id: session.user.id, // Supabase 사용자 ID 추가
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
        // 세션이 없으면 토큰도 제거
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUserData({ isLoggedIn: false, id: null, name: null, email: null });
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

    // 회원가입 성공 시 member 테이블에 데이터 삽입
    if (data.user) {
      const userId = data.user.id;
      const now = new Date().toISOString();
      const memberData = {
        auth_uuid: userId,
        nickname: nickname.trim(),
        name: nickname.trim(), // name은 nickname과 동일하게 설정
        introduction: '',
        notification_count: 0,
        badge_id: 1, // 기본 배지 ID (1~5 중 하나, 기본값 1)
        created_at: now,
        updated_at: now,
      };

      console.log('Inserting member data:', memberData);
      console.log('User ID:', userId);

      // auth.users에 사용자가 완전히 생성될 때까지 지연 후 재시도 로직
      let insertData = null;
      let memberError = null;
      for (let i = 0; i < 5; i++) {
        // 첫 시도 전에 지연
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * i));
        }

        const result = await supabase.from('member').insert(memberData).select();
        insertData = result.data;
        memberError = result.error;

        if (!memberError) {
          console.log('Member data inserted successfully:', insertData);
          break;
        }

        // 외래 키 제약 조건 에러인 경우에만 재시도
        if (memberError.code === '23503') {
          console.log(`Retry ${i + 1}/5: Foreign key constraint error, waiting...`);
        } else {
          // 다른 에러는 재시도하지 않음
          console.error('Member table insert error (non-retryable):', memberError);
          break;
        }
      }

      if (memberError) {
        console.error('Member table insert error (final):', memberError);
        console.error('Error details:', {
          message: memberError.message,
          details: memberError.details,
          hint: memberError.hint,
          code: memberError.code,
        });
        // member 테이블 삽입 실패해도 auth는 성공했으므로 경고만 표시
        return {
          success: true,
          data,
          warning: `회원가입은 완료되었지만 프로필 정보 저장에 실패했습니다: ${memberError.message}`,
        };
      }
    }

    return { success: true, data };
  };

  // ⭐ 로그인
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error };

    // 액세스 토큰을 localStorage에 저장 (API 호출용)
    const session = await supabase.auth.getSession();
    if (session.data?.session?.access_token) {
      localStorage.setItem('authToken', session.data.session.access_token);
    }

    setUserData({
      isLoggedIn: true,
      id: data.user.id, // Supabase 사용자 ID 추가
      name: data.user.user_metadata?.nickname ?? null,
      email: data.user.email,
    });

    closeUserComp();
    return { success: true };
  };

  // ⭐ 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    // 토큰 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUserData({ isLoggedIn: false, id: null, name: null, email: null, memberId: null, nickname: null });
    setIsUserCompOpen(false);
  };

  // ⭐ Spring API에서 받은 회원 정보로 userData 업데이트
  const updateUserDataFromSpring = async (memberData) => {
    if (!memberData) {
      console.warn('⚠️ updateUserDataFromSpring: memberData가 없습니다.');
      return false;
    }

    try {
      setUserData((prev) => ({
        ...prev,
        memberId: memberData.id,
        nickname: memberData.nickname || prev.nickname,
        name: memberData.name || memberData.nickname || prev.name,
      }));
      console.log('✅ userData 업데이트 완료:', {
        memberId: memberData.id,
        nickname: memberData.nickname,
        name: memberData.name || memberData.nickname,
      });
      return true;
    } catch (error) {
      console.error('❌ userData 업데이트 실패:', error);
      return false;
    }
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
        updateUserDataFromSpring,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
