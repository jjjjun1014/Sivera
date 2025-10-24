'use client';

import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { FaCheck, FaStar } from "react-icons/fa";

import { title, subtitle } from "@/components/primitives";
import { Container } from "@/components/layouts/Container";
import { PLANS, PLAN_FEATURE_DESCRIPTIONS } from "@/lib/config/plans";
import type { PlanType } from "@/types/subscription";

export default function PricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('KRW');
  const planOrder: PlanType[] = ['free', 'standard', 'pro'];

  const formatPrice = (price: number, curr: 'USD' | 'KRW') => {
    if (price === 0) return 'Free';

    if (curr === 'USD') {
      return `$${price.toFixed(2)}`;
    } else {
      return `₩${price.toLocaleString()}`;
    }
  };

  return (
    <Container className="py-20">
      <div className="text-center mb-12">
        <h1 className={title({ size: "lg" })}>
          성장에 맞는{" "}
          <span className={title({ color: "violet", size: "lg" })}>
            플랜
          </span>
          을 선택하세요
        </h1>
        <p className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          광고 캠페인 관리부터 AI 분석까지, 필요한 기능만 선택하세요.
          언제든지 플랜을 변경할 수 있습니다.
        </p>

        {/* Currency Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            size="sm"
            variant={currency === 'USD' ? 'solid' : 'flat'}
            onPress={() => setCurrency('USD')}
          >
            USD ($)
          </Button>
          <Button
            size="sm"
            variant={currency === 'KRW' ? 'solid' : 'flat'}
            onPress={() => setCurrency('KRW')}
          >
            KRW (₩)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {planOrder.map((planType) => {
          const plan = PLANS[planType];
          const features = PLAN_FEATURE_DESCRIPTIONS[planType];
          const monthlyPrice = currency === 'USD' ? plan.priceUSD : plan.priceKRW;

          return (
            <div key={planType}>
              <Card
                className={`h-full ${plan.highlighted ? "border-primary border-2" : ""}`}
                shadow={plan.highlighted ? "lg" : "sm"}
              >
                {plan.highlighted && (
                  <Chip
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                    color="primary"
                    startContent={<FaStar />}
                    variant="shadow"
                  >
                    추천
                  </Chip>
                )}

                <CardHeader className="flex flex-col gap-1 pt-8 pb-0">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-default-500 text-sm">{plan.description}</p>
                </CardHeader>

                <CardBody className="py-8">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(monthlyPrice, currency)}
                    </span>
                    {monthlyPrice > 0 && (
                      <span className="text-default-500 ml-1">
                        / 사용자 / 월
                      </span>
                    )}
                  </div>

                  <Divider className="mb-6" />

                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheck className="text-success mt-1 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {planType !== 'free' && (
                    <div className="mt-6 text-xs text-default-400 p-3 bg-default-100 rounded-lg">
                      💡 팀원 추가 시 인원당 요금이 부과됩니다
                    </div>
                  )}
                </CardBody>

                <CardFooter>
                  <Button
                    fullWidth
                    size="lg"
                    color={plan.highlighted ? "primary" : "default"}
                    variant={plan.highlighted ? "solid" : "bordered"}
                    as="a"
                    href={planType === 'free' ? '/signup' : '/signup?plan=' + planType}
                  >
                    {planType === 'free' ? '무료로 시작하기' : '14일 무료 체험'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">자주 묻는 질문</h2>
        <div className="space-y-6 text-left">
          <div>
            <h3 className="font-semibold mb-2">팀원을 추가하면 비용이 어떻게 계산되나요?</h3>
            <p className="text-default-600 text-sm">
              Standard 플랜은 팀원 1명당 월 {formatPrice(PLANS.standard.priceUSD, 'USD')} (또는 {formatPrice(PLANS.standard.priceKRW, 'KRW')}),
              Pro 플랜은 팀원 1명당 월 {formatPrice(PLANS.pro.priceUSD, 'USD')} (또는 {formatPrice(PLANS.pro.priceKRW, 'KRW')})가 부과됩니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">플랜을 변경할 수 있나요?</h3>
            <p className="text-default-600 text-sm">
              네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
