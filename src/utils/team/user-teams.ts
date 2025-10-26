// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import log from "@/utils/logger";

export interface UserTeam {
  teamId: string;
  role: "master" | "team_mate" | "viewer";
  teamName: string;
}

/**
 * 사용자의 팀 정보를 가져오고, 팀이 없으면 자동으로 생성합니다.
 *
 * @param userId - 사용자 ID
 * @returns 사용자의 팀 정보 또는 null
 */
export async function getUserTeams(userId: string): Promise<UserTeam[]> {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: GET /api/users/:userId/teams
    // Response: { teams: UserTeam[] }

    log.warn("getUserTeams called - backend integration needed", { userId });

    // Stub response - return empty array
    return [];

    // TODO: The backend should handle:
    // 1. Fetch teams where user is master
    // 2. Fetch teams where user is a member
    // 3. If no teams exist, create a new team for the user
    // 4. Return list of teams with user's role
  } catch (error) {
    log.error("Unexpected error in getUserTeams", {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });

    return [];
  }
}

/**
 * 사용자의 첫 번째 팀 ID를 가져옵니다.
 *
 * @param userId - 사용자 ID
 * @returns 팀 ID 또는 null
 */
export async function getUserPrimaryTeamId(
  userId: string,
): Promise<string | null> {
  const teams = await getUserTeams(userId);

  if (teams.length === 0) {
    return null;
  }

  // 마스터인 팀을 우선적으로 반환
  const masterTeam = teams.find((team) => team.role === "master");

  if (masterTeam) {
    return masterTeam.teamId;
  }

  // 마스터 팀이 없으면 첫 번째 팀 반환
  return teams[0].teamId;
}

/**
 * 사용자가 특정 팀에 접근 권한이 있는지 확인합니다.
 *
 * @param userId - 사용자 ID
 * @param teamId - 팀 ID
 * @returns 접근 권한 여부
 */
export async function hasTeamAccess(
  userId: string,
  teamId: string,
): Promise<boolean> {
  const teams = await getUserTeams(userId);

  return teams.some((team) => team.teamId === teamId);
}
