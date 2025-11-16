import { PLANS } from '@/lib/config/plans';
import type { PlanType } from '@/types/subscription';

/**
 * 구독 제한 체크 유틸리티
 * 
 * 이 파일은 모든 기능별 제한을 체크하는 중앙 집중식 로직을 제공합니다.
 * DB 조회는 여기서 하지 않고, 호출하는 쪽에서 현재 사용량을 전달받아 판단합니다.
 */

export interface SubscriptionLimits {
  planTier: PlanType;
  teamSize: number;
  currentAdAccounts: number;
  currentTeamMembers: number;
  dataRetentionDays: number | 'unlimited';
  apiAccess: 'none' | 'read-only' | 'full';
}

/**
 * 광고 계정 연결 가능 여부 확인
 */
export function canConnectAdAccount(limits: SubscriptionLimits): {
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number | 'unlimited';
} {
  const plan = PLANS[limits.planTier];
  const maxAccounts = plan.features.adAccounts;

  if (maxAccounts === 'unlimited') {
    return {
      allowed: true,
      current: limits.currentAdAccounts,
      limit: 'unlimited',
    };
  }

  const allowed = limits.currentAdAccounts < maxAccounts;

  return {
    allowed,
    reason: allowed ? undefined : `${plan.name} 플랜은 최대 ${maxAccounts}개의 광고 계정만 연결할 수 있습니다.`,
    current: limits.currentAdAccounts,
    limit: maxAccounts,
  };
}

/**
 * 플랫폼 중복 연결 체크
 * 각 브랜드는 플랫폼당 하나의 계정만 연결 가능
 */
export function canConnectPlatform(
  connectedPlatforms: string[], // 이미 연결된 플랫폼 목록 (예: ['google', 'facebook'])
  targetPlatform: string // 연결하려는 플랫폼 (예: 'google')
): {
  allowed: boolean;
  reason?: string;
} {
  const isAlreadyConnected = connectedPlatforms.includes(targetPlatform);

  return {
    allowed: !isAlreadyConnected,
    reason: isAlreadyConnected
      ? '이미 해당 플랫폼이 연동되어 있습니다. 브랜드당 하나의 플랫폼 계정만 연결할 수 있습니다.'
      : undefined,
  };
}

/**
 * 팀원 초대 가능 여부 확인
 */
export function canInviteTeamMember(limits: SubscriptionLimits): {
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
} {
  const plan = PLANS[limits.planTier];
  const maxMembers = limits.teamSize; // teamSize는 구독 시 설정한 인원 수

  const allowed = limits.currentTeamMembers < maxMembers;

  return {
    allowed,
    reason: allowed 
      ? undefined 
      : `현재 플랜에서는 최대 ${maxMembers}명의 팀원을 추가할 수 있습니다. 더 많은 팀원을 추가하려면 플랜을 업그레이드하세요.`,
    current: limits.currentTeamMembers,
    limit: maxMembers,
  };
}

/**
 * API 접근 권한 확인
 */
export function canAccessAPI(
  limits: SubscriptionLimits,
  method: 'read' | 'write'
): {
  allowed: boolean;
  reason?: string;
  currentAccess: 'none' | 'read-only' | 'full';
} {
  const plan = PLANS[limits.planTier];
  const apiAccess = plan.features.apiAccess;

  let allowed = false;

  if (apiAccess === 'full') {
    allowed = true;
  } else if (apiAccess === 'read-only' && method === 'read') {
    allowed = true;
  }

  return {
    allowed,
    reason: allowed
      ? undefined
      : method === 'write'
      ? 'API 쓰기 권한이 없습니다. Pro 플랜으로 업그레이드하세요.'
      : 'API 접근 권한이 없습니다. Standard 또는 Pro 플랜으로 업그레이드하세요.',
    currentAccess: apiAccess,
  };
}

/**
 * 데이터 조회 기간 확인
 */
export function canAccessDataRange(
  limits: SubscriptionLimits,
  requestedDaysBack: number
): {
  allowed: boolean;
  reason?: string;
  maxDaysBack: number | 'unlimited';
} {
  const plan = PLANS[limits.planTier];
  const retention = plan.features.dataRetention;

  if (retention === 'unlimited') {
    return {
      allowed: true,
      maxDaysBack: 'unlimited',
    };
  }

  const allowed = requestedDaysBack <= retention;

  return {
    allowed,
    reason: allowed
      ? undefined
      : `${plan.name} 플랜은 최근 ${retention}일 데이터만 조회할 수 있습니다. 더 오래된 데이터를 보려면 플랜을 업그레이드하세요.`,
    maxDaysBack: retention,
  };
}

/**
 * 팀 규모 증가 가능 여부 (플랜 내에서)
 */
