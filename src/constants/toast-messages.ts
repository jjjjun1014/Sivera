/**
 * Toast Messages Constants
 * 
 * 실제 사용되는 토스트 메시지만 정의
 */

export const TOAST_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: { title: "로그인 성공", description: "대시보드로 이동합니다." },
    LOGIN_FAILED: { title: "로그인 실패", description: "이메일 또는 비밀번호를 확인해주세요." },
    SIGNUP_SUCCESS: { title: "회원가입 완료", description: "이메일로 전송된 인증 코드를 입력해주세요." },
    SIGNUP_FAILED: { title: "회원가입 실패" },
    EMAIL_INVALID: { title: "이메일 형식 오류", description: "올바른 이메일 주소를 입력해주세요." },
    PASSWORD_INVALID: { title: "비밀번호 형식 오류" },
    PASSWORD_MISMATCH: { title: "비밀번호 불일치", description: "비밀번호가 일치하지 않습니다." },
    TERMS_REQUIRED: { title: "약관 동의 필요", description: "서비스 이용약관 및 개인정보 처리방침에 동의해주세요." },
    EMAIL_SENT: { title: "이메일 전송 완료", description: "비밀번호 재설정 링크를 이메일로 전송했습니다." },
    PASSWORD_RESET_SUCCESS: { title: "비밀번호 재설정 완료", description: "새 비밀번호로 로그인해주세요." },
    PASSWORD_RESET_FAILED: { title: "재설정 실패" },
  },
  COMMON: {
    GENERIC_ERROR: { title: "오류", description: "요청 처리 중 문제가 발생했습니다." },
  },
} as const;

export function withDescription(
  message: { title: string; description?: string },
  customDescription: string
) {
  return { ...message, description: customDescription };
}
