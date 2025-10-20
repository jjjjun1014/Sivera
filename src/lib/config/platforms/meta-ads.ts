import { PlatformDashboardConfig } from "@/types/platform-dashboard";
import { DEFAULT_METRICS } from "@/types/platform-dashboard";

export const metaAdsStandardConfig: PlatformDashboardConfig = {
  platformName: "Meta Ads - 표준 캠페인",
  platformKey: "meta-ads-standard",
  description: "Meta 표준 광고 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["meta-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const metaAdsAdvantagePlusConfig: PlatformDashboardConfig = {
  platformName: "Meta Ads - Advantage+",
  platformKey: "meta-ads-advantage-plus",
  description: "Meta Advantage+ 쇼핑 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["meta-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};
