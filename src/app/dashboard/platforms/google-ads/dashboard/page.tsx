"use client";

import { PlatformGoalDashboard } from "@/components/templates";
import { googleAdsCampaigns } from "@/lib/mock-data";

const config = {
  platformKey: "google-ads-dashboard",
  platformName: "Google Ads",
  platformDisplayName: "Google Ads - 대시보드",
  description: "전체 Google 광고 성과를 한눈에 확인하세요",
  campaigns: googleAdsCampaigns,
  platform: "google" as const,
  sampleTotalData: {
    totalSpent: 1234567,
    totalBudget: 1500000,
    totalConversions: 856,
    avgCPA: 2890,
    avgROAS: 4.2,
    avgCTR: 2.85,
    impressionShare: 68,
  },
};

export default function GoogleAdsDashboardPage() {
  return <PlatformGoalDashboard config={config} />;
}
