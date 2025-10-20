// 플랫폼 관련 타입 정의

export type PlatformName = "Google Ads" | "Meta Ads" | "TikTok Ads" | "Amazon Ads";

export type PlatformStatus = "active" | "inactive" | "error";

export interface PlatformAccount {
  id: number | string;
  platform: PlatformName;
  accountName: string;
  accountId: string;
  status: PlatformStatus;
  lastSync: string;
  campaigns: number;
}

export interface PlatformPerformance {
  platform: PlatformName;
  spent: number;
  conversions: number;
  roas: number;
  cpa: number;
  sharePercent: number;
}

export const PLATFORM_COLORS: Record<PlatformName, string> = {
  "Google Ads": "#34A853",
  "Meta Ads": "#0081FB",
  "TikTok Ads": "#FE2C55",
  "Amazon Ads": "#FF9900",
};
