import type { PlanType, SubscriptionPlan, TeamSizeTier } from '@/types/subscription';

/**
 * 팀 규모 티어 설정
 * - 여기서 인원 구간과 추가 금액을 자유롭게 설정 가능
 * - 언제든지 티어 추가/수정/삭제 가능
 */
export const TEAM_SIZE_TIERS: TeamSizeTier[] = [
  {
    id: 'tier-1',
    name: '1-5명',
    minSeats: 1,
    maxSeats: 5,
    priceUSD: 0,  // 기본 포함 (추가 비용 없음)
    priceKRW: 0,
  },
  {
    id: 'tier-2',
    name: '6-15명',
    minSeats: 6,
    maxSeats: 15,
    priceUSD: 99,  // 월 $99 추가
    priceKRW: 129000,  // 월 ₩129,000 추가
  },
  {
    id: 'tier-3',
    name: '16-30명',
    minSeats: 16,
    maxSeats: 30,
    priceUSD: 199,  // 월 $199 추가
    priceKRW: 259000,  // 월 ₩259,000 추가
  },
  {
    id: 'tier-4',
    name: '31-50명',
    minSeats: 31,
    maxSeats: 50,
    priceUSD: 399,  // 월 $399 추가
    priceKRW: 519000,  // 월 ₩519,000 추가
  },
];

/**
 * 구독 플랜 설정
 * - 여기서 플랜별 기본 가격과 기능을 설정
 * - 기본 팀 인원은 1-5명으로 고정 (tier-1)
 */
