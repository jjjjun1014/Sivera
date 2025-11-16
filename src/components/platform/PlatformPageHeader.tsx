/**
 * Platform Page Header Component
 * 
 * 플랫폼 페이지 공통 헤더 (날짜 선택 + 계정 선택)
 */

'use client';

import { Card, CardBody } from '@heroui/card';
import { DateRangePicker } from '@heroui/date-picker';
import { Chip } from '@heroui/chip';
import { AccountSwitcher } from '@/components/account/AccountSwitcher';
import { useAccount, type PlatformType } from '@/contexts/AccountContext';
import type { DateValue } from '@internationalized/date';

interface PlatformPageHeaderProps {
  platform: PlatformType;
  dateRange?: {
    start: DateValue;
    end: DateValue;
  };
  onDateRangeChange?: (range: { start: DateValue; end: DateValue }) => void;
  showAccountInfo?: boolean;
}

export function PlatformPageHeader({
  platform,
  dateRange,
  onDateRangeChange,
  showAccountInfo = true,
}: PlatformPageHeaderProps) {
  const { selectedAccount } = useAccount();

  return (
    <Card className="mb-6">
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* 필터 영역 - 좌우 끝 배치 */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            {/* 왼쪽: 날짜 선택 */}
            {dateRange && onDateRangeChange && (
              <DateRangePicker
                label="기간 선택"
                radius="sm"
                variant="bordered"
                value={dateRange}
                onChange={(value) => value && onDateRangeChange(value)}
                className="max-w-xs"
              />
            )}
            
            {/* 오른쪽: 계정 선택 */}
            <AccountSwitcher platform={platform} />
          </div>

          {/* 선택된 계정 정보 */}
          {showAccountInfo && selectedAccount && (
            <div className="flex items-center gap-2 pt-2 border-t border-default-200">
              <span className="text-sm text-default-500">선택된 계정:</span>
              <Chip
                variant="flat"
                color="primary"
                size="sm"
                classNames={{
                  base: "px-3",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedAccount.accountName}</span>
                  <span className="text-xs text-default-400">
                    {selectedAccount.accountId}
                  </span>
                </div>
              </Chip>
            </div>
          )}

          {/* 계정 없을 때 안내 */}
          {!selectedAccount && (
            <div className="pt-2 border-t border-default-200">
              <p className="text-sm text-warning">
                ⚠️ 광고 계정을 선택해주세요. 연결된 계정이 없다면 먼저 계정을 연결해주세요.
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
