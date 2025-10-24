'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { CreditCard, Calendar, Users, Zap, TrendingUp, Shield, ArrowRight, Check, X } from 'lucide-react';
import { PLANS, getMonthlyPrice, getTeamSizeTier, TEAM_SIZE_TIERS } from '@/lib/config/plans';
import type { PlanType } from '@/types/subscription';

interface BillingSectionProps {
  currentPlan?: PlanType;
  currentSeats?: number;
  nextBillingDate?: Date;
  onUpgrade?: (plan: PlanType) => void;
}

export function BillingSection({
  currentPlan = 'free',
  currentSeats = 1,
  nextBillingDate,
  onUpgrade,
}: BillingSectionProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('standard');

  const plan = PLANS[currentPlan];
  const teamTier = getTeamSizeTier(currentSeats);
  const monthlyTotal = getMonthlyPrice(currentPlan, currentSeats, 'KRW');

  const handleUpgradeClick = (planType: PlanType) => {
    setSelectedPlan(planType);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    onUpgrade?.(selectedPlan);
    setShowUpgradeModal(false);
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
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{plan.name} 플랜</h3>
                {plan.highlighted && (
                  <Chip color="primary" size="sm" variant="flat">
                    ⭐ 추천
                  </Chip>
                )}
              </div>
              <p className="text-default-500">{plan.description}</p>
            </div>
          </div>
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
        </CardHeader>

        <CardBody className="pt-4">
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

        {/* Payment Method Section */}
        <CardFooter className="flex-col gap-4 border-t border-divider">
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                결제 수단
              </h4>
              {currentPlan !== 'free' && (
                <Button size="sm" variant="flat" color="primary">
                  등록/변경
                </Button>
              )}
            </div>
            {currentPlan === 'free' ? (
              <div className="p-4 bg-default-100 rounded-lg text-center">
                <p className="text-sm text-default-600">
                  유료 플랜 업그레이드 시 결제 수단을 등록할 수 있습니다
                </p>
              </div>
            ) : (
              <div className="p-4 bg-warning/10 border-2 border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning-700 dark:text-warning">
                  ⚠️ 등록된 결제 수단이 없습니다
                </p>
                <p className="text-xs text-default-600 mt-1">
                  원활한 서비스 이용을 위해 결제 수단을 등록해주세요
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Upgrade Options - 간단한 카드들 */}
      {currentPlan !== 'pro' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">다른 플랜 살펴보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan === 'free' ? (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" isPressable onPress={() => handleUpgradeClick('standard')}>
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
                    <Button color="primary" fullWidth endContent={<ArrowRight className="w-4 h-4" />}>
                      Standard 시작하기
                    </Button>
                  </CardBody>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-secondary/20" isPressable onPress={() => handleUpgradeClick('pro')}>
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
                    <Button color="secondary" fullWidth endContent={<ArrowRight className="w-4 h-4" />}>
                      Pro 시작하기
                    </Button>
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-secondary/20" isPressable onPress={() => handleUpgradeClick('pro')}>
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
                  <Button color="secondary" fullWidth endContent={<ArrowRight className="w-4 h-4" />}>
                    Pro로 업그레이드
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} size="2xl">
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
          <ModalBody>
            <p className="text-default-600 mb-4">
              {PLANS[selectedPlan].description}
            </p>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">
                  ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}
                </span>
                <span className="text-lg text-default-500">/월</span>
              </div>
              <div className="text-sm text-default-600 space-y-1">
                <div>기본 요금: ₩{PLANS[selectedPlan].basePriceKRW.toLocaleString()}</div>
                {teamTier.priceKRW > 0 && (
                  <div>팀 규모 ({teamTier.name}): +₩{teamTier.priceKRW.toLocaleString()}</div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm">14일 무료 체험 기간 제공</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm">언제든지 플랜 변경 및 취소 가능</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm">즉시 모든 {PLANS[selectedPlan].name} 기능 사용 가능</span>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-700 dark:text-warning">
                💳 업그레이드 후 결제 수단을 등록해주세요
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowUpgradeModal(false)}>
              취소
            </Button>
            <Button color="primary" size="lg" onPress={confirmUpgrade} endContent={<ArrowRight className="w-4 h-4" />}>
              {PLANS[selectedPlan].name} 플랜 시작하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
