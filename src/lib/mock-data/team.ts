/**
 * Team & Member Mock Data
 */

import type { TeamMember, TeamInvitation } from "@/types/team";

// 샘플 팀원 데이터
export const SAMPLE_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "김철수",
    email: "kim@example.com",
    role: "owner",
    adAccounts: [
      { accountId: "1", role: "admin" },
      { accountId: "3", role: "admin" },
      { accountId: "5", role: "admin" },
    ],
  },
  {
    id: 2,
    name: "이영희",
    email: "lee@example.com",
    role: "member",
    adAccounts: [
      { accountId: "1", role: "editor" },
      { accountId: "2", role: "viewer" },
    ],
  },
  {
    id: 3,
    name: "박민수",
    email: "park@example.com",
    role: "member",
    adAccounts: [
      { accountId: "3", role: "editor" },
      { accountId: "4", role: "editor" },
    ],
  },
  {
    id: 4,
    name: "최지원",
    email: "choi@example.com",
    role: "viewer",
    adAccounts: [
      { accountId: "1", role: "viewer" },
      { accountId: "3", role: "viewer" },
      { accountId: "5", role: "viewer" },
    ],
  },
];

// 샘플 대기 중 초대 데이터
export const SAMPLE_PENDING_INVITES: TeamInvitation[] = [
  {
    id: 1,
    email: "new.member@example.com",
    role: "member",
    invitedBy: "김철수",
    invitedAt: "2025-10-28",
  },
  {
    id: 2,
    email: "viewer@example.com",
    role: "viewer",
    invitedBy: "김철수",
    invitedAt: "2025-10-30",
  },
];

// 간단한 팀원 목록 (계정 권한 모달에서 사용)
export const SIMPLE_TEAM_MEMBERS = SAMPLE_TEAM_MEMBERS.map(m => ({
  id: m.id,
  name: m.name,
  email: m.email,
}));
