/**
 * Authentication Service
 * 
 * Amplify Auth를 사용한 인증 서비스
 */

import { signIn, signOut, signUp, confirmSignUp, resetPassword, confirmResetPassword, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

/**
 * 회원가입
 */
export async function authSignUp({ email, password, fullName }: SignUpParams) {
  try {
    const { userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: fullName || '',
        },
      },
    });

    return {
      success: true,
      userId,
      nextStep,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * 이메일 인증 코드 확인
 */
export async function authConfirmSignUp(email: string, code: string) {
  try {
    const { nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return {
      success: true,
      nextStep,
    };
  } catch (error) {
    console.error('Confirm sign up error:', error);
    throw error;
  }
}

/**
 * 로그인
 */
export async function authSignIn({ email, password }: SignInParams) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });

    return {
      success: isSignedIn,
      nextStep,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * 로그아웃
 */
export async function authSignOut() {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * 비밀번호 재설정 요청
 */
export async function authResetPassword({ email }: ResetPasswordParams) {
  try {
    const { nextStep } = await resetPassword({
      username: email,
    });

    return {
      success: true,
      nextStep,
    };
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

/**
 * 비밀번호 재설정 확인
 */
export async function authConfirmResetPassword({ email, code, newPassword }: ConfirmResetPasswordParams) {
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });

    return { success: true };
  } catch (error) {
    console.error('Confirm reset password error:', error);
    throw error;
  }
}

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export async function authGetCurrentUser() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * 현재 세션 정보 가져오기 (토큰 포함)
 */
export async function authGetSession() {
  try {
    const session = await fetchAuthSession();
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * 사용자의 JWT 토큰 가져오기
 */
export async function authGetToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
}
