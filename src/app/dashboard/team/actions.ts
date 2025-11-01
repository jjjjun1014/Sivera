"use server";

import { revalidatePath } from "next/cache";

import log from "@/utils/logger";
import { UserRole } from "@/types";
import { createInvitation } from "@/lib/services/team.service";
import { getCurrentUser } from "@/lib/services/user.service";

export async function inviteTeamMemberAction(email: string, role: UserRole) {
  try {
    // 1. 현재 사용자 조회
    const currentUser = await getCurrentUser();
    
    if (!currentUser?.data) {
      return {
        success: false,
        error: "인증되지 않은 사용자입니다.",
      };
    }

    // 2. 사용자의 팀 ID 조회 (첫 번째 팀 사용)
    const userId = currentUser.data.id;
    const teamId = currentUser.data.teamID;
    
    if (!teamId) {
      return {
        success: false,
        error: "팀이 없습니다. 먼저 팀을 생성해주세요.",
      };
    }

    // 3. 초대 생성 (GraphQL을 통해 직접 생성 + 이메일 발송은 Lambda에서)
    const result = await createInvitation({
      teamID: teamId,
      email: email.toLowerCase(),
      role,
      invitedByID: userId,
    });

    if (result.error || !result.data) {
      return {
        success: false,
        error: result.error || "초대 생성에 실패했습니다.",
      };
    }

    // TODO: Lambda 함수로 이메일 발송 트리거
    // 현재는 GraphQL로 초대만 생성, 이메일은 나중에 Lambda 통합
    
    revalidatePath('/dashboard/team');
    
    return {
      success: true,
      invitationLink: `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${result.data.id}`,
    };
  } catch (error) {
    log.error(
      "Error in inviteTeamMemberAction",
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to invite team member",
    };
  }
}

export async function updateTeamMemberRoleAction(
  memberId: string,
  role: UserRole,
) {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: PATCH /api/teams/members/:memberId/role
    // Body: { role }
    // Response: { success, message }

    log.warn("updateTeamMemberRoleAction called - backend integration needed");

    // Stub response for UI compatibility
    return {
      success: false,
      error: "Backend API integration required. Please implement PATCH /api/teams/members/:memberId/role endpoint.",
    };

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Verify user is team master
    // 3. Validate memberId exists in the team
    // 4. Update member role in database
    // 5. Return success message
  } catch (error) {
    log.error(
      "Error in updateTeamMemberRoleAction",
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}

export async function removeTeamMemberAction(memberId: string) {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: DELETE /api/teams/members/:memberId
    // Response: { success, message }

    log.warn("removeTeamMemberAction called - backend integration needed");

    // Stub response for UI compatibility
    return {
      success: false,
      error: "Backend API integration required. Please implement DELETE /api/teams/members/:memberId endpoint.",
    };

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Verify user is team master
    // 3. Validate memberId exists in the team
    // 4. Delete member from database
    // 5. Return success message
  } catch (error) {
    log.error(
      "Error in removeTeamMemberAction",
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}

export async function createTeamForUserAction() {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: POST /api/teams
    // Body: { name? }
    // Response: { success, team }

    log.warn("createTeamForUserAction called - backend integration needed");

    // Stub response for UI compatibility
    return {
      success: false,
      error: "Backend API integration required. Please implement POST /api/teams endpoint.",
    };

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Create new team with user as master
    // 3. Add user to team_members table
    // 4. Return success with team data
  } catch (error) {
    log.error(
      "Error in createTeamForUserAction",
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create team",
    };
  }
}

export async function syncAllPlatformDataAction() {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: POST /api/sync/all-platforms
    // Response: { success, message, syncedData }

    log.warn("syncAllPlatformDataAction called - backend integration needed");

    return {
      success: false,
      error: "Backend API integration required. Please implement POST /api/sync/all-platforms endpoint.",
    };
  } catch (error) {
    log.error(
      "Error in syncAllPlatformDataAction",
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync data",
    };
  }
}