export function canIncreaseTeamSize(
  limits: SubscriptionLimits,
  targetSize: number
): {
  allowed: boolean;
  reason?: string;
  currentSize: number;
  maxSize: number;
} {
  const plan = PLANS[limits.planTier];

  // Free 플랜은 1명 고정
  if (limits.planTier === 'free') {
    return {
      allowed: false,
      reason: 'Free 플랜은 1명만 사용할 수 있습니다. Standard 또는 Pro 플랜으로 업그레이드하세요.',
      currentSize: limits.teamSize,
      maxSize: 1,
    };
  }

  // 현재는 최대 50명까지 (TEAM_SIZE_TIERS의 마지막 tier)
  const MAX_TEAM_SIZE = 50;
  const allowed = targetSize <= MAX_TEAM_SIZE;

  return {
    allowed,
    reason: allowed
      ? undefined
      : `최대 ${MAX_TEAM_SIZE}명까지 추가할 수 있습니다. 더 많은 인원이 필요하시면 support@sivera.io로 문의하세요.`,
    currentSize: limits.teamSize,
    maxSize: MAX_TEAM_SIZE,
  };
}

/**
 * 모든 제한 사항 요약
 */
export function getSubscriptionSummary(limits: SubscriptionLimits) {
  const plan = PLANS[limits.planTier];

  return {
    plan: {
      name: plan.name,
      tier: limits.planTier,
    },
    limits: {
      adAccounts: {
        current: limits.currentAdAccounts,
        max: plan.features.adAccounts,
        canAdd: canConnectAdAccount(limits).allowed,
      },
      teamMembers: {
        current: limits.currentTeamMembers,
        max: limits.teamSize,
        canAdd: canInviteTeamMember(limits).allowed,
      },
      dataRetention: {
        days: plan.features.dataRetention,
      },
      api: {
        access: plan.features.apiAccess,
        canRead: canAccessAPI(limits, 'read').allowed,
        canWrite: canAccessAPI(limits, 'write').allowed,
      },
    },
  };
}

/**
 * 플랜 변경 시 잃게 되는 기능 확인
 */
export function getDowngradeLostFeatures(
  fromPlan: PlanType,
  toPlan: PlanType
): string[] {
  const fromFeatures = PLANS[fromPlan].features;
  const toFeatures = PLANS[toPlan].features;
  const lostFeatures: string[] = [];

  // 광고 계정 제한
  if (fromFeatures.adAccounts === 'unlimited' && toFeatures.adAccounts !== 'unlimited') {
    lostFeatures.push(`광고 계정 (무제한 → ${toFeatures.adAccounts}개)`);
  } else if (
    typeof fromFeatures.adAccounts === 'number' &&
    typeof toFeatures.adAccounts === 'number' &&
    fromFeatures.adAccounts > toFeatures.adAccounts
  ) {
    lostFeatures.push(`광고 계정 (${fromFeatures.adAccounts}개 → ${toFeatures.adAccounts}개)`);
  }

  // API 접근 권한
  if (fromFeatures.apiAccess === 'full' && toFeatures.apiAccess !== 'full') {
    lostFeatures.push('API 쓰기 권한');
  }
  if (fromFeatures.apiAccess !== 'none' && toFeatures.apiAccess === 'none') {
    lostFeatures.push('API 접근 권한');
  }

  // 데이터 보관
  if (
    fromFeatures.dataRetention === 'unlimited' &&
    toFeatures.dataRetention !== 'unlimited'
  ) {
    lostFeatures.push(`데이터 보관 (무제한 → ${toFeatures.dataRetention}일)`);
  }

  // 우선 지원
  if (fromFeatures.prioritySupport && !toFeatures.prioritySupport) {
    lostFeatures.push('우선 지원');
  }

  // 커스텀 연동
  if (fromFeatures.customIntegrations && !toFeatures.customIntegrations) {
    lostFeatures.push('커스텀 연동');
  }

  return lostFeatures;
}

/**
 * 업그레이드 시 얻게 되는 기능 확인
 */
export function getUpgradeGainedFeatures(
  fromPlan: PlanType,
  toPlan: PlanType
): string[] {
  const fromFeatures = PLANS[fromPlan].features;
  const toFeatures = PLANS[toPlan].features;
  const gainedFeatures: string[] = [];

  // 광고 계정 증가
  if (toFeatures.adAccounts === 'unlimited' && fromFeatures.adAccounts !== 'unlimited') {
    gainedFeatures.push('무제한 광고 계정 연결');
  } else if (
    typeof fromFeatures.adAccounts === 'number' &&
    typeof toFeatures.adAccounts === 'number' &&
    toFeatures.adAccounts > fromFeatures.adAccounts
  ) {
    gainedFeatures.push(`광고 계정 ${toFeatures.adAccounts}개`);
  }

  // API 접근 권한
  if (fromFeatures.apiAccess === 'none' && toFeatures.apiAccess !== 'none') {
    gainedFeatures.push('API 접근 권한');
  }
  if (fromFeatures.apiAccess === 'read-only' && toFeatures.apiAccess === 'full') {
    gainedFeatures.push('API 쓰기 권한');
  }

  // 데이터 보관
  if (
    fromFeatures.dataRetention !== 'unlimited' &&
    toFeatures.dataRetention === 'unlimited'
  ) {
    gainedFeatures.push('무제한 데이터 보관');
  }

  // 우선 지원
  if (!fromFeatures.prioritySupport && toFeatures.prioritySupport) {
    gainedFeatures.push('우선 지원');
  }

  // 커스텀 연동
  if (!fromFeatures.customIntegrations && toFeatures.customIntegrations) {
    gainedFeatures.push('커스텀 연동');
  }

  return gainedFeatures;
}
