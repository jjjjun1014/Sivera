/**
 * Team & Account Constants
 */

import type { TeamRole, AccountRole } from "@/types/team";
import type { PlatformType } from "@/contexts/AccountContext";

// 팀 역할 텍스트 매핑
export const TEAM_ROLE_TEXT: Record<TeamRole, string> = {
  owner: "소유자",
  member: "멤버",
  viewer: "뷰어",
};

// 팀 역할 색상 매핑
export const TEAM_ROLE_COLOR: Record<TeamRole, "primary" | "success" | "default"> = {
  owner: "primary",
  member: "success",
  viewer: "default",
};

// 계정 역할 텍스트 매핑
export const ACCOUNT_ROLE_TEXT: Record<AccountRole, string> = {
  admin: "관리자",
  editor: "편집자",
  viewer: "뷰어",
};

// 플랫폼 색상 매핑
export const PLATFORM_COLOR: Record<PlatformType, "primary" | "secondary" | "warning" | "danger"> = {
  google: "primary",
  meta: "secondary",
  tiktok: "warning",
  amazon: "danger",
};

// 플랫폼 이름 매핑
export const PLATFORM_NAME: Record<PlatformType, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  amazon: "Amazon Ads",
};
