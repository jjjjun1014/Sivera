/**
 * 플랫폼별 사용자 설정 관리
 * 현재: localStorage 사용
 * 추후: AWS/DB로 마이그레이션 예정
 */

export interface PlatformConfig {
  id: string;
  name: string;
  summaryMetrics: string[];
  chartMetrics: string[];
  tableColumnOrder?: string[];
  tableColumnVisibility?: Record<string, boolean>;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserPlatformSettings {
  userId?: string; // 추후 AWS 연동 시 사용
  platform: string; // "google-ads", "meta-ads", etc.
  configs: PlatformConfig[];
  currentConfigId: string | null;
  lastUpdated: number;
}

class PlatformConfigStorage {
  private getStorageKey(platform: string, userId?: string): string {
    // 추후 userId가 있으면 사용자별로 저장
    return userId ? `platform_config_${userId}_${platform}` : `platform_config_${platform}`;
  }

  /**
   * 플랫폼 설정 불러오기
   */
  load(platform: string, userId?: string): UserPlatformSettings | null {
    try {
      const key = this.getStorageKey(platform, userId);
      const data = localStorage.getItem(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load platform config:", error);
      return null;
    }
  }

  /**
   * 플랫폼 설정 저장
   */
  save(settings: UserPlatformSettings, userId?: string): void {
    try {
      const key = this.getStorageKey(settings.platform, userId);
      const data = {
        ...settings,
        lastUpdated: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save platform config:", error);
    }
  }

  /**
   * 설정 추가
   */
  addConfig(
    platform: string,
    config: Omit<PlatformConfig, "id" | "createdAt" | "updatedAt">,
    userId?: string
  ): PlatformConfig {
    const settings = this.load(platform, userId) || {
      platform,
      configs: [],
      currentConfigId: null,
      lastUpdated: Date.now(),
    };

    const newConfig: PlatformConfig = {
      ...config,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    settings.configs.push(newConfig);
    this.save(settings, userId);

    return newConfig;
  }

  /**
   * 설정 업데이트
   */
  updateConfig(
    platform: string,
    configId: string,
    updates: Partial<Omit<PlatformConfig, "id" | "createdAt">>,
    userId?: string
  ): void {
    const settings = this.load(platform, userId);
    if (!settings) return;

    settings.configs = settings.configs.map((config) =>
      config.id === configId
        ? { ...config, ...updates, updatedAt: Date.now() }
        : config
    );

    this.save(settings, userId);
  }

  /**
   * 설정 삭제
   */
  deleteConfig(platform: string, configId: string, userId?: string): void {
    const settings = this.load(platform, userId);
    if (!settings) return;

    settings.configs = settings.configs.filter((c) => c.id !== configId);

    // 현재 적용 중인 설정이 삭제되면 currentConfigId 초기화
    if (settings.currentConfigId === configId) {
      settings.currentConfigId = null;
    }

    this.save(settings, userId);
  }

  /**
   * 현재 설정 ID 업데이트
   */
  setCurrentConfig(platform: string, configId: string | null, userId?: string): void {
    const settings = this.load(platform, userId);
    if (!settings) return;

    settings.currentConfigId = configId;
    this.save(settings, userId);
  }

  /**
   * 기본값 설정
   */
  setDefaultConfig(platform: string, configId: string, userId?: string): void {
    const settings = this.load(platform, userId);
    if (!settings) return;

    settings.configs = settings.configs.map((config) => ({
      ...config,
      isDefault: config.id === configId,
    }));

    this.save(settings, userId);
  }

  /**
   * 모든 설정 삭제 (개발/테스트용)
   */
  clear(platform: string, userId?: string): void {
    const key = this.getStorageKey(platform, userId);
    localStorage.removeItem(key);
  }

  /**
   * AWS/DB로 마이그레이션 (추후 구현)
   *
   * 예상 API 구조:
   * - GET /api/users/{userId}/platforms/{platform}/configs
   * - POST /api/users/{userId}/platforms/{platform}/configs
   * - PUT /api/users/{userId}/platforms/{platform}/configs/{configId}
   * - DELETE /api/users/{userId}/platforms/{platform}/configs/{configId}
   */
  async syncWithServer(platform: string, userId: string): Promise<void> {
    // TODO: AWS 연동 시 구현
    // 1. 로컬 데이터를 서버로 업로드
    // 2. 서버에서 최신 데이터 가져오기
    // 3. 충돌 해결 (lastUpdated 기준)
    console.log(`[Future] Sync ${platform} config for user ${userId}`);
  }
}

// Singleton 인스턴스
export const platformConfigStorage = new PlatformConfigStorage();
