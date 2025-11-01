/**
 * Campaign Service
 * 
 * 캠페인 관리 서비스
 */

import { list, get, create, update, remove, query } from './graphql.service';
import type { Campaign, CampaignMetric, ManualCampaign, ManualCampaignMetric } from '@/types/amplify';

// ===================================================================
// Campaign CRUD
// ===================================================================

/**
 * 캠페인 생성
 */
export async function createCampaign(data: {
  teamID: string;
  credentialID: string;
  externalCampaignId: string;
  name: string;
  platform: Campaign['platform'];
  status?: string;
  budget?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  objective?: string;
}) {
  return create<Campaign>('Campaign', { data });
}

/**
 * 캠페인 조회
 */
export async function getCampaign(id: string) {
  return get<Campaign>('Campaign', { id });
}

/**
 * 팀의 캠페인 목록 조회
 */
export async function listCampaigns(teamId: string) {
  return query<Campaign>('Campaign', 'byTeamID', { teamID: teamId });
}

/**
 * 캠페인 업데이트
 */
export async function updateCampaign(
  id: string,
  data: {
    name?: string;
    status?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    objective?: string;
  }
) {
  return update<Campaign>('Campaign', { id, data });
}

/**
 * 캠페인 삭제
 */
export async function deleteCampaign(id: string) {
  return remove('Campaign', { id });
}

// ===================================================================
// Campaign Metrics
// ===================================================================

/**
 * 캠페인 메트릭 생성
 */
export async function createCampaignMetric(data: {
  campaignID: string;
  date: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  roas?: number;
}) {
  return create<CampaignMetric>('CampaignMetric', { data });
}

/**
 * 캠페인의 메트릭 조회
 */
export async function getCampaignMetrics(campaignId: string, startDate?: string, endDate?: string) {
  const result = await query<CampaignMetric>('CampaignMetric', 'byCampaignID', {
    campaignID: campaignId,
  });

  if (!result.data) return result;

  // 날짜 필터링
  if (startDate || endDate) {
    result.data = result.data.filter((metric) => {
      const metricDate = new Date(metric.date);
      if (startDate && metricDate < new Date(startDate)) return false;
      if (endDate && metricDate > new Date(endDate)) return false;
      return true;
    });
  }

  return result;
}

// ===================================================================
// Manual Campaign
// ===================================================================

/**
 * 수동 캠페인 생성
 */
export async function createManualCampaign(data: {
  teamID: string;
  platform: ManualCampaign['platform'];
  name: string;
  createdByID: string;
  status?: string;
  budget?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  objective?: string;
  notes?: string;
}) {
  return create<ManualCampaign>('ManualCampaign', { data });
}

/**
 * 수동 캠페인 조회
 */
export async function getManualCampaign(id: string) {
  return get<ManualCampaign>('ManualCampaign', { id });
}

/**
 * 팀의 수동 캠페인 목록 조회
 */
export async function listManualCampaigns(teamId: string) {
  return query<ManualCampaign>('ManualCampaign', 'byTeamID', { teamID: teamId });
}

/**
 * 수동 캠페인 업데이트
 */
export async function updateManualCampaign(
  id: string,
  data: {
    name?: string;
    status?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    objective?: string;
    notes?: string;
  }
) {
  return update<ManualCampaign>('ManualCampaign', { id, data });
}

/**
 * 수동 캠페인 삭제
 */
export async function deleteManualCampaign(id: string) {
  return remove('ManualCampaign', { id });
}

// ===================================================================
// Manual Campaign Metrics
// ===================================================================

/**
 * 수동 캠페인 메트릭 생성
 */
export async function createManualCampaignMetric(data: {
  manualCampaignID: string;
  date: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
  notes?: string;
}) {
  return create<ManualCampaignMetric>('ManualCampaignMetric', { data });
}

/**
 * 수동 캠페인의 메트릭 조회
 */
export async function getManualCampaignMetrics(
  manualCampaignId: string,
  startDate?: string,
  endDate?: string
) {
  const result = await query<ManualCampaignMetric>(
    'ManualCampaignMetric',
    'byManualCampaignID',
    { manualCampaignID: manualCampaignId }
  );

  if (!result.data) return result;

  // 날짜 필터링
  if (startDate || endDate) {
    result.data = result.data.filter((metric) => {
      const metricDate = new Date(metric.date);
      if (startDate && metricDate < new Date(startDate)) return false;
      if (endDate && metricDate > new Date(endDate)) return false;
      return true;
    });
  }

  return result;
}

// ===================================================================
// 통합 조회
// ===================================================================

/**
 * 팀의 모든 캠페인 (자동 + 수동) 조회
 */
export async function getAllCampaigns(teamId: string) {
  const [campaigns, manualCampaigns] = await Promise.all([
    listCampaigns(teamId),
    listManualCampaigns(teamId),
  ]);

  return {
    campaigns: campaigns.data || [],
    manualCampaigns: manualCampaigns.data || [],
    error: campaigns.error || manualCampaigns.error,
  };
}

/**
 * 캠페인 통계 계산
 */
export async function getCampaignStats(campaignId: string, startDate?: string, endDate?: string) {
  const metrics = await getCampaignMetrics(campaignId, startDate, endDate);

  if (!metrics.data || metrics.data.length === 0) {
    return {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      totalRevenue: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgCPM: 0,
      avgROAS: 0,
    };
  }

  const stats = metrics.data.reduce(
    (acc, metric) => ({
      totalImpressions: acc.totalImpressions + (metric.impressions || 0),
      totalClicks: acc.totalClicks + (metric.clicks || 0),
      totalConversions: acc.totalConversions + (metric.conversions || 0),
      totalSpend: acc.totalSpend + (metric.spend || 0),
      totalRevenue: acc.totalRevenue + (metric.revenue || 0),
      ctrSum: acc.ctrSum + (metric.ctr || 0),
      cpcSum: acc.cpcSum + (metric.cpc || 0),
      cpmSum: acc.cpmSum + (metric.cpm || 0),
      roasSum: acc.roasSum + (metric.roas || 0),
      count: acc.count + 1,
    }),
    {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      totalRevenue: 0,
      ctrSum: 0,
      cpcSum: 0,
      cpmSum: 0,
      roasSum: 0,
      count: 0,
    }
  );

  return {
    totalImpressions: stats.totalImpressions,
    totalClicks: stats.totalClicks,
    totalConversions: stats.totalConversions,
    totalSpend: stats.totalSpend,
    totalRevenue: stats.totalRevenue,
    avgCTR: stats.ctrSum / stats.count,
    avgCPC: stats.cpcSum / stats.count,
    avgCPM: stats.cpmSum / stats.count,
    avgROAS: stats.roasSum / stats.count,
  };
}
