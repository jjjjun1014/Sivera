/**
 * Amplify Schema Types
 * 
 * amplify_outputs.json의 model_introspection에서 자동 생성된 타입
 */

import type amplifyOutputs from '@/../../amplify_outputs.json';

// Amplify Gen 2 Schema 타입
export type Schema = {
  User: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  Team: {
    id: string;
    masterUserID: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  TeamMember: {
    id: string;
    teamID: string;
    userID: string;
    role: 'master' | 'team_mate' | 'viewer';
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  TeamInvitation: {
    id: string;
    teamID: string;
    email: string;
    role: 'master' | 'team_mate' | 'viewer';
    status: 'pending' | 'accepted' | 'expired' | 'cancelled';
    invitedByID: string;
    expiresAt: string;
    acceptedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  PlatformCredential: {
    id: string;
    teamID: string;
    platform: 'facebook' | 'google' | 'kakao' | 'naver' | 'coupang' | 'amazon' | 'tiktok';
    accountId: string;
    accountName: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
    isActive: boolean;
    lastSyncAt?: string;
    createdByID: string;
    createdAt: string;
    updatedAt: string;
  };
  Campaign: {
    id: string;
    teamID: string;
    credentialID: string;
    externalCampaignId: string;
    name: string;
    status?: string;
    budget?: number;
    currency?: string;
    startDate?: string;
    endDate?: string;
    objective?: string;
    platform: 'facebook' | 'google' | 'kakao' | 'naver' | 'coupang' | 'amazon' | 'tiktok';
    createdAt: string;
    updatedAt: string;
  };
  CampaignMetric: {
    id: string;
    campaignID: string;
    date: string;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spend?: number;
    revenue?: number;
    ctr?: number;
    cpc?: number;
    cpm?: number;
    roas?: number;
    createdAt: string;
    updatedAt: string;
  };
  ManualCampaign: {
    id: string;
    teamID: string;
    platform: 'facebook' | 'google' | 'kakao' | 'naver' | 'coupang' | 'amazon' | 'tiktok';
    name: string;
    status?: string;
    budget?: number;
    currency?: string;
    startDate?: string;
    endDate?: string;
    objective?: string;
    notes?: string;
    createdByID: string;
    createdAt: string;
    updatedAt: string;
  };
  ManualCampaignMetric: {
    id: string;
    manualCampaignID: string;
    date: string;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spend?: number;
    revenue?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  };
  SyncLog: {
    id: string;
    credentialID: string;
    syncType: 'FULL' | 'INCREMENTAL';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    recordsProcessed?: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  OauthState: {
    id: string;
    state: string;
    platform: 'facebook' | 'google' | 'kakao' | 'naver' | 'coupang' | 'amazon' | 'tiktok';
    userID: string;
    teamID: string;
    used: boolean;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
  ActivityLog: {
    id: string;
    teamID: string;
    userID: string;
    action: string;
    resourceType: string;
    resourceID: string;
    metadata?: string;
    createdAt: string;
  };
};

// Amplify outputs 타입
export type AmplifyOutputs = typeof amplifyOutputs;
