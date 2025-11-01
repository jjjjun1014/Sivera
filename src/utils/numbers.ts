/**
 * Number Utilities
 * 
 * 숫자 포맷팅 유틸리티
 */

/**
 * 숫자를 천 단위 콤마로 포맷
 */
export function formatNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '0';
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '0';
  return numValue.toLocaleString('ko-KR');
}

/**
 * 통화 형식으로 포맷
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string = 'KRW'
): string {
  if (amount === undefined || amount === null) return '₩0';
  const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numValue)) return '₩0';

  const currencySymbols: Record<string, string> = {
    KRW: '₩',
    USD: '$',
    EUR: '€',
    JPY: '¥',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${formatNumber(numValue)}`;
}

/**
 * 퍼센트 형식으로 포맷
 */
export function formatPercent(
  value: number | string | undefined | null,
  decimals: number = 2
): string {
  if (value === undefined || value === null) return '0%';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0%';
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * 큰 숫자를 K, M, B 단위로 축약
 */
export function formatCompactNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '0';
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '0';

  const absNum = Math.abs(numValue);
  
  if (absNum >= 1e9) {
    return (numValue / 1e9).toFixed(1) + 'B';
  } else if (absNum >= 1e6) {
    return (numValue / 1e6).toFixed(1) + 'M';
  } else if (absNum >= 1e3) {
    return (numValue / 1e3).toFixed(1) + 'K';
  }
  
  return formatNumber(numValue);
}

/**
 * 증감률 계산 및 포맷
 */
export function formatChangeRate(
  current: number,
  previous: number,
  decimals: number = 2
): { rate: string; isPositive: boolean; isZero: boolean } {
  if (previous === 0) {
    return {
      rate: current > 0 ? '+∞' : '0%',
      isPositive: current > 0,
      isZero: current === 0,
    };
  }

  const change = ((current - previous) / previous) * 100;
  const isPositive = change > 0;
  const isZero = change === 0;
  const sign = isPositive ? '+' : '';

  return {
    rate: `${sign}${change.toFixed(decimals)}%`,
    isPositive,
    isZero,
  };
}

/**
 * ROAS 계산
 */
export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return revenue / spend;
}

/**
 * CTR 계산
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

/**
 * CPC 계산
 */
export function calculateCPC(spend: number, clicks: number): number {
  if (clicks === 0) return 0;
  return spend / clicks;
}

/**
 * CPM 계산
 */
export function calculateCPM(spend: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (spend / impressions) * 1000;
}
