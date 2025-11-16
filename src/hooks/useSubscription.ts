'use client';

import { useState, useEffect } from 'react';
import type { PlanType } from '@/types/subscription';
import type { SubscriptionLimits } from '@/lib/subscription/subscription-checker';
import {
  canConnectAdAccount,
  canInviteTeamMember,
  canAccessAPI,
  getSubscriptionSummary,
} from '@/lib/subscription/subscription-checker';

/**
 * 구독 정보 및 제한 체크 Hook
 * 
 * 사용 예시:
 * const { subscription, canConnect, canInvite, summary } = useSubscription(teamId);
 */
export function useSubscription(teamId: string) {
  const [subscription, setSubscription] = useState<SubscriptionLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setLoading(true);
        
        // [연동 전] Mock 데이터 사용 중
        // TODO: 백엔드 API 연동 후 활성화
        // const response = await fetch(`/api/subscription?teamId=${teamId}`);
        // const data = await response.json();
        // setSubscription(data);
        
        setError('Subscription API not connected');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (teamId) {
      fetchSubscription();
    }
  }, [teamId]);

  // 제한 체크 함수들
  const checkCanConnectAdAccount = () => {
    if (!subscription) return { allowed: false, reason: 'Subscription not loaded' };
    return canConnectAdAccount(subscription);
  };

  const checkCanInviteTeamMember = () => {
    if (!subscription) return { allowed: false, reason: 'Subscription not loaded' };
    return canInviteTeamMember(subscription);
  };

  const checkCanAccessAPI = (method: 'read' | 'write') => {
    if (!subscription) return { allowed: false, reason: 'Subscription not loaded' };
    return canAccessAPI(subscription, method);
  };

  const getSummary = () => {
    if (!subscription) return null;
    return getSubscriptionSummary(subscription);
  };

  return {
    subscription,
    loading,
    error,
    // 제한 체크 함수들
    canConnectAdAccount: checkCanConnectAdAccount,
    canInviteTeamMember: checkCanInviteTeamMember,
    canAccessAPI: checkCanAccessAPI,
    // 요약 정보
    summary: getSummary(),
  };
}

/**
 * 특정 기능 접근 권한 체크 Hook
 * 
 * 사용 예시:
 * const { hasAccess, reason } = useFeatureAccess('api', { method: 'write' });
 */
export function useFeatureAccess(
  featureType: 'adAccounts' | 'teamMembers' | 'api' | 'dataRetention',
  options?: { method?: 'read' | 'write'; daysBack?: number }
) {
  const [hasAccess, setHasAccess] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        setLoading(true);

        // [연동 전] Mock 데이터 사용 중
        // TODO: 백엔드 API 연동 후 활성화
        // const response = await fetch(
        //   `/api/subscription/check-access?feature=${featureType}&${new URLSearchParams(options as any)}`
        // );
        // const data = await response.json();
        // setHasAccess(data.allowed);
        // setReason(data.reason);
        
        setHasAccess(false);
        setReason('Subscription feature checking not connected');
      } catch (err) {
        setHasAccess(false);
        setReason('Failed to check access');
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [featureType, options]);

  return {
    hasAccess,
    reason,
    loading,
  };
}

/**
 * 사용량 제한 체크 Hook
 * 
 * 사용 예시:
 * const { current, limit, isNearLimit, isAtLimit } = useUsageLimit('adAccounts');
 */
export function useUsageLimit(
  limitType: 'adAccounts' | 'teamMembers',
  teamId: string
) {
  const [current, setCurrent] = useState(0);
  const [limit, setLimit] = useState<number | 'unlimited'>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        setLoading(true);

        // [연동 전] Mock 데이터 사용 중
        // TODO: 백엔드 API 연동 후 활성화
        // const response = await fetch(
        //   `/api/subscription/usage?teamId=${teamId}&type=${limitType}`
        // );
        // const data = await response.json();
        // setCurrent(data.current);
        // setLimit(data.limit);
        
        setCurrent(0);
        setLimit(0);
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      } finally {
        setLoading(false);
      }
    }

    if (teamId) {
      fetchUsage();
    }
  }, [limitType, teamId]);

  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : (current / (limit as number)) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return {
    current,
    limit,
    percentage,
    isNearLimit,
    isAtLimit,
    isUnlimited,
    loading,
  };
}
