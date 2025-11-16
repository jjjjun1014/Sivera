/**
 * Auto Logout Hook
 * 
 * 사용자의 마지막 활동 시간을 추적하여
 * 일정 시간 비활동 시 자동으로 로그아웃 처리
 */

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000; // 3시간 (밀리초)
const LAST_ACTIVITY_KEY = 'sivera_last_activity';
const CHECK_INTERVAL = 60 * 1000; // 1분마다 체크

/**
 * 자동 로그아웃 훅
 * 
 * @param onLogout - 로그아웃 함수
 * @param enabled - 자동 로그아웃 활성화 여부 (기본: true)
 */
export function useAutoLogout(
  onLogout: () => Promise<void>,
  enabled: boolean = true
) {
  const router = useRouter();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // 초기 활동 시간 설정
    updateLastActivity();

    // 사용자 활동 감지 이벤트들
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // 활동 시간 업데이트 (throttle 적용)
    let throttleTimer: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimer) {
        updateLastActivity();
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 5000); // 5초마다 한 번만 업데이트
      }
    };

    // 이벤트 리스너 등록
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // 정리 함수 저장
    activityListenerRef.current = () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };

    // 주기적으로 비활동 시간 체크
    checkIntervalRef.current = setInterval(() => {
      checkInactivity();
    }, CHECK_INTERVAL);

    return () => {
      // Cleanup
      if (activityListenerRef.current) {
        activityListenerRef.current();
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [enabled, onLogout]);

  /**
   * 마지막 활동 시간 업데이트
   */
  const updateLastActivity = () => {
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  };

  /**
   * 비활동 시간 체크 및 자동 로그아웃
   */
  const checkInactivity = async () => {
    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) {
      updateLastActivity();
      return;
    }

    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    const inactiveTime = now - lastActivity;

    console.log('🕐 Auto-logout check:', {
      inactiveMinutes: Math.floor(inactiveTime / 1000 / 60),
      timeoutMinutes: Math.floor(INACTIVITY_TIMEOUT / 1000 / 60),
    });

    // 비활동 시간이 임계값을 초과하면 로그아웃
    if (inactiveTime >= INACTIVITY_TIMEOUT) {
      console.log('⏰ Auto logout triggered due to inactivity');
      
      // 로그아웃 처리
      try {
        await onLogout();
        
        // 로그아웃 사유와 함께 로그인 페이지로 리다이렉트
        router.push('/login?reason=inactivity');
      } catch (error) {
        console.error('Auto logout error:', error);
      }
    }
  };
}

/**
 * 남은 세션 시간 계산 (분 단위)
 */
export function getRemainingSessionTime(): number | null {
  if (typeof window === 'undefined') return null;

  const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!lastActivityStr) return null;

  const lastActivity = parseInt(lastActivityStr, 10);
  const now = Date.now();
  const elapsed = now - lastActivity;
  const remaining = INACTIVITY_TIMEOUT - elapsed;

  return Math.max(0, Math.floor(remaining / 1000 / 60)); // 분 단위
}

/**
 * 세션 초기화 (수동 로그아웃 시 호출)
 */
export function clearSessionActivity() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }
}
