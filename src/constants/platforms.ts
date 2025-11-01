/**
 * Platform Constants
 * 
 * 플랫폼 관련 상수 정의
 */

export const PLATFORM_NAMES = {
  facebook: 'Facebook Ads',
  google: 'Google Ads',
  kakao: 'Kakao Moment',
  naver: 'Naver 광고',
  coupang: 'Coupang Ads',
  amazon: 'Amazon Ads',
  tiktok: 'TikTok Ads',
} as const;

export const PLATFORM_COLORS = {
  facebook: '#1877F2',
  google: '#4285F4',
  kakao: '#FEE500',
  naver: '#03C75A',
  coupang: '#FC6D05',
  amazon: '#FF9900',
  tiktok: '#000000',
} as const;

export const PLATFORM_ICONS = {
  facebook: 'FaFacebook',
  google: 'FaGoogle',
  kakao: 'SiKakaotalk',
  naver: 'SiNaver',
  coupang: 'FaShoppingCart',
  amazon: 'FaAmazon',
  tiktok: 'SiTiktok',
} as const;

export type PlatformType = keyof typeof PLATFORM_NAMES;
