/**
 * AWS API Gateway 클라이언트
 * Lambda 함수와 통신하는 API 엔드포인트
 */

interface APIConfig {
  baseUrl: string;
  region: string;
}

class APIGatewayClient {
  private config: APIConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY_URL || "",
      region: process.env.AWS_REGION || "ap-northeast-2",
    };
  }

  /**
   * 인증된 요청
   */
  private async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // TODO: Cognito 토큰을 헤더에 추가
    const token = typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${this.config.baseUrl}${endpoint}`;

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * API 엔드포인트 예시
   *
   * 사용자 관리:
   * - GET    /users/{userId}
   * - PUT    /users/{userId}
   * - DELETE /users/{userId}
   *
   * 플랫폼 설정:
   * - GET    /users/{userId}/platforms/{platform}/configs
   * - POST   /users/{userId}/platforms/{platform}/configs
   * - PUT    /users/{userId}/platforms/{platform}/configs/{configId}
   * - DELETE /users/{userId}/platforms/{platform}/configs/{configId}
   *
   * 플랫폼 연동:
   * - POST   /users/{userId}/platforms/{platform}/connect
   * - GET    /users/{userId}/platforms/{platform}/accounts
   * - DELETE /users/{userId}/platforms/{platform}/accounts/{accountId}
   *
   * 캠페인 데이터:
   * - GET    /users/{userId}/platforms/{platform}/accounts/{accountId}/campaigns
   * - POST   /users/{userId}/platforms/{platform}/accounts/{accountId}/campaigns/sync
   *
   * 팀 관리:
   * - GET    /users/{userId}/teams
   * - POST   /teams
   * - PUT    /teams/{teamId}
   * - DELETE /teams/{teamId}
   * - POST   /teams/{teamId}/invite
   */

  /**
   * 사용자 정보 조회
   */
  async getUser(userId: string): Promise<any> {
    const response = await this.authenticatedRequest(`/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 플랫폼 설정 조회
   */
  async getPlatformConfigs(userId: string, platform: string): Promise<any> {
    const response = await this.authenticatedRequest(
      `/users/${userId}/platforms/${platform}/configs`
    );
    if (!response.ok) {
      throw new Error(`Failed to get platform configs: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 플랫폼 설정 저장
   */
  async savePlatformConfig(
    userId: string,
    platform: string,
    config: any
  ): Promise<any> {
    const response = await this.authenticatedRequest(
      `/users/${userId}/platforms/${platform}/configs`,
      {
        method: "POST",
        body: JSON.stringify(config),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to save platform config: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 캠페인 데이터 조회
   */
  async getCampaigns(
    userId: string,
    platform: string,
    accountId: string
  ): Promise<any> {
    const response = await this.authenticatedRequest(
      `/users/${userId}/platforms/${platform}/accounts/${accountId}/campaigns`
    );
    if (!response.ok) {
      throw new Error(`Failed to get campaigns: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 캠페인 데이터 동기화
   */
  async syncCampaigns(
    userId: string,
    platform: string,
    accountId: string
  ): Promise<any> {
    const response = await this.authenticatedRequest(
      `/users/${userId}/platforms/${platform}/accounts/${accountId}/campaigns/sync`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to sync campaigns: ${response.statusText}`);
    }
    return response.json();
  }
}

export const apiGateway = new APIGatewayClient();
