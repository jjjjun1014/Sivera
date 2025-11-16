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
import { useSubscription, usePaymentHistory } from '@/lib/hooks/useTestData';

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
    setShowUpgradeModal(false);
    router.push(`/payment/billing/register?plan=${selectedPlan}&seats=${currentSeats}`);
  };

  const handlePaymentMethodChange = () => {
    router.push(`/payment/billing/register?plan=${currentPlan}&seats=${currentSeats}`);
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
      {/* Current Plan Card */}
      <Card className="border border-divider">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getPlanIcon(currentPlan);
              return <Icon className="w-6 h-6 text-primary" />;
            })()}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{plan.name} 플랜</h3>
                {isOnTrial && (
                  <Chip color={trialDaysLeft <= 3 ? 'warning' : 'success'} size="sm" variant="flat">
                    체험 {trialDaysLeft}일
                  </Chip>
                )}
              </div>
              <p className="text-sm text-default-500">{plan.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {currentPlan !== 'free' && (
              <Button
                variant="bordered"
                size="sm"
                startContent={<CreditCard className="w-4 h-4" />}
                onPress={() => setShowPaymentMethodModal(true)}
              >
                결제수단
              </Button>
            )}
            {currentPlan !== 'pro' && (
              <Button
                color="primary"
                size="sm"
                endContent={<ArrowRight className="w-4 h-4" />}
                onPress={() => handleUpgradeClick(currentPlan === 'free' ? 'standard' : 'pro')}
              >
                업그레이드
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          {/* 무료체험 안내 */}
          {isOnTrial && currentPlan !== 'free' && (
            <div className="p-4 bg-success/10 rounded-lg border border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-success" />
                <h4 className="font-semibold">14일 무료 체험 중</h4>
              </div>
              <p className="text-sm text-default-600">
                {trialEndDate!.toLocaleDateString('ko-KR')}까지 무료로 사용하실 수 있습니다.
                {trialDaysLeft <= 3 && <span className="text-warning ml-1">(종료 임박)</span>}
              </p>
            </div>
          )}

          {/* 가격 정보 */}
          {currentPlan !== 'free' ? (
            <div className="p-4 bg-default-50 rounded-lg">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">₩{monthlyTotal.toLocaleString()}</span>
                <span className="text-default-500">/월</span>
              </div>
              <div className="space-y-1 text-sm text-default-600">
                <div className="flex justify-between">
                  <span>기본 플랜</span>
                  <span>₩{plan.basePriceKRW.toLocaleString()}</span>
                </div>
                {teamTier.priceKRW > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>팀 규모 ({currentSeats}명)</span>
                    <span>+₩{teamTier.priceKRW.toLocaleString()}</span>
                  </div>
                )}
                {nextBillingDate && (
                  <div className="flex justify-between pt-2 border-t border-divider">
                    <span>다음 결제일</span>
                    <span className="font-medium">{nextBillingDate.toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="font-semibold mb-1">무료 플랜 사용 중</p>
              <p className="text-sm text-default-600">업그레이드하여 더 많은 기능을 사용하세요</p>
            </div>
          )}

          {/* 주요 기능 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-default-50 rounded-lg text-center">
              <p className="text-xs text-default-500 mb-1">광고 계정</p>
              <p className="font-bold">
                {plan.features.adAccounts === 'unlimited' ? '무제한' : `${plan.features.adAccounts}개`}
              </p>
            </div>
            <div className="p-3 bg-default-50 rounded-lg text-center">
              <p className="text-xs text-default-500 mb-1">데이터 보관</p>
              <p className="font-bold">
                {plan.features.dataRetention === 'unlimited' ? '무제한' : `${plan.features.dataRetention}일`}
              </p>
            </div>
            <div className="p-3 bg-default-50 rounded-lg text-center">
              <p className="text-xs text-default-500 mb-1">API</p>
              <p className="font-bold">
                {plan.features.apiAccess === 'none' && '없음'}
                {plan.features.apiAccess === 'read-only' && '읽기'}
                {plan.features.apiAccess === 'full' && '읽기/쓰기'}
              </p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="border-t border-divider">
          {currentPlan !== 'free' && (
            <div className="w-full flex gap-2">
              {currentPlan === 'pro' && (
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => handleDowngradeClick('standard')}
                  className="flex-1"
                >
                  Standard로 변경
                </Button>
              )}
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => setShowCancelModal(true)}
                className={currentPlan === 'pro' ? 'flex-1' : 'w-full'}
              >
                구독 취소
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Upgrade Options */}
      {currentPlan !== 'pro' && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">다른 플랜</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPlan === 'free' ? (
              <>
                <Card className="border border-divider hover:border-primary transition-colors">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <h4 className="font-bold">Standard</h4>
                      </div>
                      <Chip color="primary" size="sm">추천</Chip>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold">₩{PLANS.standard.basePriceKRW.toLocaleString()}</span>
                      <span className="text-sm text-default-500">/월</span>
                    </div>
                    <ul className="space-y-1 mb-3 text-sm text-default-600">
                      <li>• API 읽기</li>
                      <li>• 무제한 데이터</li>
                      <li>• 무제한 광고 계정</li>
                    </ul>
                    <Button
                      color="primary"
                      size="sm"
                      fullWidth
                      onPress={() => handleUpgradeClick('standard')}
                    >
                      시작하기
                    </Button>
                  </CardBody>
                </Card>

                <Card className="border border-divider hover:border-secondary transition-colors">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        <h4 className="font-bold">Pro</h4>
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold">₩{PLANS.pro.basePriceKRW.toLocaleString()}</span>
                      <span className="text-sm text-default-500">/월</span>
                    </div>
                    <ul className="space-y-1 mb-3 text-sm text-default-600">
                      <li>• API 읽기/쓰기</li>
                      <li>• 우선 지원</li>
                      <li>• 커스텀 연동</li>
                    </ul>
                    <Button
                      color="secondary"
                      size="sm"
                      fullWidth
                      onPress={() => handleUpgradeClick('pro')}
                    >
                      시작하기
                    </Button>
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card className="border border-divider hover:border-secondary transition-colors">
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <h4 className="font-bold">Pro 플랜</h4>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold">₩{PLANS.pro.basePriceKRW.toLocaleString()}</span>
                    <span className="text-sm text-default-500">/월</span>
                  </div>
                  <ul className="space-y-1 mb-3 text-sm text-default-600">
                    <li>• API 쓰기 권한</li>
                    <li>• 우선 지원</li>
                    <li>• 커스텀 연동</li>
                  </ul>
                  <Button
                    color="secondary"
                    size="sm"
                    fullWidth
                    onPress={() => handleUpgradeClick('pro')}
                  >
                    업그레이드
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modals */}

      {/* Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            {PLANS[selectedPlan].name} 플랜으로 업그레이드
          </ModalHeader>
          <ModalBody>
            {/* 플랜 비교 */}
            <div className="flex items-center justify-center gap-4 p-4 bg-default-50 rounded-lg mb-4">
              <div className="text-center">
                <p className="text-xs text-default-500 mb-1">현재</p>
                <p className="font-bold">{PLANS[currentPlan].name}</p>
                <p className="text-sm text-default-600">
                  ₩{getMonthlyPrice(currentPlan, currentSeats, 'KRW').toLocaleString()}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-primary" />
              <div className="text-center">
                <p className="text-xs text-default-500 mb-1">변경 후</p>
                <p className="font-bold text-primary">{PLANS[selectedPlan].name}</p>
                <p className="text-sm font-semibold text-primary">
                  ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}
                </p>
              </div>
            </div>

            {/* 가격 상세 */}
            <div className="p-4 bg-primary/10 rounded-lg mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">
                  ₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}
                </span>
                <span className="text-default-600">/월</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>기본 플랜</span>
                  <span>₩{PLANS[selectedPlan].basePriceKRW.toLocaleString()}</span>
                </div>
                {teamTier.priceKRW > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>팀 규모 ({currentSeats}명)</span>
                    <span>+₩{teamTier.priceKRW.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 14일 무료 체험 */}
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-success" />
                <h4 className="font-semibold">14일 무료 체험</h4>
              </div>
              <p className="text-sm text-default-600 mb-2">
                {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}까지 무료
              </p>
              <p className="text-xs text-default-500">
                체험 기간 중 취소하면 비용이 청구되지 않습니다
              </p>
            </div>

            {/* 새로운 기능 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">추가되는 기능</h4>
              {PLANS[currentPlan].features.apiAccess !== PLANS[selectedPlan].features.apiAccess && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="w-4 h-4" />
                  <span>
                    API {PLANS[selectedPlan].features.apiAccess === 'full' ? '읽기/쓰기' : '읽기'} 권한
                  </span>
                </div>
              )}
              {PLANS[currentPlan].features.dataRetention !== 'unlimited' && PLANS[selectedPlan].features.dataRetention === 'unlimited' && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="w-4 h-4" />
                  <span>무제한 데이터 보관</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                <span>우선 고객 지원</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowUpgradeModal(false)}>
              취소
            </Button>
            <Button color="primary" onPress={confirmUpgrade} endContent={<ArrowRight className="w-4 h-4" />}>
              시작하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Downgrade Modal */}
      <Modal isOpen={showDowngradeModal} onClose={() => setShowDowngradeModal(false)} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>플랜 다운그레이드</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {/* 경고 */}
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg mb-4">
              <p className="font-semibold text-warning mb-2">제한되는 기능</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-danger" />
                  <span>API 쓰기 권한 제거</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-danger" />
                  <span>우선 지원 → 일반 지원</span>
                </div>
              </div>
            </div>

            {/* 플랜 변경 */}
            <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg mb-4">
              <div>
                <p className="text-xs text-default-500">현재</p>
                <p className="font-bold">{PLANS[currentPlan].name}</p>
                <p className="text-sm">₩{getMonthlyPrice(currentPlan, currentSeats, 'KRW').toLocaleString()}</p>
              </div>
              <ArrowRight className="w-5 h-5" />
              <div>
                <p className="text-xs text-default-500">변경 후</p>
                <p className="font-bold">{PLANS[selectedPlan].name}</p>
                <p className="text-sm text-success">₩{getMonthlyPrice(selectedPlan, currentSeats, 'KRW').toLocaleString()}</p>
              </div>
            </div>

            {/* 적용 시기 */}
            <div className="p-3 bg-default-50 rounded-lg text-sm">
              <p className="text-default-600">
                다음 결제일({nextBillingDate?.toLocaleDateString('ko-KR')})부터 적용됩니다
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowDowngradeModal(false)}>
              취소
            </Button>
            <Button color="warning" onPress={confirmDowngrade}>
              다운그레이드
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Method Modal */}
      <Modal isOpen={showPaymentMethodModal} onClose={() => setShowPaymentMethodModal(false)}>
        <ModalContent>
          <ModalHeader>결제 수단 관리</ModalHeader>
          <ModalBody>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
              <p className="text-sm font-medium text-warning">
                등록된 결제 수단이 없습니다
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>국내/해외 신용카드</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>PayPal</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowPaymentMethodModal(false)}>
              닫기
            </Button>
            <Button color="primary" onPress={handlePaymentMethodChange}>
              등록하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Subscription Modal */}
      <Modal isOpen={showCancelModal} onClose={() => { setShowCancelModal(false); setCancelConfirmText(''); }}>
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <span>구독 취소</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {/* 경고 */}
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg mb-4">
              <p className="font-bold text-danger mb-2">비활성화되는 기능</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span>API 접근</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span>90일 이상 데이터</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span>광고 계정 3개 제한</span>
                </div>
              </div>
            </div>

            {/* 환불 정책 */}
            <div className="p-3 bg-default-50 rounded-lg mb-4 text-sm">
              <p className="font-semibold mb-1">환불 정책</p>
              <p className="text-default-600">
                • 무료 체험: 비용 없음<br />
                • 7일 이내: 전액 환불<br />
                • 7일 이후: 일할 환불
              </p>
            </div>

            {/* 확인 입력 */}
            <div>
              <p className="text-sm mb-2">
                "구독 취소"를 입력해주세요:
              </p>
              <Input
                value={cancelConfirmText}
                onValueChange={setCancelConfirmText}
                placeholder="구독 취소"
                variant="bordered"
              />
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
            >
              취소하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
