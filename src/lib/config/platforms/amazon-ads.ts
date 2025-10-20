import { PlatformDashboardConfig } from "@/types/platform-dashboard";
import { DEFAULT_METRICS } from "@/types/platform-dashboard";

export const amazonAdsSponsoredProductsConfig: PlatformDashboardConfig = {
  platformName: "Amazon Ads - Sponsored Products",
  platformKey: "amazon-ads-sponsored-products",
  description: "Amazon Sponsored Products 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["amazon-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const amazonAdsSponsoredBrandsConfig: PlatformDashboardConfig = {
  platformName: "Amazon Ads - Sponsored Brands",
  platformKey: "amazon-ads-sponsored-brands",
  description: "Amazon Sponsored Brands 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["amazon-ads"],
  defaultMetrics: ["spent", "conversions", "cpa", "roas"],
};

export const amazonAdsSponsoredDisplayConfig: PlatformDashboardConfig = {
  platformName: "Amazon Ads - Sponsored Display",
  platformKey: "amazon-ads-sponsored-display",
  description: "Amazon Sponsored Display 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["amazon-ads"],
  defaultMetrics: ["spent", "impressions", "clicks", "ctr"],
};

export const amazonAdsDSPConfig: PlatformDashboardConfig = {
  platformName: "Amazon Ads - DSP",
  platformKey: "amazon-ads-dsp",
  description: "Amazon DSP 캠페인 성과를 확인하고 관리하세요",
  features: {
    chart: true,
    goals: true,
    bulkActions: true,
    filters: true,
    export: true,
  },
  availableMetrics: DEFAULT_METRICS["amazon-ads"],
  defaultMetrics: ["spent", "impressions", "clicks", "ctr"],
};
