'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Calendar, CreditCard, Users, Database, Shield } from 'lucide-react';
import { UsageLimitBar } from './UsageLimitBar';
import type { PlanType } from '@/types/subscription';
import { PLANS } from '@/lib/config/plans';

interface SubscriptionOverviewProps {
  currentPlan: PlanType;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  trialEndDate?: Date;
  nextBillingDate?: Date;
  currentSeats: number;
  maxSeats: number;
  currentAdAccounts: number;
  maxAdAccounts: number | 'unlimited';
  dataRetentionDays: number | 'unlimited';
  onManageBilling?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionOverview({
  currentPlan,
  status,
  trialEndDate,
  nextBillingDate,
  currentSeats,
  maxSeats,
  currentAdAccounts,
  maxAdAccounts,
  dataRetentionDays,
  onManageBilling,
  onUpgrade,
}: SubscriptionOverviewProps) {
  const plan = PLANS[currentPlan];
  const isTrialing = status === 'trialing' && trialEndDate && new Date(trialEndDate) > new Date();
  const trialDaysLeft = isTrialing
    ? Math.ceil((new Date(trialEndDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'primary';
      case 'past_due': return 'warning';
      case 'canceled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return '활성';
      case 'trialing': return `무료 체험 중 (${trialDaysLeft}일 남음)`;
      case 'past_due': return '결제 실패';
      case 'canceled': return '취소됨';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* 플랜 요약 카드 */}
      <Card className="border-2 border-default-200">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{plan.name} 플랜</h2>
                <Chip color={getStatusColor()} variant="flat">
                  {getStatusText()}
                </Chip>
              </div>
              <p className="text-default-600">{plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                ₩{plan.basePriceKRW.toLocaleString()}
              </p>
              <p className="text-sm text-default-500">/월 (기본 {plan.baseTeamSize}명)</p>
            </div>
          </div>

          {/* 무료 체험 알림 */}
          {isTrialing && (
            <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">
                    🎉 14일 무료 체험 중
                  </p>
                  <p className="text-xs text-default-600">
                    {trialEndDate?.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    에 체험이 종료되며, 이후 자동으로 결제됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 다음 결제일 */}
          {!isTrialing && nextBillingDate && status === 'active' && (
            <div className="mb-4 p-4 bg-default-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-default-500" />
                  <span className="text-sm text-default-600">다음 결제일</span>
                </div>
                <span className="font-semibold">
                  {nextBillingDate.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* 관리 버튼 */}
          <div className="flex gap-3">
            {currentPlan !== 'pro' && (
              <Button
                color="primary"
                onPress={onUpgrade}
                className="flex-1"
              >
                플랜 업그레이드
              </Button>
            )}
            <Button
              variant="bordered"
              onPress={onManageBilling}
              className="flex-1"
            >
              결제 관리
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 사용량 카드 */}
      <Card>
        <CardBody className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            현재 사용량
          </h3>

          <div className="space-y-5">
            {/* 팀원 수 */}
            <UsageLimitBar
              label="팀원"
              current={currentSeats}
              limit={maxSeats}
              unit="명"
              showUpgrade={currentPlan !== 'pro'}
              onUpgrade={onUpgrade}
            />

            {/* 광고 계정 */}
            <UsageLimitBar
              label="연결된 광고 계정"
              current={currentAdAccounts}
              limit={maxAdAccounts}
              unit="개"
              showUpgrade={currentPlan !== 'pro'}
              onUpgrade={onUpgrade}
            />

            {/* 데이터 보관 */}
            <div className="p-4 bg-default-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-default-500" />
                  <span className="text-sm font-medium">데이터 보관 기간</span>
                </div>
                <Chip size="sm" color={dataRetentionDays === 'unlimited' ? 'success' : 'default'} variant="flat">
                  {dataRetentionDays === 'unlimited' ? '무제한' : `${dataRetentionDays}일`}
                </Chip>
              </div>
            </div>

            {/* API 접근 */}
            <div className="p-4 bg-default-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-default-500" />
                  <span className="text-sm font-medium">API 접근 권한</span>
                </div>
                <Chip 
                  size="sm" 
                  color={plan.features.apiAccess !== 'none' ? 'success' : 'default'} 
                  variant="flat"
                >
                  {plan.features.apiAccess === 'none' && '없음'}
                  {plan.features.apiAccess === 'read-only' && '읽기 전용'}
                  {plan.features.apiAccess === 'full' && '읽기/쓰기'}
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 플랜별 혜택 안내 */}
      {currentPlan === 'free' && (
        <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
          <CardBody className="p-6">
            <h3 className="font-bold text-lg mb-2">💎 유료 플랜으로 업그레이드하세요</h3>
            <p className="text-sm text-default-600 mb-4">
              Standard 또는 Pro 플랜으로 업그레이드하고 더 많은 기능을 사용하세요:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>최대 5명의 팀원과 협업</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span>무제한 데이터 보관</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>API 접근 권한</span>
              </li>
            </ul>
            <Button
              color="primary"
              onPress={onUpgrade}
              className="w-full mt-4"
            >
              14일 무료 체험 시작
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
