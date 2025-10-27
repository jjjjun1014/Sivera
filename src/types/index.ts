/**
 * Core Type Exports
 *
 * This file exports all type definitions used across the application.
 * Backend API integration required for database types.
 */

// Re-export all type modules
export * from './subscription';
export * from './workspace';
export * from './permissions';
export * from './database.types';
export * from './platform-service.types';
export * from './campaign.types';
export * from './user';
export * from './notification';

// Re-export UI types from campaign.ts (excluding Campaign to avoid conflict)
export type {
  CampaignTableColumn,
  TopCampaign,
  AdGroup,
  Ad,
} from './campaign';
export { BUDGET_LOCKED_CAMPAIGN_TYPES, isBudgetEditable } from './campaign';

// Platform types - using campaign.types.ts Campaign
export type {
  PlatformKey,
  PlatformColors,
  CampaignStatus,
} from './campaign';

// Main Campaign type from campaign.types.ts (DB type)
export type { Campaign } from './campaign.types';

// Database types
export type {
  UserRole,
  Profile,
  Team,
  TeamMember,
  TeamMemberWithProfile,
  TeamInvitation,
  PlatformCredential,
  AcceptTeamInvitationResult,
} from './database.types';

// Platform service types
export type {
  PlatformType,
  CampaignMetrics,
} from './platform-service.types';

// TODO: Define database schema types based on your backend API
// Replace these with actual types from backend
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export const PLATFORM_KEYS = [
  'google-ads',
  'meta-ads',
  'amazon-ads',
  'tiktok-ads',
  'naver-ads',
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  'google-ads': '#4285F4',
  'meta-ads': '#1877F2',
  'amazon-ads': '#FF9900',
  'tiktok-ads': '#000000',
  'naver-ads': '#03C75A',
};
