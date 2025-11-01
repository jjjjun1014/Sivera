/**
 * Team Service
 * 
 * 팀 관리 및 초대 시스템
 */

import { list, get, create, update, remove, query } from './graphql.service';
import type { Team, TeamMember, TeamInvitation, User } from '@/types/amplify';

// ===================================================================
// Team CRUD
// ===================================================================

/**
 * 팀 생성
 */
export async function createTeam(data: {
  name: string;
  description?: string;
  masterUserID: string;
}) {
  return create<Team>('Team', { data });
}

/**
 * 팀 정보 조회
 */
export async function getTeam(id: string) {
  return get<Team>('Team', { id });
}

/**
 * 팀 목록 조회 (현재 사용자가 속한 팀)
 */
export async function listTeams(userId: string) {
  // TeamMember를 통해 사용자가 속한 팀 조회
  const teamMembers = await query<TeamMember>(
    'TeamMember',
    'byUserID',
    { userID: userId }
  );

  if (!teamMembers.data.length) {
    return { data: [], error: null };
  }

  // 각 팀의 상세 정보 조회
  const teams = await Promise.all(
    teamMembers.data.map(async (member) => {
      const team = await getTeam(member.teamID);
      return {
        ...team.data,
        role: member.role,
        joinedAt: member.joinedAt,
      };
    })
  );

  return {
    data: teams.filter((t) => t !== null),
    error: null,
  };
}

/**
 * 팀 업데이트
 */
export async function updateTeam(
  id: string,
  data: { name?: string; description?: string }
) {
  return update<Team>('Team', { id, data });
}

/**
 * 팀 삭제
 */
export async function deleteTeam(id: string) {
  return remove('Team', { id });
}

// ===================================================================
// Team Members
// ===================================================================

/**
 * 팀 멤버 목록 조회
 */
export async function listTeamMembers(teamId: string) {
  const members = await query<TeamMember>(
    'TeamMember',
    'byTeamID',
    { teamID: teamId }
  );

  if (!members.data.length) {
    return { data: [], error: null };
  }

  // 각 멤버의 사용자 정보 조회
  const membersWithUser = await Promise.all(
    members.data.map(async (member) => {
      const user = await get<User>('User', { id: member.userID });
      return {
        ...member,
        user: user.data,
      };
    })
  );

  return {
    data: membersWithUser,
    error: null,
  };
}

/**
 * 팀 멤버 추가
 */
export async function addTeamMember(data: {
  teamID: string;
  userID: string;
  role: 'master' | 'team_mate' | 'viewer';
  joinedAt?: string;
}) {
  return create<TeamMember>('TeamMember', {
    data: {
      ...data,
      joinedAt: data.joinedAt || new Date().toISOString(),
    },
  });
}

/**
 * 팀 멤버 역할 변경
 */
export async function updateTeamMemberRole(
  memberId: string,
  role: 'master' | 'team_mate' | 'viewer'
) {
  return update<TeamMember>('TeamMember', {
    id: memberId,
    data: { role },
  });
}

/**
 * 팀 멤버 제거
 */
export async function removeTeamMember(memberId: string) {
  return remove('TeamMember', { id: memberId });
}

// ===================================================================
// Team Invitations
// ===================================================================

/**
 * 초대 생성
 */
export async function createInvitation(data: {
  teamID: string;
  email: string;
  role: 'master' | 'team_mate' | 'viewer';
  invitedByID: string;
  expiresAt?: string;
}) {
  // 기본 만료 시간: 7일
  const expiresAt =
    data.expiresAt ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return create<TeamInvitation>('TeamInvitation', {
    data: {
      ...data,
      expiresAt,
      status: 'pending',
    },
  });
}

/**
 * 초대 조회
 */
export async function getInvitation(id: string) {
  return get<TeamInvitation>('TeamInvitation', { id });
}

/**
 * 팀의 초대 목록 조회
 */
export async function listTeamInvitations(teamId: string) {
  return query<TeamInvitation>('TeamInvitation', 'byTeamID', {
    teamID: teamId,
  });
}

/**
 * 이메일로 초대 조회
 */
export async function listInvitationsByEmail(email: string) {
  return query<TeamInvitation>('TeamInvitation', 'byEmail', {
    email,
  });
}

/**
 * 초대 수락
 */
export async function acceptInvitation(invitationId: string, userId: string) {
  // 1. 초대 정보 조회
  const invitation = await getInvitation(invitationId);
  if (!invitation.data) {
    return { success: false, error: '초대를 찾을 수 없습니다.' };
  }

  // 2. 만료 확인
  if (new Date(invitation.data.expiresAt) < new Date()) {
    await update<TeamInvitation>('TeamInvitation', {
      id: invitationId,
      data: { status: 'expired' },
    });
    return { success: false, error: '초대가 만료되었습니다.' };
  }

  // 3. 팀 멤버 추가
  const memberResult = await addTeamMember({
    teamID: invitation.data.teamID,
    userID: userId,
    role: invitation.data.role,
    joinedAt: new Date().toISOString(),
  });

  if (memberResult.error) {
    return { success: false, error: '팀 멤버 추가에 실패했습니다.' };
  }

  // 4. 초대 상태 업데이트
  await update<TeamInvitation>('TeamInvitation', {
    id: invitationId,
    data: {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    },
  });

  return { success: true, data: memberResult.data };
}

/**
 * 초대 취소
 */
export async function cancelInvitation(invitationId: string) {
  return update<TeamInvitation>('TeamInvitation', {
    id: invitationId,
    data: { status: 'cancelled' },
  });
}

/**
 * 초대 삭제
 */
export async function deleteInvitation(invitationId: string) {
  return remove('TeamInvitation', { id: invitationId });
}

// ===================================================================
// 권한 확인
// ===================================================================

/**
 * 사용자가 팀의 마스터인지 확인
 */
export async function isTeamMaster(teamId: string, userId: string): Promise<boolean> {
  const team = await getTeam(teamId);
  return team.data?.masterUserID === userId;
}

/**
 * 사용자의 팀 권한 확인
 */
export async function getTeamRole(
  teamId: string,
  userId: string
): Promise<'master' | 'team_mate' | 'viewer' | null> {
  const members = await query<TeamMember>('TeamMember', 'byTeamID', {
    teamID: teamId,
  });

  const member = members.data.find((m) => m.userID === userId);
  return member?.role || null;
}

/**
 * 사용자가 팀에 액세스 권한이 있는지 확인
 */
export async function canAccessTeam(teamId: string, userId: string): Promise<boolean> {
  const role = await getTeamRole(teamId, userId);
  return role !== null;
}

/**
 * 사용자가 팀을 수정할 수 있는지 확인 (master 또는 team_mate)
 */
export async function canModifyTeam(teamId: string, userId: string): Promise<boolean> {
  const role = await getTeamRole(teamId, userId);
  return role === 'master' || role === 'team_mate';
}
