/**
 * Auth Context
 * 
 * 전역 인증 상태 관리
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import type { User } from '@/types/amplify';
import { configureAmplify } from '@/lib/amplify-client';
import {
  authGetCurrentUser,
  authSignIn,
  authSignUp,
  authSignOut,
  authResetPassword,
  authConfirmResetPassword,
  type SignInParams,
  type SignUpParams,
} from '@/lib/services/auth.service';
import { getCurrentUser as getDBUser, createUser } from '@/lib/services/user.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string; userId?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  confirmResetPassword: (params: {
    email: string;
    code: string;
    newPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  confirmSignUp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendSignUpCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Amplify 초기화
  useEffect(() => {
    configureAmplify();
  }, []);

  // 초기 사용자 로드
  useEffect(() => {
    loadUser();
  }, []);

  // Amplify Hub 이벤트 리스너 (로그인/로그아웃 감지)
  useEffect(() => {
    const hubListener = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          await loadUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
        case 'tokenRefresh':
          // 토큰 갱신 시 사용자 정보 유지
          break;
        case 'tokenRefresh_failure':
          console.error('Token refresh failed');
          setUser(null);
          break;
      }
    });

    return () => hubListener();
  }, []);

  const loadUser = async () => {
    try {
      console.log('🔄 Loading user...');
      setLoading(true);
      const authUser = await authGetCurrentUser();
      
      console.log('👤 Auth user:', authUser);
      
      if (!authUser) {
        console.log('❌ No auth user found');
        setUser(null);
        setLoading(false);
        return;
      }

      // 일단 기본 사용자 정보로 빠르게 설정 (로딩 속도 개선)
      const basicUser: User = {
        id: authUser.userId,
        email: authUser.email,
        fullName: undefined,
        avatarUrl: undefined,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User;
      
      setUser(basicUser);
      setLoading(false); // 로딩 즉시 해제 (UX 개선)
      
      // 백그라운드에서 DB 정보 동기화
      console.log('🔍 Fetching DB user in background...');
      const dbUser = await getDBUser();
      
      console.log('� DB user result:', dbUser);
      
      if (dbUser.data) {
        console.log('✅ User loaded from DB:', dbUser.data);
        setUser(dbUser.data); // DB 정보로 업데이트
      } else {
        console.log('⚠️ User not in DB yet - will be created by post-confirmation trigger');
        // Post-confirmation Lambda trigger가 자동으로 생성
        // 프론트에서는 생성 시도하지 않음
      }
    } catch (error) {
      console.error('❌ Error loading user:', error);
      setUser(null);
      setLoading(false);
    } finally {
      console.log('🏁 Load user finished');
    }
  };

  const signIn = async (params: SignInParams) => {
    console.log('🔐 SignIn called with:', { email: params.email });
    const result = await authSignIn(params);
    
    console.log('🔐 SignIn result:', result);
    
    if (result.success) {
      console.log('✅ Sign in successful, loading user...');
      await loadUser();
      console.log('✅ User loaded after sign in');
    } else {
      console.error('❌ Sign in failed:', result.error);
    }
    
    return result;
  };

  const signUp = async (params: SignUpParams) => {
    const result = await authSignUp(params);
    
    // 회원가입 성공 시 DB에 사용자 생성은 post-confirmation trigger에서 처리
    
    return result;
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return authResetPassword({ email });
  };

  const confirmResetPassword = async (params: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    return authConfirmResetPassword(params);
  };

  const confirmSignUp = async (email: string, code: string) => {
    const { authConfirmSignUp } = await import('@/lib/services/auth.service');
    return authConfirmSignUp(email, code);
  };

  const resendSignUpCode = async (email: string) => {
    const { authResendSignUpCode } = await import('@/lib/services/auth.service');
    return authResendSignUpCode(email);
  };

  const refetchUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        confirmResetPassword,
        confirmSignUp,
        resendSignUpCode,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// 인증 체크 유틸리티 훅
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading]);
  
  return { user, loading };
}
