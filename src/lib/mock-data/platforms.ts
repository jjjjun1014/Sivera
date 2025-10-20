import { PlatformAccount, PlatformPerformance } from "@/types";

// 플랫폼 연동 데이터
export const platformAccounts: PlatformAccount[] = [
  {
    id: 1,
    platform: "Google Ads",
    accountName: "메인 계정",
    accountId: "123-456-7890",
    status: "active",
    lastSync: "2024-10-09 10:30",
    campaigns: 5,
  },
  {
    id: 2,
    platform: "Meta Ads",
    accountName: "Facebook 비즈니스",
    accountId: "987654321",
    status: "active",
    lastSync: "2024-10-09 09:45",
    campaigns: 4,
  },
  {
    id: 3,
    platform: "TikTok Ads",
    accountName: "TikTok for Business",
    accountId: "TT-456789",
    status: "inactive",
    lastSync: "2024-10-07 14:20",
    campaigns: 3,
  },
  {
    id: 4,
    platform: "Amazon Ads",
    accountName: "Amazon Advertising",
    accountId: "AMZ-789456",
    status: "active",
    lastSync: "2024-10-09 11:15",
    campaigns: 6,
  },
];

// 플랫폼별 성과 데이터
export const platformPerformance: PlatformPerformance[] = [
  {
    platform: "Google Ads",
    spent: 1234567,
    conversions: 856,
    roas: 3.2,
    cpa: 2850,
    sharePercent: 35,
  },
  {
    platform: "Meta Ads",
    spent: 987654,
    conversions: 654,
    roas: 4.1,
    cpa: 2450,
    sharePercent: 28,
  },
  {
    platform: "TikTok Ads",
    spent: 765432,
    conversions: 423,
    roas: 2.8,
    cpa: 3200,
    sharePercent: 22,
  },
  {
    platform: "Amazon Ads",
    spent: 543210,
    conversions: 312,
    roas: 3.5,
    cpa: 2890,
    sharePercent: 15,
  },
];
