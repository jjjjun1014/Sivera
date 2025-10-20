import { PlatformDashboardConfig } from "@/types/platform-dashboard";
import { DEFAULT_METRICS } from "@/types/platform-dashboard";

export const googleAdsSearchConfig: PlatformDashboardConfig = {
  platformName: "Google Ads - 검색 광고",
  platformKey: "google-ads-search",
  description: "Google 검색 네트워크 광고 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["google-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const googleAdsShoppingConfig: PlatformDashboardConfig = {
  platformName: "Google Ads - 쇼핑 광고",
  platformKey: "google-ads-shopping",
  description: "Google 쇼핑 광고 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["google-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const googleAdsDisplayConfig: PlatformDashboardConfig = {
  platformName: "Google Ads - 디스플레이",
  platformKey: "google-ads-display",
  description: "Google 디스플레이 네트워크 광고 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["google-ads"],
  defaultMetrics: ["spent", "impressions", "clicks", "ctr"],
};

export const googleAdsPMaxConfig: PlatformDashboardConfig = {
  platformName: "Google Ads - Performance Max",
  platformKey: "google-ads-pmax",
  description: "Performance Max 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["google-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};
