/**
 * Platform Credential Service
 * 
 * 플랫폼 연동 및 OAuth 관리
 */

import { list, get, create, update, remove, query } from './graphql.service';
import type { PlatformCredential, OauthState } from '@/types/amplify';

// ===================================================================
// Platform Credential CRUD
// ===================================================================

/**
 * 플랫폼 인증 정보 생성
 */
export async function createPlatformCredential(data: {
  teamID: string;
  platform: PlatformCredential['platform'];
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  createdByID: string;
  isActive?: boolean;
}) {
  return create<PlatformCredential>('PlatformCredential', {
    data: {
      ...data,
      isActive: data.isActive ?? true,
    },
  });
}

/**
 * 플랫폼 인증 정보 조회
 */
export async function getPlatformCredential(id: string) {
  return get<PlatformCredential>('PlatformCredential', { id });
}

/**
 * 팀의 플랫폼 인증 정보 목록 조회
 */
export async function listPlatformCredentials(teamId: string) {
  return query<PlatformCredential>('PlatformCredential', 'byTeamID', {
    teamID: teamId,
  });
}

/**
 * 특정 플랫폼의 활성 인증 정보 조회
 */
export async function getActivePlatformCredential(
  teamId: string,
  platform: PlatformCredential['platform']
) {
  const result = await query<PlatformCredential>('PlatformCredential', 'byTeamID', {
    teamID: teamId,
  });

  const activeCredential = result.data?.find(
    (cred) => cred.platform === platform && cred.isActive
  );

  return {
    data: activeCredential || null,
    error: result.error,
  };
}

/**
 * 플랫폼 인증 정보 업데이트
 */
export async function updatePlatformCredential(
  id: string,
  data: {
    accountName?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
    isActive?: boolean;
    lastSyncAt?: string;
  }
) {
  return update<PlatformCredential>('PlatformCredential', { id, data });
}

/**
 * 플랫폼 인증 정보 비활성화
 */
export async function deactivatePlatformCredential(id: string) {
  return updatePlatformCredential(id, { isActive: false });
}

/**
 * 플랫폼 인증 정보 삭제
 */
export async function deletePlatformCredential(id: string) {
  return remove('PlatformCredential', { id });
}

// ===================================================================
// OAuth State 관리
// ===================================================================

/**
 * OAuth State 생성
 */
export async function createOAuthState(data: {
  state: string;
  platform: OauthState['platform'];
  userID: string;
  teamID: string;
  expiresAt?: string;
}) {
  // 기본 만료 시간: 10분
  const expiresAt =
    data.expiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString();

  return create<OauthState>('OauthState', {
    data: {
      ...data,
      expiresAt,
    },
  });
}

/**
 * OAuth State 조회 및 검증
 */
export async function verifyOAuthState(state: string) {
  const result = await list<OauthState>('OauthState', {
    filter: { state: { eq: state } },
    limit: 1,
  });

  const oauthState = result.data?.[0];

  if (!oauthState) {
    return { valid: false, error: 'Invalid state' };
  }

  if (new Date(oauthState.expiresAt) < new Date()) {
    return { valid: false, error: 'State expired' };
  }

  return { valid: true, data: oauthState };
}

/**
 * OAuth State 사용 처리
 */
export async function markOAuthStateUsed(id: string) {
  // OauthState에 used 필드가 없으므로 삭제로 대체
  return remove('OauthState', { id });
}

// ===================================================================
// 토큰 갱신
// ===================================================================

/**
 * 만료된 토큰 확인
 */
export async function getExpiredCredentials(teamId: string) {
  const result = await listPlatformCredentials(teamId);

  if (!result.data) return { data: [], error: result.error };

  const now = new Date();
  const expiredCredentials = result.data.filter((cred) => {
    if (!cred.expiresAt || !cred.isActive) return false;
    return new Date(cred.expiresAt) < now;
  });

  return {
    data: expiredCredentials,
    error: null,
  };
}

/**
 * 토큰 갱신 (백엔드 Lambda 호출)
 */
export async function refreshPlatformToken(credentialId: string) {
  // 백엔드의 refresh-oauth-tokens Lambda 호출
  // Amplify Gen 2 custom mutation 사용
  try {
    // TODO: 백엔드에서 refreshOAuthToken mutation 구현 확인 필요
    // const result = await client.mutations.refreshOAuthToken({ credentialId });
    
    console.warn('refreshPlatformToken: Not implemented yet');
    return { success: false, error: 'Not implemented' };
  } catch (error) {
    console.error('Error refreshing platform token:', error);
    return { success: false, error };
  }
}

// ===================================================================
// OAuth URL 생성
// ===================================================================

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
}

/**
 * OAuth 인증 URL 생성
 */
export function generateOAuthUrl(
  platform: PlatformCredential['platform'],
  state: string,
  config: OAuthConfig
): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Google Ads OAuth URL
 */
export function getGoogleAdsOAuthUrl(state: string, redirectUri: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  return generateOAuthUrl('google', state, {
    clientId,
    redirectUri,
    scopes: ['https://www.googleapis.com/auth/adwords'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  });
}

/**
 * Meta (Facebook) Ads OAuth URL
 */
export function getMetaAdsOAuthUrl(state: string, redirectUri: string): string {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID || '';
  
  return generateOAuthUrl('facebook', state, {
    clientId: appId,
    redirectUri,
    scopes: ['ads_read', 'ads_management'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  });
}

/**
 * Amazon Ads OAuth URL
 */
export function getAmazonAdsOAuthUrl(state: string, redirectUri: string): string {
  const clientId = process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID || '';
  
  return generateOAuthUrl('amazon', state, {
    clientId,
    redirectUri,
    scopes: ['advertising::campaign_management'],
    authUrl: 'https://www.amazon.com/ap/oa',
  });
}

/**
 * TikTok Ads OAuth URL
 */
export function getTikTokAdsOAuthUrl(state: string, redirectUri: string): string {
  const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID || '';
  
  return generateOAuthUrl('tiktok', state, {
    clientId: appId,
    redirectUri,
    scopes: ['advertiser.read', 'campaign.read'],
    authUrl: 'https://business-api.tiktok.com/portal/auth',
  });
}
