/**
 * Usage 트래킹 시스템 - [연동 전]
 * TODO: Amplify DataStore Usage 모델 연동 필요
 */

import type { PlanType } from '@/types/subscription';

// [연동 전] Mock client
const client: any = null;

export interface UsageMetrics {
  adAccountsUsed: number;      // 현재 연결된 광고 계정 수
  teamMembersActive: number;   // 활성 팀원 수
  apiCallsToday: number;       // 오늘 API 호출 수 (향후 사용)
  brandsCreated: number;       // 생성된 브랜드 수 (향후 사용)
}

/**
 * 현재 월의 Usage 레코드 가져오기
 */
export async function getCurrentUsage(
  teamId: string
): Promise<UsageMetrics | null> {
  try {
    const period = new Date().toISOString().slice(0, 7); // "2025-11"

    const { data: usageRecords } = await client.models.Usage.list({
      filter: {
        teamID: { eq: teamId },
        period: { eq: period },
      },
    });

    if (!usageRecords || usageRecords.length === 0) {
      return null;
    }

    const usage = usageRecords[0];
    const metrics = JSON.parse(usage.metrics as string) as UsageMetrics;

    return metrics;
  } catch (error) {
    console.error('Failed to get current usage:', error);
    return null;
  }
}

/**
 * Usage 레코드 업데이트
 */
export async function updateUsage(
  teamId: string,
  subscriptionId: string,
  metrics: Partial<UsageMetrics>
): Promise<boolean> {
  try {
    const period = new Date().toISOString().slice(0, 7);

    // 기존 레코드 찾기
    const { data: existing } = await client.models.Usage.list({
      filter: {
        teamID: { eq: teamId },
        period: { eq: period },
      },
    });

    if (existing && existing.length > 0) {
      // 기존 레코드 업데이트
      const current = existing[0];
      const currentMetrics = JSON.parse(current.metrics as string) as UsageMetrics;
      const updated = { ...currentMetrics, ...metrics };

      await client.models.Usage.update({
        id: current.id,
        metrics: JSON.stringify(updated),
      });
    } else {
      // 새 레코드 생성
      const initialMetrics: UsageMetrics = {
        adAccountsUsed: 0,
        teamMembersActive: 0,
        apiCallsToday: 0,
        brandsCreated: 0,
        ...metrics,
      };

      await client.models.Usage.create({
        subscriptionID: subscriptionId,
        teamID: teamId,
        period,
        metrics: JSON.stringify(initialMetrics),
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to update usage:', error);
    return false;
  }
}

/**
 * 광고 계정 수 업데이트
 */
export async function updateAdAccountCount(
  teamId: string,
  subscriptionId: string
): Promise<number> {
  try {
    // PlatformCredential 테이블에서 실제 연결된 계정 수 조회
    const { data: credentials } = await client.models.PlatformCredential.list({
      filter: {
        teamID: { eq: teamId },
        isActive: { eq: true },
      },
    });

    const count = credentials?.length || 0;

    // Usage 업데이트
    await updateUsage(teamId, subscriptionId, {
      adAccountsUsed: count,
    });

    return count;
  } catch (error) {
    console.error('Failed to update ad account count:', error);
    return 0;
  }
}

/**
 * 팀원 수 업데이트
 */
export async function updateTeamMemberCount(
  teamId: string,
  subscriptionId: string
): Promise<number> {
  try {
    // TeamMember 테이블에서 실제 팀원 수 조회
    const { data: members } = await client.models.TeamMember.list({
      filter: {
        teamID: { eq: teamId },
      },
    });

    const count = members?.length || 0;

    // Usage 업데이트
    await updateUsage(teamId, subscriptionId, {
      teamMembersActive: count,
    });

    return count;
  } catch (error) {
    console.error('Failed to update team member count:', error);
    return 0;
  }
}

/**
 * 전체 Usage 동기화 (Cron Job용)
 */
export async function syncAllUsage(
  teamId: string,
  subscriptionId: string
): Promise<UsageMetrics | null> {
  try {
    const adAccountCount = await updateAdAccountCount(teamId, subscriptionId);
    const teamMemberCount = await updateTeamMemberCount(teamId, subscriptionId);

    const metrics: UsageMetrics = {
      adAccountsUsed: adAccountCount,
      teamMembersActive: teamMemberCount,
      apiCallsToday: 0, // 향후 구현
      brandsCreated: 0, // 향후 구현
    };

    await updateUsage(teamId, subscriptionId, metrics);

    return metrics;
  } catch (error) {
    console.error('Failed to sync usage:', error);
    return null;
  }
}

/**
 * Usage 히스토리 조회 (대시보드용)
 */
export async function getUsageHistory(
  teamId: string,
  months: number = 6
): Promise<Array<{ period: string; metrics: UsageMetrics }>> {
  try {
    const { data: usageRecords } = await client.models.Usage.list({
      filter: {
        teamID: { eq: teamId },
      },
    });

    if (!usageRecords) return [];

    // 최근 N개월 데이터만 필터링
    const history = usageRecords
      .map((record: any) => ({
        period: record.period,
        metrics: JSON.parse(record.metrics as string) as UsageMetrics,
      }))
      .sort((a: any, b: any) => b.period.localeCompare(a.period))
      .slice(0, months);

    return history;
  } catch (error) {
    console.error('Failed to get usage history:', error);
    return [];
  }
}
