/**
 * Amplify Backend Types
 * 
 * amplify_outputs.json의 model_introspection을 기반으로 한 타입 정의
 */

import type outputs from '@/../../amplify_outputs.json';

// 백엔드 스키마 타입
export type AmplifyOutputs = typeof outputs;
export type ModelIntrospection = AmplifyOutputs['data']['model_introspection'];

// Enum 타입들
export type PlatformType = 'facebook' | 'google' | 'kakao' | 'naver' | 'coupang' | 'amazon' | 'tiktok';
export type UserRole = 'master' | 'team_mate' | 'viewer';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';
export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type SyncType = 'FULL' | 'INCREMENTAL';

// 모델 타입들 (백엔드 스키마와 정확히 매칭)
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  masterUserID: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  teamID: string;
  userID: string;
  role: UserRole;
  invitedBy?: string;
  joinedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamInvitation {
  id: string;
  teamID: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  status: InvitationStatus;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformCredential {
  id: string;
  teamID: string;
  platform: PlatformType;
  accountId: string;
  accountName?: string;
  credentials?: Record<string, any>;
  data?: Record<string, any>;
  isActive?: boolean;
  createdBy: string;
  lastSyncedAt?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  teamID: string;
  platform: PlatformType;
  platformCampaignId: string;
  platformCredentialID: string;
  name: string;
  status?: string;
  budget?: number;
  isActive?: boolean;
  rawData?: Record<string, any>;
  syncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignMetric {
  id: string;
  campaignID: string;
  date: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  cost?: number;
  spend?: number;
  revenue?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  roas?: number;
  rawData?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ManualCampaign {
  id: string;
  teamID: string;
  platform: string;
  externalId: string;
  name: string;
  status: string;
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  lastUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ManualCampaignMetric {
  id: string;
  manualCampaignID: string;
  date: string;
  impressions?: number;
  clicks?: number;
  spent?: number;
  conversions?: number;
  revenue?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncLog {
  id: string;
  teamID: string;
  platform: PlatformType;
  syncType: SyncType;
  startedAt: string;
  completedAt?: string;
  lastSyncAt?: string;
  recordsProcessed?: number;
  successCount?: number;
  errorCount?: number;
  errorMessage?: string;
  status: SyncStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OauthState {
  id: string;
  userID: string;
  teamID: string;
  state: string;
  platform: string;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy?: string;
  details?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ListResponse<T> {
  data: T[];
  nextToken?: string;
}

// Custom Mutation 타입
export interface AcceptInvitationInput {
  token: string;
}

export interface RefreshOAuthTokenInput {
  credentialId: string;
}
