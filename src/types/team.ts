/**
 * Team & Account Management Types
 */

// 팀원 기본 역할
export type TeamRole = "owner" | "member" | "viewer";

// 광고 계정별 역할
export type AccountRole = "admin" | "editor" | "viewer";

// 팀원 기본 정보
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: TeamRole;
  adAccounts?: AccountAccess[];
}

// 광고 계정 접근 권한
export interface AccountAccess {
  accountId: string;
  role: AccountRole;
}

// 계정별 팀원 정보
export interface AccountMember {
  memberId: number;
  memberName: string;
  memberEmail: string;
  role: AccountRole;
}

// 초대 정보
export interface TeamInvitation {
  id: number;
  email: string;
  role: TeamRole;
  invitedBy: string;
  invitedAt: string;
}
