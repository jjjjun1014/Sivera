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
  teamMembers: number | 'unlimited';
  adAccounts: number | 'unlimited';
  dataRetention: number | 'unlimited';  // days
  apiAccess: 'none' | 'read-only' | 'full';
  aiChatbot: boolean;
  apiWrite: boolean;
  prioritySupport?: boolean;
  customIntegrations?: boolean;
}

export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  description: string;
  priceUSD: number;  // USD per user per month
  priceKRW: number;  // KRW per user per month
  features: PlanFeatures;
  highlighted?: boolean;  // 추천 플랜 표시
}

export interface TeamSubscription {
  teamId: string;
  plan: PlanType;
  status: SubscriptionStatus;

  // 요금 계산
  currentSeats: number;  // 현재 활성 팀원 수
  monthlyTotalUSD: number;  // currentSeats * priceUSD
  monthlyTotalKRW: number;  // currentSeats * priceKRW

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
