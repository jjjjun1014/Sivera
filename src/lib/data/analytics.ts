/**
 * Analytics Data Layer
 * Mock implementation - Replace with real API calls when backend is ready
 */

export interface AnalyticsSummary {
  totalImpressions: number;
  totalClicks: number;
  totalCost: number;
  totalConversions: number;
  totalRevenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  roi: number;
}

export interface PlatformAnalytics {
  platform: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  roas: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

/**
 * Get analytics summary for a team
 */
export async function getAnalyticsSummary(
  teamId: string,
  dateRange: { start: Date; end: Date }
): Promise<AnalyticsSummary> {
  // Mock data - Replace with real API call
  return {
    totalImpressions: 1250000,
    totalClicks: 45000,
    totalCost: 15000000,
    totalConversions: 1200,
    totalRevenue: 45000000,
    ctr: 3.6,
    cpc: 333,
    cpa: 12500,
    roas: 3.0,
    roi: 200,
  };
}

/**
 * Get platform-wise analytics
 */
export async function getPlatformAnalytics(
  teamId: string,
  dateRange: { start: Date; end: Date }
): Promise<PlatformAnalytics[]> {
  // Mock data - Replace with real API call
  return [
    {
      platform: "Google Ads",
      impressions: 500000,
      clicks: 18000,
      cost: 6000000,
      conversions: 480,
      revenue: 18000000,
      ctr: 3.6,
      cpc: 333,
      roas: 3.0,
    },
    {
      platform: "Meta Ads",
      impressions: 450000,
      clicks: 16200,
      cost: 5400000,
      conversions: 432,
      revenue: 16200000,
      ctr: 3.6,
      cpc: 333,
      roas: 3.0,
    },
    {
      platform: "TikTok Ads",
      impressions: 300000,
      clicks: 10800,
      cost: 3600000,
      conversions: 288,
      revenue: 10800000,
      ctr: 3.6,
      cpc: 333,
      roas: 3.0,
    },
  ];
}

/**
 * Get time series data for a specific metric
 */
export async function getTimeSeriesData(
  teamId: string,
  dateRange: { start: Date; end: Date },
  metric: "impressions" | "clicks" | "cost" | "conversions" | "revenue"
): Promise<TimeSeriesDataPoint[]> {
  // Generate mock time series data
  const data: TimeSeriesDataPoint[] = [];
  const days = Math.ceil(
    (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const baseValues = {
    impressions: 45000,
    clicks: 1600,
    cost: 550000,
    conversions: 40,
    revenue: 1600000,
  };

  for (let i = 0; i < days; i++) {
    const date = new Date(dateRange.start);
    date.setDate(date.getDate() + i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    // Add some variance
    const variance = 0.8 + Math.random() * 0.4;
    const value = Math.round(baseValues[metric] * variance);

    data.push({
      date: dateStr,
      value,
    });
  }

  return data;
}

/**
 * Preload analytics data for better performance
 */
export function preloadAnalyticsData(
  teamId: string,
  dateRange: { start: Date; end: Date }
): void {
  // Trigger parallel data fetching
  getAnalyticsSummary(teamId, dateRange);
  getPlatformAnalytics(teamId, dateRange);
  getTimeSeriesData(teamId, dateRange, "impressions");
  getTimeSeriesData(teamId, dateRange, "clicks");
  getTimeSeriesData(teamId, dateRange, "cost");
  getTimeSeriesData(teamId, dateRange, "conversions");
  getTimeSeriesData(teamId, dateRange, "revenue");
}
