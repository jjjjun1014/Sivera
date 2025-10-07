// ========================================
// 사용자 및 인증 관련 타입
// ========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface InviteData {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

// ========================================
// 플랫폼 관련 타입
// ========================================

export type PlatformType = 'google' | 'meta' | 'amazon' | 'tiktok' | 'naver' | 'kakao';

export interface Platform {
  id: PlatformType;
  name: string;
  logo: string;
  description: string;
  isConnected: boolean;
  connectedAt?: string;
  accountInfo?: {
    accountId: string;
    accountName: string;
  };
}

// ========================================
// 캠페인 관련 타입
// ========================================

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion';

export interface Campaign {
  id: string;
  name: string;
  platform: PlatformType;
  status: CampaignStatus;
  objective: CampaignObjective;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  schedule: {
    startDate: string;
    endDate?: string;
  };
  metrics: CampaignMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille (1000 impressions)
  roas: number; // Return on ad spend
  conversionRate: number;
}

// ========================================
// 대시보드 관련 타입
// ========================================

export interface StatCard {
  title: string;
  value: string | number;
  change?: number; // 증감율 (%)
  changeType?: 'increase' | 'decrease';
  icon?: string;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

// ========================================
// 테이블 관련 타입
// ========================================

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

// ========================================
// 약관 동의 관련 타입
// ========================================

export interface TermsConsent {
  terms: boolean; // 이용약관 (필수)
  privacy: boolean; // 개인정보처리방침 (필수)
  marketing: boolean; // 마케팅 수신 동의 (선택)
  thirdParty: boolean; // 제3자 정보 제공 동의 (선택)
}

export interface LegalDocument {
  id: string;
  type: 'terms' | 'privacy' | 'marketing';
  title: string;
  version: string;
  effectiveDate: string;
  content: string;
}

// ========================================
// 팀 관련 타입 (나중에 사용)
// ========================================

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  token: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}

// ========================================
// API 응답 타입
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

// ========================================
// 설정 관련 타입
// ========================================

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    campaignAlerts: boolean;
    budgetAlerts: boolean;
  };
  preferences: {
    language: 'ko' | 'en';
    currency: 'KRW' | 'USD';
    timezone: string;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showActivity: boolean;
  };
}

// ========================================
// 폼 검증 관련 타입
// ========================================

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: { [K in keyof T]?: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}
