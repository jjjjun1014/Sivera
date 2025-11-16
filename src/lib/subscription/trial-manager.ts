/**
 * 무료 체험 관리 시스템
 * 
 * 14일 무료 체험 기간 관리 및 알림
 */

export interface TrialInfo {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  status: 'active' | 'ending_soon' | 'ended';
}

/**
 * 무료 체험 정보 계산
 */
export function getTrialInfo(trialEndDate: Date | string | null): TrialInfo | null {
  if (!trialEndDate) return null;

  const now = new Date();
  const endDate = new Date(trialEndDate);
  const startDate = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isActive = daysRemaining > 0;

  let status: 'active' | 'ending_soon' | 'ended';
  if (daysRemaining <= 0) {
    status = 'ended';
  } else if (daysRemaining <= 3) {
    status = 'ending_soon';
  } else {
    status = 'active';
  }

  return {
    isActive,
    startDate,
    endDate,
    daysRemaining: Math.max(0, daysRemaining),
    status,
  };
}

/**
 * 무료 체험 시작 (구독 생성 시 호출)
 */
export function createTrialPeriod(): {
  trialStart: Date;
  trialEnd: Date;
  currentPeriodEnd: Date;
} {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  return {
    trialStart: now,
    trialEnd,
    currentPeriodEnd: trialEnd, // 체험 기간엔 currentPeriodEnd = trialEnd
  };
}

/**
 * 체험 종료 알림이 필요한지 확인
 */
export function shouldNotifyTrialEnding(trialInfo: TrialInfo | null): {
  shouldNotify: boolean;
  notificationType: 'none' | '3days' | '1day' | 'today';
} {
  if (!trialInfo || !trialInfo.isActive) {
    return { shouldNotify: false, notificationType: 'none' };
  }

  const { daysRemaining } = trialInfo;

  if (daysRemaining === 3) {
    return { shouldNotify: true, notificationType: '3days' };
  } else if (daysRemaining === 1) {
    return { shouldNotify: true, notificationType: '1day' };
  } else if (daysRemaining === 0) {
    return { shouldNotify: true, notificationType: 'today' };
  }

  return { shouldNotify: false, notificationType: 'none' };
}

/**
 * 체험 종료 시 첫 결제 실행 여부 확인
 */
export function shouldProcessFirstPayment(
  trialEndDate: Date | string | null,
  billingKey: string | null | undefined
): boolean {
  if (!trialEndDate || !billingKey) return false;

  const now = new Date();
  const endDate = new Date(trialEndDate);

  // 체험 종료일이 지났고 빌링키가 있으면 결제 실행
  return now >= endDate;
}

/**
 * 체험 종료 메시지 생성
 */
export function getTrialMessage(trialInfo: TrialInfo): {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
} {
  const { daysRemaining, status } = trialInfo;

  if (status === 'ended') {
    return {
      title: '무료 체험 종료',
      message: '무료 체험이 종료되었습니다. 계속 사용하려면 결제 정보를 등록해주세요.',
      urgency: 'high',
    };
  }

  if (daysRemaining === 0) {
    return {
      title: '오늘 체험 종료',
      message: '무료 체험이 오늘 종료됩니다. 내일부터 자동으로 결제가 시작됩니다.',
      urgency: 'high',
    };
  }

  if (daysRemaining === 1) {
    return {
      title: '1일 남음',
      message: '무료 체험이 1일 후 종료됩니다. 결제 정보를 확인해주세요.',
      urgency: 'high',
    };
  }

  if (daysRemaining <= 3) {
    return {
      title: `${daysRemaining}일 남음`,
      message: `무료 체험이 ${daysRemaining}일 후 종료됩니다.`,
      urgency: 'medium',
    };
  }

  return {
    title: `${daysRemaining}일 남음`,
    message: `무료 체험 기간이 ${daysRemaining}일 남았습니다.`,
    urgency: 'low',
  };
}

/**
 * 체험 종료 후 다음 결제일 계산
 */
export function getNextBillingDate(trialEndDate: Date | string): Date {
  const endDate = new Date(trialEndDate);
  // 체험 종료일 다음날이 첫 결제일
  return new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * 체험 기간 연장 가능 여부 (향후 프로모션용)
 */
export function canExtendTrial(
  currentTrialEnd: Date | string,
  extensionDays: number = 7
): {
  canExtend: boolean;
  newEndDate?: Date;
  reason?: string;
} {
  const now = new Date();
  const endDate = new Date(currentTrialEnd);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // 이미 종료된 체험은 연장 불가
  if (daysRemaining <= 0) {
    return {
      canExtend: false,
      reason: '이미 종료된 무료 체험은 연장할 수 없습니다.',
    };
  }

  // 최대 14일까지만 연장 가능
  if (daysRemaining + extensionDays > 28) {
    return {
      canExtend: false,
      reason: '무료 체험은 최대 28일까지만 연장할 수 있습니다.',
    };
  }

  const newEndDate = new Date(endDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);

  return {
    canExtend: true,
    newEndDate,
  };
}
