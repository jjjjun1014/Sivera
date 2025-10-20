import { PlatformDashboardConfig } from "@/types/platform-dashboard";
import { DEFAULT_METRICS } from "@/types/platform-dashboard";

export const tiktokAdsStandardConfig: PlatformDashboardConfig = {
  platformName: "TikTok Ads - 표준 캠페인",
  platformKey: "tiktok-ads-standard",
  description: "TikTok 표준 광고 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["tiktok-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const tiktokAdsGMVMaxConfig: PlatformDashboardConfig = {
  platformName: "TikTok Ads - GMV Max",
  platformKey: "tiktok-ads-gmv-max",
  description: "TikTok GMV Max 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["tiktok-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};
