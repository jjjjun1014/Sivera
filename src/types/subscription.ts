/**
 * Subscription & Billing Types
 */

export type PlanType = 'free' | 'standard' | 'pro';

export type SubscriptionStatus =
  | 'active'      // 정상 구독 중
  | 'trialing'    // 무료 체험 중
  | 'past_due'    // 결제 실패
  | 'cancelled'   // 취소됨
  | 'paused';     // 일시정지

export interface PlanFeatures {
  adAccounts: number | 'unlimited';
  dataRetention: number | 'unlimited';  // days (3 = 3일, 'unlimited' = 무제한)
  apiAccess: 'none' | 'read-only' | 'full';
  apiWrite: boolean;
  prioritySupport?: boolean;
  customIntegrations?: boolean;
}

/**
 * 팀 규모 티어 - 언제든지 추가/수정 가능
 */
export interface TeamSizeTier {
  id: string;
  name: string;
  minSeats: number;
  maxSeats: number;
  priceUSD: number;  // 이 구간의 추가 비용 (USD/월)
  priceKRW: number;  // 이 구간의 추가 비용 (KRW/월)
}

/**
 * 구독 플랜 - 기본 기능만 정의
 */
export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  description: string;
  basePriceUSD: number;  // 기본 요금 (USD/월)
  basePriceKRW: number;  // 기본 요금 (KRW/월)
  baseTeamSize: number;  // 기본 포함 인원 수
  features: PlanFeatures;
  highlighted?: boolean;  // 추천 플랜 표시
}

export interface TeamSubscription {
  teamId: string;
  plan: PlanType;
  status: SubscriptionStatus;

  // 요금 계산
  currentSeats: number;  // 현재 활성 팀원 수
  teamSizeTierId: string;  // 현재 적용된 팀 규모 티어 ID
  monthlyTotalUSD: number;  // basePriceUSD + teamSizeTier price
  monthlyTotalKRW: number;  // basePriceKRW + teamSizeTier price

  // 결제 정보
  billing: {
    customerId: string;  // 토스페이먼츠 고객 ID
    billingKey?: string; // 자동결제 키
    paymentMethod?: PaymentMethod;
    nextBillingDate: Date;
  };

  // 구독 기간
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;

  // 체험 기간
  trialStart?: Date;
  trialEnd?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  type: 'card';
  last4: string;
  brand: string;  // 'visa', 'mastercard', etc.
  expiryMonth: number;
  expiryYear: number;
}

export interface BillingHistory {
  id: string;
  teamId: string;
  amount: number;
  currency: 'USD' | 'KRW';
  status: 'paid' | 'failed' | 'refunded';
  invoiceUrl?: string;
  paidAt?: Date;
  createdAt: Date;
}
