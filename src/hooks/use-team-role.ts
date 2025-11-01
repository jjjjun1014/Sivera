'use client';

import { useEffect, useState } from 'react';
import { GraphQLQuery, generateClient } from 'aws-amplify/api';

const client = generateClient();

export type UserRole = 'master' | 'team_mate' | 'viewer';

interface TeamMember {
  id: string;
  teamID: string;
  userID: string;
  role: UserRole;
  joinedAt: string;
}

interface UseTeamRoleResult {
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
  isMaster: boolean;
  canManageTeam: boolean;
  canManageCampaigns: boolean;
  canViewOnly: boolean;
  refetch: () => Promise<void>;
}

/**
 * 현재 사용자의 팀 권한을 조회하는 Hook
 * 
 * @param teamID - 조회할 팀 ID
 * @param userID - 현재 사용자 ID
 * @returns 사용자의 역할과 권한 헬퍼 함수들
 * 
 * @example
 * ```tsx
 * const { role, isMaster, canManageTeam } = useTeamRole(teamID, userID);
 * 
 * if (canManageTeam) {
 *   // 팀 설정 버튼 표시
 * }
 * ```
 */
export function useTeamRole(teamID: string | null, userID: string | null): UseTeamRoleResult {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRole = async () => {
    if (!teamID || !userID) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // GraphQL로 TeamMember 조회
      const query = `
        query ListTeamMembers($filter: ModelTeamMemberFilterInput) {
          listTeamMembers(filter: $filter) {
            items {
              id
              teamID
              userID
              role
              joinedAt
            }
          }
        }
      `;

      const variables = {
        filter: {
          and: [
            { teamID: { eq: teamID } },
            { userID: { eq: userID } },
          ],
        },
      };

      const response: any = await client.graphql({
        query,
        variables,
      });

      const members = response.data?.listTeamMembers?.items || [];

      if (members.length > 0) {
        setRole(members[0].role as UserRole);
      } else {
        setRole(null);
      }
    } catch (err) {
      console.error('Failed to fetch team role:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [teamID, userID]);

  return {
    role,
    isLoading,
    error,
    isMaster: role === 'master',
    canManageTeam: role === 'master', // master만 팀 설정 가능
    canManageCampaigns: role === 'master' || role === 'team_mate', // master, team_mate는 캠페인 수정 가능
    canViewOnly: role === 'viewer', // viewer는 읽기 전용
    refetch: fetchRole,
  };
}

/**
 * 사용자 권한에 따른 액션 허용 여부 체크
 * 
 * @param role - 사용자 역할
 * @returns 권한별 액션 허용 여부
 */
export function getPermissions(role: UserRole | null) {
  return {
    canInviteMembers: role === 'master',
    canRemoveMembers: role === 'master',
    canEditTeamSettings: role === 'master',
    canCreateCampaigns: role === 'master' || role === 'team_mate',
    canEditCampaigns: role === 'master' || role === 'team_mate',
    canDeleteCampaigns: role === 'master',
    canViewReports: role !== null, // 모든 멤버 가능
    canExportData: role === 'master' || role === 'team_mate',
  };
}
