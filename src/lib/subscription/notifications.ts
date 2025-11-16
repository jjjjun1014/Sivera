'use client';

import { toast } from 'sonner';
import { AlertTriangle, TrendingUp } from 'lucide-react';

/**
 * 제한 도달 시 토스트 알림 표시
 */
export function showLimitReachedToast(
  limitType: 'adAccounts' | 'teamMembers' | 'api' | 'dataRetention',
  onUpgrade?: () => void
) {
  const messages = {
    adAccounts: {
      title: '광고 계정 연결 한도 초과',
      description: '현재 플랜에서 연결 가능한 광고 계정 수를 초과했습니다.',
    },
    teamMembers: {
      title: '팀원 초대 한도 초과',
      description: '현재 플랜에서 초대 가능한 팀원 수를 초과했습니다.',
    },
    api: {
      title: 'API 접근 권한 없음',
      description: '현재 플랜에서는 API를 사용할 수 없습니다.',
    },
    dataRetention: {
      title: '데이터 조회 제한',
      description: '현재 플랜에서는 제한된 기간의 데이터만 조회할 수 있습니다.',
    },
  };

  const message = messages[limitType];

  toast.error(message.title, {
    description: message.description,
    action: onUpgrade ? {
      label: '업그레이드',
      onClick: onUpgrade,
    } : undefined,
    duration: 5000,
  });
}

/**
 * 한도 임박 시 경고 토스트 표시
 */
export function showNearLimitWarning(
  limitType: 'adAccounts' | 'teamMembers',
  current: number,
  limit: number,
  onUpgrade?: () => void
) {
  const percentage = (current / limit) * 100;
  
  if (percentage < 80) return; // 80% 미만이면 표시 안 함

  const messages = {
    adAccounts: `광고 계정 연결 한도의 ${Math.round(percentage)}%를 사용 중입니다.`,
    teamMembers: `팀원 수가 한도의 ${Math.round(percentage)}%에 도달했습니다.`,
  };

  toast.warning('사용량 주의', {
    description: messages[limitType],
    action: onUpgrade ? {
      label: '업그레이드',
      onClick: onUpgrade,
    } : undefined,
    duration: 4000,
  });
}

/**
 * 무료 체험 종료 임박 알림
 */
export function showTrialEndingSoon(daysLeft: number, onUpgrade?: () => void) {
  toast.info('무료 체험 종료 알림', {
    description: `무료 체험이 ${daysLeft}일 후 종료됩니다. 계속 사용하시려면 결제 정보를 등록해주세요.`,
    action: onUpgrade ? {
      label: '결제 정보 등록',
      onClick: onUpgrade,
    } : undefined,
    duration: 6000,
  });
}

/**
 * 업그레이드 성공 토스트
 */
export function showUpgradeSuccess(planName: string) {
  toast.success('플랜 업그레이드 완료', {
    description: `${planName} 플랜으로 성공적으로 업그레이드되었습니다.`,
    duration: 4000,
  });
}

/**
 * 다운그레이드 알림
 */
export function showDowngradeWarning(features: string[]) {
  toast.warning('플랜 다운그레이드', {
    description: `다음 기능을 더 이상 사용할 수 없습니다: ${features.join(', ')}`,
    duration: 5000,
  });
}
