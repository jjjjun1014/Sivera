import type { PlanType, SubscriptionPlan } from '@/types/subscription';

/**
 * Subscription Plans Configuration
 */
export const PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    type: 'free',
    name: 'Free',
    description: '개인 사용자를 위한 기본 플랜',
    priceUSD: 0,
    priceKRW: 0,
    features: {
      teamMembers: 1,
      adAccounts: 1,
      dataRetention: 7,
      apiAccess: 'none',
      aiChatbot: false,
      apiWrite: false,
    },
  },

  standard: {
    type: 'standard',
    name: 'Standard',
    description: '팀 협업과 AI 기능을 원하는 사용자',
    priceUSD: 19.99,
    priceKRW: 26000,  // 약 26,000원
    highlighted: true,  // 추천 플랜
    features: {
      teamMembers: 'unlimited',
      adAccounts: 'unlimited',
      dataRetention: 'unlimited',
      apiAccess: 'read-only',
      aiChatbot: true,
      apiWrite: false,
    },
  },

  pro: {
    type: 'pro',
    name: 'Pro',
    description: '모든 기능을 사용하는 전문가',
    priceUSD: 69.99,
    priceKRW: 91000,  // 약 91,000원
    features: {
      teamMembers: 'unlimited',
      adAccounts: 'unlimited',
      dataRetention: 'unlimited',
      apiAccess: 'full',
      aiChatbot: true,
      apiWrite: true,
      prioritySupport: true,
      customIntegrations: true,
    },
  },
};

/**
 * Plan feature descriptions for display
 */
export const PLAN_FEATURE_DESCRIPTIONS = {
  free: [
    '1명만 사용 가능',
    '광고 계정 1개 연결',
    '7일 데이터 조회',
    'AI 챗봇 사용 불가',
    'API 접근 불가',
  ],
  standard: [
    '무제한 팀원 추가',
    '무제한 광고 계정 연결',
    '전체 데이터 조회',
    'AI 챗봇 사용 가능',
    'API 읽기 전용',
    '이메일 지원',
  ],
  pro: [
    '무제한 팀원 추가',
    '무제한 광고 계정 연결',
    '전체 데이터 조회',
    'AI 챗봇 사용 가능',
    'API 읽기/쓰기 모두 가능',
    '우선 지원',
    '커스텀 연동 지원',
  ],
} as const;

/**
 * Helper functions
 */
export function getPlan(type: PlanType): SubscriptionPlan {
  return PLANS[type];
}

export function getMonthlyPrice(planType: PlanType, seats: number, currency: 'USD' | 'KRW' = 'USD'): number {
  const plan = PLANS[planType];
  const price = currency === 'USD' ? plan.priceUSD : plan.priceKRW;
  return price * seats;
}

export function canAddTeamMember(planType: PlanType, currentMembers: number): boolean {
  const plan = PLANS[planType];
  if (plan.features.teamMembers === 'unlimited') return true;
  return currentMembers < plan.features.teamMembers;
}

export function canConnectAdAccount(planType: PlanType, currentAccounts: number): boolean {
  const plan = PLANS[planType];
  if (plan.features.adAccounts === 'unlimited') return true;
  return currentAccounts < plan.features.adAccounts;
}

export function canAccessAPI(planType: PlanType, method: 'read' | 'write'): boolean {
  const plan = PLANS[planType];
  if (plan.features.apiAccess === 'none') return false;
  if (plan.features.apiAccess === 'read-only' && method === 'write') return false;
  return true;
}

export function canUseAI(planType: PlanType): boolean {
  return PLANS[planType].features.aiChatbot;
}

export function getDataRetentionDays(planType: PlanType): number | null {
  const retention = PLANS[planType].features.dataRetention;
  return retention === 'unlimited' ? null : retention;
}
