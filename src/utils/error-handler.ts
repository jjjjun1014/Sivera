/**
 * Error Handler Utility
 * 
 * 통일된 에러 처리
 */

import { toast } from '@/utils/toast';

export interface AppError {
  title: string;
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export function handleError(error: any): AppError {
  console.error('Application error:', error);

  // Amplify Auth 에러
  if (error.name || error.code) {
    const errorCode = error.name || error.code;
    
    const authErrors: Record<string, AppError> = {
      UserNotFoundException: {
        title: '사용자를 찾을 수 없음',
        message: '존재하지 않는 사용자입니다.',
        code: errorCode,
      },
      NotAuthorizedException: {
        title: '인증 실패',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        code: errorCode,
      },
      UsernameExistsException: {
        title: '중복된 이메일',
        message: '이미 가입된 이메일입니다.',
        code: errorCode,
      },
      InvalidPasswordException: {
        title: '비밀번호 형식 오류',
        message: '비밀번호는 최소 8자 이상이어야 하며, 대소문자, 숫자, 특수문자를 포함해야 합니다.',
        code: errorCode,
      },
      CodeMismatchException: {
        title: '인증 코드 오류',
        message: '인증 코드가 올바르지 않습니다.',
        code: errorCode,
      },
      ExpiredCodeException: {
        title: '인증 코드 만료',
        message: '인증 코드가 만료되었습니다. 다시 요청해주세요.',
        code: errorCode,
      },
      LimitExceededException: {
        title: '요청 횟수 초과',
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        code: errorCode,
      },
      UserNotConfirmedException: {
        title: '이메일 미인증',
        message: '이메일 인증이 완료되지 않았습니다.',
        code: errorCode,
      },
    };

    if (authErrors[errorCode]) {
      return authErrors[errorCode];
    }
  }

  // GraphQL 에러
  if (error.errors && Array.isArray(error.errors)) {
    const graphqlError = error.errors[0];
    return {
      title: 'GraphQL 오류',
      message: graphqlError.message || '요청 처리 중 오류가 발생했습니다.',
      code: graphqlError.errorType,
    };
  }

  // HTTP 에러
  if (error.response) {
    return {
      title: 'API 오류',
      message: error.response.data?.message || '서버 오류가 발생했습니다.',
      statusCode: error.response.status,
    };
  }

  // 네트워크 에러
  if (error.message?.includes('Network') || error.message?.includes('fetch')) {
    return {
      title: '네트워크 오류',
      message: '네트워크 연결을 확인해주세요.',
    };
  }

  // 기본 에러
  return {
    title: '오류',
    message: error.message || '알 수 없는 오류가 발생했습니다.',
  };
}

/**
 * 에러를 toast로 표시
 */
export function showErrorToast(error: any) {
  const appError = handleError(error);
  toast.error({
    title: appError.title,
    description: appError.message,
  });
}

/**
 * 에러를 로그하고 toast 표시
 */
export function logAndShowError(error: any, context?: string) {
  if (context) {
    console.error(`[${context}]`, error);
  }
  showErrorToast(error);
}

/**
 * Try-Catch 래퍼
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      showErrorToast(error);
    }
    return null;
  }
}
