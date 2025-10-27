import { PlatformGoals } from "@/components/modals/GoalSettingModal";
import { BaseStorage } from "./BaseStorage";

const STORAGE_PREFIX = "platform_goals_";

class PlatformGoalsStorage extends BaseStorage<Record<string, PlatformGoals>> {
  constructor() {
    super(STORAGE_PREFIX + "all");
  }

  /**
   * 모든 목표 불러오기 (내부용)
   */
  load(): Record<string, PlatformGoals> | null {
    // TODO: AWS API로 교체 - GET /api/goals?userId={userId}
    return this.getFromLocalStorage();
  }

  /**
   * 모든 목표 저장하기 (내부용)
   */
  save(data: Record<string, PlatformGoals>): void {
    // TODO: AWS API로 교체 - POST /api/goals
    this.saveToLocalStorage(data);
  }

  /**
   * 모든 목표 삭제하기
   */
  clear(): void {
    // TODO: AWS API로 교체 - DELETE /api/goals?userId={userId}
    this.removeFromLocalStorage();
  }

  /**
   * localStorage 키 생성 (사업체별 분리)
   * @param platform 플랫폼 명
   * @param workspaceId 사업체 ID (필수)
   * @param userId 사용자 ID (선택)
   */
  private getStorageKey(platform: string, workspaceId: string, userId?: string): string {
    const base = `${STORAGE_PREFIX}${platform}_${workspaceId}`;
    return userId ? `${base}_${userId}` : base;
  }

  /**
   * 특정 플랫폼 목표 불러오기 (사업체별)
   * TODO: AWS API로 교체 - GET /api/goals/{platform}?workspaceId={workspaceId}&userId={userId}
   */
  loadPlatform(platform: string, workspaceId: string, userId?: string): PlatformGoals | null {
    if (typeof window === "undefined") return null;
    if (!workspaceId) return null;

    const key = this.getStorageKey(platform, workspaceId, userId);
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * 특정 플랫폼 목표 저장하기 (사업체별)
   * TODO: AWS API로 교체 - PUT /api/goals/{platform}
   */
  savePlatform(platform: string, workspaceId: string, goals: PlatformGoals, userId?: string): void {
    if (typeof window === "undefined") return;
    if (!workspaceId) return;

    const key = this.getStorageKey(platform, workspaceId, userId);
    localStorage.setItem(key, JSON.stringify(goals));
  }

  /**
   * 특정 플랫폼 목표 삭제하기 (사업체별)
   * TODO: AWS API로 교체 - DELETE /api/goals/{platform}?workspaceId={workspaceId}&userId={userId}
   */
  deletePlatform(platform: string, workspaceId: string, userId?: string): void {
    if (typeof window === "undefined") return;
    if (!workspaceId) return;

    const key = this.getStorageKey(platform, workspaceId, userId);
    localStorage.removeItem(key);
  }

  /**
   * 기본 목표값 반환
   */
  getDefaultGoals(): PlatformGoals {
    return {
      totalBudget: 0,
      targetConversions: 0,
      targetCPA: 0,
      targetROAS: 0,
      targetCTR: 0,
      targetImpressionShare: 0,
    };
  }
}

export const platformGoalsStorage = new PlatformGoalsStorage();
