/**
 * API Client for AWS Backend
 *
 * 환경변수 설정:
 * - NEXT_PUBLIC_API_BASE_URL: AWS API Gateway 또는 ALB 엔드포인트
 * - NEXT_PUBLIC_API_VERSION: API 버전 (예: v1)
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class APIClient {
  private baseURL: string;
  private version: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  }

  private getAuthToken(): string | null {
    // 백엔드 개발자가 구현할 부분
    // AWS Cognito JWT 또는 커스텀 토큰
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}/api/${this.version}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, headers = {}, ...restConfig } = config;
    const url = this.buildURL(endpoint, params);
    const token = this.getAuthToken();

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.message || 'An error occurred',
          response.status,
          data.code,
          data.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Network error',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Singleton instance
export const apiClient = new APIClient();