export const PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    type: 'free',
    name: 'Free',
    description: '개인 사용자를 위한 기본 플랜',
    basePriceUSD: 0,
    basePriceKRW: 0,
    baseTeamSize: 1,  // Free는 1명만
    features: {
      adAccounts: 1,
      dataRetention: 3,  // 3일 데이터만
      apiAccess: 'none',
      aiChatbot: false,
      apiWrite: false,
    },
  },

  standard: {
    type: 'standard',
    name: 'Standard',
    description: 'API 읽기와 AI 기능을 원하는 팀',
    basePriceUSD: 99,  // 기본 $99/월 (1-5명 포함)
    basePriceKRW: 129000,  // 기본 ₩129,000/월 (1-5명 포함)
    baseTeamSize: 5,
    highlighted: true,
    features: {
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
    description: 'API 읽기/쓰기와 모든 기능을 사용하는 팀',
    basePriceUSD: 299,  // 기본 $299/월 (1-5명 포함)
    basePriceKRW: 389000,  // 기본 ₩389,000/월 (1-5명 포함)
    baseTeamSize: 5,
    features: {
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
 * 플랜별 기능 설명 (UI 표시용)
 */
export const PLAN_FEATURE_DESCRIPTIONS = {
  free: [
    '1명만 사용 가능',
    '광고 계정 1개 연결',
    '3일 데이터만 조회',
    'AI 챗봇 사용 불가',
    'API 접근 불가',
  ],
  standard: [
    '1-5명 기본 포함 (추가 인원은 별도 요금)',
    '무제한 광고 계정 연결',
    '무제한 데이터 조회',
    'AI 챗봇 사용 가능',
    'API 읽기 전용',
    '이메일 지원',
  ],
  pro: [
    '1-5명 기본 포함 (추가 인원은 별도 요금)',
    '무제한 광고 계정 연결',
    '무제한 데이터 조회',
    'AI 챗봇 사용 가능',
    'API 읽기/쓰기 모두 가능',
    '우선 지원',
    '커스텀 연동 지원',
  ],
} as const;

/**
 * Helper Functions
 */

/**
 * 플랜 정보 가져오기
 */
export function getPlan(type: PlanType): SubscriptionPlan {
  return PLANS[type];
}

/**
 * 팀원 수에 맞는 팀 규모 티어 찾기
 */
export function getTeamSizeTier(seats: number): TeamSizeTier {
  const tier = TEAM_SIZE_TIERS.find(
    (t) => seats >= t.minSeats && seats <= t.maxSeats
  );

  if (!tier) {
    // 최대 티어를 초과하면 마지막 티어 반환
    return TEAM_SIZE_TIERS[TEAM_SIZE_TIERS.length - 1];
  }

  return tier;
}

/**
 * 월 요금 계산 (기본 요금 + 팀 규모 추가 요금)
 */
export function getMonthlyPrice(
  planType: PlanType,
  seats: number,
  currency: 'USD' | 'KRW' = 'USD'
): number {
  const plan = PLANS[planType];
  const tier = getTeamSizeTier(seats);

  const basePrice = currency === 'USD' ? plan.basePriceUSD : plan.basePriceKRW;
  const tierPrice = currency === 'USD' ? tier.priceUSD : tier.priceKRW;

  return basePrice + tierPrice;
}

/**
 * 가격 비교 - 다른 플랜/인원으로 변경 시 예상 금액
 */
export function getPriceComparison(
  fromPlan: PlanType,
  fromSeats: number,
  toPlan: PlanType,
  toSeats: number,
  currency: 'USD' | 'KRW' = 'USD'
) {
  const currentPrice = getMonthlyPrice(fromPlan, fromSeats, currency);
  const newPrice = getMonthlyPrice(toPlan, toSeats, currency);
  const difference = newPrice - currentPrice;

  return {
    currentPrice,
    newPrice,
    difference,
    percentChange: currentPrice > 0 ? (difference / currentPrice) * 100 : 0,
  };
}

/**
 * 팀원 추가 가능 여부 확인
 */
export function canAddTeamMember(planType: PlanType, currentSeats: number): boolean {
  const plan = PLANS[planType];

  // Free 플랜은 1명만
  if (planType === 'free') {
    return currentSeats < plan.baseTeamSize;
  }

  // 다른 플랜은 최대 티어까지 가능
  const maxTier = TEAM_SIZE_TIERS[TEAM_SIZE_TIERS.length - 1];
  return currentSeats < maxTier.maxSeats;
}

/**
 * 광고 계정 연결 가능 여부 확인
 */
export function canConnectAdAccount(planType: PlanType, currentAccounts: number): boolean {
  const plan = PLANS[planType];
  if (plan.features.adAccounts === 'unlimited') return true;
  return currentAccounts < plan.features.adAccounts;
}

/**
 * API 접근 권한 확인
 */
export function canAccessAPI(planType: PlanType, method: 'read' | 'write'): boolean {
  const plan = PLANS[planType];
  if (plan.features.apiAccess === 'none') return false;
  if (plan.features.apiAccess === 'read-only' && method === 'write') return false;
  return true;
}

/**
 * AI 챗봇 사용 가능 여부
 */
export function canUseAI(planType: PlanType): boolean {
  return PLANS[planType].features.aiChatbot;
}

/**
 * 데이터 보관 기간 가져오기 (일 수)
 */
export function getDataRetentionDays(planType: PlanType): number | null {
  const retention = PLANS[planType].features.dataRetention;
  return retention === 'unlimited' ? null : retention;
}

/**
 * 다음 팀 규모 티어 정보 가져오기 (업그레이드 안내용)
 */
export function getNextTeamSizeTier(currentSeats: number): TeamSizeTier | null {
  const currentTier = getTeamSizeTier(currentSeats);
  const currentIndex = TEAM_SIZE_TIERS.findIndex((t) => t.id === currentTier.id);

  if (currentIndex === -1 || currentIndex === TEAM_SIZE_TIERS.length - 1) {
    return null;  // 마지막 티어이면 다음 티어 없음
  }

  return TEAM_SIZE_TIERS[currentIndex + 1];
}

/**
 * 가격 포매팅 함수
 */
export function formatPrice(amount: number, currency: 'USD' | 'KRW'): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  } else {
    return `₩${amount.toLocaleString('ko-KR')}`;
  }
}
