/**
 * Database Types
 *
 * TODO: Backend API Integration Required
 * These types represent database entities and should be replaced with
 * actual types from your backend API schema.
 */

import { PlatformType } from "./platform-service.types";
import { CampaignMetrics } from "./campaign.types";

// User role type - matching string literals used in database
export type UserRole = "master" | "team_mate" | "viewer";

// Profile type (user profile from database)
export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Team type (from teams table)
export interface Team {
  id: string;
  name: string;
  master_user_id: string;
  created_at: string;
  updated_at?: string;
}

// Team member type (from team_members table)
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  invited_by: string | null;
  joined_at: string;
}

// Team member with profile (joined query result)
export interface TeamMemberWithProfile extends TeamMember {
  profiles: Profile | null;
}

// Team invitation type (from team_invitations table)
export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  token: string;
  status: "pending" | "accepted" | "declined" | "cancelled" | "expired";
  created_at: string;
  accepted_at?: string | null;
  expires_at: string;
  teams?: {
    id: string;
    name: string;
  };
  profiles?: Profile;
}

// Platform credential type (from platform_credentials table)
export interface PlatformCredential {
  id: string;
  team_id: string;
  platform: PlatformType;
  account_id?: string;
  credentials: Record<string, any>; // JSON field
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by: string;
  last_sync_at?: string | null;
}

// Result type for accepting team invitation
export interface AcceptTeamInvitationResult {
  success: boolean;
  team_id?: string;
  error?: string;
}
