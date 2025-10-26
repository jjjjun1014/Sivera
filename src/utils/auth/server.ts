import { cache } from "react";
import { cookies } from "next/headers";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";

// Cache the team ID retrieval to prevent duplicate queries
export const getTeamId = cache(async (): Promise<string | null> => {
  // TODO: Backend API Integration Required
  // Endpoint: GET /api/auth/me/team
  // Response: { teamId: string | null }

  // For now, return null
  return null;

  // TODO: The backend should handle:
  // 1. Get authenticated user from session/token
  // 2. Check for team_id in cookies first
  // 3. If not in cookies, fetch from database
  // 4. Return team_id or null
});

// Cache user role retrieval
export const getUserRole = cache(async (): Promise<string | null> => {
  // TODO: Backend API Integration Required
  // Endpoint: GET /api/auth/me/role
  // Response: { role: string | null }

  // For now, return null
  return null;

  // TODO: The backend should handle:
  // 1. Get authenticated user from session/token
  // 2. Get user's team_id
  // 3. Fetch user's role in that team
  // 4. Return role or null
});

// Cache user profile retrieval
export const getUserProfile = cache(async () => {
  // TODO: Backend API Integration Required
  // Endpoint: GET /api/auth/me/profile
  // Response: { profile: Profile | null }

  // For now, return null
  return null;

  // TODO: The backend should handle:
  // 1. Get authenticated user from session/token
  // 2. Fetch user's profile from database
  // 3. Return profile or null
});
