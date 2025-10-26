"use server";

import { revalidatePath } from "next/cache";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import {
  getProfileServer,
  updateProfileServer as updateProfileUtil,
} from "@/utils/profile.server";
import log from "@/utils/logger";

export async function getProfileData() {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: GET /api/profile
    // Response: { user, profile }

    log.warn("getProfileData called - backend integration needed");

    // Stub response for UI compatibility
    throw new Error("Backend API integration required. Please implement GET /api/profile endpoint.");

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Fetch user profile from database
    // 3. Create profile if it doesn't exist
    // 4. Return user and profile data
  } catch (error) {
    log.error("Failed to get profile data", error as Error, {
      module: "profile/actions",
      action: "getProfileData",
    });
    throw error;
  }
}

export async function updateProfileAction(formData: FormData) {
  "use server";

  try {
    // TODO: Backend API Integration Required
    // Endpoint: PATCH /api/profile
    // Body: { full_name }
    // Response: { success, message }

    const fullName = formData.get("full_name") as string;

    log.warn("updateProfileAction called - backend integration needed", { fullName });

    // Stub response for UI compatibility
    return {
      success: false,
      message: "Backend API integration required. Please implement PATCH /api/profile endpoint.",
    };

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Update user profile in database
    // 3. Return success message
  } catch (error) {
    log.error("Failed to update profile", error as Error, {
      module: "profile/actions",
      action: "updateProfileAction",
    });

    return {
      success: false,
      message: "프로필 업데이트 중 오류가 발생했습니다.",
    };
  }
}

export async function updateAvatarAction(avatarUrl: string | null) {
  "use server";

  try {
    // TODO: Backend API Integration Required
    // Endpoint: PATCH /api/profile/avatar
    // Body: { avatar_url }
    // Response: { success }

    log.warn("updateAvatarAction called - backend integration needed", { avatarUrl });

    // Stub response for UI compatibility
    return {
      success: false,
    };

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Update avatar_url in user profile
    // 3. Return success status
  } catch (error) {
    log.error("Failed to update avatar", error as Error, {
      module: "profile/actions",
      action: "updateAvatarAction",
    });

    return { success: false };
  }
}
