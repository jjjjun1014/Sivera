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
   * localStorage 키 생성
   */
  private getStorageKey(platform: string, userId?: string): string {
    return userId
      ? `${STORAGE_PREFIX}${userId}_${platform}`
      : `${STORAGE_PREFIX}${platform}`;
  }

  /**
   * 특정 플랫폼 목표 불러오기
   * TODO: AWS API로 교체 - GET /api/goals/{platform}?userId={userId}
   */
  loadPlatform(platform: string, userId?: string): PlatformGoals | null {
    if (typeof window === "undefined") return null;

    const key = this.getStorageKey(platform, userId);
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse platform goals:", error);
      return null;
    }
  }

  /**
   * 특정 플랫폼 목표 저장하기
   * TODO: AWS API로 교체 - PUT /api/goals/{platform}
   */
  savePlatform(platform: string, goals: PlatformGoals, userId?: string): void {
    if (typeof window === "undefined") return;

    const key = this.getStorageKey(platform, userId);
    localStorage.setItem(key, JSON.stringify(goals));
  }

  /**
   * 특정 플랫폼 목표 삭제하기
   * TODO: AWS API로 교체 - DELETE /api/goals/{platform}?userId={userId}
   */
  deletePlatform(platform: string, userId?: string): void {
    if (typeof window === "undefined") return;

    const key = this.getStorageKey(platform, userId);
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
