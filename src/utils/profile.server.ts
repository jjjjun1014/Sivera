// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/types";
import log from "@/utils/logger";

export async function getProfileServer(
  userId: string,
): Promise<Profile | null> {
  // TODO: Backend API Integration Required
  // Endpoint: GET /api/profiles/:userId
  // Response: { profile: Profile | null }

  log.warn("getProfileServer called - backend integration needed", { userId });

  // Stub response
  return null;

  // TODO: The backend should handle:
  // 1. Fetch profile from database by user ID
  // 2. Return profile data or null
}

export async function updateProfileServer(
  userId: string,
  updates: Partial<Profile>,
) {
  // TODO: Backend API Integration Required
  // Endpoint: PATCH /api/profiles/:userId
  // Body: updates (Partial<Profile>)
  // Response: { profile: Profile }

  log.warn("updateProfileServer called - backend integration needed", { userId, updates });

  // Stub response - throw error
  throw new Error("Backend API integration required. Please implement PATCH /api/profiles/:userId endpoint.");

  // TODO: The backend should handle:
  // 1. Update profile in database
  // 2. Return updated profile data
}
