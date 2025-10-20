import { Campaign, TopCampaign } from "@/types";

// Helper function to add CTR, impressions, clicks
const addMetrics = (campaigns: Campaign[]): Campaign[] => {
  return campaigns.map((c, i) => ({
    ...c,
    id: i + 1,
    spent: c.conversions * c.cpa,
    ctr: c.ctr || Number((Math.random() * 3 + 0.5).toFixed(2)),
    impressions: c.impressions || Math.floor(Math.random() * 50000 + 10000),
    clicks: c.clicks || Math.floor((c.impressions || 10000) * ((c.ctr || 1.5) / 100)),
  }));
};

// Google Ads - Search
export const googleAdsSearchCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "여름 세일 - 검색 광고", type: "검색", conversions: 156, cpa: 2481, roas: 4.8, status: "active" },
  { rank: 2, name: "브랜드 키워드 캠페인", type: "검색", conversions: 92, cpa: 2663, roas: 3.9, status: "active" },
  { rank: 3, name: "검색 광고 - 경쟁사 키워드", type: "검색", conversions: 54, cpa: 2685, roas: 2.8, status: "active" },
  { rank: 4, name: "검색 광고 - 롱테일 키워드", type: "검색", conversions: 32, cpa: 2031, roas: 2.9, status: "active" },
  { rank: 5, name: "가을 신상품 캠페인", type: "검색", conversions: 28, cpa: 2150, roas: 3.2, status: "active" },
]);

// Google Ads - Shopping
export const googleAdsShoppingCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "쇼핑 광고 - 신제품", type: "쇼핑", conversions: 134, cpa: 2328, roas: 5.6, status: "active" },
  { rank: 2, name: "쇼핑 광고 - 베스트셀러", type: "쇼핑", conversions: 43, cpa: 4244, roas: 4.2, status: "active" },
  { rank: 3, name: "시즌 세일 쇼핑", type: "쇼핑", conversions: 38, cpa: 3100, roas: 3.8, status: "active" },
  { rank: 4, name: "신규 카테고리 쇼핑", type: "쇼핑", conversions: 25, cpa: 2900, roas: 3.5, status: "active" },
]);

// Google Ads - Display
export const googleAdsDisplayCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "디스플레이 - 리타겟팅", type: "디스플레이", conversions: 78, cpa: 2000, roas: 3.2, status: "paused" },
  { rank: 2, name: "디스플레이 - 신규 고객", type: "디스플레이", conversions: 45, cpa: 3022, roas: 2.4, status: "active" },
  { rank: 3, name: "디스플레이 - 브랜딩", type: "디스플레이", conversions: 32, cpa: 2500, roas: 2.8, status: "active" },
  { rank: 4, name: "디스플레이 - 인식 개선", type: "디스플레이", conversions: 28, cpa: 2650, roas: 2.5, status: "active" },
]);

// Google Ads - Performance Max
export const googleAdsPMaxCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "Performance Max - 전제품", type: "P-Max", conversions: 67, cpa: 3134, roas: 3.5, status: "active" },
  { rank: 2, name: "Performance Max - 시즌 특가", type: "P-Max", conversions: 38, cpa: 4026, roas: 3.8, status: "active" },
  { rank: 3, name: "Performance Max - 신규 고객", type: "P-Max", conversions: 29, cpa: 3500, roas: 3.3, status: "active" },
]);

// Meta Ads - Standard
export const metaAdsStandardCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "리타겟팅 - 장바구니 이탈", type: "표준", conversions: 142, cpa: 2099, roas: 5.2, status: "active" },
  { rank: 2, name: "신규 고객 확보", type: "표준", conversions: 89, cpa: 2450, roas: 3.9, status: "active" },
  { rank: 3, name: "브랜드 인지도", type: "표준", conversions: 56, cpa: 2800, roas: 3.2, status: "active" },
  { rank: 4, name: "계절 프로모션", type: "표준", conversions: 48, cpa: 2300, roas: 4.1, status: "active" },
]);

// Meta Ads - Advantage+
export const metaAdsAdvantagePlusCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "Advantage+ 쇼핑 캠페인", type: "Advantage+", conversions: 108, cpa: 2556, roas: 4.3, status: "active" },
  { rank: 2, name: "Advantage+ 신상품", type: "Advantage+", conversions: 72, cpa: 2380, roas: 4.5, status: "active" },
  { rank: 3, name: "Advantage+ 재구매", type: "Advantage+", conversions: 54, cpa: 2100, roas: 4.8, status: "active" },
]);

// TikTok Ads - Standard
export const tiktokAdsStandardCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "동영상 캠페인 - 신규", type: "표준", conversions: 118, cpa: 2153, roas: 3.9, status: "active" },
  { rank: 2, name: "숏폼 콘텐츠", type: "표준", conversions: 76, cpa: 2240, roas: 3.7, status: "active" },
  { rank: 3, name: "트렌드 활용", type: "표준", conversions: 62, cpa: 2400, roas: 3.5, status: "active" },
]);

