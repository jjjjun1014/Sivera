'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { CreditCard, Calendar, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PLANS } from '@/lib/config/plans';
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
  const monthlyTotal = plan.priceKRW * currentSeats;

  const handleUpgradeClick = (planType: PlanType) => {
    setSelectedPlan(planType);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    onUpgrade?.(selectedPlan);
    setShowUpgradeModal(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">구독 플랜 & 결제</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Current Plan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  {plan.name} Plan
                  {currentPlan === 'free' && (
                    <Chip size="sm" color="default">무료</Chip>
                  )}
                  {currentPlan === 'standard' && (
                    <Chip size="sm" color="primary">추천</Chip>
                  )}
                  {currentPlan === 'pro' && (
                    <Chip size="sm" color="secondary">Pro</Chip>
                  )}
                </h4>
                <p className="text-sm text-default-500 mt-1">{plan.description}</p>
              </div>
              {currentPlan !== 'pro' && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => handleUpgradeClick(currentPlan === 'free' ? 'standard' : 'pro')}
                >
                  업그레이드
                </Button>
              )}
            </div>

            {/* Pricing Info */}
            {currentPlan !== 'free' && (
              <div className="bg-default-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-default-600">월 요금</span>
                  <span className="text-lg font-semibold">
                    ₩{monthlyTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-500">
                    ₩{plan.priceKRW.toLocaleString()} × {currentSeats}명
                  </span>
                  {nextBillingDate && (
                    <span className="text-default-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      다음 결제: {nextBillingDate.toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Plan Features */}
          <div>
            <h4 className="font-semibold mb-3">현재 플랜 기능</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-success mt-1" />
                <div className="text-sm">
                  <div className="font-medium">팀원</div>
                  <div className="text-default-500">
                    {plan.features.teamMembers === 'unlimited' ? '무제한' : `${plan.features.teamMembers}명`}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                <div className="text-sm">
                  <div className="font-medium">광고 계정</div>
                  <div className="text-default-500">
                    {plan.features.adAccounts === 'unlimited' ? '무제한' : `${plan.features.adAccounts}개`}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-success mt-1" />
                <div className="text-sm">
                  <div className="font-medium">데이터 보관</div>
                  <div className="text-default-500">
                    {plan.features.dataRetention === 'unlimited' ? '무제한' : `${plan.features.dataRetention}일`}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {plan.features.aiChatbot ? (
                  <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-default-300 mt-1" />
                )}
                <div className="text-sm">
                  <div className="font-medium">AI 챗봇</div>
                  <div className={plan.features.aiChatbot ? 'text-success' : 'text-default-400'}>
                    {plan.features.aiChatbot ? '사용 가능' : '사용 불가'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Payment Method */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">결제 수단</h4>
              {currentPlan !== 'free' && (
                <Button size="sm" variant="flat">
                  변경
                </Button>
              )}
            </div>
            {currentPlan === 'free' ? (
              <div className="text-sm text-default-500">
                유료 플랜으로 업그레이드하면 결제 수단을 등록할 수 있습니다.
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-default-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-default-500" />
                <div className="text-sm">
                  <div className="font-medium">등록된 결제 수단 없음</div>
                  <div className="text-default-500">결제 수단을 등록해주세요</div>
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Options */}
          {currentPlan !== 'pro' && (
            <>
              <Divider />
              <div>
                <h4 className="font-semibold mb-3">다른 플랜 둘러보기</h4>
                <div className="grid grid-cols-2 gap-3">
                  {currentPlan === 'free' && (
                    <>
                      <Button
                        fullWidth
                        variant="bordered"
                        onPress={() => handleUpgradeClick('standard')}
                      >
                        Standard 플랜
                        <span className="text-xs text-default-500">₩26,000/월</span>
                      </Button>
                      <Button
                        fullWidth
                        variant="bordered"
                        onPress={() => handleUpgradeClick('pro')}
                      >
                        Pro 플랜
                        <span className="text-xs text-default-500">₩91,000/월</span>
                      </Button>
                    </>
                  )}
                  {currentPlan === 'standard' && (
                    <Button
                      fullWidth
                      variant="bordered"
                      onPress={() => handleUpgradeClick('pro')}
                    >
                      Pro 플랜으로 업그레이드
                      <span className="text-xs text-default-500">₩91,000/월</span>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)}>
        <ModalContent>
          <ModalHeader>
            {PLANS[selectedPlan].name} 플랜으로 업그레이드
          </ModalHeader>
          <ModalBody>
            <p className="text-default-600 mb-4">
              {PLANS[selectedPlan].description}
            </p>
            <div className="bg-default-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">월 요금</span>
                <span className="text-2xl font-bold">
                  ₩{(PLANS[selectedPlan].priceKRW * currentSeats).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-default-500">
                ₩{PLANS[selectedPlan].priceKRW.toLocaleString()} × {currentSeats}명
              </div>
            </div>
            <p className="text-sm text-default-500 mt-4">
              • 14일 무료 체험 제공<br />
              • 언제든지 취소 가능<br />
              • 즉시 모든 기능 사용 가능
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowUpgradeModal(false)}>
              취소
            </Button>
            <Button color="primary" onPress={confirmUpgrade}>
              업그레이드 시작
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
