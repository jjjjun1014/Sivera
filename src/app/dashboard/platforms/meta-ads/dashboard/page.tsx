"use client";

import { PlatformGoalDashboard } from "@/components/templates";
import { metaAdsCampaigns } from "@/lib/mock-data";

const config = {
  platformKey: "meta-ads-dashboard",
  platformName: "Meta Ads",
  platformDisplayName: "Meta Ads - 대시보드",
  description: "전체 Meta 광고 성과를 한눈에 확인하세요",
  campaigns: metaAdsCampaigns,
  platform: "meta" as const,
  sampleTotalData: {
    totalSpent: 1156789,
    totalBudget: 1400000,
    totalConversions: 782,
    avgCPA: 2720,
    avgROAS: 3.8,
    avgCTR: 2.52,
    impressionShare: 58,
  },
};

export default function MetaAdsDashboardPage() {
  return <PlatformGoalDashboard config={config} />;
}
