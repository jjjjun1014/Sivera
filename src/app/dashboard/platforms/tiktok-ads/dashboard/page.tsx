"use client";

import { PlatformGoalDashboard } from "@/components/templates";
import { tiktokAdsCampaigns } from "@/lib/mock-data";

const config = {
  platformKey: "tiktok-ads-dashboard",
  platformName: "TikTok Ads",
  platformDisplayName: "TikTok Ads - 대시보드",
  description: "전체 TikTok 광고 성과를 한눈에 확인하세요",
  campaigns: tiktokAdsCampaigns,
  platform: "tiktok" as const,
  sampleTotalData: {
    totalSpent: 856432,
    totalBudget: 1100000,
    totalConversions: 598,
    avgCPA: 2580,
    avgROAS: 3.6,
    avgCTR: 2.88,
    impressionShare: 62,
  },
};

export default function TikTokAdsDashboardPage() {
  return <PlatformGoalDashboard config={config} />;
}
