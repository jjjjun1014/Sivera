/**
 * Permission and Role-Based Access Control (RBAC) Types
 *
 * 사용자 역할에 따른 기능 사용 제한 시스템
 */

export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export type Permission =
  // Workspace Management
  | 'workspace:delete'
  | 'workspace:update'
  | 'workspace:transfer-ownership'

  // Subscription & Billing
  | 'subscription:view'
  | 'subscription:change-plan'
  | 'subscription:cancel'
  | 'billing:view'
  | 'billing:update-payment'

  // Team Management
  | 'team:invite'
  | 'team:remove-member'
  | 'team:change-role'
  | 'team:view-members'

  // Ad Account Management
  | 'ad-account:connect'
  | 'ad-account:disconnect'
  | 'ad-account:view'

  // Campaign Management
  | 'campaign:create'
  | 'campaign:update'
  | 'campaign:delete'
  | 'campaign:view'

  // Analytics
  | 'analytics:view'
  | 'analytics:export'

  // Settings
  | 'settings:view'
  | 'settings:update';

/**
 * 각 역할별 권한 매핑
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    // Workspace
    'workspace:delete',
    'workspace:update',
    'workspace:transfer-ownership',

    // Subscription & Billing
    'subscription:view',
    'subscription:change-plan',
    'subscription:cancel',
    'billing:view',
    'billing:update-payment',

    // Team
    'team:invite',
    'team:remove-member',
    'team:change-role',
    'team:view-members',

    // Ad Account
    'ad-account:connect',
    'ad-account:disconnect',
    'ad-account:view',

    // Campaign
    'campaign:create',
    'campaign:update',
    'campaign:delete',
    'campaign:view',

    // Analytics
    'analytics:view',
    'analytics:export',

    // Settings
    'settings:view',
    'settings:update',
  ],

  admin: [
    // Workspace (제한적)
    'workspace:update',

    // Subscription & Billing (읽기만)
    'subscription:view',
    'billing:view',

    // Team
    'team:invite',
    'team:remove-member',
    'team:change-role', // owner 역할은 부여 불가
    'team:view-members',

    // Ad Account
    'ad-account:connect',
    'ad-account:disconnect',
    'ad-account:view',

    // Campaign
    'campaign:create',
    'campaign:update',
    'campaign:delete',
    'campaign:view',

    // Analytics
    'analytics:view',
    'analytics:export',

    // Settings
    'settings:view',
    'settings:update',
  ],

  member: [
    // Subscription & Billing (읽기만)
    'subscription:view',

    // Team (읽기만)
    'team:view-members',

    // Ad Account (읽기만)
    'ad-account:view',

    // Campaign (전체)
    'campaign:create',
    'campaign:update',
    'campaign:delete',
    'campaign:view',

    // Analytics
    'analytics:view',
    'analytics:export',

    // Settings (읽기만)
    'settings:view',
  ],

  viewer: [
    // Subscription (읽기만)
    'subscription:view',

    // Team (읽기만)
    'team:view-members',

    // Ad Account (읽기만)
    'ad-account:view',

    // Campaign (읽기만)
    'campaign:view',

    // Analytics (읽기만)
    'analytics:view',

    // Settings (읽기만)
    'settings:view',
  ],
};

/**
 * 역할 우선순위 (숫자가 높을수록 높은 권한)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
};

/**
 * 역할 한글 이름
 */
export const ROLE_LABELS: Record<Role, string> = {
  owner: '소유자',
  admin: '관리자',
  member: '멤버',
  viewer: '뷰어',
};

/**
 * 역할 설명
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: '모든 권한 보유. 워크스페이스 삭제 및 구독 관리 가능',
  admin: '대부분의 관리 권한 보유. 구독 변경은 불가',
  member: '캠페인 생성/수정/삭제 가능. 팀 및 구독 관리 불가',
  viewer: '읽기 전용. 모든 데이터 조회만 가능',
};
