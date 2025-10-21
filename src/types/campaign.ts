// 캠페인 관련 타입 정의

export type CampaignStatus = "active" | "paused" | "ended" | "draft";

export interface Campaign {
  id: number | string;
  rank?: number;
  name: string;
  platform?: string;
  type?: string;
  status: CampaignStatus;
  budget?: number;
  spent: number;
  conversions: number;
  cpa: number;
  roas: number;
  ctr?: number;
  impressions?: number;
  clicks?: number;
  spentRate?: string;
}

export interface CampaignTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface TopCampaign {
  rank: number;
  platform: string;
  name: string;
  spent: number;
  conversions: number;
  cpa: number;
  roas: number;
}

// 광고그룹 타입 (Google Ads Ad Group, Meta Ads Ad Set)
export interface AdGroup {
  id: number | string;
  campaignId: number | string;
  campaignName: string;
  campaignType?: string; // "search", "performance-max", "shopping", "display", "advantage-plus", "gmv-max" 등
  name: string;
  status: CampaignStatus;
  budget?: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  conversions: number;
  cpc?: number;
  cpa: number;
  roas: number;
}

// 예산 편집 불가능한 캠페인 타입들
export const BUDGET_LOCKED_CAMPAIGN_TYPES = [
  "performance-max",    // Google Performance Max
  "advantage-plus",     // Meta Advantage+ Shopping
  "gmv-max",           // TikTok GMV Max
  "dsp",               // Amazon DSP (Order 레벨에서만 편집)
];

// 예산 편집 가능 여부를 계산하는 헬퍼 함수
export function isBudgetEditable(campaignType?: string): boolean {
  if (!campaignType) return true; // 타입 정보 없으면 기본적으로 편집 가능
  return !BUDGET_LOCKED_CAMPAIGN_TYPES.includes(campaignType.toLowerCase());
}

// 광고/소재 타입 (Ad, Creative)
export interface Ad {
  id: number | string;
  campaignId: number | string;
  campaignName: string;
  adGroupId: number | string;
  adGroupName: string;
  name: string;
  type?: string; // "text", "image", "video", "carousel" 등
  status: CampaignStatus;
  spent: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  conversions: number;
  cpc?: number;
  cpa: number;
  roas: number;
  thumbnailUrl?: string; // 크리에이티브 썸네일
}
