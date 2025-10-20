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
