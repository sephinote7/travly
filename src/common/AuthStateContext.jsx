// src/common/AuthStateContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../util/supabaseClient.js';
import { createOrUpdateMember, getMemberInfoByAuthUuid } from '../util/memberService.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
    memberId: null,
    id: null, // authUuid (Supabase user.id)
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
        const authUuid = session.user.id;

        // memberId 가져오기 시도
        let memberId = null;
        try {
          const result = await getMemberInfoByAuthUuid(authUuid);
          if (result.success && result.data?.id) {
            memberId = result.data.id;
            localStorage.setItem('memberId', memberId.toString());
          }
        } catch (err) {
          console.error('세션 체크 시 memberId 가져오기 실패:', err);
          // localStorage에서 memberId 가져오기 시도
          const storedMemberId = localStorage.getItem('memberId');
          if (storedMemberId) {
            memberId = parseInt(storedMemberId, 10);
          }
        }

        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? session.user.user_metadata?.full_name ?? null,
          email: session.user.email,
          memberId: memberId,
          id: authUuid,
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 초기 세션 체크가 완료될 때까지 기다림
      if (!initialSessionChecked) {
        return;
      }

      if (session) {
        const isOAuthRedirect = checkOAuthRedirect();
        const authUuid = session.user.id;

        // memberId 가져오기 시도
        let memberId = null;
        try {
          const result = await getMemberInfoByAuthUuid(authUuid);
          if (result.success && result.data?.id) {
            memberId = result.data.id;
            localStorage.setItem('memberId', memberId.toString());
          }
        } catch (err) {
          console.error('auth state change 시 memberId 가져오기 실패:', err);
          // localStorage에서 memberId 가져오기 시도
          const storedMemberId = localStorage.getItem('memberId');
          if (storedMemberId) {
            memberId = parseInt(storedMemberId, 10);
          }
        }

        setUserData({
          isLoggedIn: true,
          name: session.user.user_metadata?.nickname ?? session.user.user_metadata?.full_name ?? null,
          email: session.user.email,
          memberId: memberId,
          id: authUuid,
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
        setUserData({ isLoggedIn: false, name: null, email: null, memberId: null, id: null });
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

    // 회원가입 성공 시 Spring 백엔드 API를 통해 member 테이블에 데이터 저장
    if (data.user) {
      const authUuid = data.user.id;
      const trimmedNickname = nickname.trim();

      console.log('회원가입 성공, Spring 백엔드에 회원 정보 저장 시도:', {
        authUuid,
        nickname: trimmedNickname,
      });

      // Spring 백엔드 API를 통해 회원 정보 생성
      // auth.users에 사용자가 완전히 생성될 때까지 지연 후 재시도 로직
      let memberResult = null;
      let memberError = null;

      for (let i = 0; i < 5; i++) {
        // 첫 시도 전에 지연 (auth.users 생성 대기)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * i));
        }

        try {
          // Spring 백엔드 API 호출
          memberResult = await createOrUpdateMember({
            authUuid: authUuid,
            name: trimmedNickname, // name은 nickname과 동일하게 설정
            nickname: trimmedNickname,
            introduction: '',
            profileImageFileId: null,
          });

          if (memberResult.success) {
            console.log('Spring 백엔드에 회원 정보 저장 성공:', memberResult.data);

            // 응답에서 memberId 저장
            const memberId = memberResult.data?.id;
            if (memberId) {
              localStorage.setItem('memberId', memberId.toString());
              console.log('memberId 저장됨:', memberId);

              // userData에도 memberId 반영
              setUserData((prev) => ({
                ...prev,
                memberId: memberId,
              }));
            }

            break;
          } else {
            // API 에러인 경우
            memberError = memberResult.error;

            // 400 에러 중 "등록되지 않은 인증 사용자 uuid"인 경우에만 재시도
            if (memberResult.status === 400 && memberError?.includes('등록되지 않은 인증 사용자')) {
              console.log(`Retry ${i + 1}/5: 인증 사용자 UUID 등록 대기 중...`);
            } else {
              // 다른 에러는 재시도하지 않음
              console.error('회원 정보 저장 실패 (non-retryable):', memberError);
              break;
            }
          }
        } catch (err) {
          console.error('회원 정보 저장 중 예외 발생:', err);
          memberError = err.message || '회원 정보 저장 중 오류가 발생했습니다.';
          // 네트워크 에러 등은 재시도
          if (i < 4) {
            console.log(`Retry ${i + 1}/5: 네트워크 오류, 재시도 중...`);
          } else {
            break;
          }
        }
      }

      if (!memberResult || !memberResult.success) {
        console.error('회원 정보 저장 최종 실패:', memberError);
        // Spring 백엔드 저장 실패해도 Supabase Authentication은 성공했으므로 경고만 표시
        return {
          success: true,
          data,
          warning: `회원가입은 완료되었지만 프로필 정보 저장에 실패했습니다: ${memberError || '알 수 없는 오류'}`,
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

    // 로그인 성공 시 memberId 가져오기
    const authUuid = data.user.id;
    let memberId = null;

    try {
      // authUuid로 회원 정보 조회하여 memberId 가져오기
      const result = await getMemberInfoByAuthUuid(authUuid);

      if (result.success && result.data?.id) {
        memberId = result.data.id;
        // localStorage에 memberId 저장
        localStorage.setItem('memberId', memberId.toString());
        console.log('로그인 시 memberId 저장됨:', memberId);
      }
    } catch (err) {
      console.error('로그인 시 memberId 가져오기 실패:', err);
      // memberId 가져오기 실패해도 로그인은 성공 처리
    }

    setUserData({
      isLoggedIn: true,
      name: data.user.user_metadata?.nickname ?? null,
      email: data.user.email,
      memberId: memberId,
      id: data.user.id,
    });

    closeUserComp();
    return { success: true };
  };

  // ⭐ 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    setUserData({ isLoggedIn: false, name: null, email: null, memberId: null, id: null });
    setIsUserCompOpen(false);
    // 로그아웃 시 memberId도 제거
    localStorage.removeItem('memberId');
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
