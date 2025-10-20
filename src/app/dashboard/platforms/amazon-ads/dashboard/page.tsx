"use client";

import { PlatformGoalDashboard } from "@/components/templates";
import { amazonAdsCampaigns } from "@/lib/mock-data";

const config = {
  platformKey: "amazon-ads-dashboard",
  platformName: "Amazon Ads",
  platformDisplayName: "Amazon Ads - 대시보드",
  description: "전체 Amazon 광고 성과를 한눈에 확인하세요",
  campaigns: amazonAdsCampaigns,
  sampleTotalData: {
    totalSpent: 987654,
    totalBudget: 1200000,
    totalConversions: 645,
    avgCPA: 2450,
    avgROAS: 3.4,
    avgCTR: 2.15,
    impressionShare: 72,
  },
};

export default function AmazonAdsDashboardPage() {
  return <PlatformGoalDashboard config={config} />;
}
