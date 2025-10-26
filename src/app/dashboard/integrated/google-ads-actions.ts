"use server";

import { redirect } from "next/navigation";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import log from "@/utils/logger";

export async function startGoogleAdsAuth(lang: string = "en") {
  // TODO: Backend API Integration Required
  // Endpoint: POST /api/integrations/google-ads/auth/start
  // Body: { lang }
  // Response: { authUrl }

  log.warn("startGoogleAdsAuth called - backend integration needed");

  // Redirect to error page since OAuth flow needs backend implementation
  redirect(`/${lang}/integrated?error=auth_not_implemented&platform=google`);

  // TODO: The backend should handle:
  // 1. Get authenticated user from session/token
  // 2. Get user's team
  // 3. Generate OAuth state with team_id and user_id
  // 4. Create OAuth authorization URL
  // 5. Return authUrl to redirect to
}

export async function disconnectGoogleAds() {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: DELETE /api/integrations/google-ads
    // Response: { success }

    log.warn("disconnectGoogleAds called - backend integration needed");

    // Stub response for UI compatibility
    throw new Error("Backend API integration required. Please implement DELETE /api/integrations/google-ads endpoint.");

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. Get user's team
    // 3. Deactivate Google Ads credentials for the team
    // 4. Return success status
  } catch (error) {
    log.error("Failed to disconnect Google Ads", error as Error);
    throw error;
  }
}
