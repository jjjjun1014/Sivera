/**
 * PayPal 직접 연동 설정
 * @see https://developer.paypal.com/docs/api/overview/
 */

export const PAYPAL_CONFIG = {
  // Client ID (공개 가능)
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  
  // Client Secret (서버 전용)
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  
  // 환경 (sandbox | production)
  mode: (process.env.PAYPAL_MODE || 'sandbox') as 'sandbox' | 'production',
  
  // API 엔드포인트
  apiUrl: process.env.PAYPAL_MODE === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com',
  
  // 구독 플랜 ID들 (PayPal 대시보드에서 생성 후 여기에 추가)
  subscriptionPlans: {
    standard: process.env.PAYPAL_PLAN_ID_STANDARD || '',
    pro: process.env.PAYPAL_PLAN_ID_PRO || '',
  },
  
  // 플랜 가격 (USD)
  pricing: {
    standard: 49.99,
    pro: 89.99,
  },
  
  // 환율 (USD to KRW)
  exchangeRate: 1495,
  
  // 통화
  currency: 'USD', // PayPal은 USD로 결제
  
  // 무료 체험 기간
  trialPeriod: {
    enabled: true,
    days: 14,
  },
  
  // 환불 정책
  refundPolicy: {
    fullRefundDays: 7, // 7일 이내 전액 환불
    proRatedRefund: true, // 7일 이후 일할 환불
  },
} as const;

/**
 * PayPal 설정 검증
 */
export function validatePayPalConfig(): boolean {
  if (!PAYPAL_CONFIG.clientId) {
    console.error('❌ NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing');
    return false;
  }
  
  if (!PAYPAL_CONFIG.clientSecret) {
    console.error('❌ PAYPAL_CLIENT_SECRET is missing');
    return false;
  }
  
  return true;
}

/**
 * PayPal 환경 정보 반환
 */
export function getPayPalEnvironment() {
  return {
    mode: PAYPAL_CONFIG.mode,
    apiUrl: PAYPAL_CONFIG.apiUrl,
    isProduction: PAYPAL_CONFIG.mode === 'production',
    isSandbox: PAYPAL_CONFIG.mode === 'sandbox',
  };
}

/**
 * 금액을 PayPal 형식으로 변환
 * @param amountUSD USD 금액
 * @returns PayPal value 객체
 */
export function formatPayPalAmount(amountUSD: number) {
  return {
    currency_code: 'USD',
    value: amountUSD.toFixed(2),
  };
}

/**
 * KRW를 USD로 변환
 * @param amountKRW 원화 금액
 * @returns USD 금액
 */
export function convertKRWtoUSD(amountKRW: number): number {
  return Math.round((amountKRW / PAYPAL_CONFIG.exchangeRate) * 100) / 100;
}

/**
 * USD를 KRW로 변환
 * @param amountUSD USD 금액
 * @returns 원화 금액
 */
export function convertUSDtoKRW(amountUSD: number): number {
  return Math.round(amountUSD * PAYPAL_CONFIG.exchangeRate);
}

/**
 * 플랜별 가격 정보 가져오기
 */
export function getPayPalPlanPrice(plan: 'standard' | 'pro') {
  const priceUSD = PAYPAL_CONFIG.pricing[plan];
  const priceKRW = convertUSDtoKRW(priceUSD);
  
  return {
    usd: priceUSD,
    krw: priceKRW,
    displayUSD: `$${priceUSD.toFixed(2)}`,
    displayKRW: `₩${priceKRW.toLocaleString()}`,
    exchangeRate: PAYPAL_CONFIG.exchangeRate,
  };
}

/**
 * PayPal 웹훅 이벤트 타입
 */
export const PAYPAL_WEBHOOK_EVENTS = {
  // 결제 완료
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  
  // 구독
  BILLING_SUBSCRIPTION_CREATED: 'BILLING.SUBSCRIPTION.CREATED',
  BILLING_SUBSCRIPTION_ACTIVATED: 'BILLING.SUBSCRIPTION.ACTIVATED',
  BILLING_SUBSCRIPTION_UPDATED: 'BILLING.SUBSCRIPTION.UPDATED',
  BILLING_SUBSCRIPTION_EXPIRED: 'BILLING.SUBSCRIPTION.EXPIRED',
  BILLING_SUBSCRIPTION_CANCELLED: 'BILLING.SUBSCRIPTION.CANCELLED',
  BILLING_SUBSCRIPTION_SUSPENDED: 'BILLING.SUBSCRIPTION.SUSPENDED',
  BILLING_SUBSCRIPTION_PAYMENT_FAILED: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
} as const;

export type PayPalWebhookEvent = typeof PAYPAL_WEBHOOK_EVENTS[keyof typeof PAYPAL_WEBHOOK_EVENTS];
