// 플랫폼 대시보드 템플릿 타입 정의

export interface PlatformDashboardConfig {
  // 기본 정보
  platformName: string; // "Google Ads - 검색 광고"
  platformKey: string; // "google-ads-search"
  description: string; // "Google 검색 광고 성과를 관리하세요"

  // 기능 활성화
  features: {
    chart?: boolean; // 차트 표시 여부
    goals?: boolean; // 목표 설정 기능
    bulkActions?: boolean; // 일괄 작업
    filters?: boolean; // 필터링
    export?: boolean; // 내보내기
  };

  // 메트릭 설정 (차트/테이블에 표시될 지표들)
  availableMetrics?: MetricConfig[];

  // 기본 선택 메트릭
  defaultMetrics?: string[];
}

export interface MetricConfig {
  key: string; // "impressions", "clicks", "conversions" 등
  label: string; // "노출수", "클릭수", "전환수"
  format: "number" | "currency" | "percentage" | "decimal";
  chartType?: "line" | "bar"; // 차트 타입
  color?: string; // 차트 색상
}

// 플랫폼별 기본 메트릭
export const DEFAULT_METRICS: Record<string, MetricConfig[]> = {
  "google-ads": [
    { key: "impressions", label: "노출수", format: "number", chartType: "bar", color: "#17C964" },
    { key: "clicks", label: "클릭수", format: "number", chartType: "bar", color: "#0072F5" },
    { key: "conversions", label: "전환수", format: "number", chartType: "line", color: "#F5A524" },
    { key: "cost", label: "비용", format: "currency", chartType: "bar", color: "#9353D3" },
    { key: "ctr", label: "CTR", format: "percentage", chartType: "line", color: "#17C964" },
    { key: "cpc", label: "CPC", format: "currency", chartType: "line", color: "#0072F5" },
    { key: "cpa", label: "CPA", format: "currency", chartType: "line", color: "#F5A524" },
    { key: "roas", label: "ROAS", format: "decimal", chartType: "line", color: "#9353D3" },
  ],
  "meta-ads": [
    { key: "impressions", label: "노출수", format: "number", chartType: "bar", color: "#17C964" },
    { key: "clicks", label: "클릭수", format: "number", chartType: "bar", color: "#0072F5" },
    { key: "conversions", label: "전환수", format: "number", chartType: "line", color: "#F5A524" },
    { key: "spend", label: "지출", format: "currency", chartType: "bar", color: "#9353D3" },
    { key: "ctr", label: "CTR", format: "percentage", chartType: "line", color: "#17C964" },
    { key: "cpc", label: "CPC", format: "currency", chartType: "line", color: "#0072F5" },
    { key: "cpa", label: "CPA", format: "currency", chartType: "line", color: "#F5A524" },
    { key: "roas", label: "ROAS", format: "decimal", chartType: "line", color: "#9353D3" },
  ],
  "tiktok-ads": [
    { key: "impressions", label: "노출수", format: "number", chartType: "bar", color: "#17C964" },
    { key: "clicks", label: "클릭수", format: "number", chartType: "bar", color: "#0072F5" },
    { key: "conversions", label: "전환수", format: "number", chartType: "line", color: "#F5A524" },
    { key: "cost", label: "비용", format: "currency", chartType: "bar", color: "#9353D3" },
    { key: "ctr", label: "CTR", format: "percentage", chartType: "line", color: "#17C964" },
    { key: "cpc", label: "CPC", format: "currency", chartType: "line", color: "#0072F5" },
    { key: "cpa", label: "CPA", format: "currency", chartType: "line", color: "#F5A524" },
    { key: "roas", label: "ROAS", format: "decimal", chartType: "line", color: "#9353D3" },
  ],
  "amazon-ads": [
    { key: "impressions", label: "노출수", format: "number", chartType: "bar", color: "#17C964" },
    { key: "clicks", label: "클릭수", format: "number", chartType: "bar", color: "#0072F5" },
    { key: "conversions", label: "전환수", format: "number", chartType: "line", color: "#F5A524" },
    { key: "spend", label: "지출", format: "currency", chartType: "bar", color: "#9353D3" },
    { key: "ctr", label: "CTR", format: "percentage", chartType: "line", color: "#17C964" },
    { key: "cpc", label: "CPC", format: "currency", chartType: "line", color: "#0072F5" },
    { key: "acos", label: "ACOS", format: "percentage", chartType: "line", color: "#F5A524" },
    { key: "roas", label: "ROAS", format: "decimal", chartType: "line", color: "#9353D3" },
  ],
};
