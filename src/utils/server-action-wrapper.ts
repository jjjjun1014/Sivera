// TODO: Replace with backend API integration
// Previously: import { User } from "@supabase/supabase-js";
// Now using a minimal User type - should be replaced with backend API type
interface User {
  id: string;
  email?: string;
}

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import { UserRole } from "@/types";
import log from "@/utils/logger";

interface ActionContext {
  user: User;
  supabase: any; // TODO: Replace with backend API client type
  teamId?: string;
  teamRole?: UserRole;
}

interface ActionOptions {
  requiredRole?: UserRole | UserRole[];
  teamId?: string;
}

export async function withAuth<T>(
  action: (context: ActionContext) => Promise<T>,
  options: ActionOptions = {},
): Promise<T> {
  try {
    // TODO: Backend API Integration Required
    // Endpoint: GET /api/auth/me
    // Response: { user: User }

    log.warn("withAuth called - backend integration needed");

    // Stub - throw error
    throw new Error("Backend API integration required. Please implement GET /api/auth/me endpoint.");

    // TODO: The backend should handle:
    // 1. Get authenticated user from session/token
    // 2. If teamId and requiredRole specified, verify team access and role
    // 3. Execute the action with context
    // 4. Return result
  } catch (error) {
    log.error("Server action failed", error);
    throw error;
  }
}

// Helper function for actions that don't require specific team permissions
export async function withUser<T>(
  action: (context: {
    user: User;
    supabase: ActionContext["supabase"];
  }) => Promise<T>,
): Promise<T> {
  return withAuth(({ user, supabase }) => action({ user, supabase }));
}

// Helper function for viewer-accessible actions
export async function withViewer<T>(
  teamId: string,
  action: (context: ActionContext) => Promise<T>,
): Promise<T> {
  return withAuth(action, {
    teamId,
    requiredRole: ["master", "team_mate", "viewer"],
  });
}

// Helper function for team mate actions
export async function withTeamMate<T>(
  teamId: string,
  action: (context: ActionContext) => Promise<T>,
): Promise<T> {
  return withAuth(action, {
    teamId,
    requiredRole: ["master", "team_mate"],
  });
}

// Helper function for master-only actions
export async function withMaster<T>(
  teamId: string,
  action: (context: ActionContext) => Promise<T>,
): Promise<T> {
  return withAuth(action, {
    teamId,
    requiredRole: ["master"],
  });
}
