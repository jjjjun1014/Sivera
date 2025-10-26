/**
 * Workspace Types
 *
 * 여러 브랜드/광고 계정을 관리하기 위한 작업공간 시스템
 */

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface AdAccountConnection {
  id: string;
  workspaceId: string;
  platform: 'google-ads' | 'meta-ads' | 'tiktok-ads' | 'amazon-ads';
  accountId: string;
  accountName: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  status: 'active' | 'error' | 'disconnected';
  connectedBy: string;
  connectedAt: Date;
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  logoUrl?: string;
}
