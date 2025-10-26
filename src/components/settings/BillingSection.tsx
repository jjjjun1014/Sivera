'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Input } from '@heroui/input';
import { CreditCard, Calendar, Users, Zap, TrendingUp, Shield, ArrowRight, Check, X, AlertTriangle, ChevronDown } from 'lucide-react';
import { PLANS, getMonthlyPrice, getTeamSizeTier, TEAM_SIZE_TIERS } from '@/lib/config/plans';
import type { PlanType } from '@/types/subscription';

interface BillingSectionProps {
  currentPlan?: PlanType;
  currentSeats?: number;
  nextBillingDate?: Date;
  trialEndDate?: Date; // 무료체험 종료일
  onUpgrade?: (plan: PlanType) => void;
}

export function BillingSection({
  currentPlan = 'free',
  currentSeats = 1,
  nextBillingDate,
  trialEndDate,
  onUpgrade,
}: BillingSectionProps) {
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('standard');
  const [cancelConfirmText, setCancelConfirmText] = useState('');

  const plan = PLANS[currentPlan];
  const teamTier = getTeamSizeTier(currentSeats);
  const monthlyTotal = getMonthlyPrice(currentPlan, currentSeats, 'KRW');

  // 무료체험 여부 및 남은 일수 계산
  const isOnTrial = trialEndDate && new Date(trialEndDate) > new Date();
  const trialDaysLeft = isOnTrial
    ? Math.ceil((new Date(trialEndDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleUpgradeClick = (planType: PlanType) => {
    setSelectedPlan(planType);
    setShowUpgradeModal(true);
  };

  const handleDowngradeClick = (planType: PlanType) => {
    setSelectedPlan(planType);
    setShowDowngradeModal(true);
  };

  const confirmUpgrade = () => {
    // TODO: PortOne 정식 가입 후 활성화
    alert('결제 시스템 준비 중입니다.');
    setShowUpgradeModal(false);
    // router.push(`/payment/billing/register?plan=${selectedPlan}&seats=${currentSeats}`);
  };

  const handlePaymentMethodChange = () => {
    // TODO: PortOne 정식 가입 후 활성화
    alert('결제 시스템 준비 중입니다.');
    // router.push(`/payment/billing/register?plan=${currentPlan}&seats=${currentSeats}`);
  };

  const confirmDowngrade = () => {
    onUpgrade?.(selectedPlan);
    setShowDowngradeModal(false);
  };

  const confirmCancel = () => {
    if (cancelConfirmText === '구독 취소') {
      onUpgrade?.('free');
      setShowCancelModal(false);
      setCancelConfirmText('');
    }
  };

  const getPlanIcon = (planType: PlanType) => {
    switch (planType) {
      case 'free': return Users;
      case 'standard': return Zap;
      case 'pro': return TrendingUp;
    }
  };

  const getPlanColor = (planType: PlanType) => {
    switch (planType) {
      case 'free': return 'default';
      case 'standard': return 'primary';
      case 'pro': return 'secondary';
    }
  };

  // 팀 규모 진행률 계산
  const tierProgress = ((currentSeats - teamTier.minSeats) / (teamTier.maxSeats - teamTier.minSeats + 1)) * 100;
  const nextTier = TEAM_SIZE_TIERS.find(t => t.minSeats > currentSeats);

  return (
    <>
      {/* Current Plan Card - 큰 카드 */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="flex justify-between items-start pb-2">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getPlanIcon(currentPlan);
              return <Icon className="w-8 h-8 text-primary" />;
            })()}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold">{plan.name} 플랜</h3>
                {plan.highlighted && (
                  <Chip color="primary" size="sm" variant="flat">
                    ⭐ 추천
                  </Chip>
                )}
                {isOnTrial && (
                  <Chip
                    color={trialDaysLeft <= 3 ? 'warning' : 'success'}
                    size="sm"
                    variant="flat"
                    startContent={<Calendar className="w-3 h-3" />}
                  >
                    무료체험 {trialDaysLeft}일 남음
                  </Chip>
                )}
              </div>
              <p className="text-default-500">{plan.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {currentPlan !== 'free' && (
              <Button
                variant="bordered"
                size="lg"
                startContent={<CreditCard className="w-4 h-4" />}
                onPress={() => setShowPaymentMethodModal(true)}
              >
                결제수단
              </Button>
            )}
            {currentPlan !== 'pro' && (
              <Button
                color="primary"
                size="lg"
                endContent={<ArrowRight className="w-4 h-4" />}
                onPress={() => handleUpgradeClick(currentPlan === 'free' ? 'standard' : 'pro')}
              >
                업그레이드
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-4">
          {/* 무료체험 안내 (유료 플랜이면서 체험 중일 때) */}
          {isOnTrial && currentPlan !== 'free' && (
            <div className="mb-6 p-5 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl border-2 border-success/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">🎉 14일 무료 체험 중</h4>
                  <p className="text-sm text-default-700 mb-3">
                    {trialEndDate!.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    에 체험이 종료됩니다
                  </p>
                  <div className="space-y-1 text-xs text-default-600">
                    <p>• 체험 종료 후 자동으로 월 ₩{monthlyTotal.toLocaleString()}이 청구됩니다</p>
                    <p>• 체험 기간 중 취소하면 비용이 청구되지 않습니다</p>
                    {trialDaysLeft <= 3 && (
                      <p className="text-warning font-semibold">⚠️ 체험 종료가 얼마 남지 않았습니다</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Display - 크고 명확하게 */}
          {currentPlan !== 'free' ? (
            <div className="mb-6">
              <div className="bg-white dark:bg-default-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">
                    ₩{monthlyTotal.toLocaleString()}
                  </span>
                  <span className="text-xl text-default-500">/월</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-divider">
                    <span className="text-default-600">기본 플랜 요금</span>
                    <span className="font-semibold">₩{plan.basePriceKRW.toLocaleString()}</span>
                  </div>
                  {teamTier.priceKRW > 0 && (
                    <div className="flex justify-between py-2 border-b border-divider">
                      <span className="text-default-600">팀 규모 추가 ({teamTier.name})</span>
                      <span className="font-semibold text-primary">+₩{teamTier.priceKRW.toLocaleString()}</span>
                    </div>
                  )}
                  {nextBillingDate && (
                    <div className="flex items-center justify-between py-2 text-default-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>다음 결제일</span>
                      </div>
                      <span className="font-medium">{nextBillingDate.toLocaleDateString('ko-KR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl text-center">
              <p className="text-lg font-semibold mb-2">무료로 시작하세요!</p>
              <p className="text-default-600">Standard 플랜으로 업그레이드하면 더 많은 기능을 사용할 수 있습니다.</p>
            </div>
          )}

          {/* Team Size Progress */}
          {currentPlan !== 'free' && (
            <div className="mb-6 p-4 bg-default-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">팀 규모</span>
                </div>
                <span className="text-sm text-default-600">
                  {currentSeats}명 / {teamTier.maxSeats}명 ({teamTier.name})
                </span>
              </div>
              <Progress
                value={tierProgress}
                color={tierProgress > 80 ? 'warning' : 'primary'}
                className="mb-2"
              />
              {nextTier && tierProgress > 70 && (
                <p className="text-xs text-warning">
                  💡 {nextTier.minSeats}명 이상 추가 시 {nextTier.name} 티어로 자동 업그레이드됩니다
                  (+₩{nextTier.priceKRW.toLocaleString()}/월)
                </p>
              )}
            </div>
          )}

          {/* Features Grid - 아이콘과 함께 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-white dark:bg-default-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">광고 계정</span>
              </div>
              <p className="text-lg font-bold">
                {plan.features.adAccounts === 'unlimited' ? '무제한' : `${plan.features.adAccounts}개`}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-default-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Calendar className="w-4 h-4 text-success" />
                </div>
                <span className="font-semibold text-sm">데이터 보관</span>
              </div>
              <p className="text-lg font-bold">
                {plan.features.dataRetention === 'unlimited' ? '무제한' : `${plan.features.dataRetention}일`}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-default-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Zap className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-semibold text-sm">AI 챗봇</span>
              </div>
              <p className={`text-lg font-bold ${plan.features.aiChatbot ? 'text-success' : 'text-default-400'}`}>
                {plan.features.aiChatbot ? '사용 가능' : '사용 불가'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-default-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Shield className="w-4 h-4 text-warning" />
                </div>
                <span className="font-semibold text-sm">API 접근</span>
              </div>
              <p className="text-lg font-bold">
                {plan.features.apiAccess === 'none' && '불가'}
                {plan.features.apiAccess === 'read-only' && '읽기'}
                {plan.features.apiAccess === 'full' && '읽기/쓰기'}
              </p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex-col gap-4 border-t border-divider">
          {/* 플랜 관리 버튼들 */}
          {currentPlan !== 'free' && (
            <div className="w-full flex gap-2">
              {currentPlan === 'pro' && (
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  startContent={<ChevronDown className="w-4 h-4" />}
                  onPress={() => handleDowngradeClick('standard')}
                  className="flex-1"
                >
                  Standard로 다운그레이드
                </Button>
              )}
              <Button
                size="sm"
                variant="flat"
                color="danger"
                startContent={<X className="w-4 h-4" />}
                onPress={() => setShowCancelModal(true)}
                className={currentPlan === 'pro' ? 'flex-1' : 'w-full'}
              >
                구독 취소
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Upgrade Options - 간단한 카드들 */}
      {currentPlan !== 'pro' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">다른 플랜 살펴보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan === 'free' ? (
              <>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">Standard</h4>
                          <p className="text-sm text-default-500">팀 협업 시작</p>
                        </div>
                      </div>
                      <Chip color="primary" size="sm">추천</Chip>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">₩{PLANS.standard.basePriceKRW.toLocaleString()}</span>
                        <span className="text-default-500">/월부터</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>AI 챗봇 사용</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>API 읽기 전용</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>무제한 데이터</span>
                      </div>
                    </div>
                    <Button color="primary" fullWidth endContent={<ArrowRight className="w-4 h-4" />} onPress={() => handleUpgradeClick('standard')}>
                      Standard 시작하기
                    </Button>
                  </CardBody>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-2 border-secondary/20">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary/10 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">Pro</h4>
                          <p className="text-sm text-default-500">모든 기능 활용</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">₩{PLANS.pro.basePriceKRW.toLocaleString()}</span>
                        <span className="text-default-500">/월부터</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>API 읽기/쓰기</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>우선 지원</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>커스텀 연동</span>
                      </div>
                    </div>
                    <Button color="secondary" fullWidth endContent={<ArrowRight className="w-4 h-4" />} onPress={() => handleUpgradeClick('pro')}>
                      Pro 시작하기
                    </Button>
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card className="hover:shadow-lg transition-shadow border-2 border-secondary/20">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-secondary/10 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Pro로 업그레이드</h4>
                        <p className="text-sm text-default-500">더 강력한 기능 사용</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">₩{PLANS.pro.basePriceKRW.toLocaleString()}</span>
                      <span className="text-default-500">/월부터</span>
                    </div>
                    <p className="text-sm text-default-500 mt-1">
                      현재 대비 +₩{(PLANS.pro.basePriceKRW - PLANS.standard.basePriceKRW).toLocaleString()}/월
                    </p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>API 쓰기 권한 추가</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>우선 지원</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>커스텀 연동 지원</span>
                    </div>
                  </div>
                  <Button color="secondary" fullWidth endContent={<ArrowRight className="w-4 h-4" />} onPress={() => handleUpgradeClick('pro')}>
                    Pro로 업그레이드
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modals */}

      {/* Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} size="3xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = getPlanIcon(selectedPlan);
                return <Icon className="w-6 h-6 text-primary" />;
              })()}
              <span>{PLANS[selectedPlan].name} 플랜으로 업그레이드</span>
            </div>
          </ModalHeader>
          <ModalBody className="overflow-y-auto max-h-[70vh]">
            <p className="text-default-600 mb-6">
              {PLANS[selectedPlan].description}
            </p>

            {/* 플랜 비교 표 */}
            <div className="mb-6 p-5 bg-default-50 rounded-2xl">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                플랜 변경 사항
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-default-500 mb-2">현재 플랜</p>
                  <div className="p-3 bg-white dark:bg-default-100 rounded-lg">
                    <p className="font-bold text-lg">{PLANS[currentPlan].name}</p>
                    <p className="text-sm text-default-600">
                      ₩{getMonthlyPrice(currentPlan, currentSeats, 'KRW').toLocaleString()}/월
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-default-500 mb-2">새로운 플랜</p>
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg border-2 border-primary">
                    <p className="font-bold text-lg">{PLANS[selectedPlan].name}</p>
                    <p className="text-sm font-semibold text-primary">
                      ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}/월
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 가격 상세 */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
              <h4 className="font-semibold mb-3">월 결제 금액</h4>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">
                  ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}
                </span>
                <span className="text-lg text-default-500">/월</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-default-600">기본 플랜 요금</span>
                  <span className="font-semibold">₩{PLANS[selectedPlan].basePriceKRW.toLocaleString()}</span>
                </div>
                {teamTier.priceKRW > 0 && (
                  <div className="flex justify-between p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                    <span className="text-default-600">팀 규모 추가 ({teamTier.name}, {currentSeats}명)</span>
                    <span className="font-semibold text-primary">+₩{teamTier.priceKRW.toLocaleString()}</span>
                  </div>
                )}
                {currentPlan !== 'free' && (
                  <div className="flex justify-between p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="font-semibold">현재 대비 차액</span>
                    <span className="font-bold text-primary">
                      +₩{(getMonthlyPrice(selectedPlan, currentSeats, 'KRW') - getMonthlyPrice(currentPlan, currentSeats, 'KRW')).toLocaleString()}/월
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 14일 무료 체험 안내 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-success/20 to-primary/20 rounded-2xl border-2 border-success/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">🎉 14일 무료 체험</h4>
                  <p className="text-sm text-default-700 mb-3">
                    {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    까지 무료로 이용하실 수 있습니다
                  </p>
                  <div className="space-y-1 text-xs text-default-600">
                    <p>• 체험 기간 동안 모든 {PLANS[selectedPlan].name} 플랜 기능을 제한 없이 사용 가능합니다</p>
                    <p>• 체험 종료 3일 전 이메일로 알림을 보내드립니다</p>
                    <p>• 체험 기간 중 언제든 취소하면 비용이 청구되지 않습니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 새로운 기능들 */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">✨ 사용 가능한 새로운 기능</h4>
              <div className="space-y-2">
                {!PLANS[currentPlan].features.aiChatbot && PLANS[selectedPlan].features.aiChatbot && (
                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">AI 챗봇 어시스턴트</p>
                      <p className="text-xs text-default-600">광고 캠페인 최적화를 위한 AI 도우미</p>
                    </div>
                  </div>
                )}
                {PLANS[currentPlan].features.apiAccess !== PLANS[selectedPlan].features.apiAccess && (
                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        API 접근 권한 ({PLANS[currentPlan].features.apiAccess === 'none' ? '없음' : '읽기'} → {PLANS[selectedPlan].features.apiAccess === 'full' ? '읽기/쓰기' : '읽기'})
                      </p>
                      <p className="text-xs text-default-600">외부 도구와 연동하여 자동화 구축</p>
                    </div>
                  </div>
                )}
                {PLANS[currentPlan].features.dataRetention !== 'unlimited' && PLANS[selectedPlan].features.dataRetention === 'unlimited' && (
                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        데이터 보관 기간 ({PLANS[currentPlan].features.dataRetention}일 → 무제한)
                      </p>
                      <p className="text-xs text-default-600">과거 데이터 분석 및 트렌드 파악</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">우선 고객 지원</p>
                    <p className="text-xs text-default-600">더 빠른 응답과 전담 지원</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 안내 */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                다음 단계
              </h4>
              <p className="text-sm text-default-700">
                업그레이드 후 결제 수단 등록 페이지로 이동합니다.
                결제 수단을 등록해야 14일 무료 체험이 시작됩니다.
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="border-t">
            <Button variant="flat" size="lg" onPress={() => setShowUpgradeModal(false)}>
              취소
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={confirmUpgrade}
              endContent={<ArrowRight className="w-4 h-4" />}
              className="font-semibold"
            >
              {PLANS[selectedPlan].name} 플랜 시작하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Downgrade Modal */}
      <Modal isOpen={showDowngradeModal} onClose={() => setShowDowngradeModal(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <span>플랜 다운그레이드</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* 경고 메시지 */}
              <div className="p-4 bg-warning/10 border-2 border-warning/30 rounded-lg">
                <p className="font-semibold text-warning-700 dark:text-warning mb-2">
                  ⚠️ 다음 기능들이 제한됩니다
                </p>
                <div className="space-y-2 text-sm">
                  {currentPlan === 'pro' && selectedPlan === 'standard' && (
                    <>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                        <span>API 쓰기 권한이 제거됩니다 (읽기 전용으로 변경)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                        <span>우선 고객 지원이 일반 지원으로 변경됩니다</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                        <span>커스텀 연동 지원이 종료됩니다</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 플랜 변경 정보 */}
              <div className="p-4 bg-default-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-default-500 mb-1">현재 플랜</p>
                    <p className="font-bold text-lg">{PLANS[currentPlan].name}</p>
                    <p className="text-sm text-default-600">
                      ₩{getMonthlyPrice(currentPlan, currentSeats, 'KRW').toLocaleString()}/월
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500 mb-1">변경 후</p>
                    <p className="font-bold text-lg">{PLANS[selectedPlan].name}</p>
                    <p className="text-sm font-semibold text-success">
                      ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}/월
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-divider">
                  <p className="text-sm font-semibold text-success">
                    💰 월 ₩{(getMonthlyPrice(currentPlan, currentSeats, 'KRW') - getMonthlyPrice(selectedPlan, currentSeats, 'KRW')).toLocaleString()} 절약
                  </p>
                </div>
              </div>

              {/* 데이터 보관 안내 */}
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">📦 데이터 보관</h4>
                <p className="text-sm text-default-700">
                  기존 데이터는 모두 안전하게 보관됩니다.
                  {selectedPlan === 'standard' && currentPlan === 'pro' && (
                    <span className="block mt-1">
                      다만 90일이 지난 과거 데이터는 조회할 수 없습니다.
                    </span>
                  )}
                </p>
              </div>

              {/* 적용 시기 */}
              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">📅 적용 시기</h4>
                <p className="text-sm text-default-700">
                  다운그레이드는 <span className="font-semibold text-primary">다음 결제일 ({nextBillingDate?.toLocaleDateString('ko-KR')})</span>부터 적용됩니다.
                  그 전까지는 현재 플랜의 모든 기능을 계속 사용하실 수 있습니다.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowDowngradeModal(false)}>
              취소
            </Button>
            <Button
              color="warning"
              onPress={confirmDowngrade}
              startContent={<ChevronDown className="w-4 h-4" />}
            >
              {PLANS[selectedPlan].name}로 다운그레이드
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Method Modal */}
      <Modal isOpen={showPaymentMethodModal} onClose={() => setShowPaymentMethodModal(false)} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" />
              <span>결제 수단 관리</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="p-4 bg-warning/10 border-2 border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning-700 dark:text-warning">
                  ⚠️ 등록된 결제 수단이 없습니다
                </p>
                <p className="text-xs text-default-600 mt-1">
                  원활한 서비스 이용을 위해 결제 수단을 등록해주세요
                </p>
              </div>

              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-3">지원 결제 수단</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span>국내/해외 신용카드 (이니시스)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    <span>PayPal 계정</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-default-700">
                  💡 결제 시스템은 현재 준비 중입니다. 정식 오픈 시 이용 가능합니다.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowPaymentMethodModal(false)}>
              닫기
            </Button>
            <Button
              color="primary"
              onPress={handlePaymentMethodChange}
              isDisabled
            >
              결제 수단 등록 (준비 중)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Subscription Modal */}
      <Modal isOpen={showCancelModal} onClose={() => { setShowCancelModal(false); setCancelConfirmText(''); }} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-danger" />
              <span>구독 취소</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* 경고 메시지 */}
              <div className="p-4 bg-danger/10 border-2 border-danger/30 rounded-lg">
                <p className="font-bold text-danger mb-3">
                  ⚠️ 정말 구독을 취소하시겠습니까?
                </p>
                <div className="space-y-2 text-sm text-default-700">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <span>모든 유료 기능이 즉시 비활성화됩니다</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <span>AI 챗봇 어시스턴트를 사용할 수 없습니다</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <span>API 접근 권한이 제거됩니다</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <span>90일이 지난 데이터는 삭제됩니다</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                    <span>광고 계정은 3개까지만 연결 가능합니다</span>
                  </div>
                </div>
              </div>

              {/* 환불 정책 */}
              <div className="p-4 bg-default-50 rounded-lg">
                <h4 className="font-semibold mb-2">💰 환불 정책</h4>
                <p className="text-sm text-default-700 mb-2">
                  구독 취소 시점에 따라 환불 정책이 다릅니다:
                </p>
                <div className="space-y-1 text-sm text-default-600">
                  <p>• 무료 체험 기간 중: 비용이 청구되지 않습니다</p>
                  <p>• 결제 후 7일 이내: 전액 환불</p>
                  <p>• 결제 후 7일 이후: 일할 계산하여 부분 환불</p>
                </div>
              </div>

              {/* 적용 시기 */}
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold mb-2">📅 적용 시기</h4>
                <p className="text-sm text-default-700">
                  취소 확인 시 <span className="font-semibold text-danger">즉시 Free 플랜으로 전환</span>됩니다.
                  {nextBillingDate && (
                    <span className="block mt-1">
                      남은 기간({nextBillingDate.toLocaleDateString('ko-KR')}까지)에 대한 환불은 영업일 기준 3-5일 내 처리됩니다.
                    </span>
                  )}
                </p>
              </div>

              {/* 확인 입력 */}
              <div>
                <p className="text-sm font-semibold mb-2">
                  계속하시려면 아래에 "구독 취소"를 입력해주세요:
                </p>
                <Input
                  value={cancelConfirmText}
                  onValueChange={setCancelConfirmText}
                  placeholder="구독 취소"
                  variant="bordered"
                  classNames={{
                    input: 'text-center font-semibold',
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => { setShowCancelModal(false); setCancelConfirmText(''); }}>
              돌아가기
            </Button>
            <Button
              color="danger"
              onPress={confirmCancel}
              isDisabled={cancelConfirmText !== '구독 취소'}
              startContent={<X className="w-4 h-4" />}
            >
              구독 취소하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
