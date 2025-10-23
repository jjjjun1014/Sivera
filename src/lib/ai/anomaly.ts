/**
 * Anomaly Detection (이상 감지)
 *
 * 통계 분석 기반으로 캠페인 데이터의 이상 패턴을 감지합니다.
 * 백엔드 없이 클라이언트 사이드에서 동작합니다.
 */

export interface MetricData {
  date: string;
  value: number;
  campaignId?: number;
  campaignName?: string;
  metricName?: string;
}

export interface AnomalyResult {
  date: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  message: string;
  campaignId?: number;
  campaignName?: string;
  metricName?: string;
}

/**
 * 평균 계산
 */
function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

/**
 * 표준편차 계산
 */
function calculateStdDev(data: number[], mean?: number): number {
  if (data.length === 0) return 0;
  const avg = mean ?? calculateMean(data);
  const squareDiffs = data.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Z-Score 계산 (표준점수)
 * @param value 측정값
 * @param mean 평균
 * @param stdDev 표준편차
 * @returns z-score
 */
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

/**
 * 이상치 감지 (Z-Score 기반)
 * @param data 시계열 데이터
 * @param threshold Z-Score 임계값 (기본 2.0 = 약 95% 신뢰구간)
 * @returns 이상치 배열
 */
export function detectAnomalies(
  data: MetricData[],
  threshold: number = 2.0
): AnomalyResult[] {
  if (data.length < 3) {
    return []; // 최소 3개 이상의 데이터 필요
  }

  const values = data.map((d) => d.value);
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);

  const anomalies: AnomalyResult[] = [];

  data.forEach((item, index) => {
    const zScore = calculateZScore(item.value, mean, stdDev);
    const absZScore = Math.abs(zScore);

    if (absZScore > threshold) {
      const deviation = ((item.value - mean) / mean) * 100; // 퍼센트 편차

      let severity: 'low' | 'medium' | 'high' = 'low';
      if (absZScore > 3.5) severity = 'high';
      else if (absZScore > 2.5) severity = 'medium';

      const direction = zScore > 0 ? '급증' : '급락';
      const metricName = item.metricName || '지표';

      anomalies.push({
        date: item.date,
        value: item.value,
        expectedValue: mean,
        deviation: Math.round(deviation * 10) / 10,
        severity,
        message: `${metricName}가 평균 대비 ${Math.abs(Math.round(deviation))}% ${direction}했습니다.`,
        campaignId: item.campaignId,
        campaignName: item.campaignName,
        metricName: item.metricName,
      });
    }
  });

  return anomalies.sort((a, b) => {
    // 심각도 순으로 정렬 (high > medium > low)
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * 예산 소진 속도 이상 감지
 * @param spent 현재 소진 금액
 * @param budget 총 예산
 * @param daysElapsed 경과 일수
 * @param totalDays 총 캠페인 기간
 * @returns 이상 여부 및 메시지
 */
export function detectBudgetPacingAnomaly(
  spent: number,
  budget: number,
  daysElapsed: number,
  totalDays: number
): { isAnomaly: boolean; severity: 'low' | 'medium' | 'high'; message: string } | null {
  if (budget === 0 || totalDays === 0) return null;

  const expectedSpentRatio = daysElapsed / totalDays;
  const actualSpentRatio = spent / budget;
  const deviation = actualSpentRatio - expectedSpentRatio;

  // 10% 이상 빠르게 소진 중
  if (deviation > 0.1) {
    const daysRemaining = totalDays - daysElapsed;
    const remainingBudget = budget - spent;
    const dailySpent = spent / daysElapsed;
    const daysUntilBudgetExhausted = remainingBudget / dailySpent;

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (deviation > 0.3) severity = 'high';
    else if (deviation > 0.2) severity = 'medium';

    return {
      isAnomaly: true,
      severity,
      message: `예산이 예상보다 빠르게 소진되고 있습니다. 현재 속도로는 ${Math.round(daysUntilBudgetExhausted)}일 후 예산 소진 예상 (남은 기간: ${daysRemaining}일)`,
    };
  }

  // 10% 이상 느리게 소진 중
  if (deviation < -0.1) {
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (deviation < -0.3) severity = 'medium';

    return {
      isAnomaly: true,
      severity,
      message: `예산 소진이 느립니다. 현재 ${Math.round(actualSpentRatio * 100)}% 소진 (예상: ${Math.round(expectedSpentRatio * 100)}%)`,
    };
  }

  return null;
}

/**
 * CPC/CPA 급등 감지
 * @param current 현재 값
 * @param historical 과거 값들
 * @returns 이상 여부 및 메시지
 */
export function detectCostAnomaly(
  current: number,
  historical: number[]
): { isAnomaly: boolean; severity: 'low' | 'medium' | 'high'; message: string } | null {
  if (historical.length < 3) return null;

  const mean = calculateMean(historical);
  const stdDev = calculateStdDev(historical, mean);
  const zScore = calculateZScore(current, mean, stdDev);

  // 2 표준편차 이상 증가
  if (zScore > 2.0) {
    const increase = ((current - mean) / mean) * 100;

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (zScore > 3.5) severity = 'high';
    else if (zScore > 2.5) severity = 'medium';

    return {
      isAnomaly: true,
      severity,
      message: `평균 대비 ${Math.round(increase)}% 증가했습니다. (현재: ₩${current.toLocaleString()}, 평균: ₩${Math.round(mean).toLocaleString()})`,
    };
  }

  return null;
}

/**
 * 전환율 급락 감지
 * @param current 현재 전환율 (%)
 * @param historical 과거 전환율들
 * @returns 이상 여부 및 메시지
 */
export function detectConversionRateAnomaly(
  current: number,
  historical: number[]
): { isAnomaly: boolean; severity: 'low' | 'medium' | 'high'; message: string } | null {
  if (historical.length < 3) return null;

  const mean = calculateMean(historical);
  const stdDev = calculateStdDev(historical, mean);
  const zScore = calculateZScore(current, mean, stdDev);

  // 2 표준편차 이상 감소
  if (zScore < -2.0) {
    const decrease = ((mean - current) / mean) * 100;

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (zScore < -3.5) severity = 'high';
    else if (zScore < -2.5) severity = 'medium';

    return {
      isAnomaly: true,
      severity,
      message: `전환율이 평균 대비 ${Math.round(decrease)}% 하락했습니다. (현재: ${current.toFixed(2)}%, 평균: ${mean.toFixed(2)}%)`,
    };
  }

  return null;
}

/**
 * 전체 캠페인 건강도 체크
 * @param campaign 캠페인 데이터
 * @param historicalData 과거 데이터
 * @returns 감지된 이상 목록
 */
export function checkCampaignHealth(
  campaign: {
    id: number;
    name: string;
    spent: number;
    budget: number;
    cpc: number;
    cpa: number;
    conversionRate: number;
    daysElapsed: number;
    totalDays: number;
  },
  historicalData: {
    cpcHistory: number[];
    cpaHistory: number[];
    conversionRateHistory: number[];
  }
): AnomalyResult[] {
  const anomalies: AnomalyResult[] = [];

  // 예산 소진 속도 체크
  const budgetAnomaly = detectBudgetPacingAnomaly(
    campaign.spent,
    campaign.budget,
    campaign.daysElapsed,
    campaign.totalDays
  );
  if (budgetAnomaly?.isAnomaly) {
    anomalies.push({
      date: new Date().toISOString().split('T')[0],
      value: campaign.spent,
      expectedValue: (campaign.budget * campaign.daysElapsed) / campaign.totalDays,
      deviation: 0,
      severity: budgetAnomaly.severity,
      message: `[예산] ${budgetAnomaly.message}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      metricName: '예산 소진',
    });
  }

  // CPC 이상 체크
  const cpcAnomaly = detectCostAnomaly(campaign.cpc, historicalData.cpcHistory);
  if (cpcAnomaly?.isAnomaly) {
    anomalies.push({
      date: new Date().toISOString().split('T')[0],
      value: campaign.cpc,
      expectedValue: calculateMean(historicalData.cpcHistory),
      deviation: 0,
      severity: cpcAnomaly.severity,
      message: `[CPC] ${cpcAnomaly.message}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      metricName: 'CPC',
    });
  }

  // CPA 이상 체크
  const cpaAnomaly = detectCostAnomaly(campaign.cpa, historicalData.cpaHistory);
  if (cpaAnomaly?.isAnomaly) {
    anomalies.push({
      date: new Date().toISOString().split('T')[0],
      value: campaign.cpa,
      expectedValue: calculateMean(historicalData.cpaHistory),
      deviation: 0,
      severity: cpaAnomaly.severity,
      message: `[CPA] ${cpaAnomaly.message}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      metricName: 'CPA',
    });
  }

  // 전환율 이상 체크
  const conversionAnomaly = detectConversionRateAnomaly(
    campaign.conversionRate,
    historicalData.conversionRateHistory
  );
  if (conversionAnomaly?.isAnomaly) {
    anomalies.push({
      date: new Date().toISOString().split('T')[0],
      value: campaign.conversionRate,
      expectedValue: calculateMean(historicalData.conversionRateHistory),
      deviation: 0,
      severity: conversionAnomaly.severity,
      message: `[전환율] ${conversionAnomaly.message}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      metricName: '전환율',
    });
  }

  return anomalies;
}
