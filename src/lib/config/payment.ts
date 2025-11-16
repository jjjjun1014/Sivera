/**
 * 결제 설정
 * 
 * PortOne V2 통합 결제 시스템 설정
 * 공식 문서: https://developers.portone.io/opi/ko/integration/pg/v2/inicis-v2
 */

/**
 * PortOne 스토어 설정
 */
export const PORTONE_CONFIG = {
  // PortOne 스토어 ID (환경변수에서 로드)
  storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '',
  
  // API URL
  apiUrl: process.env.NEXT_PUBLIC_PORTONE_API_URL || 'https://api.portone.io',
  
  // 결제 SDK URL
  sdkUrl: 'https://cdn.portone.io/v2/browser-sdk.js',
} as const;

/**
 * PG사별 채널 키 설정
 * 
 * KG이니시스(inicis-v2) 설정
 * - 일반결제: card, trans, vbank, phone 지원
 * - 정기결제(빌링키): 지원
 * - 에스크로: 지원
 */
export const PG_CHANNELS = {
  // KG이니시스 (개발환경)
  INICIS_DEV: {
    key: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_INICIS_DEV || '',
    name: 'KG이니시스 (개발)',
    pgProvider: 'inicis-v2',
    environment: 'development',
    supportedMethods: ['CARD', 'VIRTUAL_ACCOUNT', 'TRANSFER', 'MOBILE'] as const,
    supportsBilling: true, // 정기결제 지원
    supportsEscrow: true,  // 에스크로 지원
  },
  
  // KG이니시스 (운영환경)
  INICIS_PROD: {
    key: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_INICIS_PROD || '',
    name: 'KG이니시스 (운영)',
    pgProvider: 'inicis-v2',
    environment: 'production',
    supportedMethods: ['CARD', 'VIRTUAL_ACCOUNT', 'TRANSFER', 'MOBILE'] as const,
    supportsBilling: true,
    supportsEscrow: true,
  },
  
  // 향후 추가 PG사 (예시)
  // TOSS_PAYMENTS: {
  //   key: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_TOSS || '',
  //   name: '토스페이먼츠',
  //   pgProvider: 'tosspayments',
  //   environment: process.env.NODE_ENV,
  //   supportedMethods: ['CARD', 'VIRTUAL_ACCOUNT', 'TRANSFER', 'EASY_PAY'],
  //   supportsBilling: true,
  //   supportsEscrow: false,
  // },
} as const;

/**
 * 현재 환경에 맞는 채널 키 가져오기
 */
export function getCurrentChannelKey(): string {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? PG_CHANNELS.INICIS_DEV.key : PG_CHANNELS.INICIS_PROD.key;
}

/**
 * 현재 환경에 맞는 채널 설정 가져오기
 */
export function getCurrentChannel() {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? PG_CHANNELS.INICIS_DEV : PG_CHANNELS.INICIS_PROD;
}

/**
 * 결제 방법별 한글 이름
 */
export const PAYMENT_METHOD_NAMES = {
  CARD: '신용/체크카드',
  VIRTUAL_ACCOUNT: '가상계좌',
  TRANSFER: '계좌이체',
  MOBILE: '휴대폰',
  EASY_PAY: '간편결제',
  PAYPAL: 'PayPal',
} as const;

/**
 * 결제 방법별 아이콘 (선택사항)
 */
export const PAYMENT_METHOD_ICONS = {
  CARD: '💳',
  VIRTUAL_ACCOUNT: '🏦',
  TRANSFER: '💸',
  MOBILE: '📱',
  EASY_PAY: '⚡',
  PAYPAL: 'P',
} as const;

/**
 * 통화 설정
 */
export const CURRENCIES = {
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: '원',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar',
  },
} as const;

/**
 * 결제 환경 검증
 */
export function validatePaymentConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!PORTONE_CONFIG.storeId) {
    errors.push('NEXT_PUBLIC_PORTONE_STORE_ID 환경변수가 설정되지 않았습니다.');
  }

  const currentChannel = getCurrentChannel();
  if (!currentChannel.key) {
    const envVar = process.env.NODE_ENV === 'development'
      ? 'NEXT_PUBLIC_PORTONE_CHANNEL_KEY_INICIS_DEV'
      : 'NEXT_PUBLIC_PORTONE_CHANNEL_KEY_INICIS_PROD';
    errors.push(`${envVar} 환경변수가 설정되지 않았습니다.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 결제 리다이렉트 URL 설정
 */
export const PAYMENT_REDIRECT_URLS = {
  success: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment/billing/success`,
  failure: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment/billing/failure`,
  webhook: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment/webhook`,
} as const;

/**
 * 빌링키 발급 설정
 */
export const BILLING_KEY_CONFIG = {
  // 빌링키 발급 성공 시 리다이렉트 URL
  redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment/billing/register`,
  
  // 빌링키 웹훅 URL
  noticeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/payment/billing-webhook`,
} as const;

/**
 * KG이니시스 특화 설정
 */
export const INICIS_CONFIG = {
  // 테스트 카드 정보 (개발환경)
  testCards: [
    {
      number: '5570**********1074',
      name: 'Master 테스트카드',
      hint: '개발환경 전용',
    },
    {
      number: '4000**********0008',
      name: 'Visa 테스트카드',
      hint: '개발환경 전용',
    },
  ],
  
  // 에스크로 사용 여부
  useEscrow: false,
  
  // 할부 개월 수 옵션
  installmentMonths: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const,
  
  // 무이자 할부 개월 수
  interestFreeMonths: [2, 3] as const,
} as const;

/**
 * 개발 모드 체크
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 결제 설정 출력 (디버깅용)
 */
export function logPaymentConfig() {
  if (isDevelopmentMode()) {
    console.log('💳 Payment Configuration:');
    console.log('- Store ID:', PORTONE_CONFIG.storeId ? '✅ Set' : '❌ Missing');
    console.log('- Channel:', getCurrentChannel().name);
    console.log('- Channel Key:', getCurrentChannelKey() ? '✅ Set' : '❌ Missing');
    console.log('- Environment:', process.env.NODE_ENV);
    console.log('- Supported Methods:', getCurrentChannel().supportedMethods);
    console.log('- Billing Support:', getCurrentChannel().supportsBilling ? '✅' : '❌');
    
    const validation = validatePaymentConfig();
    if (!validation.valid) {
      console.error('❌ Payment config errors:', validation.errors);
    }
  }
}