// TikTok Ads - GMV Max
export const tiktokAdsGMVMaxCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "GMV Max - 특가 이벤트", type: "GMV Max", conversions: 87, cpa: 2276, roas: 3.6, status: "active" },
  { rank: 2, name: "GMV Max - 신상품", type: "GMV Max", conversions: 65, cpa: 2350, roas: 3.8, status: "active" },
  { rank: 3, name: "GMV Max - 베스트", type: "GMV Max", conversions: 48, cpa: 2180, roas: 4.0, status: "active" },
]);

// Amazon Ads - Sponsored Products
export const amazonAdsSponsoredProductsCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "Sponsored Products - 베스트", type: "SP", conversions: 95, cpa: 1989, roas: 3.8, status: "active" },
  { rank: 2, name: "Sponsored Products - 신상품", type: "SP", conversions: 68, cpa: 2100, roas: 3.6, status: "active" },
  { rank: 3, name: "Sponsored Products - 시즌", type: "SP", conversions: 52, cpa: 2050, roas: 3.7, status: "active" },
]);

// Amazon Ads - Sponsored Brands
export const amazonAdsSponsoredBrandsCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "Sponsored Brands - 신제품", type: "SB", conversions: 71, cpa: 2324, roas: 3.4, status: "active" },
  { rank: 2, name: "Sponsored Brands - 브랜드", type: "SB", conversions: 54, cpa: 2450, roas: 3.2, status: "active" },
  { rank: 3, name: "Sponsored Brands - 컬렉션", type: "SB", conversions: 42, cpa: 2280, roas: 3.5, status: "active" },
]);

// Amazon Ads - Sponsored Display
export const amazonAdsSponsoredDisplayCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "Sponsored Display - 리타겟팅", type: "SD", conversions: 48, cpa: 2600, roas: 3.0, status: "active" },
  { rank: 2, name: "Sponsored Display - 신규", type: "SD", conversions: 36, cpa: 2750, roas: 2.8, status: "active" },
  { rank: 3, name: "Sponsored Display - 유사", type: "SD", conversions: 28, cpa: 2500, roas: 3.1, status: "active" },
]);

// Amazon Ads - DSP
export const amazonAdsDSPCampaigns: Campaign[] = addMetrics([
  { rank: 1, name: "DSP - 브랜드 인지도", type: "DSP", conversions: 42, cpa: 3200, roas: 2.5, status: "active" },
  { rank: 2, name: "DSP - 리타겟팅", type: "DSP", conversions: 32, cpa: 3100, roas: 2.7, status: "active" },
  { rank: 3, name: "DSP - 신규 고객", type: "DSP", conversions: 25, cpa: 3350, roas: 2.4, status: "active" },
]);

// Backward compatibility - keeping original googleAdsCampaigns
export const googleAdsCampaigns: Campaign[] = [
  ...googleAdsSearchCampaigns.slice(0, 2),
  ...googleAdsShoppingCampaigns.slice(0, 2),
  ...googleAdsDisplayCampaigns.slice(0, 2),
  ...googleAdsPMaxCampaigns.slice(0, 2),
].map((c, i) => ({
  ...c,
  rank: i + 1,
  id: i + 1,
  spentRate: `${(70 + Math.random() * 25).toFixed(1)}%`,
}));

// 통합 대시보드 TOP 10 캠페인
export const topCampaigns: TopCampaign[] = [
  { rank: 1, platform: "Google Ads", name: "여름 세일 - 검색 광고", spent: 387000, conversions: 156, cpa: 2481, roas: 4.8 },
  { rank: 2, platform: "Meta Ads", name: "리타겟팅 - 장바구니 이탈", spent: 298000, conversions: 142, cpa: 2099, roas: 5.2 },
  { rank: 3, platform: "Google Ads", name: "쇼핑 광고 - 신제품", spent: 312000, conversions: 134, cpa: 2328, roas: 5.6 },
  { rank: 4, platform: "TikTok Ads", name: "동영상 캠페인 - 신규", spent: 254000, conversions: 118, cpa: 2153, roas: 3.9 },
  { rank: 5, platform: "Meta Ads", name: "Advantage+ 쇼핑 캠페인", spent: 276000, conversions: 108, cpa: 2556, roas: 4.3 },
  { rank: 6, platform: "Amazon Ads", name: "Sponsored Products - 베스트", spent: 189000, conversions: 95, cpa: 1989, roas: 3.8 },
  { rank: 7, platform: "Google Ads", name: "브랜드 키워드 캠페인", spent: 245000, conversions: 92, cpa: 2663, roas: 3.9 },
  { rank: 8, platform: "TikTok Ads", name: "GMV Max - 특가 이벤트", spent: 198000, conversions: 87, cpa: 2276, roas: 3.6 },
  { rank: 9, platform: "Google Ads", name: "디스플레이 - 리타겟팅", spent: 156000, conversions: 78, cpa: 2000, roas: 3.2 },
  { rank: 10, platform: "Amazon Ads", name: "Sponsored Brands - 신제품", spent: 165000, conversions: 71, cpa: 2324, roas: 3.4 },
];
