/**
 * AI Chatbot Rate Limiter
 * 
 * 사용자별 AI 챗봇 사용량 제한을 관리합니다.
 * 실제 AWS 연동 후 활성화 예정
 */

// 메모리 기반 임시 저장소 (개발용)
const requestStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number; // 시간당 최대 요청 수
  windowMs: number; // 시간 윈도우 (밀리초)
}

// 플랜별 Rate Limit 설정
export const PLAN_RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: {
    maxRequests: 10, // 10회/시간
    windowMs: 60 * 60 * 1000, // 1시간
  },
  standard: {
    maxRequests: 50, // 50회/시간
    windowMs: 60 * 60 * 1000,
  },
  pro: {
    maxRequests: 200, // 200회/시간 (사실상 무제한에 가까움)
    windowMs: 60 * 60 * 1000,
  },
};

// 플랜별 월간 토큰 제한
export const PLAN_TOKEN_LIMITS: Record<string, number> = {
  free: 50_000, // 50K 토큰/월
  standard: 500_000, // 500K 토큰/월
  pro: 2_000_000, // 2M 토큰/월
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number; // 초 단위
}

/**
 * Rate Limit 체크 (메모리 기반)
 * TODO: AWS 연동 후 DynamoDB/Redis로 교체
 */
export function checkRateLimit(
  userId: string,
  plan: 'free' | 'standard' | 'pro' = 'free'
): RateLimitResult {
  const config = PLAN_RATE_LIMITS[plan];
  const now = Date.now();
  
  const userLimit = requestStore.get(userId);

  // 첫 요청 또는 윈도우 리셋
  if (!userLimit || now > userLimit.resetTime) {
    const resetTime = now + config.windowMs;
    requestStore.set(userId, { count: 1, resetTime });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // 제한 초과
  if (userLimit.count >= config.maxRequests) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: userLimit.resetTime,
      retryAfter,
    };
  }

  // 요청 허용
  userLimit.count += 1;
  requestStore.set(userId, userLimit);

  return {
    allowed: true,
    remaining: config.maxRequests - userLimit.count,
    resetTime: userLimit.resetTime,
  };
}

/**
 * 월간 토큰 사용량 체크
 * TODO: AWS 연동 후 실제 DB에서 조회
 */
export interface TokenUsageResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}

const monthlyTokenStore = new Map<string, { tokens: number; month: string }>();

export function checkTokenLimit(
  userId: string,
  tokensToUse: number,
  plan: 'free' | 'standard' | 'pro' = 'free'
): TokenUsageResult {
  const limit = PLAN_TOKEN_LIMITS[plan];
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const usage = monthlyTokenStore.get(userId);

  // 첫 사용 또는 새 달
  if (!usage || usage.month !== currentMonth) {
    monthlyTokenStore.set(userId, { tokens: tokensToUse, month: currentMonth });
    
    return {
      allowed: true,
      used: tokensToUse,
      limit,
      remaining: limit - tokensToUse,
    };
  }

  const newTotal = usage.tokens + tokensToUse;

  // 토큰 제한 초과
  if (newTotal > limit) {
    return {
      allowed: false,
      used: usage.tokens,
      limit,
      remaining: Math.max(0, limit - usage.tokens),
    };
  }

  // 사용량 업데이트
  usage.tokens = newTotal;
  monthlyTokenStore.set(userId, usage);

  return {
    allowed: true,
    used: newTotal,
    limit,
    remaining: limit - newTotal,
  };
}

/**
 * IP 기반 Rate Limit (비로그인 사용자용)
 */
export function checkIpRateLimit(ip: string): RateLimitResult {
  // 비로그인 사용자는 더 엄격한 제한
  const config: RateLimitConfig = {
    maxRequests: 5, // 5회/시간만
    windowMs: 60 * 60 * 1000,
  };

  const now = Date.now();
  const ipKey = `ip:${ip}`;
  const ipLimit = requestStore.get(ipKey);

  if (!ipLimit || now > ipLimit.resetTime) {
    const resetTime = now + config.windowMs;
    requestStore.set(ipKey, { count: 1, resetTime });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  if (ipLimit.count >= config.maxRequests) {
    const retryAfter = Math.ceil((ipLimit.resetTime - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: ipLimit.resetTime,
      retryAfter,
    };
  }

  ipLimit.count += 1;
  requestStore.set(ipKey, ipLimit);

  return {
    allowed: true,
    remaining: config.maxRequests - ipLimit.count,
    resetTime: ipLimit.resetTime,
  };
}

/**
 * 사용량 초기화 (테스트용)
 */
export function resetUsage(userId: string) {
  requestStore.delete(userId);
  monthlyTokenStore.delete(userId);
}

/**
 * 전체 사용량 조회 (관리자용)
 */
export function getAllUsage() {
  return {
    requests: Array.from(requestStore.entries()),
    tokens: Array.from(monthlyTokenStore.entries()),
  };
}
