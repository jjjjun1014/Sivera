/**
 * AI Chatbot 타입 정의
 */

export type PlanType = 'free' | 'standard' | 'pro';

export interface AIUsageStats {
  // Rate Limit
  requestsRemaining: number;
  requestsTotal: number;
  resetTime: number;

  // Token Usage
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
  
  // User Info
  userId: string;
  plan: PlanType;
}

export interface AIRateLimitError {
  error: string;
  retryAfter?: number; // 초 단위
  remaining?: number;
  resetTime?: number;
  used?: number;
  limit?: number;
}

export interface AIChatRequest {
  message: string;
  context?: {
    currentPage?: string;
    campaigns?: any[];
    selectedMetrics?: string[];
    userRole?: string;
  };
}

export interface AIChatResponse {
  response: string;
  usage?: {
    tokensUsed: number;
    remaining: number;
  };
}
