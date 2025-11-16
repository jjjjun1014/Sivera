'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { TrendingUp, Lock, Check } from 'lucide-react';
import { PLANS, PLAN_FEATURE_DESCRIPTIONS } from '@/lib/config/plans';
import type { PlanType } from '@/types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  limitType: 'adAccounts' | 'teamMembers' | 'api';
  onUpgrade: (plan: PlanType) => void;
}

const LIMIT_MESSAGES = {
  adAccounts: {
    title: '광고 계정 연결 한도 초과',
    description: '더 많은 광고 계정을 연결하려면 플랜을 업그레이드하세요.',
    icon: '🔗',
  },
  teamMembers: {
    title: '팀원 초대 한도 초과',
    description: '더 많은 팀원을 초대하려면 플랜을 업그레이드하세요.',
    icon: '👥',
  },
  api: {
    title: 'API 접근 권한 없음',
    description: 'API를 사용하려면 플랜을 업그레이드하세요.',
    icon: '🔌',
  },
};

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  limitType,
  onUpgrade,
}: UpgradeModalProps) {
  const message = LIMIT_MESSAGES[limitType];
  const currentPlanInfo = PLANS[currentPlan];

  // 업그레이드 가능한 플랜들
  const availablePlans: PlanType[] = currentPlan === 'free' 
    ? ['standard', 'pro'] 
    : currentPlan === 'standard' 
    ? ['pro'] 
    : [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Lock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{message.icon} {message.title}</h3>
              <p className="text-sm text-default-500 font-normal">{message.description}</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* 현재 플랜 정보 */}
          <Card className="bg-default-50 border-2 border-default-200">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-default-500 mb-1">현재 플랜</p>
                  <p className="font-bold text-lg">{currentPlanInfo.name}</p>
                </div>
                <Chip color="default" variant="flat">
                  현재 사용 중
                </Chip>
              </div>
              
              <div className="mt-3 space-y-1">
                {PLAN_FEATURE_DESCRIPTIONS[currentPlan].map((feature, index) => (
                  <p key={index} className="text-xs text-default-600">• {feature}</p>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* 업그레이드 가능한 플랜들 */}
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-sm">추천 플랜</h4>
            {availablePlans.map((planType) => {
              const plan = PLANS[planType];
              return (
                <Card 
                  key={planType}
                  isPressable
                  onPress={() => onUpgrade(planType)}
                  className="border-2 border-primary/20 hover:border-primary transition-colors"
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-bold text-lg">{plan.name}</h5>
                          {plan.highlighted && (
                            <Chip size="sm" color="primary" variant="flat">
                              인기
                            </Chip>
                          )}
                        </div>
                        <p className="text-sm text-default-600">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₩{plan.basePriceKRW.toLocaleString()}
                        </p>
                        <p className="text-xs text-default-500">/월</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {PLAN_FEATURE_DESCRIPTIONS[planType].map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      color="primary"
                      className="w-full mt-4"
                      endContent={<TrendingUp className="w-4 h-4" />}
                    >
                      {plan.name}으로 업그레이드
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            나중에
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
