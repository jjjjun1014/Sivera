/**
 * User Service
 * 
 * 사용자 관리 서비스
 */

import { get, create, update, list } from './graphql.service';
import type { User } from '@/types/amplify';
import { authGetCurrentUser } from './auth.service';

// ===================================================================
// User CRUD
// ===================================================================

/**
 * 사용자 생성 (회원가입 시 자동 호출됨)
 */
export async function createUser(data: {
  id: string; // Cognito User ID
  email: string;
  fullName?: string;
  avatarUrl?: string;
}) {
  console.log('📝 Creating user in DB:', data);
  const result = await create<User>('User', { data });
  console.log('📝 Create user result:', result);
  if (result.error) {
    console.error('❌ Create user error details:', result.error);
  }
  return result;
}

/**
 * 사용자 조회
 */
export async function getUser(id: string) {
  return get<User>('User', { id });
}

/**
 * 사용자 업데이트
 */
export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'fullName' | 'avatarUrl'>>
) {
  return update<User>('User', { id, data });
}

/**
 * 현재 로그인한 사용자 정보 조회
 */
export async function getCurrentUser() {
  const authUser = await authGetCurrentUser();
  if (!authUser) {
    return { data: null, error: 'Not authenticated' };
  }

  return getUser(authUser.userId);
}

/**
 * 이메일로 사용자 조회
 */
export async function getUserByEmail(email: string) {
  const result = await list<User>('User', {
    filter: { email: { eq: email } },
    limit: 1,
  });

  return {
    data: result.data[0] || null,
    error: result.error,
  };
}

// ===================================================================
// User 프로필
// ===================================================================

/**
 * 프로필 업데이트
 */
export async function updateProfile(data: {
  fullName?: string;
  avatarUrl?: string;
}) {
  const authUser = await authGetCurrentUser();
  if (!authUser) {
    return { data: null, error: 'Not authenticated' };
  }

  return updateUser(authUser.userId, data);
}

/**
 * 아바타 URL 업데이트
 */
export async function updateAvatar(avatarUrl: string) {
  return updateProfile({ avatarUrl });
}
