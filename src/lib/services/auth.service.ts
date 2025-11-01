/**
 * Authentication Service
 * 
 * Amplify Auth를 사용한 인증 서비스
 * 백엔드 Cognito User Pool과 연동
 */

import {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
  updatePassword,
  type SignUpInput,
  type SignInInput,
  type ConfirmSignUpInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify-client';

// Amplify 초기화 보장
if (typeof window !== 'undefined') {
  configureAmplify();
}

// ===================================================================
// 회원가입
// ===================================================================

export interface SignUpParams {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignUpResult {
  success: boolean;
  userId?: string;
  nextStep?: string;
  error?: string;
}

/**
 * 회원가입
 */
export async function authSignUp({
  email,
  password,
  fullName,
}: SignUpParams): Promise<SignUpResult> {
  try {
    const { userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: fullName || '',
        },
        autoSignIn: true, // 인증 완료 후 자동 로그인
      },
    });

    return {
      success: true,
      userId,
      nextStep: nextStep.signUpStep,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * 이메일 인증 코드 확인
 */
export async function authConfirmSignUp(
  email: string,
  code: string
): Promise<SignUpResult> {
  try {
    const { nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return {
      success: true,
      nextStep: nextStep.signUpStep,
    };
  } catch (error: any) {
    console.error('Confirm sign up error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * 인증 코드 재전송
 */
export async function authResendSignUpCode(
  email: string
): Promise<SignUpResult> {
  try {
    await resendSignUpCode({
      username: email,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Resend sign up code error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

// ===================================================================
// 로그인
// ===================================================================

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  nextStep?: string;
  error?: string;
}

/**
 * 로그인
 */
export async function authSignIn({
  email,
  password,
}: SignInParams): Promise<SignInResult> {
  try {
    // 이미 로그인된 사용자가 있는지 확인
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // 같은 사용자면 성공 처리
        if (currentUser.signInDetails?.loginId === email) {
          return { success: true };
        }
        // 다른 사용자면 로그아웃 후 진행
        await signOut();
      }
    } catch (error) {
      // 로그인된 사용자 없음 - 계속 진행
    }

    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });

    if (!isSignedIn && nextStep) {
      return {
        success: false,
        nextStep: nextStep.signInStep,
        error: '추가 인증이 필요합니다.',
      };
    }

    return {
      success: isSignedIn,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * 로그아웃
 */
export async function authSignOut(): Promise<SignUpResult> {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

// ===================================================================
// 비밀번호 재설정
// ===================================================================

export interface ResetPasswordParams {
  email: string;
}

export interface ResetPasswordResult {
  success: boolean;
  nextStep?: string;
  error?: string;
}

/**
 * 비밀번호 재설정 요청
 */
export async function authResetPassword({
  email,
}: ResetPasswordParams): Promise<ResetPasswordResult> {
  try {
    const { nextStep } = await resetPassword({
      username: email,
    });

    return {
      success: true,
      nextStep: nextStep.resetPasswordStep,
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

export interface ConfirmResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

/**
 * 비밀번호 재설정 확인
 */
export async function authConfirmResetPassword({
  email,
  code,
  newPassword,
}: ConfirmResetPasswordParams): Promise<ResetPasswordResult> {
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Confirm reset password error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

/**
 * 비밀번호 변경 (로그인 상태)
 */
export async function authUpdatePassword(
  oldPassword: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    await updatePassword({
      oldPassword,
      newPassword,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error),
    };
  }
}

// ===================================================================
// 사용자 정보
// ===================================================================

export interface CurrentUser {
  userId: string;
  email: string;
  emailVerified: boolean;
}

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export async function authGetCurrentUser(): Promise<CurrentUser | null> {
  try {
    const user = await getCurrentUser();
    return {
      userId: user.userId,
      email: user.signInDetails?.loginId || '',
      emailVerified: true,
    };
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
    return {
      tokens: session.tokens,
      credentials: session.credentials,
      identityId: session.identityId,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * 사용자의 JWT 토큰 가져오기
 */
export async function authGetToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
}

/**
 * 사용자의 액세스 토큰 가져오기
 */
export async function authGetAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch (error) {
    console.error('Get access token error:', error);
    return null;
  }
}

// ===================================================================
// 유틸리티
// ===================================================================

/**
 * 에러 메시지 변환 (사용자 친화적)
 */
function getAuthErrorMessage(error: any): string {
  const errorCode = error.name || error.code;

  const errorMessages: Record<string, string> = {
    UserNotFoundException: '이메일 또는 비밀번호를 확인해주세요.',
    NotAuthorizedException: '이메일 또는 비밀번호를 확인해주세요.',
    UsernameExistsException: '이미 가입된 이메일입니다.',
    InvalidPasswordException: '비밀번호는 최소 8자 이상이어야 하며, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    CodeMismatchException: '인증 코드가 올바르지 않습니다.',
    ExpiredCodeException: '인증 코드가 만료되었습니다. 다시 요청해주세요.',
    LimitExceededException: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    InvalidParameterException: '입력값이 올바르지 않습니다.',
    UserNotConfirmedException: '이메일 인증이 완료되지 않았습니다.',
    UserAlreadyAuthenticatedException: '이미 로그인되어 있습니다.',
  };

  return errorMessages[errorCode] || error.message || '알 수 없는 오류가 발생했습니다.';
}

/**
 * 비밀번호 유효성 검사
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
