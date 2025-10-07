/**
 * 임시 인증 로직
 * TODO: 백엔드 API 연동 시 교체 필요
 */

// 임시 마스터 계정
export const MASTER_ACCOUNT = {
  email: "admin@sivera.com",
  password: "Admin1234!",
  name: "관리자",
  role: "admin" as const,
};

// 로컬 스토리지 키
const AUTH_KEY = "sivera_auth";
const USER_KEY = "sivera_user";

/**
 * 로그인 처리 (임시)
 */
export function login(email: string, password: string): boolean {
  // 마스터 계정 체크
  if (email === MASTER_ACCOUNT.email && password === MASTER_ACCOUNT.password) {
    // 로그인 성공 - 로컬 스토리지에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          email: MASTER_ACCOUNT.email,
          name: MASTER_ACCOUNT.name,
          role: MASTER_ACCOUNT.role,
        })
      );
    }
    return true;
  }

  return false;
}

/**
 * 로그아웃
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * 로그인 상태 확인
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
