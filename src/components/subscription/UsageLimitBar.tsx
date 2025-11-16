'use client';

import { Progress } from '@heroui/progress';
import { Chip } from '@heroui/chip';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface UsageLimitBarProps {
  label: string;
  current: number;
  limit: number | 'unlimited';
  unit?: string;
  showUpgrade?: boolean;
  onUpgrade?: () => void;
}

export function UsageLimitBar({
  label,
  current,
  limit,
  unit = '개',
  showUpgrade = false,
  onUpgrade,
}: UsageLimitBarProps) {
  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const getColor = () => {
    if (isUnlimited) return 'success';
    if (isAtLimit) return 'danger';
    if (isNearLimit) return 'warning';
    return 'primary';
  };

  const getIcon = () => {
    if (isUnlimited) return <CheckCircle className="w-4 h-4" />;
    if (isAtLimit) return <AlertTriangle className="w-4 h-4" />;
    if (isNearLimit) return <AlertTriangle className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          {getIcon()}
        </div>
        <div className="flex items-center gap-2">
          {isUnlimited ? (
            <Chip size="sm" color="success" variant="flat">
              무제한
            </Chip>
          ) : (
            <>
              <span className="text-sm font-semibold">
                {current} / {limit} {unit}
              </span>
              {showUpgrade && isNearLimit && (
                <button
                  onClick={onUpgrade}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  업그레이드
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isUnlimited && (
        <>
          <Progress
            value={percentage}
            color={getColor()}
            size="sm"
            className="max-w-full"
          />
          {isAtLimit && (
            <p className="text-xs text-danger">
              ⚠️ 한도에 도달했습니다. 더 추가하려면 플랜을 업그레이드하세요.
            </p>
          )}
          {isNearLimit && !isAtLimit && (
            <p className="text-xs text-warning">
              곧 한도에 도달합니다. ({Math.round(percentage)}% 사용 중)
            </p>
          )}
        </>
      )}
    </div>
  );
}
